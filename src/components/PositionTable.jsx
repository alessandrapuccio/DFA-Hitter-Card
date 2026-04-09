import React from 'react';
import { HEADER_BG } from './constants';

export default function PositionTable({ positions, isCatcher = false }) {
  const catcherRows = positions.filter(r => r.type === 'catcher');
  const fieldRows   = positions.filter(r => r.type === 'field');

  const headerStyle = {
    background: HEADER_BG, color: 'white', border: '2px solid #475569',
    padding: '5px 8px', textAlign: 'center', fontWeight: 700,
  };
  const tdBase   = { padding: '4px 8px', fontSize: 15, border: '2px solid #475569', textAlign: 'center' };
  const runColor = (rs) => rs > 3 ? '#16a34a' : rs < -3 ? '#dc2626' : '#374151';

  const renderRows = (rows, offset = 0) => rows.map((row, i) => (
    <tr key={i + offset} style={{ background: (i + offset) % 2 === 0 ? '#f8fafc' : 'white' }}>
      <td style={{ ...tdBase, fontWeight: 700 }}>{row.pos}</td>
      <td style={tdBase}>{row.gc ?? row.opps}</td>
      <td style={{ ...tdBase, fontWeight: 700, color: runColor(row.runs_saved) }}>{row.runs_saved}</td>
    </tr>
  ));

  // Pure non-catcher or pure catcher — single header table
  if (!isCatcher || catcherRows.length === 0 || fieldRows.length === 0) {
    const col2 = isCatcher ? 'GC' : 'OPPS';
    return (
      <table style={{ fontSize: 12, borderCollapse: 'collapse', tableLayout: 'fixed', width: 'auto' }}>
        <colgroup>
          <col style={{ width: 45 }} /><col style={{ width: 55 }} /><col style={{ width: 85 }} />
        </colgroup>
        <thead>
          <tr>{['POS', col2, 'Runs Saved'].map(h => <th key={h} style={headerStyle}>{h}</th>)}</tr>
        </thead>
        <tbody>{renderRows(positions)}</tbody>
      </table>
    );
  }

  // Mixed: determine primary position by GC vs max opps
  const primaryIsCatcher = catcherRows[0].gc >= Math.max(...fieldRows.map(r => r.gc ?? 0), 0);
  const firstGroup    = primaryIsCatcher ? catcherRows : fieldRows;
  const secondGroup   = primaryIsCatcher ? fieldRows   : catcherRows;
  const firstHeaders  = primaryIsCatcher ? ['POS', 'GC',   'Runs Saved'] : ['POS', 'OPPS', 'Runs Saved'];
  const secondHeaders = primaryIsCatcher ? ['POS', 'OPPS', 'Runs Saved'] : ['POS', 'GC',   'Runs Saved'];

  return (
    <table style={{ fontSize: 12, borderCollapse: 'collapse', tableLayout: 'fixed', width: 'auto' }}>
      <colgroup>
        <col style={{ width: 45 }} /><col style={{ width: 55 }} /><col style={{ width: 85 }} />
      </colgroup>
      <thead>
        <tr>{firstHeaders.map(h => <th key={h} style={headerStyle}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {renderRows(firstGroup, 0)}
        <tr>{secondHeaders.map(h => <th key={h} style={headerStyle}>{h}</th>)}</tr>
        {renderRows(secondGroup, firstGroup.length)}
      </tbody>
    </table>
  );
}
