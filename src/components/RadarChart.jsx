import React from 'react';

export default function RadarChart({ data, size = 300 }) {
  const categories = [
    { key: 'fitness', label: 'FITNESS', color: '#FF0066' },
    { key: 'mindset', label: 'MINDSET', color: '#0066FF' },
    { key: 'social', label: 'SOCIAL', color: '#00FF66' },
    { key: 'career', label: 'CAREER', color: '#FF6600' },
    { key: 'skills', label: 'SKILLS', color: '#6600FF' },
    { key: 'lifestyle', label: 'LIFESTYLE', color: '#FFFF00' }
  ];

  const center = size / 2;
  const maxRadius = (size / 2) - 60;
  const angleStep = (2 * Math.PI) / categories.length;

  const getPointCoordinates = (index, value) => {
    const angle = (index * angleStep) - (Math.PI / 2);
    const radius = (value / 10) * maxRadius;
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius
    };
  };

  const getLabelCoordinates = (index) => {
    const angle = (index * angleStep) - (Math.PI / 2);
    const radius = maxRadius + 30;
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius
    };
  };

  const dataPoints = categories.map((cat, i) => 
    getPointCoordinates(i, data[cat.key] || 0)
  );

  const pathData = dataPoints.map((point, i) => 
    `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ') + ' Z';

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform rotate-0">
        {/* Grid circles */}
        {[2, 4, 6, 8, 10].map(level => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={(level / 10) * maxRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.3"
          />
        ))}
        
        {/* Grid lines */}
        {categories.map((_, i) => {
          const endPoint = getPointCoordinates(i, 10);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.3"
            />
          );
        })}

        {/* Data area */}
        <path
          d={pathData}
          fill="rgba(0, 102, 255, 0.2)"
          stroke="#0066FF"
          strokeWidth="4"
        />

        {/* Data points */}
        {dataPoints.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="8"
            fill={categories[i].color}
            stroke="#000"
            strokeWidth="3"
          />
        ))}
      </svg>

      {/* Labels */}
      {categories.map((cat, i) => {
        const labelPos = getLabelCoordinates(i);
        return (
          <div
            key={cat.key}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: labelPos.x,
              top: labelPos.y,
            }}
          >
            <div className="neo-brutalist bg-black text-white px-2 py-1 text-xs font-black uppercase tracking-wide text-center">
              {cat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}