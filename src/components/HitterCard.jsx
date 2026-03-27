import React from 'react';
import ShortDeviationSlider from './ShortDeviationSlider';
import TrinityTrident from './TrinityTrident';
import WRCPlusChart from './WRCPlusChart';
import LevelTimeBar from './LevelTimeBar';
import ANCHOR from '../data/KRAKEN.png';
import MLV from '../data/MLV.png';
import PV from '../data/PV.svg';

import RollingAveragePlot from '../components/RollingAvgPlot';
import julioData from '../data/julio_tmwrc.json';
import joshData from '../data/josh_tmwrc.json';
const logos = import.meta.glob('../data/logos/*.png', { eager: true });

const logoMap = Object.fromEntries(
  Object.entries(logos).map(([path, module]) => {
    const fileName = path.split('/').pop().replace('.png', '');
    return [fileName, module.default];
  })
);

// ─── style helpers ────────────────────────────────────────────────────────────

function gradeBg(grade) {
  if (grade >= 60) return '#dcfce7';
  if (grade >= 55) return '#bbf7d0';
  if (grade >= 45) return '#f3f4f6';
  if (grade >= 40) return '#fee2e2';
  return '#fca5a5';
}

function gradeTextColor(grade) {
  if (grade >= 55) return '#16a34a';
  if (grade >= 45) return '#374151';
  return '#dc2626';
}

// ─── shared primitives ────────────────────────────────────────────────────────

const BORDER = '1.5px solid #94a3b8';
const HEADER_BG = '#1e3a5f';

function SectionHeader({ label, align = 'center' }) {
  return (
    <div style={{
      background: HEADER_BG,
      color: 'white',
      fontWeight: 700,
      fontStyle: 'italic',
      fontSize: 14,
      padding: '4px 8px',
      letterSpacing: '0.4px',
      textAlign: align,
    }}>
      {label}
    </div>
  );
}

// ─── sub-panels ───────────────────────────────────────────────────────────────
function formatSalary(value) {
  if (value == null) return '';

  const num = typeof value === 'string'
    ? parseFloat(value.replace(/,/g, ''))
    : value;

  const format = (n, suffix) => {
    const str = (n / suffix.div).toFixed(1);
    return `${str.endsWith('.0') ? str.slice(0, -2) : str}${suffix.label}`;
  };

  if (num >= 1_000_000) return `$${format(num, { div: 1_000_000, label: 'M' })}`;
  if (num >= 1_000)     return `$${format(num, { div: 1_000, label: 'K' })}`;
  return `$${num.toFixed(1).endsWith('.0') ? num.toFixed(0) : num.toFixed(1)}`;
}

function PlayerBioPanel({ player }) {
  return (
    <div style={{ background: 'white' }}>

      {/* Navy banner — logo contained on left, text on right */}
      <div style={{
        background: HEADER_BG,
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '10px 7px',
      }}>
        <img
          src={logoMap[player.ORG]}
          alt={player.ORG}
          style={{ width: 50, height: 70, marginLeft:5, objectFit: 'contain', flexShrink: 0 }}
        />
        <div>
          <div style={{ color: 'white', fontSize: 27, fontWeight: 800, fontStyle: 'italic', lineHeight: 1.1 }}>
            {player.name}
          </div>
          <div style={{ color: 'white', display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 5 }}>
            <span style={{ fontSize: 22, fontWeight: 800, fontStyle: 'italic' }}>{player.position}&nbsp;</span>
            <span style={{ fontSize: 17, fontWeight: 400, opacity: 0.88 }}>
              {player.bats}/{player.throws}&nbsp;&nbsp;Age: {player.age}&nbsp;&nbsp;MLS: {player.mls}
            </span>
          </div>
        </div>
      </div>

      {/* White section — centered, larger text */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '12px 14px',
      }}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 21, fontWeight: 600 }}>
          Opt:{' '}
          <span style={{
            background: player.option?.includes('Y') ? '#dcfce7' : '#fee2e2',
            color: player.option?.includes('Y') ? '#16a34a' : '#dc2626',
            padding: '3px 10px', borderRadius: 4, fontWeight: 800, fontSize: 21
          }}>
            {player.option}
          </span>
        </span>
        <span style={{ fontSize: 21, fontWeight: 600 }}>
          Out:{' '}
          <span style={{
            background: player.outrighted === 'Y' ? '#fee2e2' : '#dcfce7',
            color: player.outrighted === 'Y' ? '#dc2626' : '#16a34a',
            padding: '3px 10px', borderRadius: 4, fontWeight: 800, fontSize: 21
          }}>
            {player.outrighted}
          </span>
        </span>
      </div>

        <div style={{ height: 3, background: HEADER_BG, width: '85%', marginBottom: 10 }} />
        <div style={{ fontSize: 21, fontWeight: 500 }}>
          <strong>Salary: </strong>{formatSalary(player.salary)}
          &nbsp;&nbsp;
          <strong>P2: </strong>{formatSalary(player.p2)}
        </div>
      </div>
    </div>
  );
}


