import React from 'react';

// Compact card-ready component — no full-page wrapper.
export default function WRCPlusChart({ vR, vL, barContainerHeight = 130 }) {
  const getBarColor = (value) => {
    if (value >= 110) return '#22c55e';
    if (value <= 90)  return '#ef4444';
    return '#6b7280';
  };

  // Scale bar fill: treat 170 as "full height"
  const getBarHeightPct = (value) =>
    Math.min(Math.max((value / 170) * 100, 0), 85);

  const BarColumn = ({ value, label }) => {
    const heightPct = getBarHeightPct(value);
    const color     = getBarColor(value);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
        <div
          style={{
            position: 'relative',
            width: 44,
            height: barContainerHeight,
            background: '#e5e7eb',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: `${heightPct}%`,
              backgroundColor: color,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'height 0.5s',
            }}
          >
            <span style={{ color: 'white', fontWeight: 700, fontSize: 15, marginTop: 4 }}>
              {value}
            </span>
            <div style={{ flex: 1 }} />
            <span style={{ color: 'white', fontWeight: 600, fontSize: 11, marginBottom: 3 }}>
              {label}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // 100 reference line: 100/170 of the bar container height from the bottom
  const lineFromBottom = (100 / 170) * barContainerHeight;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 8,
        position: 'relative',
        padding: '8px 16px',
      }}
    >
      <BarColumn value={vL} label="vL" />
      <BarColumn value={vR} label="vR" />

      {/* Baseline — sits at the bottom of the bars */}
      <div
        style={{
          position: 'absolute',
          bottom: 1,
          left: 8,
          right: 8,
          height: 3,
          background: '#374151',
          pointerEvents: 'none',
        }}
      />

      {/* 100 reference line */}
      <div
        style={{
          position: 'absolute',
          bottom: `calc(8px + ${lineFromBottom}px)`,
          left: 8,
          right: 8,
          borderTop: '2px dashed #9ca3af',
          pointerEvents: 'none',
        }}
      >
        {/* "100" label — larger and pushed left of the bars */}
        <span
          style={{
            position: 'absolute',
            right: 'calc(100%px)',
            top: -13,
            fontSize: 15,
            color: '#6b7280',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          100
        </span>
      </div>
    </div>
  );
}
