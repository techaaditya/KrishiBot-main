"use client"

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:8000/game-api";

const LabChat = ({ gameState, logs, onNewMessage }: any) => {
    const [messages, setMessages] = useState([
        { sender: 'ai', text: "Welcome to the Agricultural Lab! I'm your AI assistant. I can analyze your soil, predict crop suitability, and give advice on your farming actions. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [connected, setConnected] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastLogRef = useRef(logs?.[0]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        axios.get("http://localhost:8000/") // Health check on main API
            .then(() => setConnected(true))
            .catch(() => setConnected(false));
    }, []);

    const addMessage = (msg: any) => {
        setMessages(prev => [...prev, msg]);
        if (onNewMessage) onNewMessage(msg);
    };

    useEffect(() => {
        if (!logs || logs.length === 0) return;
        if (logs[0] === lastLogRef.current) return;

        lastLogRef.current = logs[0];

        const timer = setTimeout(() => {
            triggerAutoResponse();
        }, 2500);

        return () => clearTimeout(timer);
    }, [logs]);

    const triggerAutoResponse = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const recentActions = logs.slice(0, 5);
            const gameStatePayload = gameState ? {
                location: gameState.location || 'Unknown',
                region: gameState.region || 'Hilly',
                gold: gameState.gold || 1000,
                day: gameState.day || 1,
                grid: gameState.grid?.map((cell: any) => ({
                    n: cell.n || 40,
                    p: cell.p || 40,
                    k: cell.k || 40,
                    rainfall: cell.rainfall || 100,
                    ph: cell.ph || 6.5,
                    humidity: cell.humidity || 60,
                    temperature: cell.temperature || 25,
                    moisture: cell.moisture || 50,
                    crop: cell.crop || null,
                    stage: cell.stage || 0,
                    max_stage: cell.max_stage || 100,
                    weed: cell.weed || 0,
                    health: cell.health || 100
                })) || []
            } : null;

            const res = await axios.post(`${API_URL}/game_chat`, {
                message: null,
                recent_actions: recentActions,
                game_state: gameStatePayload
            });

            const aiMsg = { sender: 'ai', text: res.data.response };
            addMessage(aiMsg);
            setConnected(true);
        } catch (error: any) {
            console.error("Auto-response error:", error);
            if (error.code === "ERR_NETWORK") setConnected(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { sender: 'user', text: input };
        addMessage(userMsg);
        setInput("");
        setLoading(true);

        try {
            const recentActions = logs.slice(0, 5);
            const gameStatePayload = gameState ? {
                location: gameState.location || 'Unknown',
                region: gameState.region || 'Hilly',
                gold: gameState.gold || 1000,
                day: gameState.day || 1,
                grid: gameState.grid?.map((cell: any) => ({
                    n: cell.n || 40,
                    p: cell.p || 40,
                    k: cell.k || 40,
                    rainfall: cell.rainfall || 100,
                    ph: cell.ph || 6.5,
                    humidity: cell.humidity || 60,
                    temperature: cell.temperature || 25,
                    moisture: cell.moisture || 50,
                    crop: cell.crop || null,
                    stage: cell.stage || 0,
                    max_stage: cell.max_stage || 100,
                    weed: cell.weed || 0,
                    health: cell.health || 100
                })) || []
            } : null;

            const res = await axios.post(`${API_URL}/game_chat`, {
                message: userMsg.text,
                recent_actions: recentActions,
                game_state: gameStatePayload
            });

            const aiMsg = { sender: 'ai', text: res.data.response };
            addMessage(aiMsg);
            setConnected(true);
        } catch (error: any) {
            console.error("Chat error:", error);
            let errorText = "Sorry, I encountered an error analyzing the data. Please try again.";
            if (error.code === "ERR_NETWORK") {
                errorText = "Network Error: Cannot connect to the Laboratory Server. Please ensure the backend is running.";
                setConnected(false);
            }
            addMessage({ sender: 'ai', text: errorText });
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 h-full flex flex-col shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
                <h2 className="text-xl font-bold text-emerald-400">EcoBot</h2>
                <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-xs text-white/50">{connected ? 'Online' : 'Offline'}</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 scrollbar-none" style={{ minHeight: '300px', maxHeight: '500px' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl ${msg.sender === 'user'
                            ? 'bg-emerald-600 text-white rounded-br-none'
                            : 'bg-white/5 text-white/90 rounded-bl-none border border-white/10'
                            }`}>
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 p-3 rounded-2xl rounded-bl-none border border-white/10 text-white/60">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-emerald-500/50 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-emerald-500/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-emerald-500/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask EcoBot..."
                    className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                    disabled={loading}
                />
                <button
                    onClick={handleSend}
                    disabled={loading}
                    className={`px-4 py-2 rounded-xl text-white font-bold text-sm transition-all ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/20'
                        }`}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default LabChat;