function AnchorTable({ player }) {
  const cellBorder = '1px solid #cbd5e1';
  const colStyle = { width: '33.33%' };
  return (
    <div style={{ borderTop: BORDER }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={colStyle} />
          <col style={colStyle} />
          <col style={colStyle} />
        </colgroup>

      <thead>
        <tr>
          {[
            { key: 'ANCHOR', src: ANCHOR, height: 51, isLarge: true },
            { key: 'MLV', src: MLV, height: 26 },
            { key: 'PV', src: PV, height: 28 },
          ].map(({ key, src, height, isLarge }) => (
            <th key={key} style={{
              background: HEADER_BG,
              padding: '6px 8px', textAlign: 'center',
              border: cellBorder,
              position: 'relative',
            }}>
              {isLarge ? (
                <div style={{ position: 'relative', height: 20 }}>
                  <img src={src} alt={key} style={{
                    height,
                    objectFit: 'contain',
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }} />
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 20 }}>
                  <img src={src} alt={key} style={{ height, objectFit: 'contain' }} />
                </div>
              )}
            </th>
          ))}
        </tr>
      </thead>

        <tbody>
          <tr>
            <td style={{ padding: '9px 8px 5px 8px', textAlign: 'center', fontWeight: 700, fontSize: 19, border: cellBorder, verticalAlign: 'bottom'  }}>
               {player.anchor_val}
            </td>
            <td style={{ padding: '9px 8px 5px 8px', textAlign: 'center', fontWeight: 700, fontSize: 19, border: cellBorder, verticalAlign: 'bottom' }}>
               {player.ML_val}
            </td>
            <td style={{ padding: '9px 8px 5px 8px', textAlign: 'center', fontWeight: 700, fontSize: 19, border: cellBorder, verticalAlign: 'bottom' }}>
               {player.PV_val}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function BaseballDiamond({ positions }) {
  const posMap = Object.fromEntries(positions.map(p => [p.pos, p]));
  const fieldDots = {
    // Infield
    '1B': { cx: 82, cy: 50 },
    '2B': { cx: 65, cy: 30 },
    'SS': { cx: 45, cy: 30 },
    '3B': { cx: 28, cy: 50 },
    // Outfield
    'LF': { cx: 20, cy: 12 },
    'CF': { cx: 55, cy: -5 },
    'RF': { cx: 90, cy: 12 },
    // Pitcher, Catcher, DH
    'P':  { cx: 55, cy: 48 },
    'C':  { cx: 55, cy: 78 },
    'DH': { cx: 55, cy: 96 },
  };

  // Compute dot sizes: only scale relative to each other when multiple positions exist
  const activePosData = positions.filter(p => fieldDots[p.pos]);
  const maxOpps = activePosData.length > 1 ? Math.max(...activePosData.map(p => p.opps)) : null;
  const minDotR = 4;
  const maxDotR = 8;

  const getDotR = (opps) => {
    if (maxOpps === null || activePosData.length <= 1) return minDotR;
    return minDotR + ((opps / maxOpps) * (maxDotR - minDotR));
  };

  const getDotColor = (runs_saved) => {
    if (runs_saved > 3)  return '#16a34a';
    if (runs_saved < -3) return '#dc2626';
    return '#374151';
  };

  return (
<svg width={100} height={115} viewBox="0 0 110 110" style={{ flexShrink: 0, marginLeft: '8px', marginTop: '10px' }}>

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
    const r = getDotR(posData.opps);
    const fill = getDotColor(posData.runs_saved);
    return <circle key={pos} cx={cx} cy={cy + 15} r={r} fill={fill} stroke="white" strokeWidth="1.5" />;
  })}

</svg>



  );
}


