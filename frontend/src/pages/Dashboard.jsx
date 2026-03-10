import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Camera, Activity, Map, AlertTriangle, Cpu, Database, Server, Zap, HardDrive } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalProjects: 0, totalCaptures: 0, averageProgress: 0 });
    const [recentAlerts, setRecentAlerts] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [reportRes, alertsRes] = await Promise.all([
                    api.get('/reports/summary'),
                    api.get('/alerts')
                ]);
                setStats(reportRes.data);
                setRecentAlerts(alertsRes.data.slice(0, 5));
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-6">
            <header className="mb-8 border-b border-slate-800/80 pb-6 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-mono text-[10px] uppercase tracking-widest mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Connection Active
                </div>
                <h1 className="text-4xl font-display font-bold text-slate-100 tracking-wider uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">Command Center</h1>
                <p className="text-slate-400 font-mono text-sm mt-2">System Overview & Global Metrics</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric Cards - Animated and Colorful */}
                <div className="glass-panel p-6 border-blue-500/30 hover:border-blue-400/80 shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] relative overflow-hidden group animate-slide-up transition-all duration-500 hover:-translate-y-2 cursor-default">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] group-hover:bg-blue-500/30 group-hover:scale-150 transition-all duration-700"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">Active Sites</p>
                            <h3 className="text-5xl font-display font-bold mt-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-[0_0_25px_rgba(56,189,248,0.4)]">
                                {stats.totalProjects}
                            </h3>
                        </div>
                        <Map className="text-blue-500/50 w-12 h-12 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 group-hover:text-blue-400" />
                    </div>
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                </div>

                <div className="glass-panel p-6 border-purple-500/30 hover:border-purple-400/80 shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] relative overflow-hidden group animate-slide-up [animation-delay:100ms] transition-all duration-500 hover:-translate-y-2 cursor-default">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] group-hover:bg-purple-500/30 group-hover:scale-150 transition-all duration-700"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-xs font-mono text-purple-400 uppercase tracking-widest font-bold">Total Captures</p>
                            <h3 className="text-5xl font-display font-bold mt-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-[0_0_25px_rgba(232,121,249,0.4)]">
                                {stats.totalCaptures}
                            </h3>
                        </div>
                        <Camera className="text-purple-500/50 w-12 h-12 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 group-hover:text-purple-400" />
                    </div>
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-400 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                </div>

                <div className="glass-panel p-6 border-emerald-500/30 hover:border-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] relative overflow-hidden group animate-slide-up [animation-delay:200ms] transition-all duration-500 hover:-translate-y-2 cursor-default">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] group-hover:bg-emerald-500/30 group-hover:scale-150 transition-all duration-700"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div className="w-full">
                            <div className="flex justify-between w-full items-center">
                                <p className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">Global Progress</p>
                                <Activity className="text-emerald-500/50 w-12 h-12 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 group-hover:text-emerald-400" />
                            </div>
                            <h3 className="text-5xl font-display font-bold mt-3 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-[0_0_25px_rgba(45,212,191,0.4)]">
                                {stats.averageProgress}%
                            </h3>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Quick Actions */}
                <div className="glass-panel p-6 border-slate-800/80 animate-slide-up [animation-delay:300ms]">
                    <h3 className="text-sm font-mono text-slate-300 uppercase mb-6 border-b border-slate-800 pb-3 flex items-center justify-between">
                        Quick Actions
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 rounded bg-amber-500 block"></div>
                            <div className="w-2 h-2 rounded bg-emerald-500 block"></div>
                            <div className="w-2 h-2 rounded bg-blue-500 block"></div>
                        </div>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/live-capture" className="glass-panel p-5 border-slate-700 hover:border-amber-500 hover:bg-gradient-to-br hover:from-amber-600/20 hover:to-orange-600/10 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_5px_20px_rgba(245,158,11,0.2)]">
                            <div className="bg-amber-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                                <Camera className="text-amber-500 w-6 h-6 group-hover:animate-pulse group-hover:scale-110 transition-transform" />
                            </div>
                            <h4 className="font-mono text-sm text-slate-200 uppercase group-hover:text-amber-400 transition-colors font-bold tracking-wide">Live CV Capture</h4>
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2">Initialize real-time webcam analysis and object detection matrices.</p>
                        </Link>

                        <Link to="/cv-analysis" className="glass-panel p-5 border-slate-700 hover:border-emerald-500 hover:bg-gradient-to-br hover:from-emerald-600/20 hover:to-teal-600/10 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_5px_20px_rgba(16,185,129,0.2)]">
                            <div className="bg-emerald-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                                <Activity className="text-emerald-500 w-6 h-6 group-hover:animate-bounce group-hover:scale-110 transition-transform" />
                            </div>
                            <h4 className="font-mono text-sm text-slate-200 uppercase group-hover:text-emerald-400 transition-colors font-bold tracking-wide">Image Analysis</h4>
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2">Upload batch captures for Server-side OpenCV post-processing.</p>
                        </Link>

                        <Link to="/projects" className="glass-panel p-5 border-slate-700 hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-600/20 hover:to-cyan-600/10 transition-all duration-300 group hover:-translate-y-1 col-span-2 sm:col-span-1 hover:shadow-[0_5px_20px_rgba(59,130,246,0.2)]">
                            <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                                <Map className="text-blue-500 w-6 h-6 group-hover:animate-float group-hover:scale-110 transition-transform" />
                            </div>
                            <h4 className="font-mono text-sm text-slate-200 uppercase group-hover:text-blue-400 transition-colors font-bold tracking-wide">Active Projects</h4>
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2">Access the secure registry of all operational construction sites.</p>
                        </Link>
                    </div>
                </div>

                {/* Recent Alerts */}
                <div className="glass-panel p-6 border-slate-800/80 animate-slide-up [animation-delay:400ms]">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-6">
                        <h3 className="text-sm font-mono text-slate-300 uppercase">Recent System Alerts</h3>
                        <div className="flex items-center gap-2 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase">Live Feed</span>
                        </div>
                    </div>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {recentAlerts.length > 0 ? recentAlerts.map(alert => (
                            <div key={alert.id} className="flex gap-4 items-start p-4 bg-slate-900/40 border border-slate-800/50 hover:border-amber-500/30 transition-colors group cursor-pointer rounded-lg relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500/50 group-hover:bg-amber-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                                <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-200 font-medium group-hover:text-white transition-colors">{alert.message}</p>
                                    <p className="text-[10px] text-slate-500 font-mono mt-1.5 uppercase tracking-wider">{new Date(alert.created_at).toLocaleString()} • <span className="text-amber-500/70">{alert.project_name}</span></p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8 border border-slate-800 border-dashed">
                                <p className="text-slate-500 font-mono text-sm">No recent alerts</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Advanced Metrics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

                {/* System Resources */}
                <div className="glass-panel p-6 border-slate-800/80 animate-slide-up [animation-delay:500ms]">
                    <h3 className="text-sm font-mono text-slate-300 uppercase mb-6 border-b border-slate-800 pb-3 flex items-center">
                        <Server className="w-4 h-4 mr-2 text-blue-500" /> Server Resources
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-xs font-mono mb-2">
                                <span className="text-slate-400">CPU Usage</span>
                                <span className="text-amber-500 font-bold">42%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 w-[42%] relative">
                                    <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-mono mb-2">
                                <span className="text-slate-400">RAM Allocation</span>
                                <span className="text-purple-500 font-bold">12.4 GB / 32 GB</span>
                            </div>
                            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-[38%] relative">
                                    <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-mono mb-2">
                                <span className="text-slate-400">Storage (SQLite)</span>
                                <span className="text-blue-500 font-bold">145 MB / 5 GB</span>
                            </div>
                            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 w-[15%] relative"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Neural Models */}
                <div className="glass-panel p-6 border-slate-800/80 animate-slide-up [animation-delay:600ms]">
                    <h3 className="text-sm font-mono text-slate-300 uppercase mb-6 border-b border-slate-800 pb-3 flex items-center">
                        <Cpu className="w-4 h-4 mr-2 text-emerald-500" /> Active Neural Models
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-900/40 border border-emerald-500/20 rounded">
                            <div className="flex items-center gap-3">
                                <Zap className="w-4 h-4 text-emerald-500" />
                                <div>
                                    <h4 className="text-xs font-mono text-slate-200 uppercase font-bold">COCO-SSD v2</h4>
                                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">Object Detection (80 Classes)</p>
                                </div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono border border-emerald-500/30">ONLINE</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-900/40 border border-emerald-500/20 rounded">
                            <div className="flex items-center gap-3">
                                <Activity className="w-4 h-4 text-emerald-500" />
                                <div>
                                    <h4 className="text-xs font-mono text-slate-200 uppercase font-bold">MobileNet</h4>
                                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">Scene Classification Core</p>
                                </div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono border border-emerald-500/30">ONLINE</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-900/40 border border-slate-800 rounded opacity-70">
                            <div className="flex items-center gap-3">
                                <Database className="w-4 h-4 text-slate-500" />
                                <div>
                                    <h4 className="text-xs font-mono text-slate-400 uppercase font-bold">BodyPix Net</h4>
                                    <p className="text-[10px] font-mono text-slate-600 mt-0.5">Worker Segmentation</p>
                                </div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold font-mono border border-slate-700">STANDBY</span>
                        </div>
                    </div>
                </div>

                {/* Recent Captures Mini-Grid */}
                <div className="glass-panel p-6 border-slate-800/80 animate-slide-up [animation-delay:700ms]">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-6">
                        <h3 className="text-sm font-mono text-slate-300 uppercase flex items-center">
                            <Camera className="w-4 h-4 mr-2 text-purple-500" /> Latest Uploads
                        </h3>
                        <Link to="/cv-analysis" className="text-[10px] font-mono text-purple-400 hover:text-purple-300 uppercase tracking-widest border-b border-transparent hover:border-purple-400 pb-0.5">View All</Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="aspect-square bg-slate-900 rounded border border-slate-800 hover:border-purple-500/50 transition-colors flex items-center justify-center group overflow-hidden relative cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1541888018134-8b6b2184d284?auto=format&fit=crop&q=80&w=200" alt="Capture 1" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent"></div>
                            <span className="absolute bottom-2 left-2 text-[8px] font-mono text-emerald-400">ANALYZED • 98%</span>
                        </div>
                        <div className="aspect-square bg-slate-900 rounded border border-slate-800 hover:border-purple-500/50 transition-colors flex items-center justify-center group overflow-hidden relative cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=200" alt="Capture 2" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent"></div>
                            <span className="absolute bottom-2 left-2 text-[8px] font-mono text-emerald-400">ANALYZED • 84%</span>
                        </div>
                        <div className="aspect-square bg-slate-900 rounded border border-slate-800 hover:border-purple-500/50 transition-colors flex items-center justify-center group overflow-hidden relative cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1504307651254-35680f35aa21?auto=format&fit=crop&q=80&w=200" alt="Capture 3" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent"></div>
                            <span className="absolute bottom-2 left-2 text-[8px] font-mono text-emerald-400">ANALYZED • 91%</span>
                        </div>
                        <div className="aspect-square bg-slate-900 rounded border border-slate-800 hover:border-purple-500/50 transition-colors flex items-center justify-center group overflow-hidden relative cursor-pointer">
                            <HardDrive className="w-6 h-6 text-slate-600 group-hover:text-purple-400 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
