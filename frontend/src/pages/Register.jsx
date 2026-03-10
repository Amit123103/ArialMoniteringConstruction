import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, user } = useAuth();
    const [loading, setLoading] = useState(false);

    const backgroundImages = [
        'https://images.unsplash.com/photo-1541888018134-8b6b2184d284?auto=format&fit=crop&q=80&w=2000',
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=2000',
        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2000',
        'https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?auto=format&fit=crop&q=80&w=2000'
    ];
    const [currentBg, setCurrentBg] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    if (user) return <Navigate to="/dashboard" />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await register(name, email, password);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 bg-grid-pattern bg-[length:32px_32px] overflow-hidden relative">

            {/* Dynamic Background Image Slider */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {backgroundImages.map((img, index) => (
                    <div
                        key={img}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${currentBg === index ? 'opacity-20' : 'opacity-0'
                            }`}
                        style={{ backgroundImage: `url(${img})` }}
                    />
                ))}
            </div>

            {/* Ambient Lighting Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-amber-600/20 rounded-full blur-[140px] animate-blob mix-blend-screen"></div>
                <div className="absolute top-[40%] right-[-10%] w-[50%] h-[70%] bg-orange-600/20 rounded-full blur-[140px] animate-blob [animation-delay:2s] mix-blend-screen"></div>
            </div>

            <div className="absolute inset-0 bg-amber-500/5 mix-blend-overlay pointer-events-none z-0"></div>

            <div className="w-full max-w-md relative z-10 animate-slide-up">
                {/* HUD Decorations */}
                <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-amber-500"></div>
                <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-amber-500"></div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500"></div>
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-amber-500"></div>

                <div className="glass-panel p-8 relative z-10 shadow-[0_0_50px_rgba(245,158,11,0.15)] border-amber-500/30">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 border border-amber-500/50 mb-4 shadow-[0_0_25px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] transition-all">
                            <span className="text-2xl font-mono text-amber-500 animate-pulse">OP</span>
                        </div>
                        <h1 className="text-3xl font-display font-bold tracking-wider text-slate-100">INITIALIZE<span className="text-amber-500"> UPLINK</span></h1>
                        <p className="text-slate-400 font-mono text-sm mt-2">NEW OPERATOR REGISTRATION</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-xs font-mono text-amber-500/80 mb-2 uppercase tracking-widest">Operator Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-900/80 border border-slate-700/80 focus:border-amber-500 focus:shadow-[0_0_15px_rgba(245,158,11,0.2)] text-slate-100 px-4 py-3 outline-none font-mono text-sm transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-mono text-amber-500/80 mb-2 uppercase tracking-widest">Access Node (Email)</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900/80 border border-slate-700/80 focus:border-amber-500 focus:shadow-[0_0_15px_rgba(245,158,11,0.2)] text-slate-100 px-4 py-3 outline-none font-mono text-sm transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-mono text-amber-500/80 mb-2 uppercase tracking-widest">Secure Clearance (Password)</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900/80 border border-slate-700/80 focus:border-amber-500 focus:shadow-[0_0_15px_rgba(245,158,11,0.2)] text-slate-100 px-4 py-3 outline-none font-mono text-sm transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 px-4 uppercase tracking-widest font-mono text-sm transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] disabled:opacity-50"
                        >
                            {loading ? 'SYNCING DATA...' : 'REGISTER NODE'}
                        </button>

                        <div className="text-center mt-6">
                            <Link to="/login" className="text-xs font-mono text-slate-400 hover:text-amber-500 transition-colors uppercase tracking-widest border-b border-transparent hover:border-amber-500 pb-1">
                                Already Registered? Authenticate
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <p className="fixed bottom-4 text-xs font-mono text-slate-600">v2.0 - REGISTRY_SECURE</p>
        </div>
    );
};

export default Register;
