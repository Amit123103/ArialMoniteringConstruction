export const analyzeChange = (beforeImageData, afterImageData) => {
    const width = beforeImageData.width;
    const height = beforeImageData.height;
    const totalPixels = width * height;
    let changedPixels = 0;

    const changeMap = new Uint8ClampedArray(totalPixels * 4);
    const beforeData = beforeImageData.data;
    const afterData = afterImageData.data;
    const CHANGE_THRESHOLD = 30;

    for (let i = 0; i < totalPixels * 4; i += 4) {
        const rDiff = Math.abs(afterData[i] - beforeData[i]);
        const gDiff = Math.abs(afterData[i + 1] - beforeData[i + 1]);
        const bDiff = Math.abs(afterData[i + 2] - beforeData[i + 2]);
        const totalDiff = (rDiff + gDiff + bDiff) / 3;

        if (totalDiff > CHANGE_THRESHOLD) {
            changedPixels++;
            // Mark change map pixel RED
            changeMap[i] = 255;
            changeMap[i + 1] = 0;
            changeMap[i + 2] = 0;
            changeMap[i + 3] = 200;
        } else {
            // Mark dark blue/transparent
            changeMap[i] = 0;
            changeMap[i + 1] = 0;
            changeMap[i + 2] = 50;
            changeMap[i + 3] = 100;
        }
    }

    const changePercent = (changedPixels / totalPixels) * 100;

    return {
        changePercent: changePercent.toFixed(1),
        changedPixels,
        totalPixels,
        changeMap,
        width,
        height,
        significance: getSignificance(changePercent),
        recommendation: getChangeRecommendation(changePercent)
    };
};

const getSignificance = (pct) => {
    if (pct < 2) return "Minimal Change — Site appears unchanged";
    if (pct < 10) return "Minor Activity — Small changes detected";
    if (pct < 25) return "Moderate Progress — Visible site changes";
    if (pct < 50) return "Significant Progress — Major construction activity";
    return "Major Transformation — Substantial progress made";
};

const getChangeRecommendation = (pct) => {
    if (pct < 2) return "Check site activity logs - no visual progress detected.";
    if (pct < 10) return "Normal minor activity noted.";
    if (pct < 25) return "Good progress. Ensure materials are restocked.";
    return "Significant milestone reached. Trigger phase review.";
};

export const renderChangeMask = (ctx, changeMap, width, height, opacity = 0.6) => {
    const imageData = new ImageData(changeMap, width, height);

    // We create a temporary canvas to draw the imageData, then draw it to context with globalAlpha
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCanvas.getContext('2d').putImageData(imageData, 0, 0);

    const oldAlpha = ctx.globalAlpha;
    ctx.globalAlpha = opacity;
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.globalAlpha = oldAlpha; // restore
};
