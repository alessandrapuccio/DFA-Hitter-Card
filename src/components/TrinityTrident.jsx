import React from 'react';

export default function TrinityTrident({ swdec = 111, dmg = 104, con = 63, width = 240, height = 230 }) {
  const minValue = 50;
  const maxValue = 150;
  const minHeight = 100;
  const maxHeight = 380;

  const getHeight = (value) => {
    const clamped    = Math.max(minValue, Math.min(value, maxValue));
    const normalized = (clamped - minValue) / (maxValue - minValue);
    return minHeight + normalized * (maxHeight - minHeight);
  };

  const getDisplayHeight = (value) => {
    let displayValue = value > 100 ? value + 7 : value;
    displayValue = value > 106 ? value + 10 : value;
    displayValue = value < 96 ? value - 5 : displayValue;
    displayValue = value > 124 ? value - 1 : displayValue;
    displayValue = value < 66 ? 66 : displayValue;

    // if display value ends up less than 31, keep at 40 so prong exists
    displayValue = displayValue < 66 ? 66 : displayValue;
    return getHeight(displayValue);
  };

  const LABEL_Y = 44;

  const leftHeight   = getDisplayHeight(swdec);
  const centerHeight = getDisplayHeight(dmg);
  const rightHeight  = getDisplayHeight(con);
  const baselineHeight = getHeight(95);

  const leftArrowTop   = 440 - leftHeight;
  const centerArrowTop = 440 - centerHeight;
  const rightArrowTop  = 440 - rightHeight;

  const leftLabelY   = LABEL_Y;
  const centerLabelY = LABEL_Y;
  const rightLabelY  = LABEL_Y;

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
      viewBox="0 14 400 440"
      xmlns="http://www.w3.org/2000/svg"
    >
    {/* Ghost prongs (baseline at 100) — with arrowheads */}
    <g opacity="0.3">
      <line x1="120" y1={440 - baselineHeight +30} x2="120" y2="336" stroke="#94a3b8" strokeWidth="28" strokeLinecap="butt" />
      {swdec < 100 && <polygon points={`120,${440 - baselineHeight} 100,${440 - baselineHeight + 35} 140,${440 - baselineHeight + 35}`} fill="#94a3b8" />}
      
      <line x1="200" y1={440 - baselineHeight + 30} x2="200" y2="336" stroke="#94a3b8" strokeWidth="28" strokeLinecap="butt" />
      {dmg < 100 && <polygon points={`200,${440 - baselineHeight} 180,${440 - baselineHeight + 35} 220,${440 - baselineHeight + 35}`} fill="#94a3b8" />}
      
      <line x1="280" y1={440 - baselineHeight + 30} x2="280" y2="336" stroke="#94a3b8" strokeWidth="28" strokeLinecap="butt" />
      {con < 100 && <polygon points={`280,${440 - baselineHeight} 260,${440 - baselineHeight + 35} 300,${440 - baselineHeight + 35}`} fill="#94a3b8" />}
    </g>


      {/* Base / handle */}
      <g>
        <path d="M 120 336 Q 160 356, 200 356" stroke="#d97706" strokeWidth="28" fill="none" strokeLinecap="round" />
        <path d="M 280 336 Q 240 356, 200 356" stroke="#d97706" strokeWidth="28" fill="none" strokeLinecap="round" />
        <line x1="200" y1="336" x2="200" y2="356" stroke="#d97706" strokeWidth="28" strokeLinecap="round" />
        <line x1="200" y1="356" x2="200" y2="411" stroke="#d97706" strokeWidth="32" strokeLinecap="round" />
      </g>

      {/* Dotted 100 line */}
      <line
        x1="80" y1={440 - baselineHeight}
        x2="320" y2={440 - baselineHeight}
        stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4"
      />
      <text
        x="72" y={442 - baselineHeight + 7}
        textAnchor="end" fontSize={31} fontWeight="600" fill="#94a3b8"
      >
        100
      </text>

      {/* Left prong — swDEC+ */}
      <g>
        <line x1="120" y1={leftArrowTop + 30} x2="120" y2="336" stroke="#d97706" strokeWidth="28" strokeLinecap="butt" />
        <polygon points={`120,${leftArrowTop} 100,${leftArrowTop + 35} 140,${leftArrowTop + 35}`} fill="#d97706" />
        <rect x="74" y={leftLabelY} width="80" height="40" rx="6" fill={getBgColor(swdec)} />
        <text x="114" y={leftLabelY + 32} textAnchor="middle" fontSize={40} fontWeight="bold" fill={getColor(swdec)}>
          {swdec}
        </text>
      </g>

      {/* Center prong — DMG+ */}
      <g>
        <line x1="200" y1={centerArrowTop + 30} x2="200" y2="336" stroke="#d97706" strokeWidth="28" strokeLinecap="butt" />
        <polygon points={`200,${centerArrowTop} 180,${centerArrowTop + 35} 220,${centerArrowTop + 35}`} fill="#d97706" />
        <rect x="162" y={centerLabelY} width="80" height="40" rx="6" fill={getBgColor(dmg)} />
        <text x="200" y={centerLabelY + 32} textAnchor="middle" fontSize={40} fontWeight="bold" fill={getColor(dmg)}>
          {dmg}
        </text>
      </g>

      {/* Right prong — CON+ */}
      <g>
        <line x1="280" y1={rightArrowTop + 30} x2="280" y2="336" stroke="#d97706" strokeWidth="28" strokeLinecap="butt" />
        <polygon points={`280,${rightArrowTop} 260,${rightArrowTop + 35} 300,${rightArrowTop + 35}`} fill="#d97706" />
        <rect x="250" y={rightLabelY} width="80" height="40" rx="6" fill={getBgColor(con)} />
        <text x="286" y={rightLabelY + 32} textAnchor="middle" fontSize={40} fontWeight="bold" fill={getColor(con)}>
          {con}
        </text>
      </g>


      {/* Rotated labels on prongs */}
      <g>
        <text x="136" y="312" textAnchor="middle" fontSize={22} fontWeight="bold" fill="#ffffff" transform="rotate(-90, 128, 312)">swDEC+</text>
        <text x="208" y="326" textAnchor="middle" fontSize={22} fontWeight="bold" fill="#ffffff" transform="rotate(-90, 208, 326)">DMG+</text>
        <text x="290" y="316" textAnchor="middle" fontSize={22} fontWeight="bold" fill="#ffffff" transform="rotate(-90, 288, 316)">CON+</text>
      </g>
    </svg>
  );
}