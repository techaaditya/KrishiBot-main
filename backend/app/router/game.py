from fastapi import APIRouter, HTTPException, File, UploadFile
from typing import List, Optional, Dict
from pydantic import BaseModel
import numpy as np
import urllib.request
import json
import pandas as pd
import requests_cache
import openmeteo_requests
from retry_requests import retry
from app.game.game_engine.engine import (
    CellState,
    GameState,
    BatchActionRequest,
    PlantRequest,
    RecommendRequest,
    InitRequest,
)
from app.game.game_engine.clock import Clock
from app.game.constants import GRID_WIDTH, CROPS, ACTIONS, REGIONS
from app.game.model import Model
from app.game.chat_service import get_chat_response, analyze_disease_chat

router = APIRouter()

# Global game state
clock = Clock()
game_state: Optional[GameState] = None
model = Model()

class LocationInitRequest(BaseModel):
    lat: float
    lng: float

class ChatRequest(BaseModel):
    message: Optional[str] = None
    recent_actions: List[str] = []
    game_state: Optional[dict] = None

def get_region_from_elevation(elevation: float) -> str:
    if elevation < 300: return "Terai"
    elif elevation < 2000: return "Hilly"
    else: return "Himalayan"

def clean_value(val):
    if isinstance(val, (int, float)): return float(val)
    if not isinstance(val, str): return 0.0
    val = val.replace('kg/ha', '').replace('%', '').replace('ppm', '').strip()
    try: return float(val)
    except ValueError: return 0.0

def initialize_grid(region: str) -> List[CellState]:
    region_data = REGIONS.get(region, REGIONS["Hilly"])
    grid = []
    for _ in range(16):
        cell = CellState(
            temperature=region_data["temperature"],
            humidity=region_data["humidity"],
            rainfall=region_data["rainfall"],
            moisture=region_data["moisture"],
            n=40 + np.random.randint(-10, 10),
            p=40 + np.random.randint(-10, 10),
            k=40 + np.random.randint(-10, 10),
            ph=6.5 + np.random.uniform(-0.5, 0.5),
        )
        grid.append(cell)
    return grid

def initialize_grid_with_data(region: str, soil_data: dict, weather_data: dict = None) -> List[CellState]:
    region_data = REGIONS.get(region, REGIONS["Hilly"])
    n_val = clean_value(soil_data.get("total_nitrogen", 0))
    p_val = clean_value(soil_data.get("p2o5", 0))
    k_val = clean_value(soil_data.get("potassium", 0))
    ph_val = clean_value(soil_data.get("ph", 6.5))
    
    temp_val = weather_data.get("temperature", region_data["temperature"]) if weather_data else region_data["temperature"]
    rain_val = weather_data.get("rain", region_data["rainfall"]) if weather_data else region_data["rainfall"]
    wind_val = weather_data.get("wind_speed", 0.0) if weather_data else 0.0

    grid = []
    for _ in range(16):
        grid.append(CellState(
            temperature=temp_val,
            humidity=region_data["humidity"],
            rainfall=rain_val,
            moisture=region_data["moisture"],
            wind_speed=wind_val,
            n=n_val,
            p=p_val,
            k=k_val,
            ph=ph_val
        ))
    return grid

def fetch_weather_data(lat: float, lng: float):
    try:
        cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
        retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
        openmeteo = openmeteo_requests.Client(session = retry_session)
        url = "https://api.open-meteo.com/v1/forecast"
        params = {"latitude": lat, "longitude": lng, "hourly": ["temperature_2m", "rain", "wind_speed_80m", "cloud_cover"], "timezone": "auto"}
        responses = openmeteo.weather_api(url, params=params)
        response = responses[0]
        elevation = response.Elevation()
        hourly = response.Hourly()
        curr_temp = hourly.Variables(0).ValuesAsNumpy()[0]
        curr_rain = hourly.Variables(1).ValuesAsNumpy()[0]
        curr_wind = hourly.Variables(2).ValuesAsNumpy()[0]
        curr_cloud = hourly.Variables(3).ValuesAsNumpy()[0]
        return {"temperature": float(curr_temp), "rain": float(curr_rain), "wind_speed": float(curr_wind), "cloud_cover": float(curr_cloud), "elevation": elevation}
    except Exception as e:
        print(f"Weather error: {e}")
        return None

@router.get("/meta")
def get_meta(): return {"crops": CROPS, "actions": ACTIONS, "regions": REGIONS}

@router.get("/weather")
def get_weather(lat: float, lng: float):
    data = fetch_weather_data(lat, lng)
    if not data: raise HTTPException(status_code=500, detail="Weather fetch failed")
    return {"weather": data, "region": get_region_from_elevation(data["elevation"])}

@router.get("/time")
def get_time(): return {"time": clock.now()}

