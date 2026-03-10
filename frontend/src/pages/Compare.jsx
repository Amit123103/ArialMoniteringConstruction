import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { renderChangeMask } from '../cv/changeAnalyzer';
import { Layers, Scan, AlertTriangle, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const Compare = () => {
    const [captures, setCaptures] = useState([]);
    const [beforeId, setBeforeId] = useState('');
    const [afterId, setAfterId] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        const fetchCaptures = async () => {
            try {
                // Get all captures for now
                const res = await api.get('/captures');
                setCaptures(res.data);
                if (res.data.length >= 2) {
                    setAfterId(res.data[0].id.toString());
                    setBeforeId(res.data[1].id.toString());
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchCaptures();
    }, []);

    const handleCompare = async () => {
        if (!beforeId || !afterId) return toast.error("Select two captures");
        if (beforeId === afterId) return toast.error("Select different captures");

        setIsAnalyzing(true);
        setAnalysisResult(null);

        try {
            const res = await api.post('/cv/compare', { beforeCaptureId: beforeId, afterCaptureId: afterId });
            setAnalysisResult(res.data);
            toast.success("Change detection complete");
        } catch (err) {
            console.error(err);
            toast.error("Change analysis failed");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const beforeImage = captures.find(c => c.id.toString() === beforeId)?.image_url;
    const afterImage = captures.find(c => c.id.toString() === afterId)?.image_url;

    return (
        <div className="space-y-6 max-w-6xl mx-auto relative px-4">
            {/* Temporal HUD Background */}
            <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#581c87_1px,transparent_1px),linear-gradient(to_bottom,#581c87_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>
            <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none"></div>

            <header className="border-b border-white/5 pb-8 relative z-10 animate-slide-up" style={{ animationDelay: '100ms' }}>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 font-mono text-[10px] uppercase tracking-[0.25em] mb-4 font-bold shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    <Scan className="w-3 h-3 animate-pulse" />
                    Temporal Delta Engine // CHRONOS_V2
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-slate-100 uppercase tracking-[0.1em] flex items-center drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                            Progression Differencing
                        </h1>
                        <p className="text-slate-400 font-mono text-xs mt-3 opacity-80 uppercase tracking-widest">Spectral analysis of structural variance across temporal markers.</p>
                    </div>
                    <div className="hidden lg:flex items-center gap-3 font-mono text-[10px] text-slate-600 uppercase tracking-widest px-4 py-2 border border-white/5 bg-black/20 rounded">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
                        Phase: Active_Eval
                    </div>
                </div>
            </header>

            <div className="glass-panel p-10 border-slate-800/80 bg-slate-900/40 relative overflow-hidden group animate-slide-up shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]" style={{ animationDelay: '200ms' }}>
                <div className="absolute top-0 left-0 w-48 h-[1px] bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-48 h-[1px] bg-gradient-to-l from-blue-500/50 to-transparent"></div>


                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center mb-8">
                    <div className="md:col-span-2">
                        <label htmlFor="beforeId" className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-3 tracking-widest">T-Minus (Reference Frame)</label>
                        <div className="relative group/select">
                            <select
                                id="beforeId"
                                name="beforeId"
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono p-4 outline-none focus:border-amber-500/50 transition-all rounded-lg cursor-pointer hover:bg-slate-900 appearance-none"
                                value={beforeId}
                                onChange={(e) => setBeforeId(e.target.value)}
                            >
                                <option value="">Select Origin Frame</option>
                                {captures.map(c => <option key={c.id} value={c.id}>{new Date(c.captured_at).toLocaleDateString()} - {c.phase || 'N/A'}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                                <Layers className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="p-3 bg-slate-950 rounded-full border border-slate-800 group-hover:border-amber-500/30 transition-colors shadow-inner">
                            <Scan className="w-6 h-6 text-amber-500 group-hover:rotate-180 transition-transform duration-1000" />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="afterId" className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-4 tracking-[0.2em] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            T-Zero (Target Frame)
                        </label>
                        <div className="relative group/select">
                            <select
                                id="afterId"
                                name="afterId"
                                className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 text-xs font-mono p-4 outline-none focus:border-emerald-500/50 transition-all rounded-lg cursor-pointer hover:bg-slate-900 appearance-none shadow-inner backdrop-blur-md"
                                value={afterId}
                                onChange={(e) => setAfterId(e.target.value)}
                            >
                                <option value="">Select Target Frame</option>
                                {captures.map(c => <option key={c.id} value={c.id}>{new Date(c.captured_at).toLocaleDateString()} - {c.phase || 'N/A'}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700">
                                <Activity className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {captures.length === 0 && (
                    <div className="p-4 mb-6 border border-dashed border-slate-800 rounded-lg text-center bg-slate-950/30">
                        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                            No temporal frames detected. Capture new data to begin progression analysis.
                        </p>
                    </div>
                )}


                <div className="flex justify-center border-t border-slate-800 pt-8 mt-2">
                    <button
                        onClick={handleCompare}
                        disabled={isAnalyzing || !beforeId || !afterId}
                        className="bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-slate-900 px-10 py-4 font-mono font-bold uppercase tracking-[0.2em] border border-amber-500/50 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] disabled:opacity-30 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                        <span className="relative z-10 flex items-center gap-3">
                            {isAnalyzing ? (
                                <>
                                    <Activity className="w-4 h-4 animate-spin" />
                                    COMPUTING_DELTA_MATRIX...
                                </>
                            ) : (
                                <>
                                    <Scan className="w-4 h-4" />
                                    EXECUTE DIFFERENCING
                                </>
                            )}
                        </span>
                    </button>
                </div>
            </div>

            {/* Visual Output */}
            {beforeImage && afterImage && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
                    <div className="relative aspect-video bg-slate-950 border border-slate-800 rounded-lg overflow-hidden group shadow-lg hover:border-amber-500/30 transition-colors">
                        <div className="absolute top-4 left-4 z-20 text-[10px] font-mono bg-black/80 px-3 py-1.5 text-slate-300 border border-slate-800 rounded uppercase tracking-widest backdrop-blur-md">
                            T-MINUS REFERENCE
                        </div>
                        {/* Corner markers */}
                        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-slate-800 z-10"></div>
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-slate-800 z-10"></div>
                        <img src={beforeImage} alt="Before" className="w-full h-full object-contain relative z-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none"></div>
                    </div>
                    <div className="relative aspect-video bg-slate-950 border border-slate-800 rounded-lg overflow-hidden group shadow-lg hover:border-emerald-500/30 transition-colors">
                        <div className="absolute top-4 left-4 z-20 text-[10px] font-mono bg-emerald-500/10 px-3 py-1.5 text-emerald-400 border border-emerald-500/30 rounded uppercase tracking-widest backdrop-blur-md font-bold">
                            T-ZERO CURRENT
                        </div>
                        {isAnalyzing && (
                            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                                <div className="w-full h-[2px] bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-[scan_2s_linear_infinite] opacity-60"></div>
                            </div>
                        )}
                        {/* Corner markers */}
                        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-slate-800 z-10"></div>
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-slate-800 z-10"></div>
                        <img src={afterImage} alt="After" className="w-full h-full object-contain relative z-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>
            )}

            {/* Results */}
            {analysisResult && (
                <div className="glass-panel p-8 border-slate-800 border-l-4 border-l-amber-500 overflow-hidden relative animate-slide-up bg-slate-900/40">
                    <div className="absolute -right-16 -bottom-16 opacity-[0.03] pointer-events-none">
                        <Scan className="w-80 h-80" />
                    </div>

                    <div className="flex justify-between items-start mb-8 border-b border-slate-800/80 pb-6 relative z-10">
                        <h3 className="text-xl font-display font-bold text-slate-100 uppercase tracking-[0.2em] flex items-center">
                            <AlertTriangle className="mr-3 text-amber-500 animate-pulse" /> Difference Matrix Analytics
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">Analysis Verified</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 p-2">
                        <div className="bg-slate-950/50 p-8 rounded-2xl border border-white/5 relative group overflow-hidden shadow-2xl">
                            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
                            <div className="absolute inset-0 bg-amber-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <p className="text-[10px] font-mono text-slate-500 uppercase mb-4 tracking-[0.3em] font-bold">Delta Magnitude Index</p>
                            <div className="flex items-baseline gap-3">
                                <span className="text-8xl font-display font-light text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)] tracking-tighter leading-none">{analysisResult.changePercent}</span>
                                <span className="text-2xl text-slate-700 font-mono font-bold">%</span>
                            </div>

                            <div className="mt-8 flex gap-1.5 h-1.5">
                                {Array.from({ length: 12 }).map((_, idx) => (
                                    <div key={idx} className={`flex-1 rounded-full transition-all duration-700 ${idx < Math.round((analysisResult.changePercent / 100) * 12) ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-white/5'}`}></div>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-between items-center text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                                <span>Reference_Base</span>
                                <span className="text-amber-500/60">Target_Shift_Detected</span>
                            </div>
                        </div>


                        <div className="md:col-span-2 space-y-8">
                            <div className="relative group">
                                <p className="text-[10px] font-mono text-slate-500 uppercase mb-3 tracking-widest font-bold flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                    Significance Classification
                                </p>
                                <div className="text-slate-200 font-mono text-sm bg-slate-950/80 p-5 border border-slate-800 rounded-lg group-hover:border-blue-500/30 transition-colors leading-relaxed">
                                    {analysisResult.significance}
                                </div>
                            </div>

                            <div className="relative group">
                                <p className="text-[10px] font-mono text-slate-500 uppercase mb-3 tracking-widest font-bold flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                    Automated Counter-Strategy / Recommendation
                                </p>
                                <div className="text-slate-200 font-mono text-sm bg-slate-950/80 p-5 border-l-4 border-l-emerald-500/60 border border-slate-800 rounded-lg group-hover:border-emerald-500/30 transition-colors leading-relaxed italic">
                                    {analysisResult.recommendation}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Compare;
