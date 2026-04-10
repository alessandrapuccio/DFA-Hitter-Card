import React, { useMemo } from 'react';

// ─── constants matching HitterCard design system ───────────────────────────
const HEADER_BG  = '#1e3a5f';
const AXIS_COLOR = '#94a3b8';
const GRID_COLOR = '#e2e8f0';
const LINE_COLOR = '#1e3a5f';

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─── month tick positions from actual date range in data ──────────────────
function buildMonthTicks(data) {
  const ticks = [];
  let lastMonth = null;
  data.forEach((pa, i) => {
    const month = parseInt(pa.gamedate.split('-')[1], 10) - 1;
    if (month !== lastMonth) {
      ticks.push({ index: i, label: MONTH_LABELS[month] });
      lastMonth = month;
    }
  });
  return ticks;
}

// ─── SVG chart ────────────────────────────────────────────────────────────
function Chart({ data, height = 240 }) {
  const firstValidIdx = useMemo(() => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].tmrv_roll != null) return i;
    }
    return 0;
  }, [data]);

  const lastValidIdx = useMemo(() => {
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].tmrv_roll != null) return i;
    }
    return 0;
  }, [data]);

  const trimmedData = useMemo(
    () => data.slice(firstValidIdx, lastValidIdx + 1),
    [data, firstValidIdx, lastValidIdx]
  );

  const monthTicks  = useMemo(() => buildMonthTicks(trimmedData), [trimmedData]);

  const PAD  = { top: 12, right: 4, bottom: 34, left: 25 };
  const svgW = 300;
  const svgH = height;
  const cW   = svgW - PAD.left - PAD.right;
  const cH   = svgH - PAD.top  - PAD.bottom;
  const n    = trimmedData.length;

  const validVals = data.map(d => d.tmrv_roll).filter(v => v != null);
  const yMin  = Math.min(...validVals);
  const yMax  = Math.max(...validVals);
  const yPad  = Math.max((yMax - yMin) * 0.12, 5);

  const seasonAvg = data[0]?.season_avg ?? (
    validVals.length > 0
      ? Math.round(validVals.reduce((s, v) => s + v, 0) / validVals.length)
      : null
  );

  const domLo = Math.min(yMin - yPad, seasonAvg != null ? seasonAvg - yPad * 0.5 : Infinity);
  const domHi = Math.max(yMax + yPad, seasonAvg != null ? seasonAvg + yPad * 0.5 : -Infinity);

  function xOf(i) { return PAD.left + (i / Math.max(n - 1, 1)) * cW; }
  function yOf(v) { return PAD.top  + (1 - (v - domLo) / (domHi - domLo)) * cH; }

  const yTicks = useMemo(() => {
    const range = domHi - domLo;
    const step  = range < 20 ? 5 : range < 50 ? 10 : range < 150 ? 25 : 50;
    const first = Math.ceil(domLo / step) * step;
    const ticks = [];
    for (let v = first; v <= domHi; v += step) ticks.push(v);
    return ticks;
  }, [domLo, domHi]);

  const segments = [];
  let current = [];
  trimmedData.forEach((d, i) => {
    if (d.tmrv_roll != null) {
      current.push(`${xOf(i).toFixed(1)},${yOf(d.tmrv_roll).toFixed(1)}`);
    } else {
      if (current.length > 1) segments.push(current.join(' '));
      current = [];
    }
  });
  if (current.length > 1) segments.push(current.join(' '));

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      width="100%"
      height={svgH}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {yTicks.map(v => (
        <line
          key={v}
          x1={PAD.left} x2={PAD.left + cW}
          y1={yOf(v)}   y2={yOf(v)}
          stroke={Math.round(v) === 100 ? '#94a3b8' : GRID_COLOR}
          strokeWidth={Math.round(v) === 100 ? 1.2 : 0.8}
          strokeDasharray={Math.round(v) === 100 ? '4 3' : undefined}
        />
      ))}

      {domLo < 0 && domHi > 0 && (
        <line
          x1={PAD.left} x2={PAD.left + cW}
          y1={yOf(0)}   y2={yOf(0)}
          stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3"
        />
      )}

      {monthTicks.map(({ index, label }) => {
        const x = xOf(index);
        return (
          <g key={`${label}-${index}`}>
            <line
              x1={x} x2={x}
              y1={PAD.top} y2={PAD.top + cH}
              stroke={GRID_COLOR} strokeWidth={0.8}
            />
            <text
              x={x} y={PAD.top + cH + 18}
              textAnchor="middle"
              fill="#64748b"
              fontSize={13}
              fontFamily="Arial, Helvetica, sans-serif"
              fontWeight={600}
            >
              {label}
            </text>
          </g>
        );
      })}

      <line x1={PAD.left} x2={PAD.left}      y1={PAD.top} y2={PAD.top + cH} stroke={AXIS_COLOR} strokeWidth={1.2} />
      <line x1={PAD.left} x2={PAD.left + cW} y1={PAD.top + cH} y2={PAD.top + cH} stroke={AXIS_COLOR} strokeWidth={1.2} />

      {yTicks.map(v => (
        <text
          key={v}
          x={PAD.left - 6} y={yOf(v) + 4}
          textAnchor="end"
          fill={Math.round(v) === 100 ? HEADER_BG : '#64748b'}
          fontSize={13}
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight={Math.round(v) === 100 ? 700 : 400}
        >
          {Math.round(v)}
        </text>
      ))}

      {seasonAvg != null && (() => {
        const avgColor = seasonAvg > 110 ? '#16a34a' : seasonAvg < 90 ? '#dc2626' : '#4b5563';
        return (
          <g>
            <line
              x1={PAD.left} x2={PAD.left + cW}
              y1={yOf(seasonAvg)} y2={yOf(seasonAvg)}
              stroke={avgColor} strokeWidth={1.2} strokeDasharray="5 3"
            />
            <text
              x={PAD.left + cW - 2} y={yOf(seasonAvg) - 4}
              textAnchor="end"
              fill={avgColor}
              fontSize={14}
              fontFamily="Arial, Helvetica, sans-serif"
              fontWeight={700}
            >
              {Math.round(seasonAvg)}
            </text>
          </g>
        );
      })()}

      {segments.map((pts, i) => (
        <polyline
          key={i}
          points={pts}
          fill="none"
          stroke={LINE_COLOR}
          strokeWidth={2.2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

// ─── main exported component ──────────────────────────────────────────────
export default function RollingAveragePlot({ data = [], height = 240 }) {

  // Handle columnar format from Shiny: { pa_number: [...], gamedate: [...], ... }
  // Convert to row array: [{ pa_number, gamedate, tmrv_roll, season_avg }, ...]
  const safeData = Array.isArray(data)
    ? data
    : data && data.pa_number
      ? data.pa_number.map((_, i) => ({
          pa_number:  data.pa_number[i],
          gamedate:   data.gamedate[i],
          tmrv_roll:  data.tmrv_roll[i] ?? null,
          season_avg: data.season_avg[i],
        }))
      : [];

  const validCount = safeData.filter(d => d.tmrv_roll != null).length;

  return (
    <div style={{ background: 'white', fontFamily: 'Arial, Helvetica, sans-serif' }}>

      <div style={{
        padding: '3px 5px 0',
        fontSize: 15,
        fontWeight: 600,
        fontStyle: 'italic',
        color: HEADER_BG,
        textAlign: 'right',
      }}>
        {safeData.length} PA
      </div>

      <div style={{ padding: '2px 0 0' }}>
        {safeData.length === 0 ? (
          <div style={{
            height,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#94a3b8', fontSize: 13,
          }}>
            No data available
          </div>
        ) : validCount === 0 ? (
          <div style={{
            height,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#94a3b8', fontSize: 13,
          }}>
            Not enough PAs to compute rolling average
          </div>
        ) : (
          <Chart data={safeData} height={height} />
        )}
      </div>

    </div>
  );
}