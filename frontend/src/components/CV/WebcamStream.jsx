import React, { useEffect, useState, useRef } from 'react';
import useWebcam from '../../hooks/useWebcam';
import useObjectDetect from '../../hooks/useObjectDetect';
import { useCV } from '../../context/CVContext';
import api from '../../api/axios';
import { Camera, StopCircle, RefreshCw, AlertTriangle, Crosshair } from 'lucide-react';
import { renderDetections, renderHUD, renderScanLine, renderGrid } from '../../cv/canvasRenderer';
import { mapDetections } from '../../cv/constructionMapper';
import toast from 'react-hot-toast';

const WebcamStream = ({ projectId }) => {
    const { videoRef, isActive, hasPermission, error, startWebcam, stopWebcam, switchCamera, captureSnapshot, devices, activeDevice } = useWebcam();
    const { models, modelsLoaded, cvSettings, updateSessionStats } = useCV();
    const canvasRef = useRef(null);
    const [currentTime, setCurrentTime] = useState('');
    const [isFlashing, setIsFlashing] = useState(false);

    // CV Engine hook
    const { detections, fps, frameCount, isDetecting } = useObjectDetect(
        models.cocoSsd,
        videoRef,
        isActive,
        cvSettings.minConfidence
    );

    // Sync stats to context
    useEffect(() => {
        if (isActive) {
            updateSessionStats({ framesAnalyzed: frameCount, avgFps: fps });
        }
    }, [frameCount, fps, isActive]);

    // Live clock for HUD
    useEffect(() => {
        if (!cvSettings.showHUD) return;
        const interval = setInterval(() => {
            const now = new Date();
            setCurrentTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(interval);
    }, [cvSettings.showHUD]);

    // Canvas render loop
    useEffect(() => {
        if (!canvasRef.current || !videoRef.current || !isActive) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const video = videoRef.current;

        // Match canvas size to video internal size
        if (video.videoWidth && video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Clear previous layer
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Process and map detections for construction domain
            const mapped = mapDetections(detections);

            // 2. Render bounding boxes
            if (cvSettings.showHUD) {
                renderDetections(ctx, mapped, canvas.width, canvas.height);
                renderHUD(ctx, fps, canvas.width, canvas.height, currentTime);
            }

            // 3. Render cosmetic effects
            if (cvSettings.showScanLine) renderScanLine(ctx, frameCount, canvas.width, canvas.height);
            if (cvSettings.showGrid) renderGrid(ctx, canvas.width, canvas.height);
        }
    }, [detections, frameCount, isActive, cvSettings]);

    const handleTakeCapture = async () => {
        if (!projectId) {
            toast.error("Select a project first");
            return;
        }

        // Shutter flash effect
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 150);

        try {
            const snap = await captureSnapshot();
            if (!snap) return;

            // Optional: get immediate scene classification
            let classes = [];
            if (models.mobileNet && videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
                classes = await models.mobileNet.classify(videoRef.current);
            }

            // Map current detections
            const currentMapped = mapDetections(detections);

            // We'll calculate score on backend or send from frontend state
            // For now, save raw state
            const cv_data = JSON.stringify({
                workerCount: currentMapped.filter(d => d.construction.category === 'labor').length,
                machineCount: currentMapped.filter(d => d.construction.category === 'machinery').length,
                score: Math.min(100, (currentMapped.length * 5) + 20), // Placeholder simple score
                rawDetections: currentMapped.length
            });

            const formData = new FormData();
            formData.append('image', snap.blob, `capture_${Date.now()}.jpg`);
            formData.append('project_id', projectId);
            formData.append('phase', 'inspection');
            formData.append('notes', `Auto-captured during live telemetry. FPS: ${Math.round(fps)}`);
            formData.append('cv_data', cv_data);

            const toastId = toast.loading('Uploading telemetry frame...');
            await api.post('/captures', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Telemetry saved', { id: toastId });
            updateSessionStats(prev => ({ capturesTaken: (prev.capturesTaken || 0) + 1 }));

        } catch (err) {
            console.error(err);
            toast.error("Capture sequence failed");
        }
    };

    return (
        <div className="relative w-full h-full bg-slate-950 flex flex-col group">
            {/* Shutter flash overlay */}
            <div className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-100 ${isFlashing ? 'opacity-100' : 'opacity-0'}`}></div>

            {!isActive ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative mb-6 group-hover:scale-110 transition-transform duration-700">
                        <div className="absolute inset-0 bg-amber-500/5 blur-2xl rounded-full animate-pulse"></div>
                        <Crosshair className="w-24 h-24 text-slate-900 drop-shadow-[0_0_10px_rgba(245,158,11,0.2)]" />
                        <Camera className="w-10 h-10 text-slate-700 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:text-amber-500 transition-colors" />
                    </div>
                    {error ? (
                        <div className="text-red-500 font-mono text-[10px] max-w-sm text-center bg-red-500/5 p-6 border border-red-500/20 rounded-lg shadow-2xl animate-shake">
                            <AlertTriangle className="mx-auto mb-3 w-8 h-8 opacity-50" />
                            <span className="block font-bold mb-1 tracking-widest text-xs">OPTICS_CRITICAL_FAILURE</span>
                            {error}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-slate-600 font-mono text-[10px] uppercase tracking-[0.4em] mb-2">Optics / Passive_Mode</p>
                            <div className="h-0.5 w-12 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-700 w-1/2 animate-[shimmer_2s_infinite]"></div>
                            </div>
                        </div>
                    )}


                    <button
                        onClick={() => startWebcam()}
                        disabled={!modelsLoaded}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-8 py-3 font-mono font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    >
                        {modelsLoaded ? 'Initialize Optics' : 'Waiting for AI Engine...'}
                    </button>
                    {!modelsLoaded && <p className="text-xs text-slate-600 mt-4 font-mono">Run complete TF.js stack initialization first.</p>}
                </div>
            ) : (
                <>
                    {/* Video Container */}
                    <div className="relative flex-1 bg-black overflow-hidden object-cover w-full h-full min-h-[50vh]">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <canvas
                            ref={canvasRef}
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        />

                        {/* Live Indicator */}
                        <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-mono font-bold px-2 py-1 flex items-center shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-2"></span>
                            LIVE
                        </div>
                    </div>

                    {/* Camera Control Bar */}
                    <div className="bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-500 absolute bottom-0 left-0 right-0 z-30">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={stopWebcam}
                                className="bg-slate-950 hover:bg-red-500/20 text-slate-400 hover:text-red-500 p-3 border border-slate-800 hover:border-red-500/50 transition-all rounded-lg group/stop"
                                title="Terminate Link"
                            >
                                <StopCircle className="w-5 h-5 group-hover/stop:scale-110 transition-transform" />
                            </button>

                            {devices.length > 1 && (
                                <button
                                    onClick={() => {
                                        const currentIndex = devices.findIndex(d => d.deviceId === activeDevice);
                                        const nextDev = devices[(currentIndex + 1) % devices.length];
                                        switchCamera(nextDev.deviceId);
                                    }}
                                    className="bg-slate-950 hover:bg-blue-500/20 text-slate-400 hover:text-blue-500 p-3 border border-slate-800 hover:border-blue-500/50 transition-all rounded-lg group/swap"
                                    title="Switch Optics"
                                >
                                    <RefreshCw className="w-5 h-5 group-hover/swap:rotate-180 transition-transform duration-700" />
                                </button>
                            )}
                        </div>

                        {/* Optical Control Overlay Decorative */}
                        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8 pointer-events-none opacity-20 hidden lg:flex">
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Azimuth</span>
                                <span className="text-[10px] font-mono text-slate-300">042.82°</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Inclination</span>
                                <span className="text-[10px] font-mono text-slate-300">-12.04°</span>
                            </div>
                        </div>

                        <button
                            onClick={handleTakeCapture}
                            className="bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-slate-900 px-10 py-4 font-mono font-bold uppercase tracking-[0.2em] border border-amber-500/50 transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] flex items-center group/btn rounded-sm relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite]"></div>
                            <Camera className="w-5 h-5 mr-3 group-hover/btn:scale-110 transition-transform" />
                            <span>Capture Frame</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default WebcamStream;
