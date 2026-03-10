// Note: opencv4nodejs requires native build tools and CMake.
// For the sake of this implementation and platform compatibility, we mock the OpenCV logic
// if the native binding fails to load, so the system doesn't crash on standard Windows.

let cv;
try {
    const cvModule = await import('opencv4nodejs');
    cv = cvModule.default || cvModule;
} catch (e) {
    console.warn("opencv4nodejs not available. Using mock OpenCV analysis for development.");
    cv = null;
}

export const analyzeImageWithOpenCV = async (imageBuffer, width, height) => {
    if (!cv) {
        // Mock analysis if OpenCV is missing
        const simulatedEdgeRatio = 0.12;
        return {
            edgeComplexity: 'MEDIUM',
            edgeRatio: simulatedEdgeRatio,
            contourCount: Math.floor(Math.random() * 20) + 5,
            colors: {
                concrete: 45.2,
                sky: 20.1,
                rebar: 3.5
            },
            builtAreaPct: 75,
            skyRatio: 20.1,
            estimatedProgressScore: 65,
            mocked: true
        };
    }

    try {
        const mat = cv.imdecode(imageBuffer);

        // Edge Detection (Canny)
        const gray = mat.cvtColor(cv.COLOR_BGR2GRAY);
        const blurred = gray.gaussianBlur(new cv.Size(5, 5), 0);
        const edges = blurred.canny(50, 150);

        const totalPixels = mat.rows * mat.cols;
        const edgePixels = edges.countNonZero();
        const edgeRatio = edgePixels / totalPixels;

        let edgeComplexity = 'LOW';
        if (edgeRatio > 0.15) edgeComplexity = 'HIGH';
        else if (edgeRatio > 0.08) edgeComplexity = 'MEDIUM';

        // Contour Detection
        const contours = edges.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
        const significantContours = contours.filter(c => c.area > 500);

        // Color Analysis
        const hsv = mat.cvtColor(cv.COLOR_BGR2HSV);

        // Concrete (gray tones)
        const concreteMask = hsv.inRange(
            new cv.Vec3(0, 0, 80),
            new cv.Vec3(180, 30, 200)
        );
        const concretePct = (concreteMask.countNonZero() / totalPixels) * 100;

        // Sky (blue tones)
        const skyMask = hsv.inRange(
            new cv.Vec3(95, 50, 100),
            new cv.Vec3(130, 255, 255)
        );
        const skyPct = (skyMask.countNonZero() / totalPixels) * 100;

        // Rebar (orange/brown tones)
        const rebarMask = hsv.inRange(
            new cv.Vec3(5, 50, 50),
            new cv.Vec3(25, 255, 200)
        );
        const rebarPct = (rebarMask.countNonZero() / totalPixels) * 100;

        // Built-up area (inverse of sky)
        const builtAreaPct = Math.max(0, 100 - skyPct - 5);

        // Base Progress Estimation Algorithm
        let baseScore = 0;
        baseScore += Math.min(30, significantContours.length * 0.3);
        baseScore += Math.min(20, concretePct * 0.4);
        baseScore += Math.min(20, rebarPct * 2);
        baseScore += Math.min(20, edgeRatio * 100);
        baseScore += Math.min(10, builtAreaPct * 0.1);

        return {
            edgeComplexity,
            edgeRatio,
            contourCount: significantContours.length,
            colors: {
                concrete: concretePct,
                sky: skyPct,
                rebar: rebarPct
            },
            builtAreaPct,
            skyRatio: skyPct,
            estimatedProgressScore: Math.round(baseScore)
        };
    } catch (err) {
        console.error("OpenCV Analysis Error:", err);
        throw new Error("Failed to process image with OpenCV data.");
    }
};
