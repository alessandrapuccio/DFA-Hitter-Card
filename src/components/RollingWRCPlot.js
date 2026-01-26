import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Label, ResponsiveContainer } from 'recharts';
import tmwrcData from '../data/noda_tmwrc_2024.json';


function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}


function getPlayerWRCRolling(playerName, windowSize = 100) {
  const rows = tmwrcData
    .filter(r => r.batter_name === playerName);

  // sort chronologically and by PA order within game
  rows.sort((a, b) => {
    if (a.gamedate < b.gamedate) return -1;
    if (a.gamedate > b.gamedate) return 1;
    if (a.Inning !== b.Inning) return a.Inning - b.Inning;
    return a.PAofInning - b.PAofInning;
  });

  const rollingPoints = [];
  const window = [];
  let windowSum = 0;

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const value = r.tmrv_plus;

    // add current PA to window
    window.push(value);
    windowSum += value;

    // if window is bigger than 100, drop the oldest
    if (window.length > windowSize) {
      windowSum -= window[0];
      window.shift();
    }

    // only record rolling avg once we have a full 100 PAs
    if (window.length === windowSize) {
      const rollingAvg = windowSum / windowSize;
      
      // Get the date range of the current window
      const windowStartDate = rows[i - windowSize + 1].gamedate;
      const windowEndDate = r.gamedate;
      
      // Log every 10th PA or first/last few to avoid console spam
      const shouldLog = i < 102 || i % 10 === 0 || i >= rows.length - 3;
      if (shouldLog) {
        console.log(`PA #${i + 1} on ${windowEndDate}: Rolling 100-PA Average = ${rollingAvg.toFixed(2)} | Window: ${windowStartDate} to ${windowEndDate}`);
      }
      
      rollingPoints.push({
        gamedate: r.gamedate,   // date of this PA
        rollingWrcPlus: rollingAvg
      });
    }
  }

  // restrict to the target date range
  const startCutoff = '2025-03-18';
  const endCutoff   = '2025-09-30';

  const inRange = rollingPoints.filter(p =>
    p.gamedate >= startCutoff && p.gamedate <= endCutoff
  );

  const startDate = inRange.length ? inRange[0].gamedate : null;
  const endDate   = inRange.length ? inRange[inRange.length - 1].gamedate : null;

  console.log(`\n=== ${playerName} Rolling WRC+ Summary ===`);
  console.log(`Total PAs processed: ${rows.length}`);
  console.log(`Total rolling points calculated: ${rollingPoints.length}`);
  console.log(`Points in 2025 season range (${startCutoff} to ${endCutoff}): ${inRange.length}`);
  console.log(`First 2025 season point: ${startDate}`);
  console.log(`Last 2025 season point: ${endDate}`);
  console.log(`=====================================\n`);

  return { rollingSeries: inRange, startDate, endDate };
}

export default function RollingTMWRCPlot({ playerName = 'Noda, Ryan', average = 100 }) {
  const { rollingSeries, startDate, endDate } = getPlayerWRCRolling(playerName, 100);

  if (!rollingSeries.length) {
    return <div>No data for {playerName}</div>;
  }

  // chartData: one point per PA (date) with a 100-PA rolling average
  const chartData = rollingSeries.map((p, index) => ({
    index: index + 1,              
    date: p.gamedate,
    rollingWrcPlus: p.rollingWrcPlus
  }));

  const values = rollingSeries.map(p => p.rollingWrcPlus);

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  const rollingMin = Math.min(...values);
  const rollingMax = Math.max(...values);

  const maxDistance = Math.max(
    Math.abs(rollingMax - mean),
    Math.abs(mean - rollingMin)
  );

  const rangeFromCenter = Math.ceil(maxDistance / 10) * 10;
  const yMin = Math.round(mean - rangeFromCenter);
  const yMax = Math.round(mean + rangeFromCenter);

  const playerAvgColor = mean > 110 ? '#22c55e' : mean < 90 ? '#ef4444' : '#3a52a7ff';

  const isPlayerAboveLeague = mean > average;
  const greyLabelPosition = isPlayerAboveLeague ? 'insideTopRight' : 'insideBottomRight';

  const formattedStart = formatDate(startDate);
  const formattedEnd   = formatDate(endDate);

  const xLabelText =
    formattedStart && formattedEnd
      ? `${formattedStart} - ${formattedEnd}`
      : 'Rolling TM wRC+';

  return (
    <div className="w-full h-96 p-6 bg-white">
      <h2 className="text-2xl font-bold text-center mb-4">
        100 PAs Rolling TM wRC+
      </h2>

      <ResponsiveContainer width="90%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 170, left: 90, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

          <XAxis
            dataKey="index" // or "date" if you switch to a date axis
            label={{
              value: xLabelText,
              position: 'insideBottom',
              offset: -10,
              fontSize: 38,
              fontWeight: 'bold',
              fill: '#000080'
            }}
            tick={false}
            tickLine={false}
            axisLine={{ strokeWidth: 6 }}
          />

          <YAxis
            domain={[yMin, yMax]}
            label={{
              value: 'TM wRC+',
              angle: -90,
              position: 'insideLeft',
              fontSize: 36,
              fontWeight: 'bold',
              fill: '#000080',
              dy: 70,
              dx: -38
            }}
            ticks={[yMin, Math.round(mean), yMax]}
            tick={{ fontSize: 36 }}
            axisLine={{ strokeWidth: 6 }}
          />

          <ReferenceLine
            y={average}
            stroke="#bbb"
            strokeDasharray="8 5"
            strokeWidth={4}
          >
            <Label value="100" position={greyLabelPosition} fill="#A3A3A3" fontSize={28} fontWeight="bold" offset={10} />
          </ReferenceLine>


          <ReferenceLine
            y={mean}
            stroke={playerAvgColor}
            strokeDasharray="8 3"
            strokeWidth={4}
          >
            {/* First line */}
            <Label
                value="PLAYER"
                position="right"
                fill={playerAvgColor}
                fontSize={24}
                fontWeight="bold"
                dy={-10} // adjust up
          />
            {/* Second line */}
            <Label
                value="AVG"
                position="right"
                fill={playerAvgColor}
                fontSize={24}
                fontWeight="bold"
                dy={12} // adjust down relative to the first
            />
          </ReferenceLine>


          <Line
            type="monotone" dataKey="rollingWrcPlus" stroke="#6366f1" strokeWidth={3} dot={false} isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
