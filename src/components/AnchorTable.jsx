import React from 'react';
import { BORDER } from './constants';
import ANCHOR from '../data/KRAKEN.png';
import MLV from '../data/MLV.png';
import PV from '../data/PV.svg';

const fmt = (val) => Number(val).toFixed(1);

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
            <td style={{ border: cellBorder, textAlign: 'center', verticalAlign: 'middle', padding: '6px 4px', position: 'relative', overflow: 'visible' }}>
              <img src={ANCHOR} alt="ANCHOR" style={{
                position: 'absolute',
                top: '40%', left: '50%',
                transform: 'translate(-50%, -50%)',
                height: 80,
                objectFit: 'contain',
                opacity: 0.3,
                pointerEvents: 'none',
                zIndex: 0,
              }} />
              <span style={{ position: 'relative', fontWeight: 800, fontSize: 38, lineHeight: 1, color: '#1e3a5f', zIndex: 1 }}>
                ${fmt(player.anchor_val)}
              </span>
            </td>

            <td style={{ border: cellBorder, textAlign: 'center', verticalAlign: 'middle', padding: '6px 4px', position: 'relative', overflow: 'hidden' }}>
              <img src={MLV} alt="MLV" style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                height: 60,
                objectFit: 'contain',
                opacity: 0.18,
                pointerEvents: 'none',
              }} />
              <span style={{ position: 'relative', fontWeight: 700, color: '#1e3a5f', fontSize: 27 }}>${fmt(player.ML_val)}</span>
            </td>

            <td style={{ border: cellBorder, textAlign: 'center', verticalAlign: 'middle', padding: '6px 4px', position: 'relative', overflow: 'hidden' }}>
              <img src={PV} alt="PV" style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                height: 60,
                objectFit: 'contain',
                opacity: 0.18,
                pointerEvents: 'none',
              }} />
              <span style={{ position: 'relative', fontWeight: 700, color: '#1e3a5f', fontSize: 27 }}>${fmt(player.PV_val)}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}