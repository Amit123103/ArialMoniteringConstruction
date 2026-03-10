import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { Camera, BarChart3, Clock, AlertCircle } from 'lucide-react';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await api.get(`/projects/${id}`);
                setProject(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) return <div className="text-center p-10 font-mono text-amber-500">LOADING_PROJECT_DATA...</div>;
    if (!project) return <div className="text-center p-10 text-red-500">PROJECT NOT FOUND</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="border-b border-slate-800 pb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-display font-bold text-slate-100 uppercase">{project.name}</h1>
                            <span className="text-xs font-mono px-2 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase">
                                {project.status}
                            </span>
                        </div>
                        <p className="text-slate-400 font-mono text-sm max-w-2xl">{project.description}</p>
                    </div>

                    <div className="text-right">
                        <p className="text-xs font-mono text-amber-500 uppercase mb-1 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">Overall Progress</p>
                        <div className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                            {project.progress}<span className="text-2xl text-emerald-500">%</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-up">
                <Link to="/live-capture" state={{ projectId: project.id }} className="glass-panel p-6 flex flex-col items-center justify-center text-center border-slate-700/50 hover:border-amber-500 hover:bg-gradient-to-br hover:from-amber-500/10 hover:to-orange-500/5 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_5px_20px_rgba(245,158,11,0.2)]">
                    <Camera className="w-10 h-10 text-slate-400 group-hover:text-amber-500 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse" />
                    <span className="font-mono text-sm uppercase text-slate-300 group-hover:text-amber-400 transition-colors tracking-wider">Live CV Capture</span>
                </Link>
                <Link to="/cv-analysis" state={{ projectId: project.id }} className="glass-panel p-6 flex flex-col items-center justify-center text-center border-slate-700/50 hover:border-emerald-500 hover:bg-gradient-to-br hover:from-emerald-500/10 hover:to-teal-500/5 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_5px_20px_rgba(16,185,129,0.2)] [animation-delay:100ms]">
                    <BarChart3 className="w-10 h-10 text-slate-400 group-hover:text-emerald-500 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:animate-bounce" />
                    <span className="font-mono text-sm uppercase text-slate-300 group-hover:text-emerald-400 transition-colors tracking-wider">Image Analysis</span>
                </Link>
                <Link to="/captures" state={{ projectId: project.id }} className="glass-panel p-6 flex flex-col items-center justify-center text-center border-slate-700/50 hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-cyan-500/5 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_5px_20px_rgba(59,130,246,0.2)] [animation-delay:200ms]">
                    <Clock className="w-10 h-10 text-slate-400 group-hover:text-blue-500 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:animate-float" />
                    <span className="font-mono text-sm uppercase text-slate-300 group-hover:text-blue-400 transition-colors tracking-wider">Capture History</span>
                </Link>
                <Link to="/progress" state={{ projectId: project.id }} className="glass-panel p-6 flex flex-col items-center justify-center text-center border-slate-700/50 hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-pink-500/5 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_5px_20px_rgba(168,85,247,0.2)] [animation-delay:300ms]">
                    <AlertCircle className="w-10 h-10 text-slate-400 group-hover:text-purple-500 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse" />
                    <span className="font-mono text-sm uppercase text-slate-300 group-hover:text-purple-400 transition-colors tracking-wider">AI Insights</span>
                </Link>
            </div>

            {/* Recent Captures */}
            <div className="glass-panel p-6 border-slate-800 mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-display font-medium text-slate-100 uppercase tracking-wide">Recent CV Captures</h3>
                    <Link to="/captures" state={{ projectId: project.id }} className="text-amber-500 text-xs font-mono hover:underline uppercase">View All</Link>
                </div>

                {project.recentCaptures && project.recentCaptures.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {project.recentCaptures.map(capture => (
                            <Link to={`/captures?id=${capture.id}`} key={capture.id} className="block group">
                                <div className="relative aspect-video bg-slate-900 overflow-hidden border border-slate-700 group-hover:border-amber-500 transition-colors">
                                    <img
                                        src={capture.thumbnail_url || capture.image_url}
                                        alt="Capture"
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                                    <div className="absolute bottom-2 left-2 right-2">
                                        <p className="text-[10px] font-mono text-amber-500 truncate">{capture.phase || 'General'}</p>
                                        <p className="text-[10px] font-mono text-slate-300">{new Date(capture.captured_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 border border-slate-800 border-dashed text-center">
                        <Camera className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400 font-mono text-sm">No captures available for this project.</p>
                        <p className="text-slate-500 font-mono text-xs mt-1">Initialize Live Capture to begin monitoring.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetail;
