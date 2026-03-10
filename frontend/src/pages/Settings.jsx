import React from 'react';
import { useCV } from '../context/CVContext';
import { Settings as SettingsIcon, Cpu, Monitor, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
    const { cvSettings, updateSettings } = useCV();

    const handleSave = () => {
        toast.success("System configurations updated & saved in memory.");
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <header className="border-b border-slate-800 pb-4">
                <h1 className="text-3xl font-display font-bold text-slate-100 uppercase flex items-center">
                    <SettingsIcon className="mr-3 text-amber-500" /> System Configuration
                </h1>
                <p className="text-slate-400 font-mono text-sm mt-1">Tune parameters for the AI inference engine and HUD rendering</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* AI / CV Tuning */}
                <div className="glass-panel p-6 border-slate-800 relative overflow-hidden">
                    <Cpu className="absolute -right-4 -top-4 w-32 h-32 text-slate-800 opacity-20 pointer-events-none" />
                    <h3 className="text-sm font-mono text-amber-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-2">Inference Engine</h3>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label htmlFor="minConfidence" className="text-xs font-mono text-slate-300 uppercase">Detection Confidence Min</label>
                                <span className="text-xs font-mono text-amber-500">{cvSettings.minConfidence.toFixed(2)}</span>
                            </div>
                            <input
                                id="minConfidence"
                                name="minConfidence"
                                type="range"
                                min="0.1" max="0.9" step="0.05"
                                value={cvSettings.minConfidence}
                                onChange={(e) => updateSettings({ minConfidence: parseFloat(e.target.value) })}
                                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                            <p className="text-[10px] text-slate-500 mt-1">Higher values reduce false positives but might miss smaller objects.</p>
                        </div>

                        <div>
                            <label htmlFor="detectionSpeed" className="text-xs font-mono text-slate-300 uppercase block mb-2">Detection Precision Mode</label>
                            <select
                                id="detectionSpeed"
                                name="detectionSpeed"
                                className="w-full bg-slate-900 border border-slate-700 text-slate-300 font-mono text-sm p-2 outline-none focus:border-amber-500"
                                value={cvSettings.detectionSpeed}
                                onChange={(e) => updateSettings({ detectionSpeed: e.target.value })}
                            >
                                <option value="fast">High Framerate (Fast)</option>
                                <option value="medium">Balanced (Medium)</option>
                                <option value="accurate">High Precision (Slow)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* HUD Display */}
                <div className="glass-panel p-6 border-slate-800 relative overflow-hidden">
                    <Monitor className="absolute -right-4 -top-4 w-32 h-32 text-slate-800 opacity-20 pointer-events-none" />
                    <h3 className="text-sm font-mono text-amber-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-2">Visual Feed (HUD)</h3>

                    <div className="space-y-4 font-mono text-sm text-slate-300">
                        <label className="flex gap-3 items-center cursor-pointer group">
                            <input
                                id="showHUD"
                                name="showHUD"
                                type="checkbox"
                                checked={cvSettings.showHUD}
                                onChange={(e) => updateSettings({ showHUD: e.target.checked })}
                                className="w-4 h-4 accent-amber-500 bg-slate-900 border-slate-700"
                            />
                            <span className="group-hover:text-amber-500 transition-colors uppercase">Enable Data Overlays</span>
                        </label>

                        <label className="flex gap-3 items-center cursor-pointer group">
                            <input
                                id="showScanLine"
                                name="showScanLine"
                                type="checkbox"
                                checked={cvSettings.showScanLine}
                                onChange={(e) => updateSettings({ showScanLine: e.target.checked })}
                                className="w-4 h-4 accent-amber-500 bg-slate-900 border-slate-700"
                            />
                            <span className="group-hover:text-amber-500 transition-colors uppercase">CRT Scanline Fx</span>
                        </label>

                        <label className="flex gap-3 items-center cursor-pointer group">
                            <input
                                id="showGrid"
                                name="showGrid"
                                type="checkbox"
                                checked={cvSettings.showGrid}
                                onChange={(e) => updateSettings({ showGrid: e.target.checked })}
                                className="w-4 h-4 accent-amber-500 bg-slate-900 border-slate-700"
                            />
                            <span className="group-hover:text-amber-500 transition-colors uppercase">Rule-of-Thirds Grid</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-8">
                <button
                    onClick={handleSave}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-8 py-3 font-mono font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                    <Zap className="w-4 h-4 inline mr-2" /> Apply Overrides
                </button>
            </div>
        </div>
    );
};

export default Settings;
