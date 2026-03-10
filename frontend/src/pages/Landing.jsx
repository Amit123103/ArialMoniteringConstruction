import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Scan, Cpu, Layers, ShieldCheck, Activity, PlayCircle, Mail, Send, CheckCircle2, Github, Linkedin, Instagram } from 'lucide-react';

const Landing = () => {
    const { user } = useAuth();

    const backgroundImages = [
        'https://images.unsplash.com/photo-1541888018134-8b6b2184d284?auto=format&fit=crop&q=80&w=2000', // Construction worker silhouette
        'https://images.unsplash.com/photo-1504307651254-35680f35aa21?auto=format&fit=crop&q=80&w=2000', // Drone point of view
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=2000', // Architecture 
        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2000', // High Tech/Servers
        'https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?auto=format&fit=crop&q=80&w=2000', // Blueprint/Planning
        'https://images.unsplash.com/photo-1534398079543-7ae610162e7a?auto=format&fit=crop&q=80&w=2000', // Surveyor looking through total station
        'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=2000', // Bridge construction
        'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=2000', // Looking up at modern skyscraper
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000', // Business district modern glass buildings
        'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000'  // Abstract geometric architecture
    ];
    const [currentBg, setCurrentBg] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Removed auto-redirect so the landing page always shows

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
            {/* Dynamic Background Image Slider */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-slate-950">
                {backgroundImages.map((img, index) => (
                    <div
                        key={img}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${currentBg === index ? 'opacity-20' : 'opacity-0'
                            }`}
                        style={{ backgroundImage: `url(${img})` }}
                    />
                ))}
                {/* Dark gradient overlay to preserve text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/80"></div>
            </div>

            {/* Animated Grid Background */}
            <div className="fixed inset-0 bg-grid-pattern bg-[length:32px_32px] pointer-events-none z-0 opacity-20 hidden md:block"></div>

            {/* Ambient Lighting Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-amber-600/10 rounded-full blur-[140px] animate-blob mix-blend-screen"></div>
                <div className="absolute top-[40%] right-[-10%] w-[50%] h-[70%] bg-orange-600/10 rounded-full blur-[140px] animate-blob [animation-delay:2s] mix-blend-screen"></div>
            </div>

            {/* Navigation Header */}
            <nav className="relative z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                            <span className="font-mono font-bold text-slate-950 text-xl tracking-tighter">CV</span>
                        </div>
                        <span className="text-2xl font-display font-bold tracking-widest text-slate-100">AERIAL<span className="text-amber-500">PM</span></span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="px-5 py-2 text-sm font-mono text-slate-300 hover:text-amber-500 transition-colors uppercase tracking-widest hidden sm:block">
                            Operator Login
                        </Link>
                        <Link to="/register" className="px-6 py-2.5 text-sm font-mono font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-colors uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]">
                            Initialize Uplink
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-20 pb-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-4xl mx-auto mb-20 animate-slide-up">

                        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
                            Construct With <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Perfect Vision</span>
                        </h1>
                        <p className="text-xl text-slate-400 font-mono leading-relaxed max-w-2xl mx-auto mb-10">
                            The ultimate AI-powered progress monitoring system. Fusing drone telemetry with computer vision for pixel-perfect site oversight.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono uppercase tracking-widest text-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] flex items-center justify-center group">
                                <Scan className="w-5 h-5 mr-3 group-hover:animate-spin-slow" /> Begin Analysis
                            </Link>
                            <Link to="/login" className="w-full sm:w-auto px-8 py-4 border border-slate-700 hover:border-amber-500 text-slate-300 font-mono uppercase tracking-widest text-lg transition-all hover:bg-slate-900 flex items-center justify-center bg-slate-950/50 backdrop-blur">
                                Existing Node Login
                            </Link>
                        </div>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up [animation-delay:200ms]">
                        <div className="glass-panel p-6 border-slate-800 hover:border-amber-500/50 transition-colors group">
                            <Cpu className="w-10 h-10 text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-lg font-display font-bold uppercase tracking-wider mb-2">Neural Inference</h3>
                            <p className="text-sm font-mono text-slate-400">Real-time object detection powered by TensorFlow.js and MobileNet matrices.</p>
                        </div>

                        <div className="glass-panel p-6 border-slate-800 hover:border-amber-500/50 transition-colors group">
                            <Layers className="w-10 h-10 text-orange-500 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-lg font-display font-bold uppercase tracking-wider mb-2">Progression Differencing</h3>
                            <p className="text-sm font-mono text-slate-400">Pixel-perfect temporal change detection engine calculating precise build progress.</p>
                        </div>

                        <div className="glass-panel p-6 border-slate-800 hover:border-amber-500/50 transition-colors group">
                            <Activity className="w-10 h-10 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-lg font-display font-bold uppercase tracking-wider mb-2">Live Telemetry</h3>
                            <p className="text-sm font-mono text-slate-400">Stream drone and camera HUD feeds directly into the secure command center.</p>
                        </div>

                        <div className="glass-panel p-6 border-slate-800 hover:border-amber-500/50 transition-colors group">
                            <ShieldCheck className="w-10 h-10 text-purple-500 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-lg font-display font-bold uppercase tracking-wider mb-2">Secure Enclave</h3>
                            <p className="text-sm font-mono text-slate-400">Encrypted token-based authentication and SQLite hardened data logging.</p>
                        </div>
                    </div>

                    {/* About details / Brief text */}
                    <div className="mt-32 max-w-4xl mx-auto text-center border-t border-slate-800/50 pt-20">
                        <h2 className="text-3xl font-display font-bold text-slate-100 uppercase tracking-widest mb-6">Precision Monitoring. Zero Guesswork.</h2>
                        <p className="text-lg text-slate-400 font-mono leading-relaxed mb-12">
                            AerialPM radically transforms construction site management. By combining routine drone flights with custom-trained machine learning models, our engine detects sub-centimeter changes over time.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                            <div className="glass-panel p-8 border-amber-500/20 bg-slate-900/40">
                                <h3 className="text-xl font-display font-bold text-amber-500 uppercase tracking-widest flex items-center gap-3 mb-6 pb-4 border-b border-amber-500/10">
                                    <Cpu className="w-6 h-6" /> Computer Vision Stack
                                </h3>
                                <ul className="space-y-4 text-sm font-mono text-slate-300">
                                    <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-emerald-500 shrink-0 mt-0.5" /> <strong>COCO-SSD Matrix:</strong> Real-time detection across 80+ structural and mechanical object classes.</li>
                                    <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-emerald-500 shrink-0 mt-0.5" /> <strong>MobileNet V2:</strong> High-speed architectural scene classification.</li>
                                    <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-emerald-500 shrink-0 mt-0.5" /> <strong>BodyPix Neural Net:</strong> Pixel-accurate worker and personnel tracking.</li>
                                    <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-emerald-500 shrink-0 mt-0.5" /> <strong>GPU Accelerated:</strong> WebGL backend processing direct telemetry at 6-7 FPS natively in-browser.</li>
                                </ul>
                            </div>

                            <div className="glass-panel p-8 border-amber-500/20 bg-slate-900/40">
                                <h3 className="text-xl font-display font-bold text-amber-500 uppercase tracking-widest flex items-center gap-3 mb-6 pb-4 border-b border-amber-500/10">
                                    <Layers className="w-6 h-6" /> System Architecture
                                </h3>
                                <ul className="space-y-4 text-sm font-mono text-slate-300">
                                    <li className="flex items-start"><span className="text-amber-500 mr-3 font-bold">01.</span> Construction object mapping & tracking</li>
                                    <li className="flex items-start"><span className="text-amber-500 mr-3 font-bold">02.</span> Automated activity scoring algorithms</li>
                                    <li className="flex items-start"><span className="text-amber-500 mr-3 font-bold">03.</span> Historical image change detection</li>
                                    <li className="flex items-start"><span className="text-amber-500 mr-3 font-bold">04.</span> Server-side OpenCV post-processing</li>
                                    <li className="flex items-start"><span className="text-amber-500 mr-3 font-bold">05.</span> Automatic capture tagging and secure DB storage</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Demo Video Section */}
                    <div className="mt-32 max-w-5xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-display font-bold text-slate-100 uppercase tracking-widest flex items-center justify-center gap-3">
                                <PlayCircle className="text-amber-500 w-8 h-8" /> System Demo Feed
                            </h2>
                            <p className="text-slate-400 font-mono mt-3">Watch Neural Inference in action across a live grid.</p>
                        </div>

                        <div className="relative aspect-video rounded-xl overflow-hidden glass-panel border-amber-500/30 group cursor-pointer shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:shadow-[0_0_50px_rgba(245,158,11,0.2)] transition-shadow">
                            <div className="absolute inset-0 bg-slate-900 overflow-hidden">
                                {/* Live drone footage mockup */}
                                <video
                                    src="https://cdn.coverr.co/videos/coverr-flying-over-a-construction-site-4123/1080p.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                ></video>

                                {/* Simulated HUD inside video player */}
                                <div className="absolute top-4 left-4 text-amber-500 font-mono text-xs animate-pulse z-10 bg-slate-950/50 px-2 py-1">REC // SENSOR 7G</div>
                                <div className="absolute top-4 right-4 text-emerald-500 font-mono text-xs z-10 bg-slate-950/50 px-2 py-1">FPS: 59.94</div>
                                <div className="absolute bottom-4 right-4 text-emerald-500 font-mono text-xs z-10 bg-slate-950/50 px-2 py-1">MODEL: DETECT_V2 [ONLINE]</div>

                                {/* Simulated bounding boxes tracking objects */}
                                <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-emerald-500/50 bg-emerald-500/10 z-10 flex">
                                    <span className="bg-emerald-500 text-slate-950 text-[10px] font-bold px-1 py-0.5 absolute -top-5 -left-[2px] h-5">Heavy Mach. 98%</span>
                                </div>
                                <div className="absolute bottom-1/3 right-1/4 w-48 h-24 border-2 border-orange-500/50 bg-orange-500/10 z-10">
                                    <span className="bg-orange-500 text-slate-950 text-[10px] font-bold px-1 py-0.5 absolute -top-5 -left-[2px] h-5">Struct Defect 82%</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 z-0 pointer-events-none"></div>
                            </div>
                        </div>
                    </div>

                    {/* Connect / Contact Options */}
                    <div className="mt-32 max-w-3xl mx-auto glass-panel p-10 border-slate-800">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-display font-bold text-slate-100 uppercase tracking-widest flex items-center justify-center gap-3">
                                <Mail className="text-blue-500 w-6 h-6" /> Establish Connection
                            </h2>
                            <p className="text-slate-400 font-mono mt-3 text-sm">Request dedicated node access or enterprise integration support.</p>
                        </div>

                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Message queued for encrypted transmission!"); }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <input type="text" placeholder="Designation (Name)" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 text-slate-100 px-4 py-3 outline-none font-mono text-sm transition-colors" required />
                                </div>
                                <div>
                                    <input type="email" placeholder="Comms Channel (Email)" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 text-slate-100 px-4 py-3 outline-none font-mono text-sm transition-colors" required />
                                </div>
                            </div>
                            <div>
                                <textarea placeholder="Transmission Payload (Message)" rows="4" className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 text-slate-100 px-4 py-3 outline-none font-mono text-sm transition-colors resize-none" required></textarea>
                            </div>
                            <button type="submit" className="w-full bg-slate-800 hover:bg-blue-600 text-white font-bold py-3 px-4 uppercase tracking-widest font-mono text-sm transition-all border border-slate-700 hover:border-blue-500 flex items-center justify-center gap-3">
                                <Send className="w-4 h-4" /> Transmit Signal
                            </button>
                        </form>
                    </div>

                </div>
            </main>

            {/* Global Footer & Connect Section */}
            <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center border-b border-slate-800/50 pb-12 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                    <span className="font-mono font-bold text-slate-950 text-sm tracking-tighter">CV</span>
                                </div>
                                <span className="text-xl font-display font-bold tracking-widest text-slate-100">AERIAL<span className="text-amber-500">PM</span></span>
                            </div>
                            <p className="text-slate-400 font-mono text-sm leading-relaxed max-w-md">
                                Engineered for the future of construction oversight. Bringing unparalleled visibility and precision to modern project management through the fusion of drone telemetry and computer vision.
                            </p>
                        </div>

                        <div className="flex flex-col md:items-end">
                            <h4 className="text-slate-100 font-display font-bold uppercase tracking-widest mb-6">Establish Neural Link</h4>
                            <div className="flex items-center gap-4">
                                <a href="https://github.com" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-slate-700 hover:border-amber-500 bg-slate-900 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all group">
                                    <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-slate-700 hover:border-blue-500 bg-slate-900 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all group">
                                    <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-slate-700 hover:border-pink-500 bg-slate-900 flex items-center justify-center text-slate-400 hover:text-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all group">
                                    <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between text-xs font-mono text-slate-500">
                        <p>© {new Date().getFullYear()} AerialPM Systems. All rights reserved.</p>
                        <p className="mt-2 md:mt-0 uppercase tracking-widest text-amber-500/50">Core Version 2.0.4</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
