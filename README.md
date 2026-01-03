# 🌱 KrishiBot: The Ultimate AI-Powered Agricultural Ecosystem

KrishiBot is a unified, state-of-the-art agricultural platform that combines advanced **Plant Disease Detection**, an interactive **Farming Dashboard**, and the **EcoFarm Simulation Engine** into a single, seamless experience. It empowers farmers with real-time AI advice, data-driven insights, and immersive educational simulations.

---

## 🚀 Experience the Fusion of AI & Farming

This project represents a deep integration of two powerful systems:
1.  **KrishiBot Dashboard**: A premium, "liquid glass" interface for monitoring farm health, detecting diseases using TensorFlow, and managing crops.
2.  **EcoFarm Engine**: A high-fidelity growth simulation that uses real-world soil (NARC API) and weather (Open-Meteo) data to train farmers in sustainable agriculture.

---

## ✨ Key Features

### 🔍 AI Disease Detector
*   **Deep Learning**: Built on TensorFlow, detecting complex plant diseases with high precision.
*   **Instant Analysis**: Upload a leaf image and receive an immediate diagnosis and AI-generated treatment plan.

### 🎮 EcoFarm Simulation
*   **Real-World Data**: Simulation parameters are driven by live geographic coordinates, fetching actual soil pH and nitrogen levels from the **NARC Soil API**.
*   **Hyper-Realistic Growth**: Crops evolve through growth stages affected by temperature, humidity, and rainfall derived from **Open-Meteo**.
*   **EcoBot AI**: A laboratory-integrated assistant that monitors your simulation in real-time and provides proactive farming advice.

### 📊 Integrated Dashboard
*   **Liquid Glass UI**: A modern, premium aesthetic designed for clarity and engagement.
*   **Unified API**: Both systems run on a single synchronized backend, ensuring data consistency across all components.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15, React, Tailwind CSS, Shadcn UI, Framer Motion, Leaflet.js |
| **Backend** | FastAPI (Python), SQLAlchemy, SQLite/PostgreSQL |
| **AI/ML** | TensorFlow (Disease Prediction), Google Gemini API (Natural Language Advice) |
| **Data Sources** | NARC Nepal Soil API, Open-Meteo API |
| **Environment** | UV (Python package manager), NPM |

---

## ⚙️ Getting Started

### Prerequisites
*   **Python 3.10+**
*   **Node.js 18+**
*   **UV** (Highly recommended for backend management)

### 1. Backend Setup
1.  Navigate to the backend directory:
    ```powershell
    cd backend
    ```
2.  Install dependencies using UV:
    ```powershell
    uv sync
    ```
3.  Configure environment variables in `.env` (refer to `env.example`):
    *   `GEMINI_API_KEY`: Your Google Gemini key for EcoBot.
    *   `DATABASE_URL`: Your local database path.

### 2. Frontend Setup
1.  Navigate to the frontend directory:
    ```powershell
    cd frontend
    ```
2.  Install dependencies:
    ```powershell
    npm install
    ```

---

## 🏃 Running the Platform

To run the unified ecosystem, you need to start both the backend and frontend servers.

### Start Backend
```powershell
# From KrishiBot-main/backend
uv run python -m app
```
*Backend will be available at [http://localhost:8000](http://localhost:8000)*

### Start Frontend
```powershell
# From KrishiBot-main/frontend
npm run dev
```
*Platform will be available at [http://localhost:3000](http://localhost:3000)*

---

## 📂 Project Structure

```text
KrishiBot-main/
├── backend/            # FastAPI Project with unified KrishiBot/EcoFarm logic
│   ├── app/
│   │   ├── models/     # TensorFlow and DB Models
│   │   ├── router/     # Integrated API routes (game.py, disease.py, etc.)
│   │   └── game/       # EcoFarm simulation logic
├── frontend/           # Next.js 15 Application
│   ├── app/            # App router pages (dashboard, game simulation)
│   ├── components/     # UI Library and Integrated Parts
│   └── public/         # Farm assets, Leaflet markers, and simulation graphics
└── README.md           # This file!
```

---

## 🤝 Contribution
Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request.

## 📄 License
This project is licensed under the MIT License.
