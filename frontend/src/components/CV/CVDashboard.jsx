import React, { useEffect, useState } from 'react';
import { useCV } from '../../context/CVContext';
import { Activity, Users, Truck, Package, Server, Radio } from 'lucide-react';
import { io } from 'socket.io-client';

const CVDashboard = () => {
    const { sessionStats, modelsLoaded, error } = useCV();
    const [elapsed, setElapsed] = useState('00:00:00');
    const [socketConnected, setSocketConnected] = useState(false);
    const [liveData, setLiveData] = useState(null);

    // Timer
    useEffect(() => {
        if (!sessionStats.startTime) return;
        const interval = setInterval(() => {
            const diff = Math.floor((new Date() - sessionStats.startTime) / 1000);
            const h = Math.floor(diff / 3600);
            const m = Math.floor((diff % 3600) / 60);
            const s = diff % 60;
            setElapsed(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(interval);
    }, [sessionStats.startTime]);

    // WebSocket Integration
    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

        socket.on('connect', () => {
            setSocketConnected(true);
        });

        socket.on('disconnect', () => {
            setSocketConnected(false);
        });

        socket.on('live_cv_update', (data) => {
            setLiveData(data);
        });

        return () => socket.disconnect();
    }, []);

    return (
        <div className="space-y-4 font-mono">
            {/* TF Status */}
            <div className="glass-panel p-6 border-slate-800/80 bg-slate-900/40 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-[1px] bg-gradient-to-l from-emerald-500/50 to-transparent"></div>
                <h3 className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold mb-5 border-b border-white/5 pb-3">AI Engine Status // CORE_V4</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] font-mono">ACCELERATION</span>
                        <div className="flex items-center gap-2">
                            <span className="text-emerald-500 text-[10px] font-bold">WASM_WEBGL</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] font-mono">NEURAL_DENSITY</span>
                        <span className={modelsLoaded ? "text-emerald-500 text-[10px] font-bold" : "text-amber-500 text-[10px] font-bold animate-pulse"}>
                            {modelsLoaded ? 'NOMINAL' : 'BOOTING...'}
                        </span>
                    </div>
                </div>
                {error && <div className="text-[10px] text-red-500 mt-4 p-3 border border-red-500/20 bg-red-500/5 font-mono italic">![ERROR]: {error}</div>}
            </div>

            {/* Session Stats */}
            <div className="glass-panel p-6 border-slate-800/80 bg-slate-900/40 flex-1 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-[1px] bg-gradient-to-l from-amber-500/50 to-transparent"></div>
                <h3 className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold mb-5 border-b border-white/5 pb-3">Session Telemetry // REAL_TIME</h3>

                <div className="grid gap-3">
                    <div className="flex justify-between items-center bg-slate-950/50 p-3 border border-slate-800/50 rounded group/row hover:border-amber-500/30 transition-colors">
                        <span className="text-[10px] text-slate-500 group-hover/row:text-slate-300 transition-colors">UPTIME_SEC</span>
                        <span className="text-xs text-slate-100 font-bold">{elapsed}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950/50 p-3 border border-slate-800/50 rounded group/row hover:border-amber-500/30 transition-colors">
                        <span className="text-[10px] text-slate-500 group-hover/row:text-slate-300 transition-colors">THROUGHPUT_FPS</span>
                        <span className="text-xs text-amber-500 font-bold">{sessionStats.avgFps ? sessionStats.avgFps.toFixed(1) : '0.0'}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950/50 p-3 border border-slate-800/50 rounded group/row hover:border-amber-500/30 transition-colors">
                        <span className="text-[10px] text-slate-500 group-hover/row:text-slate-300 transition-colors">MT_ANALYZED</span>
                        <span className="text-xs text-slate-100 font-bold">{sessionStats.framesAnalyzed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950/50 p-3 border border-slate-800/50 rounded group/row hover:border-amber-500/30 transition-colors">
                        <span className="text-[10px] text-slate-500 group-hover/row:text-slate-300 transition-colors">REGISTRY_STORE</span>
                        <span className="text-xs text-emerald-500 font-bold">{sessionStats.capturesTaken}</span>
                    </div>
                </div>
            </div>

            {/* Simulated Live Feed Indicator */}
            <div className="glass-panel p-4 border-slate-800">
                <div className={`flex items-center justify-center p-2 border ${socketConnected ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 border-dashed'} relative overflow-hidden group transition-colors`}>
                    {socketConnected ? (
                        <>
                            <Radio className="w-4 h-4 text-emerald-500 mr-2 animate-pulse" />
                            <span className="text-xs text-emerald-500 uppercase tracking-widest">Global Relay Connected</span>
                        </>
                    ) : (
                        <>
                            <Server className="w-4 h-4 text-slate-600 mr-2" />
                            <span className="text-xs text-slate-500 uppercase tracking-widest">WebSocket Offline</span>
                        </>
                    )}
                </div>
                {liveData && (
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-center bg-slate-900/50 p-2 border border-slate-800">
                            <span className="text-[10px] uppercase text-slate-500">Global Stream Mode</span>
                            <span className="text-[10px] text-amber-500">{liveData.captureId}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CVDashboard;
