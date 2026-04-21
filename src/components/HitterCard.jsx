import React from 'react';
import ShortDeviationSlider from './ShortDeviationSlider';
import TrinityTrident from './TrinityTrident';
import WRCPlusChart from './WRCPlusChart';
import LevelTimeBar from './LevelTimeBar';
import CatchingChart from './CatchingChart';
import RollingAveragePlot from './RollingAvgPlot';

import { BORDER, HEADER_BG, gradeBg } from './constants';
import SectionHeader from './SectionHeader';
import PlayerBioPanel from './PlayerBioPanel';
import AnchorTable from './AnchorTable';
import BaseballDiamond from './BaseballDiamond';

export default function HitterCard({ data }) {
  const { player, hitting, defense, baserunning, health, last_report, impact_statement, grades } = data;

  console.log('rollingTmwrcData:', hitting.rollingTmwrcData);

  // Total opportunities across all positions
  const getOpps = (p) => p.opps ?? p.gc ?? 0;
  const totalOpps = (defense.positions || []).reduce((sum, p) => sum + getOpps(p), 0);

  const formatBodyParts = (text) => {
    const parts = text.split(/(\(x\d+\))/g);

    return parts.map((part, i) => {
      if (/\(x\d+\)/.test(part)) {
        return <strong key={i}>{part}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div style={{
      width: 1020,
      fontFamily: 'Arial, Helvetica, sans-serif',
      lineHeight: 1,
      border: '2px solid #475569',
      background: '#ffffff',
      boxSizing: 'border-box',
    }}>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 330px', alignItems: 'stretch' }}>
        {/* ── COL 1: Player bio + Rolling chart ──────────────────────────── */}
        <div style={{ borderRight: BORDER, display: 'flex', flexDirection: 'column' }}>
          <PlayerBioPanel player={player} />
          <AnchorTable player={player} />

          {/* Rolling avg chart */}
          <div style={{ borderTop: BORDER, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <SectionHeader label="ROLLING AVG TM wRC+ (100 PA Window)" align="center" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: -25 }}>
              <RollingAveragePlot
                data={hitting.rollingTmwrcData}
                height={180}
              />
            </div>
          </div>
        </div>

        {/* ── COL 2: Hitting ─────────────────────────────────────────────── */}
        <div style={{ borderRight: BORDER, overflow: 'hidden', minWidth: 0 }}>
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
                <div style={{ textAlign: 'center', fontSize: 17, color: HEADER_BG, padding: '4px 0 8px', fontWeight: 600 }}>
                  wRC+: <strong style={{ fontSize: 18, color: HEADER_BG }}>{hitting.projections.wrc_plus}</strong>
                </div>
              </div>

              {/* ── Right half: Trident ────────────────────────────────────── */}
              <div style={{
                flex: '0 0 50%',
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <div style={{ transform: 'translateX(0px)' }}>
                  <TrinityTrident
                    swdec={hitting.trident.swdec_plus}
                    dmg={hitting.trident.dmg_plus}
                    con={hitting.trident.con_plus}
                    width={210}
                    height={210}
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
              padding: '6px 25px 6px 8px', letterSpacing: '0.4px',
              zIndex: 1,
            }}>
              RESULTS
            </div>

            {/* LevelTimeBar — centred between the two banners */}
            <div style={{
              position: 'absolute',
              left: '49.3%', top: 8,
              transform: 'translateX(-50%)',
              width: '42%',
              zIndex: 1,
            }}>
              <LevelTimeBar
                levels={hitting.level_time.levels}
                percentages={hitting.level_time.percentages}
                barHeight={21}
                inline={true}
                borderRadius={10}
              />
            </div>

            {/* TRACKMAN banner — hangs from right end of line */}
            <div style={{
              position: 'absolute',
              right: 5, top: 4,
              background: HEADER_BG, color: 'white',
              fontSize: 13, fontWeight: 700, fontStyle: 'italic',
              padding: '6px 8px 6px 15px', letterSpacing: '0.4px',
              zIndex: 1,
            }}>
              TRACKMAN
            </div>

            {/* Center vertical divider */}
            <div style={{
              position: 'absolute',
              left: '50%', top: 45, bottom: 14,
              width: 2, background: HEADER_BG,
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
            }} />

            {/* Slider columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', paddingTop: 33, paddingBottom: 10, alignItems: 'center', alignContent: 'center', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
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
          <div style={{ flex: 5, minHeight: 0, borderBottom: BORDER, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <SectionHeader label="DEFENSE (2025)" />

            {/* Top stat row: DEF Runs left, catcher-aware right side */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px 2px',
              flexShrink: 0,
            }}>
              {/* DEF Runs — single line */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 19, fontWeight: 700, fontStyle: 'italic', color: HEADER_BG }}>
                  DEF Runs:
                </span>
                <span style={{
                  background: defense.def_runs >= 1 ? '#dcfce7' : defense.def_runs <= -1 ? '#fee2e2' : '#f3f4f6',
                  color: defense.def_runs >= 1 ? '#16a34a' : defense.def_runs <= -1 ? '#dc2626' : '#374151',
                  padding: '2px 4px', borderRadius: 4, fontWeight: 800, fontSize: 19,
                }}>
                  {Number(defense.def_runs).toFixed(1)}
                </span>
              </div>

              {/* Right side */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {defense.is_catcher ? (
                  <>
                    <span style={{ fontSize: 15, fontWeight: 700, fontStyle: 'italic', color: HEADER_BG }}>
                      GC: <span style={{ fontWeight: 700, fontSize: 15, color: '#374151', fontStyle: 'normal' }}>{defense.catcher_gc}</span>
                    </span>
                    {(defense.positions || [])
                      .filter(p => p.type === 'field' && getOpps(p) > 0)
                      .map(p => (
                        <span key={p.pos} style={{ fontSize: 15, fontWeight: 700, fontStyle: 'italic', color: HEADER_BG }}>
                          {p.pos} Opps: <span style={{ fontWeight: 700, fontSize: 15, color: '#374151', fontStyle: 'normal' }}>{getOpps(p)}</span>
                        </span>
                      ))
                    }
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 16, fontWeight: 700, fontStyle: 'italic', color: HEADER_BG }}>
                      Total Opps:
                    </span>
                    <span style={{ fontWeight: 700, fontSize: 16, color: '#374151' }}>
                      {totalOpps}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 2, background: HEADER_BG, margin: '6px 20px -5px', flexShrink: 0 }} />


            {/* ── Main visual: big diamond or catching chart ─────────────── */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0px 8px 12px',
              minHeight: 0,
            }}>
              {defense.primary_catcher ? (
                <CatchingChart
                  overall={defense.catcher_def_runs}
                  framing={defense.catcher_framing_runs}
                  sb={defense.catcher_sb_runs}
                  blocking={defense.catcher_block_runs}
                  width={290}
                  height={200}
                />
              ) : (
                <BaseballDiamond
                  positions={defense.positions}
                  projectedDef={defense.projected_def || []}
                  width={220}
                  height={220}
                />
              )}
            </div>
          </div>


          {/* BASERUNNING */}
          <div style={{ flex: 2.4, minHeight: 0, borderBottom: BORDER, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <SectionHeader label="BASERUNNING (2025)" />

            {/* BSR Runs badge + SB */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '6px 12px 4px', flexShrink: 0 }}>
              <span style={{ fontSize: 17, fontWeight: 700, fontStyle: 'italic', color: HEADER_BG }}>BSR Runs:</span>
              <span style={{
                background: baserunning.bsr_runs >= 1 ? '#dcfce7' : baserunning.bsr_runs <= -1 ? '#fee2e2' : '#f3f4f6',
                color: baserunning.bsr_runs >= 1 ? '#16a34a' : baserunning.bsr_runs <= -1 ? '#dc2626' : '#374151',
                padding: '3px 10px', borderRadius: 4, fontWeight: 800, fontSize: 20,
              }}>
                {Number(baserunning.bsr_runs).toFixed(1)}
              </span>
              <span style={{ fontSize: 17, fontWeight: 700, fontStyle: 'italic', marginLeft: 6, color: HEADER_BG }}>SB:</span>
              <span style={{
                fontSize: 17,
                fontWeight: 600,
                color: (() => {
                  const sb = baserunning.sb_made;
                  const att = baserunning.sb_attempted;
                  if (att < 3) return 'black';
                  const fSB = sb / att * 100;
                  if (fSB >= 80) return '#16a34a';
                  if (fSB <= 60) return '#ef4444';
                  return 'black';
                })()
              }}>
                {baserunning.sb_made}/{baserunning.sb_attempted}
              </span>
            </div>
            {/* Decorative HEADER_BG divider */}
            <div style={{ height: 2, background: HEADER_BG, margin: '0 20px 1px', flexShrink: 0 }} />

            {/* Side-by-side sliders */}
            <div style={{ flex: .9, display: 'flex', alignItems: 'center', marginTop: -12, marginBottom: -12 }}>
              <div style={{ flex: 1, marginRight: -5, marginLeft: 5 }}>
                <ShortDeviationSlider
                  title="BSR+"
                  currentValue={baserunning.bsr_plus.playerValue}
                  avgValue={baserunning.bsr_plus.avgValue}
                  stdDev={baserunning.bsr_plus.stdDev}
                  aboveOrBelowRed="below"
                />
              </div>
              <div style={{ flex: 1, marginLeft: -5, marginRight: 5 }}>
                <ShortDeviationSlider
                  title=" Speed"
                  currentValue={baserunning.sprint_speed.playerValue}
                  avgValue={baserunning.sprint_speed.avgValue}
                  stdDev={baserunning.sprint_speed.stdDev}
                  aboveOrBelowRed="below"
                />
              </div>
            </div>
          </div>

          {/* HEALTH */}
          <div style={{ flex: 2.3, minHeight: 0, maxHeight: 112, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <SectionHeader label="HEALTH" />
            {(() => {
              const years = Object.keys(health).filter(k => k !== 'body_parts').sort((a, b) => a - b);
              const hasBodyParts = health.body_parts && health.body_parts.trim() !== '';
              return (
                <>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, tableLayout: 'fixed', marginTop: 0, ...(hasBodyParts ? {} : { flex: 1 }) }}>
                    <colgroup>
                      <col style={{ width: '34%' }} />
                      {years.map(yr => <col key={yr} style={{ width: `${66 / years.length}%` }} />)}
                    </colgroup>
                    <thead>
                      <tr>
                        <th style={{ background: '#e2e8f0', color: HEADER_BG, padding: '3px 8px', textAlign: 'left', fontStyle: 'normal', fontWeight: 700, border: '1px solid #cbd5e1' }}>Year</th>
                        {years.map(yr => (
                          <th key={yr} style={{ background: '#e2e8f0', border: '1px solid #cbd5e1', color: HEADER_BG, padding: '3px 8px', textAlign: 'center', fontStyle: 'normal', fontWeight: 700 }}>{yr}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '4px 8px', fontWeight: 600, fontSize: 15, border: '1px solid #cbd5e1', textAlign: 'left' }}>Days Missed</td>
                        {years.map((yr, i) => {
                          const days = health[yr];
                          return (
                            <td key={i} style={{ padding: '5px 8px', textAlign: 'center', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: 16, color: days > 15 ? '#dc2626' : '#374151' }}>
                              {days}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                  {hasBodyParts && (
                    <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '4px 8px', fontSize: 15, color: '#374151', lineHeight: 1.3 }}>
                      <span>
                        <span style={{ fontWeight: 700, color: HEADER_BG }}>Areas: </span>
                        {formatBodyParts(health.body_parts)}
                      </span>
                    </div>
                  )}
                </>
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
            {[['PRESENT', last_report.present], ['FUTURE', last_report.future], ['TOP END', last_report.te]].map(([label, val]) => (
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