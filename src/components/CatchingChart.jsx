import React from 'react';

// Standard normal CDF (Abramowitz & Stegun approximation)
const normalCDF = (z) => {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  let prob =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 +
      t * (1.781478 +
      t * (-1.821256 +
      t * 1.330274))));
  if (z > 0) prob = 1 - prob;
  return prob;
};

const getOrdinalSuffix = (num) => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return num + "st";
  if (j === 2 && k !== 12) return num + "nd";
  if (j === 3 && k !== 13) return num + "rd";
  return num + "th";
};

export default function CatchingChart({ 
  overall = -10.8, 
  framing = -12.8, 
  sb = 1.7, 
  blocking = 0.3,
  sdOverall = 4.6,
  sdFraming = 3.7,
  sdSB = 2.0,
  sdBlocking = 1.0,
  width = 210,
  height = 155,
}) {
  const margin = { top: 15, right: 20, bottom: 26, left: 38 };
  
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  
  const minX = -25;
  const maxX = 25;

  const xScale = (value) =>
    margin.left + ((value - minX) / (maxX - minX)) * chartWidth;
  
  const categories = [
    { label: 'Overall', value: overall, sd: sdOverall },
    { label: 'Framing', value: framing, sd: sdFraming },
    { label: 'SB',      value: sb,      sd: sdSB },
    { label: 'Blocking',value: blocking, sd: sdBlocking },
  ];
  
  const rowHeight = chartHeight / categories.length;
  const yScale = (index) => margin.top + index * rowHeight + rowHeight / 2;
  
  const ticks = [-20, -10, 0, 10, 20];

  return (
    <svg width={width} height={height}>

      {/* Vertical center line */}
      <line
        x1={xScale(0)} y1={margin.top}
        x2={xScale(0)} y2={height - margin.bottom}
        stroke="#999" strokeWidth="1"
      />

      {categories.map((cat, i) => {
        const z = cat.value / cat.sd;
        const pct = Math.round(normalCDF(z) * 100);
        const isLow  = pct <= 20;
        const isHigh = pct >= 80;
        const fillColor = isHigh ? '#81C784' : isLow ? '#FF8488' : '#1e3a5f';

        return (
          <g key={i}>
            {i % 2 === 0 && (
              <rect
                x={margin.left} y={margin.top + i * rowHeight}
                width={chartWidth} height={rowHeight}
                fill="#e0f2f7" opacity="0.5"
              />
            )}

            {/* Row label */}
            <text
              x={margin.left - 4} y={yScale(i)}
              textAnchor="end" dominantBaseline="middle"
              fill="#374151" fontWeight="600" fontSize={9}
            >
              {cat.label}
            </text>

            {/* Dot */}
            <circle cx={xScale(cat.value)} cy={yScale(i)} r="5" fill={fillColor} />

            {/* Percentile */}
            <text
              x={width - margin.right + 4} y={yScale(i)}
              textAnchor="start" dominantBaseline="middle"
              fill="gray" fontSize={8}
            >
              {getOrdinalSuffix(pct)}
            </text>
          </g>
        );
      })}

      {/* X axis */}
      <line
        x1={margin.left} y1={height - margin.bottom}
        x2={width - margin.right} y2={height - margin.bottom}
        stroke="black" strokeWidth="1"
      />

      {/* Y axis */}
      <line
        x1={margin.left} y1={margin.top}
        x2={margin.left} y2={height - margin.bottom}
        stroke="black" strokeWidth="1"
      />

      {ticks.map((tick) => (
        <g key={tick}>
          <line
            x1={xScale(tick)} y1={height - margin.bottom}
            x2={xScale(tick)} y2={height - margin.bottom + 3}
            stroke="black" strokeWidth="1"
          />
          <text
            x={xScale(tick)} y={height - margin.bottom + 10}
            textAnchor="middle" fill="#374151" fontSize={7}
          >
            {tick}
          </text>
        </g>
      ))}

      {/* X axis label */}
      <text
        x={margin.left + chartWidth / 2} y={height - 2}
        textAnchor="middle" fill="#374151" fontSize={8} fontWeight="600"
      >
        Runs
      </text>

    </svg>
  );
}