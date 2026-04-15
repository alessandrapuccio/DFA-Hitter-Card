import React from 'react';

export default function BaseballDiamond({ positions, width = 100, height = 115 }) {
  const posMap = Object.fromEntries(positions.map(p => [p.pos, p]));
  const fieldDots = {
    // Infield
    '1B': { cx: 82, cy: 44 },
    '2B': { cx: 65, cy: 30 },
    'SS': { cx: 45, cy: 30 },
    '3B': { cx: 28, cy: 45 },
    // Outfield
    'LF': { cx: 20, cy: 12 },
    'CF': { cx: 55, cy: -5 },
    'RF': { cx: 90, cy: 12 },
    // Pitcher, Catcher, DH
    'P':  { cx: 55, cy: 48 },
    'C':  { cx: 55, cy: 78 },
    'DH': { cx: 55, cy: 96 },
  };

  // Dot sizing: consistent base size for all minimums, scale by share of total opps
  const activePosData = positions.filter(p => fieldDots[p.pos]);
  // gc is used for catcher rows, opps for field rows — normalise to a single key
  const getOpps = (p) => p.opps ?? p.gc ?? 0;
  const totalOpps = activePosData.reduce((sum, p) => sum + getOpps(p), 0);
  const minDotR = 4;
  const maxDotR = 9;

  const getDotR = (opps) => {
    if (activePosData.length <= 1 || totalOpps === 0) return minDotR + 3;
    const share = opps / totalOpps;
    return minDotR + (share * (maxDotR - minDotR));
  };

  const getDotColor = (runs_saved) => {
    if (runs_saved > 3)  return '#16a34a';
    if (runs_saved < -3) return '#dc2626';
    return '#374151';
  };

  return (
    <svg width={width} height={height} viewBox="0 -7 110 110" style={{ flexShrink: 0, marginLeft: '8px', marginTop: '10px' }}>

      {/* wider foul lines from home plate */}
      <line x1="55" y1="89" x2="-5" y2="22" stroke="#cbd5e1" strokeWidth="1" />
      <line x1="55" y1="89" x2="115" y2="22" stroke="#cbd5e1" strokeWidth="1" />

      {/* outfield arc stays the same */}
      <path d="M 0 22 Q 55 -35 110 22" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />

      {/* infield diamond */}
      <polygon points="55,33 82,61 55,89 28,61" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />

      {/* bases */}
      <rect x="52" y="30" width="6" height="6" fill="#94a3b8" />
      <rect x="79" y="58" width="6" height="6" fill="#94a3b8" />
      <rect x="25" y="58" width="6" height="6" fill="#94a3b8" />

      {/* home plate */}
      <circle cx="55" cy="89" r="3" fill="#94a3b8" />

      {/* player dots */}
      {Object.entries(fieldDots).map(([pos, { cx, cy }]) => {
        const posData = posMap[pos];
        if (!posData) return null;
        const opps = getOpps(posData);
        const r = getDotR(opps);
        const fill = getDotColor(posData.runs_saved);
        return <circle key={pos} cx={cx} cy={cy + 15} r={r} fill={fill} stroke="white" strokeWidth="1.5" />;
      })}

    </svg>
  );
}