import { useState, useRef, useCallback, useEffect } from 'react';

const useObjectDetect = (model, videoRef, isActive, minConfidence = 0.45) => {
    const [detections, setDetections] = useState([]);
    const [fps, setFps] = useState(0);
    const [isDetecting, setIsDetecting] = useState(false);

    const requestRef = useRef();
    const lastFrameTime = useRef(performance.now());
    const frameCount = useRef(0);

    // ~6-7 fps detection limit
    const DETECTION_INTERVAL = 150;

    const detectLoop = useCallback(async () => {
        if (!isActive || !model || !videoRef.current) {
            setIsDetecting(false);
            return;
        }

        const now = performance.now();
        const elapsed = now - lastFrameTime.current;

        if (elapsed >= DETECTION_INTERVAL && videoRef.current.readyState === 4) {
            if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
                requestRef.current = requestAnimationFrame(detectLoop);
                return;
            }

            try {
                const predictions = await model.detect(videoRef.current, 20);
                const filtered = predictions.filter(p => p.score >= minConfidence);

                setDetections(filtered);

                setFps(1000 / elapsed);
                lastFrameTime.current = now;
                frameCount.current += 1;
            } catch (err) {
                console.warn("Detection error frame dropped", err);
            }
        }

        requestRef.current = requestAnimationFrame(detectLoop);
    }, [isActive, model, videoRef, minConfidence]);

    const startDetection = useCallback(() => {
        if (!isDetecting && isActive && model) {
            setIsDetecting(true);
            lastFrameTime.current = performance.now();
            requestRef.current = requestAnimationFrame(detectLoop);
        }
    }, [isDetecting, isActive, model, detectLoop]);

    const stopDetection = useCallback(() => {
        setIsDetecting(false);
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
        }
        setDetections([]);
    }, []);

    useEffect(() => {
        return () => stopDetection();
    }, [stopDetection]);

    // Auto start/stop based on webcam activity
    useEffect(() => {
        if (isActive && model) {
            startDetection();
        } else {
            stopDetection();
        }
    }, [isActive, model, startDetection, stopDetection]);

    return {
        detections,
        fps,
        frameCount: frameCount.current,
        isDetecting,
        startDetection,
        stopDetection
    };
};

export default useObjectDetect;
