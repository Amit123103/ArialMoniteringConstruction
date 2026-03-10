// This module synthesizes data from multiple sources (TF.js object stats, OpenCV image stats, metadata)
// to generate a final weighted progress estimation score.

export const estimateOverallProgress = (openCvData, tfjsData, projectPhase) => {
    let finalScore = 0;

    // Weightings based on phase (simplified)
    const weights = {
        foundation: { cvObjects: 0.6, openCv: 0.4 },
        framework: { cvObjects: 0.5, openCv: 0.5 },
        roofing: { cvObjects: 0.4, openCv: 0.6 },
        mep: { cvObjects: 0.7, openCv: 0.3 },
        interior: { cvObjects: 0.8, openCv: 0.2 },
        handover: { cvObjects: 0.5, openCv: 0.5 }
    };

    const w = weights[projectPhase] || { cvObjects: 0.5, openCv: 0.5 };

    const opencvScore = openCvData ? openCvData.estimatedProgressScore : 0;
    const tfjsScore = tfjsData ? tfjsData.activityScore : 0;

    finalScore = (opencvScore * w.openCv) + (tfjsScore * w.cvObjects);

    return {
        score: Math.round(finalScore),
        confidence: 0.85,
        phaseMatch: projectPhase,
        components: {
            sceneScore: Math.round(opencvScore),
            activityScore: Math.round(tfjsScore)
        }
    };
};
