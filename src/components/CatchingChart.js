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
  sdBlocking = 1.0
}) {
  const width = 500;
  const height = 300;
  const margin = { top: 20, right: 120, bottom: 40, left: 100 };
  
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  
  const minX = -25;
  const maxX = 25;

  const xScale = (value) =>
    margin.left + ((value - minX) / (maxX - minX)) * chartWidth;
  
  const categories = [
    { label: 'Overall', value: overall, sd: sdOverall, y: 0 },
    { label: 'Framing', value: framing, sd: sdFraming, y: 1 },
    { label: 'SB', value: sb, sd: sdSB, y: 2 },
    { label: 'Blocking', value: blocking, sd: sdBlocking, y: 3 }
  ];
  
  const rowHeight = chartHeight / categories.length;
  const yScale = (index) => margin.top + index * rowHeight + rowHeight / 2;
  
  const ticks = [-20, -10, 0, 10, 20];

  return (
    <div className="w-full flex justify-center p-8">
      <svg width={width} height={height} className="border border-gray-300 bg-white">
        
        {/* Vertical center line */}
        <line
          x1={xScale(0)}
          y1={margin.top}
          x2={xScale(0)}
          y2={height - margin.bottom}
          stroke="#999"
        />

        {categories.map((cat, i) => {
          const z = cat.value / cat.sd;
          const pct = Math.round(normalCDF(z) * 100);
          const isLowPercentile = pct < 30;

          return (
            <g key={i}>
              {i % 2 === 0 && i !== 2 && (
                <rect
                  x={margin.left}
                  y={margin.top + i * rowHeight}
                  width={chartWidth}
                  height={rowHeight}
                  fill="#e0f2f7"
                  opacity="0.5"
                />
              )}

            <text
                x={margin.left - 6}
                y={yScale(i)}
                textAnchor="end"
                dominantBaseline="middle"
                fill="#374151"
                fontWeight="600"
                fontSize={24}  // <-- adjust this number
                >
                {cat.label}
             </text>

              {/* Dot */}
              <circle
                cx={xScale(cat.value)}
                cy={yScale(i)}
                r="14"
                fill="#1e3a5f"
              />

              {/* Background rect for low percentile */}
              {isLowPercentile && (
                <rect
                  x={width - margin.right + 20 - 77}
                  y={yScale(i) - 15}
                  width="85"
                  height="30"
                  fill="#ffcccb"
                  rx="5"
                  ry="5"
                />
              )}

              {/* Percentile label on right side */}
              <text
                x={width - margin.right + 20}
                y={yScale(i)}
                textAnchor="end"
                dominantBaseline="middle"
                fill="gray"
                fontSize={21}
              >
                {getOrdinalSuffix(pct)} pctl
              </text>

            </g>
          );
        })}

        {/* Axes */}
        <line
          x1={margin.left}
          y1={height - margin.bottom}
          x2={width - margin.right}
          y2={height - margin.bottom}
          stroke="black"
          strokeWidth="2"
        />
        
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={height - margin.bottom}
          stroke="black"
          strokeWidth="2"
        />

        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={xScale(tick)}
              y1={height - margin.bottom}
              x2={xScale(tick)}
              y2={height - margin.bottom + 6}
              stroke="black"
              strokeWidth="2"
            />
            <text
              x={xScale(tick)}
              y={height - margin.bottom + 20}
              textAnchor="middle"
              className="text-sm fill-gray-700"
            >
              {tick}
            </text>
          </g>
        ))}

        <text
          x={margin.left + chartWidth / 2}
          y={height - 5}
          textAnchor="middle"
          className="text-base font-semibold fill-gray-700"
        >
          Runs
        </text>
      </svg>
    </div>
  );
}