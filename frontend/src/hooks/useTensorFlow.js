import { useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

const useTensorFlow = () => {
    const [models, setModels] = useState({
        cocoSsd: null,
        mobileNet: null,
        bodyPix: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const [error, setError] = useState(null);
    const loadAttempted = useRef(false);

    const loadModels = useCallback(async () => {
        if (loadAttempted.current || models.cocoSsd) return;
        loadAttempted.current = true;
        setIsLoading(true);
        setError(null);

        try {
            // Wait for TF to be ready and set backend
            setLoadProgress(10);
            await window.tf.ready();
            await window.tf.setBackend('webgl'); // ensure GPU accel

            // Load COCO-SSD
            setLoadProgress(30);
            const cocoSsdModel = await window.cocoSsd.load({ base: 'mobilenet_v2' });

            // Load MobileNet
            setLoadProgress(60);
            const mobileNetModel = await window.mobilenet.load({ version: 2, alpha: 1.0 });

            // Load BodyPix
            setLoadProgress(80);
            const bodyPixModel = await window.bodyPix.load({
                architecture: 'MobileNetV1',
                outputStride: 16,
                multiplier: 0.75,
                quantBytes: 2
            });

            setLoadProgress(100);
            setModels({
                cocoSsd: cocoSsdModel,
                mobileNet: mobileNetModel,
                bodyPix: bodyPixModel
            });

            toast.success("AI Models loaded — CV Active", { icon: '🧠' });
        } catch (err) {
            console.error("TF.js Model Load Error", err);
            setError("Failed to initialize AI models. Ensure you have an internet connection.");
            toast.error("AI Model Initialization Failed");
        } finally {
            setIsLoading(false);
        }
    }, [models.cocoSsd]);

    const warmUp = async (videoElement) => {
        if (!models.cocoSsd || !videoElement || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) return;
        try {
            // throw away first prediction
            await models.cocoSsd.detect(videoElement);
        } catch (e) {
            console.log("Warmup ignored", e);
        }
    };

    return { models, isLoading, loadProgress, error, loadModels, warmUp };
};

export default useTensorFlow;
