export const renderDetections = (ctx, detections, videoWidth, videoHeight) => {
    detections.forEach(detection => {
        const [x, y, width, height] = detection.bbox;
        const color = detection.construction.color;
        const score = detection.score;

        // Bounding box
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.strokeRect(x, y, width, height);
        ctx.shadowBlur = 0; // reset

        // Corner accents (military HUD style)
        const cornerLen = 12;
        ctx.beginPath();
        // Top Left
        ctx.moveTo(x, y + cornerLen); ctx.lineTo(x, y); ctx.lineTo(x + cornerLen, y);
        // Top Right
        ctx.moveTo(x + width - cornerLen, y); ctx.lineTo(x + width, y); ctx.lineTo(x + width, y + cornerLen);
        // Bottom Right
        ctx.moveTo(x + width, y + height - cornerLen); ctx.lineTo(x + width, y + height); ctx.lineTo(x + width - cornerLen, y + height);
        // Bottom Left
        ctx.moveTo(x + cornerLen, y + height); ctx.lineTo(x, y + height); ctx.lineTo(x, y + height - cornerLen);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label string
        const labelText = `${detection.construction.icon} ${detection.construction.label} ${Math.round(score * 100)}%`;

        ctx.font = 'bold 11px "Space Mono", monospace';
        const textWidth = ctx.measureText(labelText).width;

        // Label background
        ctx.fillStyle = color + 'dd';
        ctx.fillRect(x, y - 24, textWidth + 8, 22);

        // Label text
        ctx.fillStyle = '#000000';
        ctx.fillText(labelText, x + 4, y - 7);

        // Confidence bar inside bbox bottom
        const barWidth = width * score;
        ctx.fillStyle = color + '44';
        ctx.fillRect(x, y + height - 4, width, 4);
        ctx.fillStyle = color;
        ctx.fillRect(x, y + height - 4, barWidth, 4);
    });
};

export const renderHUD = (ctx, fps, videoWidth, videoHeight, currentTime = '') => {
    // FPS Counter
    ctx.fillStyle = '#f59e0b';
    ctx.font = '11px "Space Mono"';
    ctx.fillText(`FPS: ${fps.toFixed(1)}`, 12, 20);

    // Watermark
    ctx.fillStyle = 'rgba(245,158,11,0.8)';
    const text = `AerialPM CV • ${currentTime}`;
    const txtW = ctx.measureText(text).width;
    ctx.fillText(text, videoWidth - txtW - 12, videoHeight - 12);
};

export const renderScanLine = (ctx, frameCount, videoWidth, videoHeight) => {
    const y = (frameCount * 3) % videoHeight;
    const gradient = ctx.createLinearGradient(0, y - 10, 0, y + 10);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.5, 'rgba(245,158,11,0.15)');
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, y - 10, videoWidth, 20);
};

export const renderGrid = (ctx, videoWidth, videoHeight) => {
    ctx.strokeStyle = 'rgba(245,158,11,0.08)';
    ctx.lineWidth = 1;

    const w3 = videoWidth / 3;
    const h3 = videoHeight / 3;

    ctx.beginPath();
    ctx.moveTo(w3, 0); ctx.lineTo(w3, videoHeight);
    ctx.moveTo(w3 * 2, 0); ctx.lineTo(w3 * 2, videoHeight);
    ctx.moveTo(0, h3); ctx.lineTo(videoWidth, h3);
    ctx.moveTo(0, h3 * 2); ctx.lineTo(videoWidth, h3 * 2);
    ctx.stroke();
};
