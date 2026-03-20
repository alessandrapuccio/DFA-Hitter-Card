import React from 'react';
import ShortDeviationSlider from './ShortDeviationSlider';
import DeviationSlider from './DeviationSlider';
import TrinityTrident from './TrinityTrident';
import WRCPlusChart from './WRCPlusChart';
import LevelTimeBar from './LevelTimeBar';
import RollingTMWRCPlot from './RollingWRCPlot';
import data from '../data/noda_data.json';
import seattleLogo from '../data/seattle_logo.png';

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
      fontSize: 12,
      padding: '3px 8px',
      letterSpacing: '0.4px',
      textAlign: align,
    }}>
      {label}
    </div>
  );
}

// ─── sub-panels ───────────────────────────────────────────────────────────────

function PlayerBioPanel({ player }) {
  // Logo spans the navy/white boundary — absolute positioned, centered at the seam
  const LOGO_SIZE = 90;
  const LOGO_LEFT = 12;
  const NAVY_H = 90;   // min-height of navy banner
  const LOGO_TOP = NAVY_H - LOGO_SIZE / 2;  // center of logo sits at boundary
  const TEXT_LEFT = LOGO_LEFT + LOGO_SIZE + 14; // text starts after logo

  return (
    <div style={{ background: 'white', position: 'relative' }}>

      {/* Full-width navy banner — extends all the way to the left border */}
      <div style={{
        background: HEADER_BG,
        minHeight: NAVY_H,
        paddingLeft: TEXT_LEFT,
        paddingRight: 14,
        paddingTop: 10,
        paddingBottom: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <div style={{
          color: 'white', fontSize: 27, fontWeight: 800,
          fontStyle: 'italic', lineHeight: 1.1,
        }}>
          {player.name}
        </div>
        <div style={{
          color: 'white',
          display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 5,
        }}>
          <span style={{ fontSize: 22, fontWeight: 800, fontStyle: 'italic' }}>{player.position}&nbsp;</span>
          <span style={{ fontSize: 17, fontWeight: 400, opacity: 0.88 }}>
            {player.bats}/{player.throws}&nbsp;&nbsp;Age: {player.age}&nbsp;&nbsp;MLS: {player.mls}
          </span>
        </div>
      </div>

      {/* White section — Opt/Out + divider + Salary, padded past the logo */}
      <div style={{
        paddingLeft: TEXT_LEFT,
        paddingRight: 14,
        paddingTop: 10,
        paddingBottom: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: LOGO_SIZE / 2 + 20,
      }}>
        <div style={{ display: 'flex', gap: 20, marginLeft:10, marginBottom: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 19, fontWeight: 600 }}>
            Opt:{' '}
            <span style={{
              background: '#dcfce7', color: '#16a34a',
              padding: '3px 10px', borderRadius: 4, fontWeight: 800, fontSize: 19,
            }}>
              Y({player.option.years})
            </span>
          </span>
          <span style={{ fontSize: 19, fontWeight: 600 }}>
            Out:{' '}
            <span style={{
              background: '#dcfce7', color: '#16a34a',
              padding: '3px 10px', borderRadius: 4, fontWeight: 800, fontSize: 19,
            }}>
              N
            </span>
          </span>
        </div>
        <div style={{ height: 4, background: HEADER_BG, marginBottom: 10 }} />
        <div style={{ fontSize: 19, fontWeight: 500 }}>
          Salary: <strong>${(player.salary / 1000).toFixed(0)}K</strong>
          &nbsp;&nbsp;
          P2: <strong>${(player.p2 / 1000).toFixed(0)}K</strong>
        </div>
      </div>

      {/* S logo — absolutely positioned, straddling the navy/white boundary */}
      <img
        src={seattleLogo}
        alt="Seattle"
        style={{
          position: 'absolute',
          top: LOGO_TOP-50,
          bottom:0,
          left: LOGO_LEFT-50,
          width: 190,
          height: 190,
          objectFit: 'cover',
          zIndex: 2,
        }}
      />
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
            {['ANCHOR', 'MLV', 'PV'].map(h => (
              <th key={h} style={{
                background: HEADER_BG, color: 'white',
                fontStyle: 'italic', fontWeight: 700,
                padding: '6px 8px', textAlign: 'center', fontSize: 15,
                border: cellBorder,
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 700, fontSize: 18, border: cellBorder }}>
              ${(player.anchor_val / 1e6).toFixed(1)}M
            </td>
            <td style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 700, fontSize: 18, border: cellBorder }}>
              ${(player.ML_val / 1e6).toFixed(1)}M
            </td>
            <td style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 700, fontSize: 18, border: cellBorder }}>
              --
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function BaseballDiamond({ positions }) {
  const posSet = new Set(positions.map(p => p.pos));
  const fieldDots = {
    '1B': { cx: 82, cy: 50 }, '2B': { cx: 55, cy: 24 },
    'SS': { cx: 30, cy: 30 }, '3B': { cx: 20, cy: 50 },
    'LF': { cx: 12, cy: 10 }, 'CF': { cx: 55, cy: 8  },
    'RF': { cx: 95, cy: 10 }, 'C':  { cx: 55, cy: 78 },
    'P':  { cx: 55, cy: 46 }, 'DH': { cx: 55, cy: 92 },
  };
  return (
    <svg width={100} height={95} viewBox="0 0 110 100" style={{ flexShrink: 0 }}>
      <path d="M 10 62 Q 55 0 100 62" fill="none" stroke="#cbd5e1" strokeWidth="1" />
      <polygon points="55,18 82,46 55,74 28,46" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="52" y="15" width="6" height="6" fill="#94a3b8" />
      <rect x="79" y="43" width="6" height="6" fill="#94a3b8" />
      <rect x="25" y="43" width="6" height="6" fill="#94a3b8" />
      <circle cx="55" cy="74" r="3" fill="#94a3b8" />
      {Object.entries(fieldDots).map(([pos, { cx, cy }]) =>
        posSet.has(pos)
          ? <circle key={pos} cx={cx} cy={cy} r={5} fill="#ef4444" stroke="white" strokeWidth="1.5" />
          : null
      )}
    </svg>
  );
}

function PositionTable({ positions }) {
  return (
    <table style={{ fontSize: 11, borderCollapse: 'collapse', flex: 1, marginLeft: 6 }}>
      <thead>
        <tr>
          {['POS', 'OPPS', 'Runs Saved'].map(h => (
            <th key={h} style={{
              background: HEADER_BG, color: 'white',
              padding: '2px 6px', textAlign: 'center', fontWeight: 700,
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {positions.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : 'white' }}>
            <td style={{ padding: '2px 6px', textAlign: 'center', fontWeight: 700 }}>{row.pos}</td>
            <td style={{ padding: '2px 6px', textAlign: 'center' }}>{row.opps}</td>
            <td style={{ padding: '2px 6px', textAlign: 'center', fontWeight: 700, color: row.runs_saved < 0 ? '#dc2626' : '#16a34a' }}>
              {row.runs_saved}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── main card ────────────────────────────────────────────────────────────────

export default function HitterCard() {
  const { player, hitting, defense, baserunning, health, last_report, impact_statement, grades } = data;

  return (
    <div style={{
      width: 1130,
      fontFamily: 'Arial, Helvetica, sans-serif',
      border: '2px solid #475569',
      background: '#ffffff',
      boxSizing: 'border-box',
    }}>

      {/* ══ 3 EQUAL COLUMNS ══════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>

        {/* ── COL 1: Player bio + Rolling chart ──────────────────────────── */}
        <div style={{ borderRight: BORDER }}>
          <PlayerBioPanel player={player} />
          <AnchorTable player={player} />

          {/* Rolling avg chart — keep overflow crop; chart is Recharts auto-sized */}
          <div style={{ borderTop: BORDER }}>
            <SectionHeader label="Rolling Avg TM wRC+" align="left" />
            <div style={{ height: 100, overflow: 'hidden' }}>
              <RollingTMWRCPlot playerName="Noda, Ryan" average={100} />
            </div>
          </div>
        </div>

        {/* ── COL 2: Hitting ─────────────────────────────────────────────── */}
        <div style={{ borderRight: BORDER }}>
          <div style={{
            background: HEADER_BG, color: 'white',
            fontWeight: 700, fontStyle: 'italic',
            fontSize: 16, padding: '3px 8px',
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
                padding: '3px 8px', letterSpacing: '0.4px',
                zIndex: 1,
              }}>
                PROJECTIONS
              </div>

              {/* Center vertical divider — full height, stops short of bottom */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 14,
                top: 10,
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
                <WRCPlusChart vL={hitting.projections.vL} vR={hitting.projections.vR} barContainerHeight={120} />
                <div style={{ textAlign: 'center', fontSize: 17, padding: '4px 0 8px', fontWeight: 600 }}>
                  wRC+: <strong style={{ fontSize: 18 }}>{hitting.projections.wrc_plus}</strong>
                </div>
              </div>

              {/* ── Right half: Trident ────────────────────────────────────── */}
              <div style={{
                flex: '0 0 50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                paddingBottom: '20px',
              }}>
                <div style={{ transform: 'translate(-20px, -15px)' }}>   {/* move left 20 and up 10 */}
                  <TrinityTrident
                    swdec={hitting.trident.swdec_plus}
                    dmg={hitting.trident.dmg_plus}
                    con={hitting.trident.con_plus}
                    width={240}
                    height={220}
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
              padding: '3px 8px', letterSpacing: '0.4px',
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
              padding: '3px 8px', letterSpacing: '0.4px',
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', paddingTop: 36 }}>
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
        <div>
          <SectionHeader label="DEFENSE" />

          {/* DEF runs + rng/arm */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderBottom: BORDER }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              DEF Runs:{' '}
              <span style={{ color: defense.def_runs < 0 ? '#dc2626' : '#16a34a', fontSize: 15 }}>
                {defense.def_runs}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
              <span>Rng+: <strong>{defense.rng_plus ?? '--'}</strong></span>
              <span>Arm+: <strong>{defense.arm_plus ?? '--'}</strong></span>
            </div>
          </div>

          {/* Diamond + position table */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderBottom: BORDER }}>
            <BaseballDiamond positions={defense.positions} />
            <PositionTable positions={defense.positions} />
          </div>

          {/* BASERUNNING */}
          <SectionHeader label="BASERUNNING" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px' }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              BSR Runs:{' '}
              <span style={{ color: baserunning.bsr_runs >= 0 ? '#16a34a' : '#dc2626', fontSize: 15 }}>
                {baserunning.bsr_runs}
              </span>
            </div>
            <div style={{ fontSize: 12 }}>
              SB: <strong>{baserunning.sb_made}/{baserunning.sb_attempted}</strong>
            </div>
          </div>
          <DeviationSlider
            title="BSR+"
            currentValue={baserunning.bsr_plus.playerValue}
            avgValue={baserunning.bsr_plus.avgValue}
            stdDev={baserunning.bsr_plus.stdDev}
            aboveOrBelowRed="above"
          />
          <DeviationSlider
            title="Sprint Speed"
            currentValue={baserunning.sprint_speed.playerValue}
            avgValue={baserunning.sprint_speed.avgValue}
            stdDev={baserunning.sprint_speed.stdDev}
            aboveOrBelowRed="above"
          />

          {/* HEALTH */}
          <SectionHeader label="HEALTH" />
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ background: HEADER_BG, color: 'white', padding: '3px 8px', textAlign: 'left' }}>Year</th>
                <th style={{ background: HEADER_BG, color: 'white', padding: '3px 8px', textAlign: 'center' }}>Days Missed</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(health).map(([yr, days]) => (
                <tr key={yr}>
                  <td style={{ padding: '4px 8px' }}>{yr}</td>
                  <td style={{ padding: '4px 8px', textAlign: 'center', fontWeight: 700, color: days > 15 ? '#dc2626' : '#374151' }}>{days}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>

      {/* ══ BOTTOM BAR ═══════════════════════════════════════════════════════ */}
      <div style={{ display: 'flex', borderTop: '2px solid #475569', marginTop: -22 }}>

        {/* ── LAST REPORT — 40% width ───────────────────────────────────── */}
        <div style={{ flex: '0 0 40%', borderRight: BORDER }}>

          {/* Banner with scout name + date inline */}
          <div style={{
            background: HEADER_BG,
            display: 'flex', alignItems: 'center',
            padding: '4px 8px', gap: 8,
          }}>
            <span style={{ color: 'white', fontWeight: 700, fontStyle: 'italic', fontSize: 12, letterSpacing: '0.4px' }}>
              LAST REPORT
            </span>
            <span style={{ color: 'white', fontStyle: 'normal', fontWeight: 500, fontSize: 11, opacity: 0.85 }}>
              {last_report.scout} &nbsp;·&nbsp; {last_report.date}
            </span>
          </div>

          {/* Impact statement — bold navy, larger */}
          <div style={{ padding: '7px 10px' }}>
            <p style={{
              margin: 0, fontSize: 13, fontWeight: 700,
              color: HEADER_BG, lineHeight: 1.4,
            }}>
              {impact_statement}
            </p>
          </div>
        </div>

        {/* ── GRADES — 60% width ────────────────────────────────────────────── */}
        <div style={{ flex: '0 0 60%' }}>
          <SectionHeader label="GRADES" />

          {/* Single row: PFT tiles (wider) + thin divider + scout grade tiles */}
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 4, padding: '6px 10px' }}>

            {/* PRESENT / FUTURE / TE — flex:2 each so they're visibly wider */}
            {[['PRESENT', last_report.present], ['FUTURE', last_report.future], ['TE', last_report.te]].map(([label, val]) => (
              <div key={label} style={{
                flex: 2,
                background: gradeBg(val), color: gradeTextColor(val),
                borderRadius: 4, padding: '2px 4px', textAlign: 'center',
              }}>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{val}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
              </div>
            ))}

            {/* Separator */}
            <div style={{ width: 2, background: '#94a3b8', borderRadius: 1, alignSelf: 'stretch', margin: '2px 0' }} />

            {/* HIT / CTZ / PWR / RAW / FLD / ARM / RUN — flex:1 each */}
            {Object.entries(grades).map(([label, val]) => (
              <div key={label} style={{
                flex: 1,
                background: gradeBg(val), color:'BLACK', /* gradeTextColor(val), */
                borderRadius: 4, padding: '2px 4px', textAlign: 'center',
              }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginTop:3 }}>{val}</div>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom:10 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
