import React from 'react';
import { BORDER } from './constants';
import ANCHOR from '../data/KRAKEN.png';
import MLV from '../data/MLV.png';
import PV from '../data/PV.svg';

const fmt = (val) => val === '—' ? '—' : Number(val).toFixed(0);
const display = (val) => val === '—' ? '—' : `$${fmt(val)}M`;

const getColor = (val, greenThreshold, redThreshold) => {
  if (val === '—') return '#1e3a5f';
  const num = Number(val);
  if (num > greenThreshold) return '#3e970e';
  if (num < redThreshold) return '#bc0b0a';
  return '#1e3a5f';
};

export default function AnchorTable({ player }) {
  const cellBorder = '1px solid #cbd5e1';
  return (
    <div style={{ borderTop: BORDER }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', overflow: 'visible' }}>
        <colgroup>
          <col style={{ width: '42%' }} />
          <col style={{ width: '29%' }} />
          <col style={{ width: '29%' }} />
        </colgroup>

        <tbody>
          <tr>
            <td style={{ border: cellBorder, textAlign: 'center', verticalAlign: 'middle', padding: '10px 4px', position: 'relative', overflow: 'visible' }}>
              <img src={ANCHOR} alt="ANCHOR" style={{
                position: 'absolute',
                top: '40%', left: '50%',
                transform: 'translate(-50%, -50%)',
                height: 90,
                objectFit: 'contain',
                opacity: 0.3,
                pointerEvents: 'none',
                zIndex: 0,
              }} />
              <span style={{ position: 'relative', fontWeight: 800, fontSize: 32, lineHeight: 1, color: getColor(player.anchor_val, 34.5, -22.5), zIndex: 1 }}>
               {display(player.anchor_val)}
              </span>
            </td>

            <td style={{ border: cellBorder, textAlign: 'center', verticalAlign: 'middle', padding: '6px 4px', position: 'relative', overflow: 'hidden' }}>
              <img src={MLV} alt="MLV" style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                height: 50,
                opacity: 0.18,
                pointerEvents: 'none',
              }} />
              <span style={{ position: 'relative', fontWeight: 700, color: getColor(player.ML_val, 43.5, -24.5), fontSize: 25 }}>{display(player.ML_val)}</span>
            </td>

            <td style={{ border: cellBorder, textAlign: 'center', verticalAlign: 'middle', padding: '6px 4px', position: 'relative', overflow: 'hidden' }}>
              <img src={PV} alt="PV" style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                height: 90,
                opacity: 0.18,
                pointerEvents: 'none',
              }} />
              <span style={{ position: 'relative', fontWeight: 700, color: getColor(player.PV_val, 29.2, -22.5), fontSize: 25 }}>{display(player.PV_val)}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}