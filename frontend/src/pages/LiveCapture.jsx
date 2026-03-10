import React, { useState, useEffect } from 'react';
import WebcamStream from '../components/CV/WebcamStream.jsx';
import CVDashboard from '../components/CV/CVDashboard.jsx';
import api from '../api/axios';
import { useCV } from '../context/CVContext';
import { Activity, Map, ChevronDown } from 'lucide-react';

const LiveCapture = () => {
    const { modelsLoaded, loadProgress } = useCV();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects');
                setProjects(res.data);
                if (res.data.length > 0) setSelectedProject(res.data[0].id.toString());
            } catch (err) {
                console.error(err);
            }
        };
        fetchProjects();
    }, []);

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6 overflow-hidden relative">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none"></div>


            {/* Left/Center: Video Feed & Controls */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="mb-6 relative z-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-mono text-[10px] uppercase tracking-widest mb-3 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        Direct Satellite Uplink Active // SECURE_CHANNEL_802
                    </div>
                    <div className="flex items-center justify-between">
                        <h1 className="text-4xl font-display font-bold text-slate-100 uppercase tracking-wider flex items-center drop-shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                            <Activity className="w-8 h-8 mr-3 text-red-500 animate-pulse" />
                            Live Telemetry Feed
                        </h1>
                        <div className="hidden lg:flex items-center gap-6 font-mono text-[10px] text-slate-500 uppercase tracking-[0.2em]">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                                Optics: Nominal
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                Uplink: Stable
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 relative glass-panel hud-border overflow-hidden bg-black flex flex-col animate-slide-up shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]" style={{ animationDelay: '200ms' }}>
                    {!modelsLoaded ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-slate-950/95 backdrop-blur-xl">
                            <div className="relative w-[450px] p-10 border border-slate-800 bg-slate-900/40 rounded-xl overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent"></div>

                                {/* Decorative elements */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500/50"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500/50"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-500/50"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500/50"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                                        <h3 className="font-mono bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500 uppercase tracking-[0.4em] text-xs font-bold">System Boot Sequence</h3>
                                        <span className="text-[10px] font-mono text-slate-600 animate-pulse">v4.0.2</span>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="group">
                                            <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-2 uppercase tracking-widest">
                                                <span>TensorFlow.js Core</span>
                                                <span className="text-amber-400 font-bold">{Math.min(loadProgress, 20)}%</span>
                                            </div>
                                            <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                                <div className="h-full bg-gradient-to-r from-amber-600 to-orange-500 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]" style={{ width: `${Math.min((loadProgress / 20) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="group">
                                            <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-2 uppercase tracking-widest">
                                                <span>COCO-SSD V2 (OBJECTS)</span>
                                                <span className="text-emerald-400 font-bold">{Math.max(0, Math.min(loadProgress - 20, 40))}%</span>
                                            </div>
                                            <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                                <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]" style={{ width: `${Math.max(0, Math.min(((loadProgress - 20) / 40) * 100, 100))}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="group">
                                            <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-2 uppercase tracking-widest">
                                                <span>MobileNet (SCENE)</span>
                                                <span className="text-blue-400 font-bold">{Math.max(0, Math.min(loadProgress - 60, 40))}%</span>
                                            </div>
                                            <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                                <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ width: `${Math.max(0, Math.min(((loadProgress - 60) / 40) * 100, 100))}%` }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-center">
                                        <div className="px-4 py-1.5 border border-slate-800 bg-slate-950/50 rounded flex items-center gap-3">
                                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
                                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Waiting for hardware acceleration...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <WebcamStream projectId={selectedProject} />
                </div>
            </div>

            {/* Right: CV Stats Dashboard */}
            <div className="w-full md:w-80 lg:w-96 flex flex-col h-full overflow-y-auto no-scrollbar gap-4 shrink-0 relative z-10 animate-slide-up" style={{ animationDelay: '300ms' }}>
                <div className="glass-panel p-6 border-slate-800/80 hover:border-amber-500/30 transition-all group bg-slate-900/40">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Map className="w-4 h-4 text-amber-500" />
                            <label htmlFor="targetProject" className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em] group-hover:text-amber-500 transition-colors">Deployment Sector</label>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                    </div>
                    <div className="relative">
                        <select
                            id="targetProject"
                            name="targetProject"
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono p-4 outline-none focus:border-amber-500 transition-all rounded-lg cursor-pointer hover:bg-slate-900 appearance-none shadow-inner"
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                        >
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                <CVDashboard />
            </div>

        </div>
    );
};

export default LiveCapture;
