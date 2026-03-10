const PHASE_EXPECTED_OBJECTS = {
    'foundation': ['truck', 'person', 'bowl', 'bench'],
    'framework': ['person', 'couch', 'bench', 'truck'],
    'roofing': ['person', 'bench', 'couch'],
    'mep': ['person', 'scissors', 'backpack'],
    'interior': ['person', 'chair', 'bench', 'book'],
    'handover': ['person', 'book', 'laptop', 'car']
};

export const getScoreLabel = (score) => {
    if (score <= 20) return "Minimal Activity";
    if (score <= 40) return "Low Activity";
    if (score <= 60) return "Moderate Activity";
    if (score <= 80) return "High Activity";
    return "Very High Activity";
};

const getRecommendation = (score, phase) => {
    if (score > 80) return "Site shows very high activity — progress well ahead of schedule.";
    if (score > 60) return "Site shows high worker activity — progress on track.";
    if (score > 40) return "Moderate activity detected — monitor specific phase completion.";
    if (score > 20) return "Low activity detected — check equipment or labor deployment.";
    return "Minimal to no activity detected. Verify site status.";
};

export const scoreFrame = (mappedDetections, sceneClassification = [], projectPhase = 'foundation') => {
    // 1. ACTIVITY SCORE (0-40 points)
    const workerCount = mappedDetections.filter(d => d.construction.category === 'labor').length;
    const machineCount = mappedDetections.filter(d => d.construction.category === 'machinery').length;
    let activityScore = Math.min(40, (workerCount * 5) + (machineCount * 8));

    // 2. MATERIAL SCORE (0-30 points)
    const materialCount = mappedDetections.filter(d => d.construction.category === 'material').length;
    const structureCount = mappedDetections.filter(d => d.construction.category === 'structure').length;
    let materialScore = Math.min(30, (materialCount * 3) + (structureCount * 8));

    // 3. SCENE CONFIDENCE (0-20 points)
    const constructionKeywords = [
        'construction', 'building', 'crane', 'scaffold', 'architecture',
        'structure', 'urban', 'industrial', 'equipment', 'machinery',
        'worker', 'site', 'concrete', 'steel'
    ];
    let sceneScore = 0;
    const topPredictions = sceneClassification.slice(0, 5);
    topPredictions.forEach(pred => {
        if (constructionKeywords.some(kw => pred.className.toLowerCase().includes(kw))) {
            sceneScore += pred.probability * 20;
        }
    });
    sceneScore = Math.min(20, sceneScore);

    // 4. PHASE CONTEXT BONUS (0-10 points)
    const phaseExpected = PHASE_EXPECTED_OBJECTS[projectPhase] || [];
    const matches = mappedDetections.filter(d => phaseExpected.includes(d.class));
    const phaseBonus = Math.min(10, matches.length * 2);

    const totalScore = activityScore + materialScore + sceneScore + phaseBonus;

    return {
        score: Math.round(totalScore),
        label: getScoreLabel(totalScore),
        breakdown: { activityScore, materialScore, sceneScore, phaseBonus },
        workerCount,
        machineCount,
        materialCount,
        confidence: totalScore / 100,
        recommendation: getRecommendation(totalScore, projectPhase)
    };
};
