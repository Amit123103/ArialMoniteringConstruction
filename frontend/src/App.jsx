import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import Navbar from './components/Layout/Navbar.jsx';

// Pages
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import LiveCapture from './pages/LiveCapture.jsx';
import CVAnalysis from './pages/CVAnalysis.jsx';
import Captures from './pages/Captures.jsx';
import Progress from './pages/Progress.jsx';
import Compare from './pages/Compare.jsx';
import Reports from './pages/Reports.jsx';
import Alerts from './pages/Alerts.jsx';
import Settings from './pages/Settings.jsx';

// Context
import { useAuth } from './context/AuthContext.jsx';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-950 text-amber-500 font-mono">LOADING_SYSTEM...</div>;
    return user ? <div className="flex flex-col h-screen overflow-hidden">{children}</div> : <Navigate to="/login" />;
};

function App() {
    return (
        <Router basename={import.meta.env.BASE_URL} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
            <Toaster position="top-right" toastOptions={{
                style: {
                    background: '#0f172a',
                    color: '#f1f5f9',
                    border: '1px solid #334155',
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '14px'
                }
            }} />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/*" element={
                    <PrivateRoute>
                        <Navbar />
                        <div className="flex-1 overflow-auto bg-slate-950 relative">
                            {/* Animated Background Blobs */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-blob mix-blend-screen"></div>
                                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] animate-blob [animation-delay:2s] mix-blend-screen"></div>
                                <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-pink-600/20 rounded-full blur-[120px] animate-blob [animation-delay:4s] mix-blend-screen"></div>
                            </div>
                            {/* Grid overlay */}
                            <div className="absolute inset-0 bg-grid-pattern bg-[length:32px_32px] pointer-events-none z-0 opacity-30"></div>

                            {/* Main Content */}
                            <div className="relative mx-auto max-w-7xl p-6 z-10 animate-fade-in">
                                <Routes>
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/projects" element={<Projects />} />
                                    <Route path="/projects/:id" element={<ProjectDetail />} />
                                    <Route path="/live-capture" element={<LiveCapture />} />
                                    <Route path="/cv-analysis" element={<CVAnalysis />} />
                                    <Route path="/captures" element={<Captures />} />
                                    <Route path="/progress" element={<Progress />} />
                                    <Route path="/compare" element={<Compare />} />
                                    <Route path="/reports" element={<Reports />} />
                                    <Route path="/alerts" element={<Alerts />} />
                                    <Route path="/settings" element={<Settings />} />
                                </Routes>
                            </div>
                        </div>
                    </PrivateRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
