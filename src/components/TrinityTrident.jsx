import React from 'react';

// Compact card-ready component — returns just the SVG, no full-page wrapper.
// Pass width/height to scale; viewBox stays at 400x384 so all coordinates are
// reused exactly and CSS handles the visual scale.
export default function TrinityTrident({ swdec = 111, dmg = 104, con = 63, width = 240, height = 230 }) {
  const minValue = 50;
  const maxValue = 150;
  const minHeight = 170;
  const maxHeight = 290;

  const getHeight = (value) => {
    const clamped    = Math.max(minValue, Math.min(value, maxValue));
    const normalized = (clamped - minValue) / (maxValue - minValue);
    return minHeight + normalized * (maxHeight - minHeight);
  };

  const leftHeight   = getHeight(swdec);
  const centerHeight = getHeight(dmg);
  const rightHeight  = getHeight(con);
  const baselineHeight = getHeight(100);

  const getColor = (value) => {
    if (value > 110) return '#22c55e';
    if (value < 90)  return '#ef4444';
    return '#64748b';
  };

  const getBgColor = (value) => {
    if (value > 110) return '#dcfce7';
    if (value < 90)  return '#fee2e2';
    return '#f1f5f9';
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 384"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ghost prongs (baseline at 100) */}
      <g opacity="0.3">
        <line x1="120" y1={384 - baselineHeight + 15} x2="120" y2="280" stroke="#94a3b8" strokeWidth="28" strokeLinecap="butt" />
        <line x1="200" y1={384 - baselineHeight + 15} x2="200" y2="280" stroke="#94a3b8" strokeWidth="28" strokeLinecap="butt" />
        <line x1="280" y1={384 - baselineHeight + 15} x2="280" y2="280" stroke="#94a3b8" strokeWidth="28" strokeLinecap="butt" />
      </g>

      {/* Dotted 100 line */}
      <line
        x1="80" y1={384 - baselineHeight}
        x2="320" y2={384 - baselineHeight}
        stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4"
      />
      <text
        x="73" y={384 - baselineHeight + 7}
        textAnchor="end" fontSize={24} fontWeight="600" fill="#94a3b8"
      >
        100
      </text>

      {/* Left prong — swDEC+ */}
      <g>
        <line x1="120" y1={384 - leftHeight + 30} x2="120" y2="280" stroke="#d97706" strokeWidth="28" strokeLinecap="butt" />
        <polygon points={`120,${384 - leftHeight} 100,${384 - leftHeight + 35} 140,${384 - leftHeight + 35}`} fill="#d97706" />
        <rect x="80" y={384 - leftHeight - 50} width="80" height="40" rx="6" fill={getBgColor(swdec)} />
        <text x="120" y={384 - leftHeight - 15} textAnchor="middle" fontSize={40} fontWeight="bold" fill={getColor(swdec)}>
          {swdec}
        </text>
      </g>

      {/* Center prong — DMG+ */}
      <g>
        <line x1="200" y1={384 - centerHeight + 30} x2="200" y2="280" stroke="#d97706" strokeWidth="28" strokeLinecap="butt" />
        <polygon points={`200,${384 - centerHeight} 180,${384 - centerHeight + 35} 220,${384 - centerHeight + 35}`} fill="#d97706" />
        <rect x="162" y={384 - centerHeight - 50} width="80" height="40" rx="6" fill={getBgColor(dmg)} />
        <text x="200" y={384 - centerHeight - 15} textAnchor="middle" fontSize={40} fontWeight="bold" fill={getColor(dmg)}>
          {dmg}
        </text>
      </g>

      {/* Right prong — CON+ */}
      <g>
        <line x1="280" y1={384 - rightHeight + 30} x2="280" y2="280" stroke="#d97706" strokeWidth="28" strokeLinecap="butt" />
        <polygon points={`280,${384 - rightHeight} 260,${384 - rightHeight + 35} 300,${384 - rightHeight + 35}`} fill="#d97706" />
        <rect x="244" y={384 - rightHeight - 50} width="80" height="40" rx="6" fill={getBgColor(con)} />
        <text x="280" y={384 - rightHeight - 15} textAnchor="middle" fontSize={40} fontWeight="bold" fill={getColor(con)}>
          {con}
        </text>
      </g>

      {/* Base / handle */}
      <g>
        <path d="M 120 280 Q 160 300, 200 300" stroke="#d97706" strokeWidth="28" fill="none" strokeLinecap="round" />
        <path d="M 280 280 Q 240 300, 200 300" stroke="#d97706" strokeWidth="28" fill="none" strokeLinecap="round" />
        <line x1="200" y1="280" x2="200" y2="300" stroke="#d97706" strokeWidth="28" strokeLinecap="round" />
        <line x1="200" y1="300" x2="200" y2="355" stroke="#d97706" strokeWidth="32" strokeLinecap="round" />
      </g>

      {/* Rotated labels on prongs */}
      <g>
        <text x="136" y="256" textAnchor="middle" fontSize={22} fontWeight="bold" fill="#ffffff" transform="rotate(-90, 128, 256)">swDEC+</text>
        <text x="208" y="270" textAnchor="middle" fontSize={22} fontWeight="bold" fill="#ffffff" transform="rotate(-90, 208, 270)">DMG+</text>
        <text x="290" y="260" textAnchor="middle" fontSize={22} fontWeight="bold" fill="#ffffff" transform="rotate(-90, 288, 260)">CON+</text>
      </g>
    </svg>
  );
}
