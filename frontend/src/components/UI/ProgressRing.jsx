import React from 'react';

const ProgressRing = ({ radius, stroke, progress, color = '#f59e0b' }) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <svg height={radius * 2} width={radius * 2}>
            <circle
                stroke="#1e293b" // slate-800
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <circle
                stroke={color}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                strokeLinecap="round"
                transform={`rotate(-90 ${radius} ${radius})`}
            />
        </svg>
    );
};

export default ProgressRing;
