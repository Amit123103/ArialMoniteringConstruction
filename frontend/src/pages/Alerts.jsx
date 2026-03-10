import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { AlertTriangle, ShieldAlert, AlertCircle, Info } from 'lucide-react';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await api.get('/alerts');
                setAlerts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'critical': return <ShieldAlert className="w-5 h-5 text-red-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'info': default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="space-y-8 relative px-4">
            {/* Threat Detection Matrix HUD Background */}
            <div className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ef4444_1px,transparent_1px),linear-gradient(to_bottom,#ef4444_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <header className="border-b border-white/5 pb-8 relative z-10 animate-slide-up" style={{ animationDelay: '100ms' }}>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-[10px] uppercase tracking-[0.25em] mb-4 font-bold shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <ShieldAlert className="w-3 h-3 animate-pulse" />
                    Security Protocol // THREAT_WATCH
                </div>
                <h1 className="text-5xl font-display font-bold text-slate-100 uppercase tracking-widest flex items-center drop-shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    Threat & Alert Center
                </h1>
                <p className="text-slate-500 font-mono text-xs mt-3 uppercase tracking-widest opacity-80">Real-time CV-detected anomalies and system-critical notification matrices.</p>
            </header>

            {loading ? (
                <div className="text-center p-10 font-mono text-amber-500">SCANNING_LOGS...</div>
            ) : (
                <div className="glass-panel border-white/5 overflow-hidden bg-slate-900/40 relative animate-slide-up shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]" style={{ animationDelay: '200ms' }}>
                    {alerts.length > 0 ? (
                        <div className="divide-y divide-white/5">
                            {alerts.map((alert, i) => (
                                <div key={alert.id} className={`p-6 hover:bg-white/5 transition-all duration-300 flex gap-5 relative group animate-slide-up ${!alert.read ? 'bg-red-500/5' : ''}`} style={{ animationDelay: `${300 + i * 50}ms` }}>

                                    {/* Unread highlight bar */}
                                    {!alert.read && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-red-500 shadow-[2px_0_10px_rgba(239,68,68,0.5)]"></div>}

                                    {/* Scanline overlay on hover */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:100%_4px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>

                                    <div className="mt-1 relative">
                                        <div className="absolute -inset-2 bg-current opacity-0 group-hover:opacity-20 blur-lg transition-opacity"></div>
                                        {getIcon(alert.type)}
                                    </div>
                                    <div className="flex-1 relative z-10">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className={`text-sm font-mono tracking-tight ${!alert.read ? 'text-slate-100 font-bold' : 'text-slate-300'}`}>{alert.message}</h4>
                                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded border border-white/5">{new Date(alert.created_at).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-[1px] w-4 bg-red-500/30"></div>
                                            <p className="text-[10px] text-red-500/60 font-mono uppercase tracking-[0.2em] font-bold group-hover:text-red-400 transition-colors uppercase leading-none">{alert.project_name || "GLOBAL_SYSTEM_ALERT"}</p>
                                        </div>
                                    </div>

                                    {/* Right arrow decoration */}
                                    <div className="self-center opacity-0 group-hover:opacity-50 transition-all translate-x-4 group-hover:translate-x-0">
                                        <Info className="w-4 h-4 text-slate-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-32 text-center relative overflow-hidden group">
                            {/* Pulse background decoration */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                                <div className="w-64 h-64 border border-emerald-500/10 rounded-full animate-ping"></div>
                            </div>

                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-emerald-500/5 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-pulse">
                                    <ShieldAlert className="w-10 h-10 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-display font-bold text-slate-100 uppercase tracking-widest mb-2">Perimeter Secure</h3>
                                <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em]">No active anomalies detected. System nominal.</p>
                            </div>
                        </div>
                    )}
                </div>

            )}
        </div>
    );
};

export default Alerts;