@router.get("/tick")
def tick():
    global game_state
    if not game_state: raise HTTPException(status_code=400, detail="Not initialized")
    game_state.day += 1
    for cell in game_state.grid:
        cell.moisture = max(0, cell.moisture - 2)
        cell.weed = min(100, cell.weed + 1)
        if cell.crop and cell.stage < cell.max_stage:
            growth_rate = 1.0
            if 40 <= cell.moisture <= 80: growth_rate += 0.5
            if cell.weed < 30: growth_rate += 0.3
            cell.stage = min(cell.max_stage, cell.stage + int(growth_rate))
    return {"grid": [c.model_dump() for c in game_state.grid], "gold": game_state.gold, "day": game_state.day}

@router.post("/init")
def init_game(request: InitRequest):
    global game_state
    region = request.region if request.region in REGIONS else "Hilly"
    game_state = GameState(region=region, location=region, gold=1000, day=1, grid=initialize_grid(region))
    return {"grid": [c.model_dump() for c in game_state.grid], "gold": game_state.gold, "day": game_state.day, "region": region}

@router.post("/init_by_location")
def init_by_location(request: LocationInitRequest):
    global game_state
    lat, lng = request.lat, request.lng
    soil_url = f"https://soil.narc.gov.np/soil/api/?lat={lat}&lon={lng}"
    soil_data = {}
    try:
        with urllib.request.urlopen(soil_url) as resp:
            if resp.status == 200: soil_data = json.loads(resp.read().decode())
    except: pass
    weather_data = fetch_weather_data(lat, lng)
    elevation = weather_data["elevation"] if weather_data else 1000
    region = get_region_from_elevation(elevation)
    grid = initialize_grid_with_data(region, soil_data, weather_data) if soil_data else initialize_grid(region)
    game_state = GameState(region=region, location=f"{lat:.2f}, {lng:.2f}", gold=1000, day=1, grid=grid)
    return {"grid": [c.model_dump() for c in game_state.grid], "gold": game_state.gold, "day": game_state.day, "region": region}

@router.get("/state")
def get_state():
    global game_state
    if not game_state: game_state = GameState(grid=initialize_grid("Hilly"))
    return game_state.model_dump()

@router.post("/action")
def perform_action(request: BatchActionRequest):
    global game_state
    if not game_state: raise HTTPException(status_code=400, detail="Not initialized")
    action, indices = request.action, request.indices
    if action not in ACTIONS: raise HTTPException(status_code=404)
    action_data = ACTIONS[action]
    cost = action_data["cost"].get(game_state.region, action_data["cost"]["Hilly"]) * len(indices)
    
    if action == "harvest":
        earned = 0
        for i in indices:
            if 0 <= i < 16 and game_state.grid[i].crop and game_state.grid[i].stage >= game_state.grid[i].max_stage:
                earned += CROPS.get(game_state.grid[i].crop, {}).get("harvest_gold", 50)
                game_state.grid[i].crop, game_state.grid[i].stage = None, 0
        game_state.gold += earned
        return {"msg": f"Harvested! +{earned}g", "gold": game_state.gold}

    if game_state.gold < cost: raise HTTPException(status_code=400, detail="Low gold")
    for i in indices:
        if 0 <= i < 16: game_state.grid[i].take_action(action)
    game_state.gold -= cost
    return {"msg": f"{action_data['name']} complete", "gold": game_state.gold}

@router.post("/plant")
def plant(request: PlantRequest):
    global game_state
    if not game_state: raise HTTPException(status_code=400)
    crop_name, indices = request.crop.capitalize(), request.indices
    if crop_name not in CROPS: raise HTTPException(status_code=404)
    crop_data = CROPS[crop_name]
    cost = crop_data["cost"].get(game_state.region, crop_data["cost"]["Hilly"])
    total_cost = 0
    planted = 0
    for i in indices:
        if 0 <= i < 16 and game_state.grid[i].crop is None:
            if game_state.gold >= total_cost + cost:
                game_state.grid[i].crop = crop_name
                game_state.grid[i].stage = 0
                game_state.grid[i].max_stage = crop_data["days"] * 10
                total_cost += cost
                planted += 1
    game_state.gold -= total_cost
    return {"msg": f"Planted {planted} {crop_name}", "gold": game_state.gold}

@router.post("/recommend")
def recommend(request: RecommendRequest):
    return {"recommendations": model.get_recommendations(request.n, request.p, request.k, request.temperature, request.humidity, request.ph, request.rainfall)}

@router.post("/chat")
def chat(request: ChatRequest):
    global game_state
    curr = game_state or GameState(grid=initialize_grid("Hilly"))
    preds = {}
    for i, c in enumerate(curr.grid):
        preds[f"Cell {i}"] = sorted(model.predict(np.array([c.n, c.p, c.k, c.temperature, c.humidity, c.ph, c.rainfall])).items(), key=lambda x:x[1])[:3]
    return {"response": get_chat_response(request.message, curr, request.recent_actions, preds)}
