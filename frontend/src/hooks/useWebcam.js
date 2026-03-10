import { useState, useRef, useCallback, useEffect } from 'react';

const useWebcam = () => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [devices, setDevices] = useState([]);
    const [activeDevice, setActiveDevice] = useState(null);
    const [error, setError] = useState(null);
    const [hasPermission, setHasPermission] = useState(false);

    const listCameras = useCallback(async () => {
        try {
            const mediaDevices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = mediaDevices.filter(device => device.kind === 'videoinput');
            setDevices(videoDevices);
            return videoDevices;
        } catch (err) {
            console.error("Error listing cameras:", err);
            return [];
        }
    }, []);

    const startWebcam = useCallback(async (deviceId = null) => {
        try {
            setError(null);
            const constraints = {
                video: {
                    deviceId: deviceId ? { exact: deviceId } : undefined,
                    width: { ideal: 1920, min: 1280 },
                    height: { ideal: 1080, min: 720 },
                    facingMode: deviceId ? undefined : 'environment',
                    frameRate: { ideal: 30 }
                },
                audio: false
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

            setStream(mediaStream);
            setIsActive(true);
            setHasPermission(true);

            const track = mediaStream.getVideoTracks()[0];
            setActiveDevice(track.getSettings().deviceId);

            await listCameras();
        } catch (err) {
            console.error("Webcam error:", err);
            setError(err.message);
            setHasPermission(false);
        }
    }, [listCameras]);

    const stopWebcam = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsActive(false);
    }, [stream]);

    const switchCamera = useCallback(async (deviceId) => {
        stopWebcam();
        setTimeout(() => startWebcam(deviceId), 100);
    }, [stopWebcam, startWebcam]);

    const captureSnapshot = useCallback(async () => {
        if (!videoRef.current || !isActive) return null;

        const video = videoRef.current;
        const width = video.videoWidth || 1920;
        const height = video.videoHeight || 1080;

        if (width === 0 || height === 0) {
            console.error("Video dimensions invalid for capture.");
            return null;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);

        const dataURL = canvas.toDataURL('image/jpeg', 0.92);

        const res = await fetch(dataURL);
        const blob = await res.blob();

        return {
            dataURL,
            blob,
            timestamp: new Date().toISOString(),
            width: canvas.width,
            height: canvas.height
        };
    }, [isActive]);

    // Map stream to video element when it's rendered
    useEffect(() => {
        if (isActive && videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [isActive, stream, videoRef]);

    // Ensure cleanup
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(t => t.stop());
            }
        };
    }, [stream]);

    return {
        videoRef,
        stream,
        isActive,
        hasPermission,
        error,
        startWebcam,
        stopWebcam,
        switchCamera,
        captureSnapshot,
        devices,
        activeDevice
    };
};

export default useWebcam;
