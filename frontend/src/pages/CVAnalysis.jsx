import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../api/axios';
import { Upload, FileImage, Layers, Activity, ServerCog } from 'lucide-react';
import toast from 'react-hot-toast';

const CVAnalysis = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles?.length > 0) {
            const selectedFile = acceptedFiles[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResults(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1
    });

    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await api.post('/cv/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResults(res.data.analysis);
            toast.success("Image analyzed successfully");
        } catch (err) {
            console.error(err);
            toast.error("Analysis failed. Server offline or invalid image.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto relative px-4">
            {/* Spectral Analysis HUD Background */}
            <div className="absolute inset-0 z-0 opacity-[0.1] pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#064e3b_1px,transparent_1px),linear-gradient(to_bottom,#064e3b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <header className="border-b border-white/5 pb-8 relative z-10 animate-slide-up" style={{ animationDelay: '100ms' }}>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] uppercase tracking-[0.25em] mb-4 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <ServerCog className="w-3 h-3 animate-pulse" />
                    Spectral Matrix Engine // OPENCV_V4
                </div>
                <h1 className="text-5xl font-display font-bold text-slate-100 uppercase tracking-widest flex items-center drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    Deep Vision Analysis
                </h1>
                <p className="text-slate-500 font-mono text-xs mt-3 uppercase tracking-widest opacity-80">Synchronizing contour mapping and structural material detection matrices.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">

                {/* Upload Section */}
                <div className="space-y-4">
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 relative overflow-hidden group ${isDragActive ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.2)]' : 'border-slate-700 hover:border-amber-400 bg-slate-900/40 hover:bg-slate-900/60 hover:shadow-[0_5px_20px_rgba(245,158,11,0.1)]'
                            } glass-panel`}
                    >
                        {isDragActive && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent w-[200%] animate-scanline"></div>}
                        <input {...getInputProps()} />
                        <Upload className={`w-12 h-12 mx-auto mb-4 transition-transform group-hover:-translate-y-2 ${isDragActive ? 'text-amber-500 animate-bounce' : 'text-slate-400 group-hover:text-amber-400'}`} />
                        <p className="font-mono text-sm text-slate-300 group-hover:text-slate-200">
                            {isDragActive ? "Inbound transmission..." : "Drag & drop an aerial site image here, or click to select"}
                        </p>
                        <p className="font-mono text-xs text-slate-500 mt-2">Supports JPG, PNG (Max 10MB)</p>
                    </div>

                    {preview && (
                        <div className="glass-panel p-4 border-slate-700/50 relative overflow-hidden animate-fade-in group hover:shadow-[0_10px_30px_rgba(16,185,129,0.15)] transition-shadow duration-500">
                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-emerald-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
                            <img src={preview} alt="Preview" className="w-full h-auto border border-slate-700 rounded relative z-10 shadow-lg object-contain bg-slate-950" />
                            <div className="mt-4 flex justify-between items-center relative z-10">
                                <span className="text-xs font-mono text-slate-300 flex items-center bg-slate-900/80 px-3 py-1.5 rounded border border-slate-700">
                                    <FileImage className="w-4 h-4 mr-2 text-amber-500" /> <span className="truncate max-w-[150px]">{file.name}</span>
                                </span>
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing}
                                    className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 px-5 py-2 font-mono text-sm font-bold uppercase tracking-wider transition-all hover:shadow-[0_0_15px_rgba(52,211,153,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed rounded relative overflow-hidden"
                                >
                                    {isAnalyzing && <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>}
                                    <span className="relative z-10">{isAnalyzing ? 'Processing...' : 'Run Deep Analysis'}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                <div className="glass-panel p-6 border-slate-700/50 relative overflow-hidden">
                    {!results && !isAnalyzing && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                            <Layers className="w-16 h-16 mb-4 opacity-20" />
                            <p className="font-mono text-sm text-center px-8">Upload an image and run analysis to view OpenCV telemetry data.</p>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-20 backdrop-blur-md">
                            <div className="w-24 h-24 relative mb-6">
                                <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                                <Activity className="w-10 h-10 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                            </div>
                            <p className="font-mono text-sm text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-4 py-2 border border-emerald-500/20 rounded animate-pulse">Running Deep Vision Models...</p>
                        </div>
                    )}

                    {results && (
                        <div className="space-y-6 relative z-10 animate-slide-up">
                            <div>
                                <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest border-b border-slate-800 pb-2 mb-4">Analysis Summary</h3>
                                <div className="flex items-end gap-4 mb-4">
                                    <div className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-300 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">{results.estimatedProgressScore}</div>
                                    <div className="pb-2 text-sm font-mono text-slate-400 uppercase tracking-wider">Est. Progress Score</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 p-5 rounded-lg transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/40 group-hover:bg-purple-500 transition-colors"></div>
                                    <div className="flex items-center gap-2 text-[10px] font-mono text-purple-400 uppercase mb-3 tracking-widest font-bold">
                                        <Activity className="w-3.5 h-3.5" />
                                        Edge Complexity
                                    </div>
                                    <div className="text-3xl text-slate-100 font-display font-bold tracking-tighter">{results.edgeComplexity}</div>
                                    <div className="mt-2 h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 opacity-30 group-hover:opacity-60 transition-opacity" style={{ width: '65%' }}></div>
                                    </div>
                                </div>
                                <div className="bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 p-5 rounded-lg transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/40 group-hover:bg-blue-500 transition-colors"></div>
                                    <div className="flex items-center gap-2 text-[10px] font-mono text-blue-400 uppercase mb-3 tracking-widest font-bold">
                                        <Layers className="w-3.5 h-3.5" />
                                        Structural Contours
                                    </div>
                                    <div className="text-3xl text-slate-100 font-display font-bold tracking-tighter">{results.contourCount}</div>
                                    <div className="mt-2 h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 opacity-30 group-hover:opacity-60 transition-opacity" style={{ width: '80%' }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-panel p-6 border-slate-800 bg-slate-950/30 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-3xl"></div>
                                <h3 className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 font-bold">
                                    <Layers className="w-4 h-4 text-amber-500" /> Neural Material Classification
                                </h3>
                                <div className="space-y-6">
                                    <div className="group">
                                        <div className="flex justify-between text-[11px] font-mono mb-2 uppercase tracking-wide">
                                            <span className="text-slate-400 group-hover:text-slate-200 transition-colors">Concrete / Structural Tones</span>
                                            <span className="text-amber-500 font-bold">{results.colors.concrete?.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                                            <div className="bg-gradient-to-r from-slate-600 via-slate-400 to-slate-200 h-full group-hover:shadow-[0_0_15px_rgba(203,213,225,0.4)] transition-all duration-1000 relative" style={{ width: `${results.colors.concrete}%` }}>
                                                <div className="absolute inset-0 bg-white/10 animate-[shimmer_2s_infinite]"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="group">
                                        <div className="flex justify-between text-[11px] font-mono mb-2 uppercase tracking-wide">
                                            <span className="text-slate-400 group-hover:text-slate-200 transition-colors">Earth / Geological Matrix</span>
                                            <span className="text-orange-500 font-bold">{results.colors.rebar?.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                                            <div className="bg-gradient-to-r from-orange-800 via-orange-600 to-amber-500 h-full group-hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all duration-1000 relative" style={{ width: `${results.colors.rebar}%` }}>
                                                <div className="absolute inset-0 bg-white/10 animate-[shimmer_2s_infinite]"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="group">
                                        <div className="flex justify-between text-[11px] font-mono mb-2 uppercase tracking-wide">
                                            <span className="text-slate-400 group-hover:text-slate-200 transition-colors">Atmospheric / Background</span>
                                            <span className="text-blue-500 font-bold">{results.colors.sky?.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                                            <div className="bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 h-full group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-1000 relative" style={{ width: `${results.colors.sky}%` }}>
                                                <div className="absolute inset-0 bg-white/10 animate-[shimmer_2s_infinite]"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CVAnalysis;
