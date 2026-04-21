import React, { useMemo } from 'react';

// ─── constants matching HitterCard design system ───────────────────────────
const HEADER_BG  = '#1e3a5f';
const AXIS_COLOR = '#94a3b8';
const GRID_COLOR = '#e2e8f0';
const LINE_COLOR = '#1e3a5f';

// ─── color thresholds for rolling average line ────────────────────────────
const COLOR_RED     = '#ef4444'; // tmrv_roll < 80
const COLOR_NEUTRAL = '#80868e'; // tmrv_roll 80–120  (matches design system)
const COLOR_GREEN   = '#16a34a'; // tmrv_roll > 120

function tmrvColor(value) {
  if (value == null) return COLOR_NEUTRAL;
  if (value < 80)    return COLOR_RED;
  if (value > 120)   return COLOR_GREEN;
  return COLOR_NEUTRAL;
}

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

// ─── resolve x positions for month labels, nudging right on overlap ───────
// approxCharWidth * label.length gives an estimate of rendered text width.
function resolveMonthLabelPositions(monthTicks, xOf, approxCharWidth = 6.5) {
  const resolved = [];
  for (const tick of monthTicks) {
    const idealX = xOf(tick.index);
    const halfW  = (tick.label.length * approxCharWidth) / 2;
    let   x      = idealX; // center by default (textAnchor="middle")

    if (resolved.length > 0) {
      const prev     = resolved[resolved.length - 1];
      const prevRight = prev.x + (prev.label.length * approxCharWidth) / 2 + 2; // 2px gap
      const myLeft   = x - halfW;
      if (myLeft < prevRight) {
        // push right so left edge sits 2px past prev right edge
        x = prevRight + halfW;
      }
    }
    resolved.push({ ...tick, x });
  }
  return resolved;
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

  const PAD  = { top: 22, right: 7, bottom: 24, left: 25 };
  const svgW = 300;
  const svgH = height;
  const cW   = svgW - PAD.left - PAD.right;
  const cH   = svgH - PAD.top  - PAD.bottom;
  const n    = trimmedData.length;

 const seasonAvg = data.find(d => d.season_avg != null)?.season_avg ?? 100;

  const validVals = data.map(d => d.tmrv_roll).filter(v => v != null);
  const dataMin = validVals.length ? Math.min(...validVals) : seasonAvg;
  const dataMax = validVals.length ? Math.max(...validVals) : seasonAvg;

  const domLo = Math.min(seasonAvg - 60, dataMin);
  const domHi = Math.max(seasonAvg + 60, dataMax);

  function xOf(i) { return PAD.left + (i / Math.max(n - 1, 1)) * cW; }
  function yOf(v) { return PAD.top  + (1 - (v - domLo) / (domHi - domLo)) * cH; }

  const yTicks = useMemo(() => {
    const step  = 25;
    const first = Math.ceil(domLo / step) * step;
    const ticks = [];
    for (let v = first; v <= domHi; v += step) ticks.push(v);
    return ticks;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seasonAvg]);

  // ─── build colored two-point segments ──────────────────────────────────
  // Each segment connects point[i] → point[i+1], colored by the average of
  // the two endpoint values so color transitions feel natural.
  const segments = useMemo(() => {
    const segs = [];
    for (let i = 0; i < trimmedData.length - 1; i++) {
      const a = trimmedData[i];
      const b = trimmedData[i + 1];
      if (a.tmrv_roll == null || b.tmrv_roll == null) continue;
      const midVal = (a.tmrv_roll + b.tmrv_roll) / 2;
      segs.push({
        x1: xOf(i),           y1: yOf(a.tmrv_roll),
        x2: xOf(i + 1),       y2: yOf(b.tmrv_roll),
        color: tmrvColor(midVal),
      });
    }
    return segs;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmedData, n, PAD.left, cW, domLo, domHi]);

  // ─── year analysis ───────────────────────────────────────────────────────
  const yearSwitchInfo = useMemo(() => {
    const firstYear = trimmedData.length > 0
      ? parseInt(trimmedData[0].gamedate.split('-')[0], 10)
      : null;
    const lastYear = trimmedData.length > 0
      ? parseInt(trimmedData[trimmedData.length - 1].gamedate.split('-')[0], 10)
      : null;

    const spansYears = firstYear !== null && lastYear !== null && firstYear !== lastYear;

    let switchIdx = null;
    if (spansYears) {
      for (let i = 1; i < trimmedData.length; i++) {
        const prevYear = parseInt(trimmedData[i - 1].gamedate.split('-')[0], 10);
        const currYear = parseInt(trimmedData[i].gamedate.split('-')[0], 10);
        if (prevYear === 2025 && currYear === 2026) {
          switchIdx = (i - 1 + i) / 2;
          break;
        }
      }
    }

    return { firstYear, lastYear, spansYears, switchIdx };
  }, [trimmedData]);

  const { firstYear, lastYear, spansYears, switchIdx } = yearSwitchInfo;

  const yearLabelY = PAD.top + cH + 30;

  // Resolve month label x positions with collision avoidance
  const resolvedMonthTicks = useMemo(
    () => resolveMonthLabelPositions(monthTicks, xOf),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [monthTicks, n, PAD.left, cW]
  );

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

      {/* Month grid lines (always at ideal position) */}
      {monthTicks.map(({ index, label }) => (
        <line
          key={`vline-${label}-${index}`}
          x1={xOf(index)} x2={xOf(index)}
          y1={PAD.top} y2={PAD.top + cH}
          stroke={GRID_COLOR} strokeWidth={0.8}
        />
      ))}

      {/* Month labels (collision-resolved x positions) */}
      {resolvedMonthTicks.map(({ index, label, x }) => (
        <text
          key={`mlabel-${label}-${index}`}
          x={x} y={PAD.top + cH + 13}
          textAnchor="middle"
          fill="#64748b"
          fontSize={11}
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight={600}
        >
          {label}
        </text>
      ))}

      {/* Year switch vertical line (2025 → 2026) + "2026" label centered above it */}
      {switchIdx !== null && (() => {
        const x = xOf(switchIdx);
        return (
          <g>
            <line
              x1={x} x2={x}
              y1={PAD.top} y2={PAD.top + cH}
              stroke={HEADER_BG}
              strokeWidth={1.5}
              strokeDasharray="5 3"
              opacity={0.75}
            />
            <text
              x={x}
              y={PAD.top - 4}
              textAnchor="middle"
              fill={HEADER_BG}
              fontSize={11}
              fontFamily="Arial, Helvetica, sans-serif"
              fontWeight={700}
              opacity={0.85}
            >
              2026
            </text>
          </g>
        );
      })()}

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

      {/* Year labels */}
      {spansYears ? (
        <>
          <text
            x={PAD.left + 2}
            y={yearLabelY+4}
            textAnchor="start"
            fill="#475569"
            fontSize={15}
            fontFamily="Arial, Helvetica, sans-serif"
            fontWeight={700}
          >
            {firstYear}
          </text>
          <text
            x={PAD.left + cW - 2}
            y={yearLabelY+5}
            textAnchor="end"
            fill="#475569"
            fontSize={15}
            fontFamily="Arial, Helvetica, sans-serif"
            fontWeight={700}
          >
            {lastYear}
          </text>
        </>
      ) : firstYear != null ? (
        <text
          x={PAD.left + cW / 2}
          y={yearLabelY+5}
          textAnchor="middle"
          fill="#475569"
          fontSize={15}
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight={700}
        >
          {firstYear}
        </text>
      ) : null}

      {segments.map((seg, i) => (
        <line
          key={i}
          x1={seg.x1.toFixed(1)} y1={seg.y1.toFixed(1)}
          x2={seg.x2.toFixed(1)} y2={seg.y2.toFixed(1)}
          stroke={seg.color}
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
        padding: '2px 10px 0 0',
        fontSize: 15,
        fontWeight: 600,
        fontStyle: 'italic',
        color: HEADER_BG,
        textAlign: 'right',
      }}>
        {safeData.length} PA
      </div>

      <div style={{ padding: '0' }}>
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