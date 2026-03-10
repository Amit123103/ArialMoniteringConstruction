import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { Plus, Building2, MapPin, Calendar } from 'lucide-react';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // New Project Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        start_date: new Date().toISOString().split('T')[0]
    });

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/projects', formData);
            import('react-hot-toast').then(m => m.default.success('Project deployed successfully!'));
            setIsModalOpen(false);
            setFormData({ name: '', description: '', location: '', start_date: new Date().toISOString().split('T')[0] });
            fetchProjects(); // Refresh the list
        } catch (err) {
            console.error(err);
            import('react-hot-toast').then(m => m.default.error('Failed to create project'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="text-center p-10 font-mono text-amber-500 animate-pulse">LOADING_PROJECTS...</div>;

    return (
        <div className="space-y-8 relative">
            {/* Asset Management HUD Background */}
            <div className="absolute inset-0 z-0 opacity-[0.1] pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#78350f_1px,transparent_1px),linear-gradient(to_bottom,#78350f_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <header className="flex justify-between items-end border-b border-white/5 pb-8 relative z-10 animate-slide-up" style={{ animationDelay: '100ms' }}>

                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 font-mono text-[10px] uppercase tracking-[0.2em] mb-4 font-bold">
                        <Building2 className="w-3 h-3 animate-pulse" />
                        Asset Management Registry // OMNI_DEPOT
                    </div>
                    <h1 className="text-5xl font-display font-bold text-slate-100 uppercase tracking-wider drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">Project Registry</h1>
                    <p className="text-slate-500 font-mono text-xs mt-3 uppercase tracking-[0.15em] opacity-70">Synchronizing {projects.length} Active Operational Sites across the network.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-amber-500/5 hover:bg-amber-500 text-amber-500 hover:text-slate-900 px-8 py-4 text-xs font-mono font-bold border border-amber-500/50 flex items-center transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] group relative overflow-hidden backdrop-blur-md rounded-sm">
                    <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                    <Plus className="w-4 h-4 mr-3 group-hover:rotate-90 transition-transform duration-500" />
                    <span className="tracking-[0.2em]">INITIALIZE SITE</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, i) => (
                    <Link to={`/projects/${project.id}`} key={project.id} className={`block group animate-slide-up relative`} style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="glass-panel overflow-hidden border-slate-800/80 hover:border-amber-500/60 transition-all duration-500 h-full flex flex-col relative hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(245,158,11,0.4)]">

                            {/* Animated Background Glow & Scanlines */}
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Scanning line animation */}
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent -translate-y-full group-hover:animate-[scan_3s_linear_infinite] opacity-0 group-hover:opacity-100 z-20"></div>

                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-slate-800 group-hover:border-amber-500/50 transition-colors z-20"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-slate-800 group-hover:border-amber-500/50 transition-colors z-20"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-slate-800 group-hover:border-amber-500/50 transition-colors z-20"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-slate-800 group-hover:border-amber-500/50 transition-colors z-20"></div>

                            <div className="p-6 flex-1 z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700 group-hover:border-amber-500/50 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                        <Building2 className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <span className="text-[10px] font-mono px-3 py-1 bg-amber-500/10 text-amber-500 uppercase border border-amber-500/30 rounded-lg shadow-inner tracking-widest font-bold">
                                        {project.status === 'active' ? '● OPERATIONAL' : '○ STANDBY'}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold font-display text-slate-100 mb-3 truncate group-hover:text-amber-400 transition-colors duration-300 tracking-wide">{project.name}</h3>
                                <p className="text-slate-500 text-xs font-mono line-clamp-2 mb-4 group-hover:text-slate-400 transition-colors">{project.description || "System processing pending for additional site metadata..."}</p>

                                <div className="space-y-3 mt-4 text-xs font-mono">
                                    <div className="flex items-center text-slate-400 group-hover:text-slate-300 transition-colors">
                                        <div className="w-6 flex justify-center"><MapPin className="w-4 h-4 text-blue-500" /></div>
                                        <span className="truncate ml-1">{project.location}</span>
                                    </div>
                                    <div className="flex items-center text-slate-400 group-hover:text-slate-300 transition-colors">
                                        <div className="w-6 flex justify-center"><Calendar className="w-4 h-4 text-pink-500" /></div>
                                        <span className="ml-1">ESTABLISHED: {new Date(project.start_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-5 bg-slate-900/60 border-t border-slate-800/80 z-10 backdrop-blur-md relative overflow-hidden group/progress">
                                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-3 tracking-[0.2em] font-bold">
                                    <span>CONSTRUCTION_LOAD</span>
                                    <span className="text-amber-500">{project.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 shadow-[0_0_12px_rgba(245,158,11,0.4)] transition-all duration-1000 ease-out group-hover:animate-pulse"
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                </div>
                                {/* Progress bar percentage markers */}
                                <div className="flex justify-between mt-1 px-0.5">
                                    {[0, 25, 50, 75, 100].map(m => (
                                        <div key={m} className="w-[1px] h-1 bg-slate-800"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* New Project Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
                    <div className="glass-panel w-full max-w-xl p-10 border-amber-500/40 bg-slate-900/60 relative shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden">
                        {/* Matrix Grid Decoration */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f59e0b_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                        </div>

                        {/* Decorative HUD corners */}
                        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-amber-500/60"></div>
                        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-amber-500/20"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-amber-500/20"></div>
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-amber-500/60"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-display font-light text-slate-100 uppercase mb-8 flex items-center tracking-widest leading-none drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                                <span className="bg-amber-500 text-slate-950 p-2 mr-4 rounded-sm"><Plus className="w-6 h-6" /></span>
                                Site Initialization
                            </h2>


                            <form onSubmit={handleCreateProject} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-xs font-mono text-amber-500 uppercase mb-1">Project Name</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm font-mono p-3 outline-none focus:border-amber-500"
                                        placeholder="e.g. Sector 7G Development"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-xs font-mono text-amber-500 uppercase mb-1">Site Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        required
                                        rows="3"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm font-mono p-3 outline-none focus:border-amber-500 resize-none"
                                        placeholder="Brief summary of construction objectives..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="location" className="block text-xs font-mono text-amber-500 uppercase mb-1">Coordinates/Location</label>
                                        <input
                                            id="location"
                                            name="location"
                                            type="text"
                                            required
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm font-mono p-3 outline-none focus:border-amber-500"
                                            placeholder="City, Region"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="start_date" className="block text-xs font-mono text-amber-500 uppercase mb-1">Commencement Date</label>
                                        <input
                                            id="start_date"
                                            name="start_date"
                                            type="date"
                                            required
                                            value={formData.start_date}
                                            onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm font-mono p-3 outline-none focus:border-amber-500 [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2 text-slate-400 font-mono text-sm uppercase hover:text-slate-200 transition-colors"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 px-6 py-2 font-mono font-bold uppercase transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                                    >
                                        {isSubmitting ? 'PROCESSING...' : 'DEPLOY PROJECT'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