function PositionTable({ positions }) {
  return (
    <table style={{ fontSize: 12, borderCollapse: 'collapse', tableLayout: 'fixed', width: 'auto' }}>
      <colgroup>
        <col style={{ width: 45 }} />
        <col style={{ width: 55 }} />
        <col style={{ width: 85 }} />
      </colgroup>
      <thead>
        <tr>
          {['POS', 'OPPS', 'Runs Saved'].map(h => (
            <th key={h} style={{
              background: HEADER_BG, color: 'white',border: '2px solid #475569',
              padding: '5px 8px', textAlign: 'center', fontWeight: 700,
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {positions.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : 'white' }}>
            <td style={{ padding: '4px 8px', fontSize: 15, border: '2px solid #475569', textAlign: 'center', fontWeight: 700 }}>{row.pos}</td>
            <td style={{ padding: '4px 8px', fontSize: 15, border: '2px solid #475569',textAlign: 'center' }}>{row.opps}</td>
            <td style={{ padding: '4px 8px', fontSize: 15, border: '2px solid #475569', textAlign: 'center', fontWeight: 700, color: row.runs_saved > 3 ? '#16a34a' : row.runs_saved < -3 ? '#dc2626' : '#374151' }}>
              {row.runs_saved}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── main card ────────────────────────────────────────────────────────────────

function BsrRow({ label, currentValue, avgValue, stdDev, aboveOrBelowRed, unit = '', decimals = 0 }) {

  // ----- Define the visual range around the average (±7 standard deviations) -----
  const range = stdDev * 7;
  const minVal = avgValue - range;
  const maxVal = avgValue + range;

  // ----- Calculate how far the current value is from average in standard deviations -----
  const deviation = (currentValue - avgValue) / stdDev;

  // ----- Determine bar color based on deviation and whether higher/lower is worse -----
  const color =
    deviation >= 1  ? (aboveOrBelowRed === 'above' ? '#dc2626' : '#16a34a')
    : deviation <= -1 ? (aboveOrBelowRed === 'below' ? '#dc2626' : '#16a34a')
    : '#9ca3af';

  // ----- Some metrics should visually invert direction (higher = worse) -----
  const shouldInvert = aboveOrBelowRed === 'above';

  // ----- Convert the value into a percentage position along the bar -----
  const rawPct = ((currentValue - minVal) / (maxVal - minVal)) * 100;
  const pct = Math.max(2, Math.min(98, shouldInvert ? 100 - rawPct : rawPct));

  // ----- Format the displayed value -----
  const display = decimals > 0 ? Number(currentValue).toFixed(decimals) : currentValue;

  return (
    // ----- Row layout: label | slider | value -----
    <div style={{ display: 'flex', alignItems: 'center', padding: '4px 10px 4px 6px', gap: 6 }}>

      {/* Metric label */}
      <span style={{ fontSize: 16, fontWeight: 700, marginTop:1, width: 100, flexShrink: 0, textAlign: 'right', fontStyle: 'italic', whiteSpace: 'nowrap', color: '#374151' }}>
        {label}
      </span>

      {/* Slider visualization */}
      <div style={{ flex: 1, marginTop:-1.5 }}>
        {/* <div style={{ fontSize: 9, color: '#9ca3af', textAlign: 'center', lineHeight: 1, marginBottom: 2 }}>
          Avg: {avgValue}
        </div> */}

        <div style={{ position: 'relative', height: 12, marginLeft:2, marginTop:-1 }}>
          {/* Colored performance bar */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: 9, background: color }} />

          {/* Average marker */}
          <div style={{ position: 'absolute', left: '50%', top: -5, bottom: -5, width: 2, background: '#000', opacity: 0.85, transform: 'translateX(-50%)' }} />

          {/* Player value indicator */}
          <div style={{ position: 'absolute',left: pct + '%', top: '50%', transform: 'translate(-50%, -50%)', width: 17, height: 17, borderRadius: '70%', backgroundColor: '#000000', border: '2px solid ' + (color === '#9ca3af' ? '#6b7280' : color) }} />
        </div>
      </div>

      {/* Numeric value */}
      <span style={{ fontSize: 17, fontWeight: 700, marginTop:1, width: 90, flexShrink: 0, textAlign: 'left', whiteSpace: 'nowrap' }}>
        {display}{unit}
      </span>
    </div>
  );
}

export default function HitterCard({ data }) {
  const { player, hitting, defense, baserunning, health, last_report, impact_statement, grades } = data;

  console.log('rollingTmwrcData:', hitting.rollingTmwrcData);

  return (
    <div style={{
      width: 1020,
      fontFamily: 'Arial, Helvetica, sans-serif',
      lineHeight: 1,
      border: '2px solid #475569',
      background: '#ffffff',
      boxSizing: 'border-box',
    }}>

      <div style={{ display: 'grid', gridTemplateColumns: '325px 1fr 1fr', alignItems: 'stretch' }}>
        {/* ── COL 1: Player bio + Rolling chart ──────────────────────────── */}
        <div style={{ borderRight: BORDER }}>
          <PlayerBioPanel player={player} />
          <AnchorTable player={player} />

          {/* Rolling avg chart — keep overflow crop; chart is Recharts auto-sized */}
          <div style={{ borderTop: BORDER }}>
            <SectionHeader label="ROLLING AVG TM wRC+" align="center" />
              <RollingAveragePlot 
                data={hitting.rollingTmwrcData} 
                height={180} 
              />

          </div>
        </div>

        {/* ── COL 2: Hitting ─────────────────────────────────────────────── */}
        <div style={{ borderRight: BORDER, overflow: 'hidden' }}>
          <div style={{
            background: HEADER_BG, color: 'white',
            fontWeight: 700, fontStyle: 'italic',
            fontSize: 14, padding: '4px 8px',
            letterSpacing: '0.5px', textAlign: 'center',
          }}>
            HITTING
          </div>

          {/* Projections: WRC bars + Trident side-by-side */}
          <div>

            {/* Container — position:relative so we can layer the decorative lines + label */}
            <div style={{ display: 'flex', position: 'relative', alignItems: 'stretch' }}>

              {/* ── Decorative lines ──────────────────────────────────────── */}

              {/* Horizontal line: 8px from top, runs from 5px left to the center divider */}
              <div style={{
                position: 'absolute',
                left: 5,
                top: 8,
                width: '96%',
                height: 3.5,
                background: HEADER_BG,
              }} />

              {/* PROJECTIONS label — hangs below the left end of the horizontal line */}
              <div style={{
                position: 'absolute',
                left: 5,
                top: 10,
                background: HEADER_BG, color: 'white',
                fontSize: 13, fontWeight: 700, fontStyle: 'italic',
                padding: '6px 8px', letterSpacing: '0.4px',
                zIndex: 1,
              }}>
                PROJECTIONS
              </div>

              {/* Center vertical divider — full height, stops short of bottom */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: 10,
                bottom: 14,
                width: 2,
                background: HEADER_BG,
                transform: 'translateX(-50%)',
              }} />

              {/* ── Left half: WRC+ bars ───────────────────────────────────── */}
              <div style={{
                flex: '0 0 50%',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                paddingTop: 38,
              }}>
                <WRCPlusChart vL={hitting.projections.vL} vR={hitting.projections.vR} barContainerHeight={100} />
                <div style={{ textAlign: 'center', fontSize: 17, padding: '4px 0 8px', fontWeight: 600 }}>
                  wRC+: <strong style={{ fontSize: 18 }}>{hitting.projections.wrc_plus}</strong>
                </div>
              </div>

              {/* ── Right half: Trident ────────────────────────────────────── */}
              <div style={{
                flex: '0 0 50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                paddingBottom: '10px',
              }}>
                <div style={{ transform: 'translate(-15px, -10px)' }}>   {/* move left 20 and up 10 */}
                  <TrinityTrident
                    swdec={hitting.trident.swdec_plus}
                    dmg={hitting.trident.dmg_plus}
                    con={hitting.trident.con_plus}
                    width={210}
                    height={175}
                  />
                </div>
              </div>

            </div>
          </div>


          {/* RESULTS | TM slider columns — matched to PROJECTIONS style */}
          <div style={{ position: 'relative', marginTop: -6 }}>

            {/* Horizontal line — sits flush at top of section */}
            <div style={{
              position: 'absolute',
              left: 5, top: 2, right: 5,
              height: 4, background: HEADER_BG,
              pointerEvents: 'none',
            }} />

            {/* RESULTS banner — hangs from left end of line */}
            <div style={{
              position: 'absolute',
              left: 5, top: 4,
              background: HEADER_BG, color: 'white',
              fontSize: 13, fontWeight: 700, fontStyle: 'italic',
              padding: '6px 8px', letterSpacing: '0.4px',
              zIndex: 1,
            }}>
              RESULTS
            </div>

            {/* Level time bar — between RESULTS and TM banners */}
            <div style={{
              position: 'absolute',
              left: 92, right: 48, top: 8,
              zIndex: 1,
            }}>
              <LevelTimeBar
                levels={hitting.level_time.levels}
                percentages={hitting.level_time.percentages}
                barHeight={22}
                inline={true}
              />
            </div>

            {/* TM banner — hangs from right end of line */}
            <div style={{
              position: 'absolute',
              right: 5, top: 4,
              background: HEADER_BG, color: 'white',
              fontSize: 13, fontWeight: 700, fontStyle: 'italic',
              padding: '6px 8px', letterSpacing: '0.4px',
              zIndex: 1,
            }}>
              TM
            </div>

            {/* Center vertical divider */}
            <div style={{
              position: 'absolute',
              left: '50%', top: 12, bottom: 6,
              width: 2, background: HEADER_BG,
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
            }} />

            {/* Slider columns — padded to clear the hanging banners */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', paddingTop: 33, paddingBottom: 12 }}>
              <div>
                {hitting.sliders_left.map((s, i) => (
                  <ShortDeviationSlider key={i} {...s} />
                ))}
              </div>
              <div>
                {hitting.sliders_right.map((s, i) => (
                  <ShortDeviationSlider key={i} {...s} />
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ── COL 3: Defense / Baserunning / Health ──────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>

        {/* DEFENSE */}
        <div style={{ flex: 5, borderBottom: BORDER, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <SectionHeader label="DEFENSE" />

          {/* DEF Runs badge + stacked Rng/Arm */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '6px 12px 8px', flexShrink: 0 }}>
            <span style={{ fontSize: 17, fontWeight: 700, fontStyle: 'italic', color: HEADER_BG }}>DEF Runs:</span>
            <span style={{
              background: defense.def_runs >= 1 ? '#dcfce7' : defense.def_runs <= -1 ? '#fee2e2' : '#f3f4f6',
              color:      defense.def_runs >= 1 ? '#16a34a' : defense.def_runs <= -1 ? '#dc2626' : '#374151',
              padding: '3px 10px', borderRadius: 4, fontWeight: 800, fontSize: 20,
            }}>
              {defense.def_runs}
            </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginLeft: 6, fontSize: 16, fontWeight: 600 }}>
            <span>Rng+: <strong style={{ color: defense.rng_plus == null ? '#374151' : defense.rng_plus > 110 ? '#16a34a' : defense.rng_plus < 90 ? '#dc2626' : '#374151' }}>{defense.rng_plus ?? ' —'}</strong></span>
            <span>Arm+: <strong style={{ color: defense.arm_plus == null ? '#374151' : defense.arm_plus > 110 ? '#16a34a' : defense.arm_plus < 90 ? '#dc2626' : '#374151' }}>{defense.arm_plus ?? ' —'}</strong></span>
          </div>
          </div>
          {/* Decorative HEADER_BG divider — inset from edges */}
          <div style={{ height: 2, minHeight: 2, flexShrink: 0, background: HEADER_BG, margin: '0 20px 0' }} />

          {/* Diamond + position table */}
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-around', padding: '0 10px 0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: 25, justifyContent: 'center', flex: 1 }}>
              <BaseballDiamond positions={defense.positions} />
            </div>
            <PositionTable positions={defense.positions} />
          </div>
        </div>

        {/* BASERUNNING */}
        <div style={{ flex: 3, borderBottom: BORDER, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <SectionHeader label="BASERUNNING" />

          {/* BSR Runs badge + SB */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '8px 12px 7px', flexShrink: 0 }}>
            <span style={{ fontSize: 17, fontWeight: 700, fontStyle: 'italic', color: HEADER_BG }}>BSR Runs:</span>
            <span style={{
              background: baserunning.bsr_runs >= 1 ? '#dcfce7' : baserunning.bsr_runs <= -1 ? '#fee2e2' : '#f3f4f6',
              color:      baserunning.bsr_runs >= 1 ? '#16a34a' : baserunning.bsr_runs <= -1 ? '#dc2626' : '#374151',
              padding: '3px 10px', borderRadius: 4, fontWeight: 800, fontSize: 20,
            }}>
              {baserunning.bsr_runs}
            </span>
            <span style={{ fontSize: 17, fontWeight: 700, fontStyle: 'italic', marginLeft: 6, color: HEADER_BG }}>SB:</span>
            <span style={{ fontSize: 17, fontWeight: 600 }}>
              {baserunning.sb_made}/{baserunning.sb_attempted}
            </span>
          </div>
          {/* Decorative HEADER_BG divider — inset from edges */}
          <div style={{ height: 2, background: HEADER_BG, margin: '0 20px 2px', flexShrink: 0 }} />

          {/* Slider rows — centered in remaining space */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <BsrRow
              label="BSR+:"
              currentValue={baserunning.bsr_plus.playerValue}
              avgValue={baserunning.bsr_plus.avgValue}
              stdDev={baserunning.bsr_plus.stdDev}
              aboveOrBelowRed="below"
              unit=""
              decimals={0}
            />
            <BsrRow
              label="Sprint Speed:"
              currentValue={baserunning.sprint_speed.playerValue}
              avgValue={baserunning.sprint_speed.avgValue}
              stdDev={baserunning.sprint_speed.stdDev}
              aboveOrBelowRed="below"
              unit=" ft/sec"
              decimals={1}
            />
          </div>
        </div>

        {/* HEALTH */}
        <div style={{ flex: 1.60, overflow: 'hidden' }}>
          <SectionHeader label="HEALTH" />
          {(() => {
            const years = Object.keys(health).sort((a, b) => b - a);
            return (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '34%' }} />
                  {years.map(yr => <col key={yr} style={{ width: `${66 / years.length}%` }} />)}
                </colgroup>
                <thead>
                  <tr>
                    <th style={{ background: '#e2e8f0', color: HEADER_BG, padding: '5px 8px', textAlign: 'left', fontStyle: 'normal', fontWeight: 700, border: '1px solid #cbd5e1' }}>Year</th>
                    {years.map(yr => (
                      <th key={yr} style={{ background: '#e2e8f0', border: '1px solid #cbd5e1', color: HEADER_BG, padding: '3px 8px', textAlign: 'center', fontStyle: 'normal', fontWeight: 700 }}>{yr}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px 8px', fontWeight: 600, fontSize: 15, border: '1px solid #cbd5e1', textAlign: 'left' }}>Days Missed</td>
                    {years.map((yr, i) => {
                      const days = health[yr];
                      return (
                        <td key={i} style={{ padding: '7px 8px', textAlign: 'center', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: 16, color: days > 15 ? '#dc2626' : '#374151' }}>
                          {days}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            );
          })()}
        </div>

        </div>
      </div>

      {/* ══ BOTTOM BAR ═══════════════════════════════════════════════════════ */}
      <div style={{ display: 'flex', borderTop: '2px solid #475569' }}>

        {/* ── LAST REPORT — 40% width ───────────────────────────────────── */}
        <div style={{ flex: '0 0 37%', borderRight: BORDER }}>

          {/* Banner with scout name + date inline */}
          <div style={{
            background: HEADER_BG,
            display: 'flex', alignItems: 'center',
            padding: '4px 8px', gap: 8,
          }}>
            <span style={{ color: 'white', fontWeight: 700, fontStyle: 'italic', fontSize: 14, letterSpacing: '0.4px' }}>
              LAST REPORT
            </span>
            <span style={{ color: 'white', fontStyle: 'italic', fontWeight: 500, fontSize: 14, opacity: 0.85 }}>
               &nbsp; &nbsp;{last_report.scout} &nbsp;·&nbsp; {last_report.date}
            </span>
          </div>

          {/* Impact statement — bold navy, larger */}
          <div style={{ padding: '7px 10px' }}>
            <p style={{
              margin: 0, fontSize: 16, fontWeight: 700,
              color: HEADER_BG, lineHeight: 1.4,
            }}>
              {impact_statement}
            </p>
          </div>
        </div>

      {/* ── ROLE GRADES — PRESENT / FUTURE / TE ───────────────────────── */}
      <div style={{ flex: '0 0 23%', borderRight: BORDER, display: 'flex', flexDirection: 'column' }}>
        <SectionHeader label="ROLE GRADES" />
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 4, padding: '6px 8px', flex: 1 }}>
          {[['PRESENT', last_report.present], ['FUTURE', last_report.future], ['TE', last_report.te]].map(([label, val]) => (
           <div key={label} style={{
                flex: '1 1 0',
                minWidth: 0,
                background: gradeBg(val),
                color: 'black',
                borderRadius: 4,
                padding: '2px 4px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{val}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TOOLS — HIT / CTZ / PWR / RAW / FLD / ARM / RUN ─────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <SectionHeader label="TOOLS" />
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 4, padding: '6px 8px', flex: 1 }}>
          {Object.entries(grades).map(([label, val]) => (
            <div key={label} style={{
              flex: 1,
              background: gradeBg(val), color: 'black',
              borderRadius: 4, padding: '2px 4px', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{val}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>



      </div>


    </div>

    
  );
}