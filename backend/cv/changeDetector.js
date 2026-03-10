import sharp from 'sharp';

export const detectChanges = async (beforeImagePath, afterImagePath) => {
    try {
        const beforeBuffer = await sharp(beforeImagePath)
            .resize(800, 600)
            .grayscale()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const afterBuffer = await sharp(afterImagePath)
            .resize(800, 600)
            .grayscale()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const { data: bData, info } = beforeBuffer;
        const { data: aData } = afterBuffer;

        const totalPixels = info.width * info.height;
        let changedPixels = 0;

        for (let i = 0; i < totalPixels; i++) {
            const diff = Math.abs(aData[i] - bData[i]);
            if (diff > 30) { // Threshold for change
                changedPixels++;
            }
        }

        const changePercent = (changedPixels / totalPixels) * 100;
        return {
            changePercent: changePercent.toFixed(1),
            changedPixels,
            totalPixels,
            significance: getSignificance(changePercent),
            recommendation: getChangeRecommendation(changePercent)
        };
    } catch (error) {
        console.error("Change Detection Error:", error);
        throw new Error("Failed to detect changes between images");
    }
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
