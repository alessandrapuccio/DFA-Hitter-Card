import React from 'react';
import { HEADER_BG } from './constants';

export default function PositionTable({ positions, isCatcher = false, deterPlus = null, armPlus = null }) {
  const catcherRows = positions.filter(r => r.type === 'catcher');
  const fieldRows   = positions.filter(r => r.type === 'field');

  const headerStyle = {
    background: HEADER_BG, color: 'white', border: '2px solid #475569',
    padding: '5px 8px',
    textAlign: 'center', fontWeight: 700,
  };
  const tdBase = {
    padding: '4px 8px',
    fontSize: 15,
    border: '2px solid #475569', textAlign: 'center',
  };
  const runColor  = (rs) => rs > 3 ? '#16a34a' : rs < -3 ? '#dc2626' : '#374151';
  const plusColor = (v)  => v == null ? '#374151' : v > 110 ? '#16a34a' : v < 90 ? '#dc2626' : '#374151';
  const fmtPlus   = (v)  => v == null ? '—' : v;

  // Primary catcher = GC is at least 5x the opps at every individual field position
  const maxFieldOpps = fieldRows.length > 0 ? Math.max(...fieldRows.map(r => r.opps ?? 0)) : 0;
  const catcherGC    = catcherRows.length > 0 ? (catcherRows[0].gc ?? 0) : 0;
  const primaryIsCatcher = catcherRows.length > 0 && catcherGC >= 5 * maxFieldOpps;

  const renderRows = (rows, offset = 0, showPlusCols = false) => rows.map((row, i) => {
    const isField = row.type === 'field';
    return (
      <tr key={i + offset} style={{ background: (i + offset) % 2 === 0 ? '#f8fafc' : 'white' }}>
        <td style={{ ...tdBase, fontWeight: 700 }}>{row.pos}</td>
        <td style={tdBase}>{row.gc ?? row.opps}</td>
        <td style={{ ...tdBase, fontWeight: 700, color: runColor(row.runs_saved) }}>
          {row.runs_saved != null ? Number(row.runs_saved).toFixed(1) : '—'}
        </td>
        {showPlusCols && (
          <>
            <td style={{ ...tdBase, fontWeight: 700, color: isField ? plusColor(row.rng_plus) : '#374151' }}>
              {isField ? fmtPlus(row.rng_plus) : '—'}
            </td>
            <td style={{ ...tdBase, fontWeight: 700, color: isField ? plusColor(row.arm_plus) : '#374151' }}>
              {isField ? fmtPlus(row.arm_plus) : '—'}
            </td>
          </>
        )}
      </tr>
    );
  });

  // Pure catcher (no field rows) — Pos, GC, Runs, Deter+, Arm+
  if (isCatcher && fieldRows.length === 0) {
    return (
      <table style={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: 'auto' }}>
        <colgroup>
          <col style={{ width: 45 }} /><col style={{ width: 55 }} /><col style={{ width: 55 }} />
          <col style={{ width: 60 }} /><col style={{ width: 55 }} />
        </colgroup>
        <thead>
          <tr>{['Pos', 'GC', 'Runs', 'Deter+', 'Arm+'].map(h => <th key={h} style={headerStyle}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {positions.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : 'white' }}>
              <td style={{ ...tdBase, fontWeight: 700 }}>{row.pos}</td>
              <td style={tdBase}>{row.gc ?? row.opps}</td>
              <td style={{ ...tdBase, fontWeight: 700, color: runColor(row.runs_saved) }}>
                {row.runs_saved != null ? Number(row.runs_saved).toFixed(1) : '—'}
              </td>
              <td style={{ ...tdBase, fontWeight: 700, color: plusColor(deterPlus) }}>
                {fmtPlus(deterPlus)}
              </td>
              <td style={{ ...tdBase, fontWeight: 700, color: plusColor(armPlus) }}>
                {fmtPlus(armPlus)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // Pure non-catcher (or catcher without enough GC to be primary) — show RNG+ and ARM+ cols
  if (!isCatcher || catcherRows.length === 0 || !primaryIsCatcher) {
    return (
      <table style={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: 'auto' }}>
        <colgroup>
          <col style={{ width: 45 }} /><col style={{ width: 55 }} /><col style={{ width: 55 }} />
          <col style={{ width: 60 }} /><col style={{ width: 55 }} />
        </colgroup>
        <thead>
          <tr>{['Pos', 'Opp', 'Runs', 'RNG+', 'ARM+'].map(h => <th key={h} style={headerStyle}>{h}</th>)}</tr>
        </thead>
        <tbody>{renderRows(positions, 0, true)}</tbody>
      </table>
    );
  }

  // Mixed catcher + field where catcher is primary (GC >= 5x max field opps):
  // catcher section on top, field section below with its own header row
  const firstGroup  = catcherRows;
  const secondGroup = fieldRows;

  const catcherHeaders = ['Pos', 'GC',  'Runs', 'Deter+', 'Arm+'];
  const fieldHeaders   = ['Pos', 'Opp', 'Runs', 'RNG+',   'ARM+'];

  const mixedHeaderStyle = { ...headerStyle, padding: '2px 6px', fontSize: 11 };
  const mixedTd = { ...tdBase, padding: '2px 6px', fontSize: 12 };

  return (
    <table style={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: 'auto' }}>
      <colgroup>
        <col style={{ width: 42 }} /><col style={{ width: 46 }} /><col style={{ width: 48 }} />
        <col style={{ width: 52 }} /><col style={{ width: 48 }} />
      </colgroup>
      <thead>
        <tr>{catcherHeaders.map(h => <th key={h} style={mixedHeaderStyle}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {/* Catcher rows with Deter+/Arm+ */}
        {firstGroup.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : 'white' }}>
            <td style={{ ...mixedTd, fontWeight: 700 }}>{row.pos}</td>
            <td style={mixedTd}>{row.gc ?? row.opps}</td>
            <td style={{ ...mixedTd, fontWeight: 700, color: runColor(row.runs_saved) }}>
              {row.runs_saved != null ? Number(row.runs_saved).toFixed(1) : '—'}
            </td>
            <td style={{ ...mixedTd, fontWeight: 700, color: plusColor(deterPlus) }}>
              {fmtPlus(deterPlus)}
            </td>
            <td style={{ ...mixedTd, fontWeight: 700, color: plusColor(armPlus) }}>
              {fmtPlus(armPlus)}
            </td>
          </tr>
        ))}
        {/* Field sub-header */}
        <tr>{fieldHeaders.map(h => <th key={h} style={mixedHeaderStyle}>{h}</th>)}</tr>
        {/* Field rows with RNG+/ARM+ */}
        {secondGroup.map((row, i) => (
          <tr key={i + firstGroup.length} style={{ background: (i + firstGroup.length) % 2 === 0 ? '#f8fafc' : 'white' }}>
            <td style={{ ...mixedTd, fontWeight: 700 }}>{row.pos}</td>
            <td style={mixedTd}>{row.gc ?? row.opps}</td>
            <td style={{ ...mixedTd, fontWeight: 700, color: runColor(row.runs_saved) }}>
              {row.runs_saved != null ? Number(row.runs_saved).toFixed(1) : '—'}
            </td>
            <td style={{ ...mixedTd, fontWeight: 700, color: plusColor(row.rng_plus) }}>
              {fmtPlus(row.rng_plus)}
            </td>
            <td style={{ ...mixedTd, fontWeight: 700, color: plusColor(row.arm_plus) }}>
              {fmtPlus(row.arm_plus)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}