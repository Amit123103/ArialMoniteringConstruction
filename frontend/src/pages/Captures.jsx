import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useLocation, Link } from 'react-router-dom';
import { Camera, Calendar, Tag, Activity } from 'lucide-react';

const Captures = () => {
    const location = useLocation();
    const [captures, setCaptures] = useState([]);
    const [loading, setLoading] = useState(true);
    const projectId = location.state?.projectId;

    useEffect(() => {
        const fetchCaptures = async () => {
            try {
                const url = projectId ? `/captures?project_id=${projectId}` : '/captures';
                const res = await api.get(url);
                setCaptures(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCaptures();
    }, [projectId]);

    if (loading) return <div className="text-center p-10 font-mono text-amber-500">LOADING_CAPTURE_DATA...</div>;

    return (
        <div className="space-y-8 relative px-4">
            {/* Satellite Imaging HUD Background */}
            <div className="absolute inset-0 z-0 opacity-[0.1] pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#78350f_1px,transparent_1px),linear-gradient(to_bottom,#78350f_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <header className="border-b border-white/5 pb-8 relative z-10 animate-slide-up" style={{ animationDelay: '100ms' }}>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 font-mono text-[10px] uppercase tracking-[0.25em] mb-4 font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <Camera className="w-3 h-3 animate-pulse" />
                    Satellite Precision Imaging // GEO_RECON
                </div>
                <h1 className="text-5xl font-display font-bold text-slate-100 uppercase tracking-widest drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                    Capture Registry
                </h1>
                <p className="text-slate-500 font-mono text-xs mt-3 uppercase tracking-widest opacity-80">Telemetry data across {captures.length} AI-Analyzed High-Resolution Photogrammetry Units.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {captures.map((capture, i) => (
                    <div key={capture.id} className={`glass-panel overflow-hidden border-slate-800/80 hover:border-amber-500/60 transition-all duration-700 flex flex-col group hover:-translate-y-2 hover:shadow-[0_20px_50px_-10px_rgba(245,158,11,0.3)] animate-slide-up bg-slate-900/40 relative`} style={{ animationDelay: `${i * 100}ms` }}>

                        {/* Scanning HUD Overlay */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent -translate-y-full group-hover:animate-[scan_4s_linear_infinite] opacity-0 group-hover:opacity-100 z-30"></div>

                        <div className="relative aspect-video bg-slate-950 overflow-hidden">
                            <img
                                src={capture.thumbnail_url || capture.image_url}
                                alt={`Capture ${capture.id}`}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out grayscale group-hover:grayscale-0 transition-all"
                            />

                            {/* HUD border on image */}
                            <div className="absolute inset-4 border border-white/5 pointer-events-none group-hover:border-amber-500/20 transition-all duration-700">
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500/40 group-hover:border-amber-500 group-hover:scale-110 transition-all"></div>
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500/40 group-hover:border-amber-500 group-hover:scale-110 transition-all"></div>
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500/40 group-hover:border-amber-500 group-hover:scale-110 transition-all"></div>
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500/40 group-hover:border-amber-500 group-hover:scale-110 transition-all"></div>

                                <div className="absolute top-1/2 left-0 w-2 h-[1px] bg-amber-500/20"></div>
                                <div className="absolute top-1/2 right-0 w-2 h-[1px] bg-amber-500/20"></div>
                                <div className="absolute top-0 left-1/2 w-[1px] h-2 bg-amber-500/20"></div>
                                <div className="absolute bottom-0 left-1/2 w-[1px] h-2 bg-amber-500/20"></div>
                            </div>

                            <div className="absolute bottom-3 left-4 flex gap-1 items-center z-20">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">Sync Active</span>
                            </div>

                            {capture.cv_data && capture.cv_data.score && (
                                <div className="absolute top-4 right-4 bg-slate-950/90 border border-amber-500/40 px-3 py-1.5 flex items-center gap-2 backdrop-blur-xl rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:border-amber-500 transition-colors z-20">
                                    <Activity className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                                    <span className="text-sm font-mono font-bold text-amber-400">{capture.cv_data.score}</span>
                                </div>
                            )}
                        </div>

                        <div className="p-6 flex-1 flex flex-col relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="flex justify-between items-center mb-4 relative z-10">
                                <div className="flex items-center text-slate-400 group-hover:text-amber-200 transition-colors text-[10px] font-mono gap-2 tracking-tighter">
                                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                    {new Date(capture.captured_at).toLocaleString()}
                                </div>
                                <span className="text-[9px] font-mono px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 uppercase rounded tracking-widest group-hover:border-amber-500/30 transition-colors">
                                    Phase: {capture.phase || 'N/A'}
                                </span>
                            </div>

                            <p className="text-xs text-slate-400 mb-6 line-clamp-2 italic font-mono leading-relaxed group-hover:text-slate-200 transition-colors relative z-10">
                                {capture.notes ? `"${capture.notes}"` : "NO_MANUAL_TRANSCRIPTION_RECORDED"}
                            </p>

                            <div className="mt-auto pt-5 border-t border-slate-800/80 relative z-10 flex flex-wrap gap-3">
                                {capture.cv_data && capture.cv_data.workerCount !== undefined ? (
                                    <>
                                        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/5 px-2.5 py-1.5 rounded-md border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors cursor-default">
                                            <Tag className="w-3 h-3" /> Workers: <span className="font-bold">{capture.cv_data.workerCount}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-mono text-blue-400 bg-blue-500/5 px-2.5 py-1.5 rounded-md border border-blue-500/20 hover:bg-blue-500/10 transition-colors cursor-default">
                                            <Camera className="w-3 h-3" /> Units: <span className="font-bold">{capture.cv_data.machineCount || 0}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest italic">Temporal Matrix Pending Analysis</div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {captures.length === 0 && (
                    <div className="col-span-full py-16 text-center border border-slate-800 border-dashed glass-panel">
                        <Camera className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-mono text-slate-300 mb-1">NO CAPTURES DETECTED</h3>
                        <p className="text-slate-500 font-mono text-sm max-w-md mx-auto">
                            The visual intelligence matrix is empty for this query zone. Initialize Live Capture to begin monitoring.
                        </p>
                        <Link to="/live-capture" className="inline-block mt-4 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-slate-900 border border-amber-500/50 px-6 py-2 font-mono text-sm uppercase transition-colors">
                            Launch Capture Mission
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Captures;
