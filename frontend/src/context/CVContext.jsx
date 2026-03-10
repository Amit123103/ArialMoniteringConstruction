import React, { createContext, useContext, useState, useEffect } from 'react';
import useTensorFlow from '../hooks/useTensorFlow';

const CVContext = createContext();

export const useCV = () => useContext(CVContext);

export const CVProvider = ({ children }) => {
    // Load models once at app level context
    const { models, isLoading, loadProgress, error, loadModels } = useTensorFlow();

    const [cvSettings, setCvSettings] = useState({
        minConfidence: 0.45,
        detectionSpeed: 'medium',
        showHUD: true,
        showGrid: false,
        showScanLine: true
    });

    const [sessionStats, setSessionStats] = useState({
        startTime: null,
        framesAnalyzed: 0,
        capturesTaken: 0,
        avgFps: 0
    });

    // Automatically load models initially
    useEffect(() => {
        loadModels();
        setSessionStats(s => ({ ...s, startTime: new Date() }));
    }, []);

    const updateSessionStats = (updates) => {
        setSessionStats(prev => {
            const nextUpdates = typeof updates === 'function' ? updates(prev) : updates;
            return { ...prev, ...nextUpdates };
        });
    };

    const updateSettings = (updates) => {
        setCvSettings(prev => ({ ...prev, ...updates }));
    };

    return (
        <CVContext.Provider value={{
            models,
            modelsLoaded: !isLoading && models.cocoSsd != null,
            loadProgress,
            error,
            cvSettings,
            updateSettings,
            sessionStats,
            updateSessionStats
        }}>
            {children}
        </CVContext.Provider>
    );
};
