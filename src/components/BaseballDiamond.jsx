import React from 'react';
import { HEADER_BG } from './constants';

// Standard normal CDF (Abramowitz & Stegun approximation)
const normalCDF = (z) => {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  let prob =
    d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) prob = 1 - prob;
  return prob;
};

// Interpolate between two hex colors by t in [0,1]
const lerpColor = (hex1, hex2, t) => {
  const parse = (h) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(hex1);
  const [r2, g2, b2] = parse(hex2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
};

// DEF projection color: avg=0, sd=5
// Red (#dc2626) at -3 SD … neutral (#94a3b8) at 0 … Green (#16a34a) at +3 SD
const getDefColor = (def) => {
  const AVG = 0;
  const SD  = 5;
  const z   = (def - AVG) / SD;
  const clamped = Math.max(-3, Math.min(3, z));
  if (clamped >= 0) {
    // neutral → green
    return lerpColor('#ffffff', '#16a34a', clamped / 3);
  } else {
    // red → neutral
    return lerpColor('#dc2626', '#ffffff', (clamped + 3) / 3);
  }
};

export default function BaseballDiamond({ positions, projectedDef = [], width = 100, height = 115 }) {
  const posMap        = Object.fromEntries(positions.map(p => [p.pos, p]));
  const projectedMap  = Object.fromEntries(projectedDef.map(p => [p.pos, p.def]));

  const fieldDots = {
    '1B': { cx: 82, cy: 44 },
    '2B': { cx: 65, cy: 30 },
    'SS': { cx: 45, cy: 30 },
    '3B': { cx: 28, cy: 45 },
    'LF': { cx: 20, cy: 12 },
    'CF': { cx: 55, cy: -5 },
    'RF': { cx: 90, cy: 12 },
    'P':  { cx: 55, cy: 48 },
    'C':  { cx: 55, cy: 78 },
    'DH': { cx: 55, cy: 96 },
  };

  const activePosData = positions.filter(p => fieldDots[p.pos]);
  const getOpps       = (p) => p.opps ?? p.gc ?? 0;
  const totalOpps     = activePosData.reduce((sum, p) => sum + getOpps(p), 0);
  const minDotR = 4;
  const maxDotR = 9;

  const getDotR = (opps) => {
    if (activePosData.length <= 1 || totalOpps === 0) return minDotR + 3;
    const share = opps / totalOpps;
    return minDotR + share * (maxDotR - minDotR);
  };

  return (
    <svg width={width} height={height} viewBox="0 -7 110 110" style={{ flexShrink: 0, marginLeft: '8px', marginTop: '10px' }}>

      {/* Foul lines */}
      <line x1="55" y1="89" x2="-5"  y2="22" stroke="#cbd5e1" strokeWidth="1" />
      <line x1="55" y1="89" x2="115" y2="22" stroke="#cbd5e1" strokeWidth="1" />

      {/* Outfield arc */}
      <path d="M 0 17 Q 55 -40 110 17" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />

      {/* Infield diamond */}
      <polygon points="55,33 82,61 55,89 28,61" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />

      {/* Bases */}
      <rect x="52" y="30" width="6" height="6" fill="#94a3b8" />
      <rect x="79" y="58" width="6" height="6" fill="#94a3b8" />
      <rect x="25" y="58" width="6" height="6" fill="#94a3b8" />

      {/* Home plate */}
      <circle cx="55" cy="89" r="3" fill="#94a3b8" />

      {/* Player dots */}
      {Object.entries(fieldDots).map(([pos, { cx, cy }]) => {
        const posData = posMap[pos];
        if (!posData) return null;

        const opps      = getOpps(posData);
        const r         = getDotR(opps);
        const defVal    = projectedMap[pos];
        const fill      = defVal !== undefined ? getDefColor(defVal) : '#374151';

        return (
          <circle
            key={pos}
            cx={cx}
            cy={cy + 15}
            r={r}
            fill={fill}
            stroke="#1e3a5f"
            strokeWidth="1.5"
          />
        );
      })}

    </svg>
  );
}