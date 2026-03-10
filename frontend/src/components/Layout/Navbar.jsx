import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Camera, BarChart3, Clock, Activity, Map, Settings, LogOut, Bell, Layers, FileText } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const NavItem = ({ to, icon: Icon, label, badge }) => {
        const isActive = location.pathname.startsWith(to) && to !== '/' || (to === '/dashboard' && location.pathname === '/');
        return (
            <Link
                to={to}
                className={`flex flex-col items-center justify-center w-20 h-full border-r border-slate-700/50 transition-all duration-300 relative group ${isActive ? 'bg-gradient-to-b from-amber-500/10 to-transparent text-amber-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
            >
                {isActive && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]"></div>}
                <Icon className={`w-5 h-5 mb-1 transition-transform group-hover:scale-110 ${isActive ? 'animate-pulse text-amber-400' : ''}`} />
                <span className="text-[10px] font-mono tracking-wider uppercase group-hover:text-amber-200 transition-colors">{label}</span>
                {badge && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                    </span>
                )}
            </Link>
        );
    };

    return (
        <nav className="h-16 bg-slate-900/40 backdrop-blur-2xl border-b border-slate-700/50 flex justify-between items-center px-4 shrink-0 shadow-lg relative z-20">
            <div className="flex items-center h-full">
                <Link to="/" className="flex items-center mr-8 group">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 p-[1px] mr-3 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all">
                        <div className="w-full h-full bg-slate-950 rounded flex items-center justify-center">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500 font-mono font-bold text-lg">A</span>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-display font-bold text-slate-100 tracking-wider">AERIAL<span className="text-amber-500">PM</span></h1>
                    </div>
                </Link>

                <div className="hidden md:flex h-full border-l border-slate-800">
                    <NavItem to="/dashboard" icon={Activity} label="Cmd" />
                    <NavItem to="/projects" icon={Map} label="Sites" />
                    <NavItem to="/live-capture" icon={Camera} label="Live CV" badge />
                    <NavItem to="/cv-analysis" icon={Layers} label="AI Sync" badge />
                    <NavItem to="/captures" icon={Clock} label="History" />
                    <NavItem to="/progress" icon={BarChart3} label="Intel" />
                    <NavItem to="/compare" icon={FileText} label="Diff" />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Link to="/alerts" className="text-slate-400 hover:text-amber-500 relative transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white border border-slate-950">3</span>
                </Link>
                <Link to="/settings" className="text-slate-400 hover:text-slate-200 transition-colors">
                    <Settings className="w-5 h-5" />
                </Link>

                <div className="flex items-center gap-3 border-l border-slate-800 pl-4 ml-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-mono text-slate-200">{user?.name}</p>
                        <p className="text-[10px] font-mono text-amber-500 uppercase">{user?.role}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors rounded"
                        title="Disconnect"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
