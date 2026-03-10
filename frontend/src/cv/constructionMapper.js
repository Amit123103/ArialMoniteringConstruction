const CONSTRUCTION_MAP = {
    // Direct construction objects
    'person': { label: 'Construction Worker', icon: '👷', category: 'labor', color: '#f59e0b', progressWeight: 0.8 },
    'truck': { label: 'Dump Truck / Transport', icon: '🚛', category: 'machinery', color: '#3b82f6', progressWeight: 1.5 },
    'car': { label: 'Site Vehicle', icon: '🚗', category: 'machinery', color: '#3b82f6', progressWeight: 0.5 },
    'bus': { label: 'Equipment Transport', icon: '🚌', category: 'machinery', color: '#3b82f6', progressWeight: 1.0 },
    'motorcycle': { label: 'Site Supervisor Bike', icon: '🏍', category: 'labor', color: '#f59e0b', progressWeight: 0.3 },
    'bicycle': { label: 'Site Bicycle', icon: '🚲', category: 'labor', color: '#f59e0b', progressWeight: 0.2 },
    'bench': { label: 'Formwork / Shuttering', icon: '🪵', category: 'material', color: '#10b981', progressWeight: 1.2 },
    'chair': { label: 'Site Furniture', icon: '🪑', category: 'material', color: '#10b981', progressWeight: 0.4 },
    'bottle': { label: 'Worker Supplies', icon: '🧴', category: 'labor', color: '#f59e0b', progressWeight: 0.1 },
    'backpack': { label: 'Worker Equipment Bag', icon: '🎒', category: 'labor', color: '#f59e0b', progressWeight: 0.2 },
    'handbag': { label: 'Tool Bag', icon: '👜', category: 'tools', color: '#8b5cf6', progressWeight: 0.3 },
    'umbrella': { label: 'Site Safety Cover', icon: '☂️', category: 'safety', color: '#ef4444', progressWeight: 0.2 },
    'cell phone': { label: 'Site Coordinator', icon: '📱', category: 'labor', color: '#f59e0b', progressWeight: 0.1 },
    'laptop': { label: 'Engineering Station', icon: '💻', category: 'tools', color: '#8b5cf6', progressWeight: 0.5 },
    'clock': { label: 'Site Timing Equipment', icon: '🕐', category: 'tools', color: '#8b5cf6', progressWeight: 0.1 },
    'bowl': { label: 'Concrete Mix Container', icon: '🥣', category: 'material', color: '#10b981', progressWeight: 0.8 },
    'cup': { label: 'Cement Container', icon: '🥤', category: 'material', color: '#10b981', progressWeight: 0.4 },
    'scissors': { label: 'Cutting Tools', icon: '✂️', category: 'tools', color: '#8b5cf6', progressWeight: 0.3 },
    'book': { label: 'Engineering Blueprint', icon: '📋', category: 'planning', color: '#3b82f6', progressWeight: 0.5 },
    'vase': { label: 'Pipe / Cylinder Material', icon: '🏺', category: 'material', color: '#10b981', progressWeight: 0.6 },
    'couch': { label: 'Scaffolding Frame', icon: '🪜', category: 'structure', color: '#ef4444', progressWeight: 2.0 },
    'bed': { label: 'Foundation Slab / Platform', icon: '🏗', category: 'structure', color: '#ef4444', progressWeight: 3.0 },
    'dining table': { label: 'Work Platform / Table', icon: '🪚', category: 'structure', color: '#ef4444', progressWeight: 1.5 },
    'potted plant': { label: 'Site Vegetation Marker', icon: '🌿', category: 'environment', color: '#10b981', progressWeight: 0.1 },
    'tv': { label: 'Site Monitoring Display', icon: '📺', category: 'tools', color: '#8b5cf6', progressWeight: 0.5 },
    'keyboard': { label: 'Control Panel', icon: '⌨️', category: 'tools', color: '#8b5cf6', progressWeight: 0.3 }
};

export const mapDetections = (predictions) => {
    return predictions.map(p => ({
        ...p,
        construction: CONSTRUCTION_MAP[p.class] || {
            label: p.class + ' (Site Object)',
            icon: '📦',
            category: 'unknown',
            color: '#64748b',
            progressWeight: 0.1
        }
    }));
};

export const getCategoryCounts = (mappedDetections) => {
    const counts = { labor: 0, machinery: 0, material: 0, structure: 0, tools: 0, safety: 0, environment: 0, planning: 0, unknown: 0 };
    mappedDetections.forEach(d => {
        if (counts[d.construction.category] !== undefined) {
            counts[d.construction.category]++;
        } else {
            counts.unknown++;
        }
    });
    return counts;
};
