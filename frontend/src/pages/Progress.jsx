import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Layers, ChevronDown } from 'lucide-react';

const Progress = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [data, setData] = useState({ currentProgress: 0, cvHistory: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const res = await api.get('/projects');
            setProjects(res.data);
            if (res.data.length > 0) setSelectedProject(res.data[0].id.toString());
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        if (!selectedProject) return;
        setLoading(true);
        const fetchProgress = async () => {
            try {
                const res = await api.get(`/progress/${selectedProject}`);

                // Format history for chart
                const formattedHistory = res.data.cvHistory.map((h, i) => ({
                    ...h,
                    name: `Scan ${i + 1}`,
                    date: new Date(h.created_at).toLocaleDateString(),
                    Score: h.score,
                    Workers: h.worker_count,
                    Machinery: h.machinery_count
                }));

                setData({ ...res.data, formattedHistory });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProgress();
    }, [selectedProject]);

    return (
        <div className="space-y-6 relative">
            {/* Animated Data Stream Background */}
            <div className="absolute inset-x-0 -top-20 h-[500px] z-0 opacity-[0.03] pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
            </div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 blur-[150px] rounded-full pointer-events-none"></div>

            <header className="border-b border-slate-800/80 pb-6 flex justify-between items-end relative z-10 animate-slide-up">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-500 font-mono text-[10px] uppercase tracking-widest mb-4 font-bold">
                        <Activity className="w-3 h-3" />
                        Neural Forecasting Engine v2.1
                    </div>
                    <h1 className="text-4xl font-display font-bold text-slate-100 uppercase tracking-wider flex items-center drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        Progress Analytics
                    </h1>
                    <p className="text-slate-400 font-mono text-sm mt-2">Historical telemetry tracking and AI-driven growth projections.</p>
                </div>
                {projects.length > 0 && (
                    <div className="flex flex-col items-end gap-2">
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Sector Selection</label>
                        <select
                            className="bg-slate-950 border border-slate-800 text-amber-500 font-mono text-xs p-3 outline-none focus:border-amber-500 transition-all rounded-lg cursor-pointer hover:bg-slate-900 min-w-[200px]"
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                        >
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                )}
            </header>

            {loading ? (
                <div className="h-[60vh] flex flex-col items-center justify-center gap-6 relative z-10">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-amber-500 animate-pulse" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="font-mono text-amber-500 text-sm tracking-[0.3em] font-bold animate-pulse">COMPUTING_TELEMETRY_MATRIX</span>
                        <span className="font-mono text-slate-600 text-[10px] uppercase">Accessing encrypted sector: {selectedProject}</span>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Top Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
                        <div className="glass-panel p-8 border-slate-800 border-l-4 border-l-amber-500/60 hover:border-l-amber-500 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors"></div>
                            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] font-bold mb-2">Base Progress Index</p>
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-5xl font-display font-bold text-slate-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{data.currentProgress}</h2>
                                <span className="text-xl font-mono text-amber-500 font-bold">%</span>
                            </div>
                            <div className="mt-4 h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 group-hover:animate-pulse" style={{ width: `${data.currentProgress}%` }}></div>
                            </div>
                        </div>
                        <div className="glass-panel p-8 border-slate-800 border-l-4 border-l-emerald-500/60 hover:border-l-emerald-500 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
                            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] font-bold mb-2">Neural Activity Score</p>
                            <h2 className="text-5xl font-display font-bold text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                {data.cvHistory.length ? Math.round(data.cvHistory.reduce((s, h) => s + h.score, 0) / data.cvHistory.length) : '00'}
                            </h2>
                            <div className="mt-4 flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={`h-1 flex-1 rounded-full ${i <= 4 ? 'bg-emerald-500/40' : 'bg-slate-800'}`}></div>
                                ))}
                            </div>
                        </div>
                        <div className="glass-panel p-8 border-slate-800 border-l-4 border-l-blue-500/60 hover:border-l-blue-500 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
                            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] font-bold mb-2">Total Telemetry Scans</p>
                            <h2 className="text-5xl font-display font-bold text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">{data.cvHistory.length.toString().padStart(2, '0')}</h2>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-[10px] font-mono text-slate-500">SYNC_STATUS</span>
                                <span className="text-[10px] font-mono text-blue-400 font-bold">NOMINAL</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart area */}
                    {data.formattedHistory && data.formattedHistory.length > 0 ? (
                        <>
                            <div className="glass-panel p-0 border-slate-800/80 overflow-hidden group animate-slide-up shadow-2xl" style={{ animationDelay: '100ms' }}>
                                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/40 relative">
                                    <div className="absolute top-0 left-0 w-24 h-[1px] bg-gradient-to-r from-amber-500/50 to-transparent"></div>
                                    <h3 className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.3em] font-bold flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                                        Neural Activity Trajectory // PHASE_ANALYSIS
                                    </h3>
                                    <div className="flex gap-2 text-[9px] font-mono text-slate-500">
                                        <span className="px-2 py-0.5 border border-slate-800 rounded">LINEAR_REGRESSION</span>
                                        <span className="px-2 py-0.5 border border-amber-500/30 text-amber-500 rounded bg-amber-500/5">AI_ENHANCED</span>
                                    </div>
                                </div>
                                <div className="p-8 h-96">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data.formattedHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                                </linearGradient>
                                                <filter id="glow">
                                                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                                    <feMerge>
                                                        <feMergeNode in="coloredBlur" />
                                                        <feMergeNode in="SourceGraphic" />
                                                    </feMerge>
                                                </filter>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                            <XAxis dataKey="date" stroke="#475569" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} />
                                            <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} domain={[0, 100]} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                                itemStyle={{ color: '#f59e0b', fontSize: '12px', fontFamily: 'monospace' }}
                                                cursor={{ stroke: '#f59e0b', strokeWidth: 1, strokeDasharray: '4 4' }}
                                            />
                                            <Area type="monotone" dataKey="Score" stroke="#f59e0b" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} filter="url(#glow)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="glass-panel p-0 border-slate-800/80 overflow-hidden group animate-slide-up shadow-2xl" style={{ animationDelay: '200ms' }}>
                                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/40 relative">
                                    <div className="absolute top-0 left-0 w-24 h-[1px] bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                                    <h3 className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.3em] font-bold flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-blue-500" />
                                        Resource Allocation Matrix // ASSET_LOAD
                                    </h3>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                            <span className="text-[10px] font-mono text-slate-400">WORKERS</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                            <span className="text-[10px] font-mono text-slate-400">MACHINERY</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={data.formattedHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                            <XAxis dataKey="date" stroke="#475569" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} />
                                            <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}
                                                itemStyle={{ fontSize: '12px', fontFamily: 'monospace' }}
                                            />
                                            <Line type="stepAfter" dataKey="Workers" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0, shadowBlur: 10, shadowColor: '#10b981' }} />
                                            <Line type="stepAfter" dataKey="Machinery" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0, shadowBlur: 10, shadowColor: '#3b82f6' }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex justify-center">
                                    <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest italic font-bold">● TELEMETRY_STREAM_SYNCED_AND_VERIFIED</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="glass-panel p-20 text-center border-slate-800/80 border-dashed bg-slate-900/20 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Activity className="w-16 h-16 text-slate-700 mx-auto mb-6 opacity-40 group-hover:text-amber-500/40 transition-colors" />
                            <h3 className="text-xl font-display font-bold text-slate-400 uppercase tracking-widest mb-2">Insufficient Telemetry Data</h3>
                            <p className="text-slate-500 font-mono text-xs max-w-sm mx-auto leading-relaxed">The Neural Forecasting Engine requires a larger temporal dataset to generate trajectory matrices. Execute multiple CV missions to populate this sector.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Progress;
