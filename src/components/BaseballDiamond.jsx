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
const getDefColor = (def) => {
  const AVG = 0;
  const SD  = 5;
  const z   = (def - AVG) / SD;
  const clamped = Math.max(-3, Math.min(3, z));
  if (clamped >= 0) {
    return lerpColor('#ffffff', '#16a34a', clamped / 3);
  } else {
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
    'LF': { cx: 8, cy: -8 },
    'CF': { cx: 55, cy: -25 },
    'RF': { cx: 102, cy: -8 },
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
    <svg width={width} height={height} viewBox="-35 -45 180 160" style={{ flexShrink: 0, marginLeft: '8px', marginTop: '10px' }}>
      <defs>
        {/* Clip to the field "cone": foul lines + outfield arc */}
        <clipPath id="fieldCone">
          <path d="M 45 89 L -27 15 Q 55 -80 137 15 L 65 89 A 15 15 0 0 1 45 89 Z" />
        <clipPath id="baselineClip">
          <path d="M 45 89 L -27 15 Q 55 -80 137 15 L 65 89 A 15 15 0 0 1 45 89 Z" />
        </clipPath>
        </clipPath>
      </defs>

      {/* Green grass — clipped to field cone shape */}
      <rect x="-50" y="-90" width="210" height="220" fill="#6d826a" clipPath="url(#fieldCone)" />

      {/* Brown infield dirt — arc to foul line points, closed down to home */}
      <path
        d="M 18 48 Q 55 -12 92 48 L 55 89 Z"
        fill="#a38a4b"
        stroke="none"
      />

      {/* Home plate grass circle — full green circle blending into field */}
      <circle cx="55" cy="89" r="15" fill="#6d826a" stroke="none" />

      {/* Infield diamond grass on top of dirt */}
      <polygon points="55,33 82,61 55,89 28,61" fill="#6d826a" />

      {/* Baseline extensions: 3B and 1B straight to outfield edge (clipped) */}
      <line x1="28" y1="61" x2="-80" y2="-51" stroke="#94a3b8" strokeWidth="1.5" clipPath="url(#baselineClip)" />
      <line x1="82" y1="61" x2="190" y2="-51" stroke="#94a3b8" strokeWidth="1.5" clipPath="url(#baselineClip)" />

      {/* Outfield arc — raised control point for more outfield space */}
      <path d="M -27 15 Q 55 -80 137 15" fill="none" stroke="#e8dcc8" strokeWidth="1.5" />


      {/* Infield diamond outline */}
      <polygon points="55,33 82,61 55,89 28,61" fill="none" stroke="#94a3b8" strokeWidth="1.5" />

      {/* Bases — rotated 45deg (diamond orientation) using polygons */}
      {/* 2B at 55,33 */}
      <polygon points="55,30 58,33 55,36 52,33" fill="#f8fafc" />
      {/* 1B at 82,61 */}
      <polygon points="82,58 85,61 82,64 79,61" fill="#f8fafc" />
      {/* 3B at 28,61 */}
      <polygon points="28,58 31,61 28,64 25,61" fill="#f8fafc" />

      {/* Home plate */}
      <polygon points="55,86 58,89 55,92 52,89" fill="#f8fafc" />

      {/* Pitcher's mound */}
      <circle cx="55" cy="61" r="4" fill="#a38a4b" stroke="#c49a6c" strokeWidth="0.8" />

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