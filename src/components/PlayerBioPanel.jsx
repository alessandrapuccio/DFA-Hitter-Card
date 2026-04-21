import React from 'react';
import { HEADER_BG } from './constants';

const logos = import.meta.glob('../data/logos/*.png', { eager: true });

const logoMap = Object.fromEntries(
  Object.entries(logos).map(([path, module]) => {
    const fileName = path.split('/').pop().replace('.png', '');
    return [fileName, module.default];
  })
);

function formatSalary(value) {
  if (value == "—") return value;
  if (value == null) return '';

  const num = typeof value === 'string'
    ? parseFloat(value.replace(/,/g, ''))
    : value;

  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000)     return `$${Math.round(num / 1_000)}K`;

  return `$${Number.isInteger(num) ? num : num.toFixed(1)}`;
}

export default function PlayerBioPanel({ player }) {
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
    style={{ width: 50, height: 70, marginLeft: 5, objectFit: 'contain', flexShrink: 0 }}
  />
  <div style={{ flex: 1, minWidth: 0 }}>
    {(() => {
      const nameParts = player.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      const isLong = player.name.replace(/\s/g, '').length > 11;

      return (
        <div style={{ color: 'white', display: 'flex', alignItems: isLong ? 'flex-start' : 'baseline', justifyContent: 'space-between', lineHeight: 1.1 }}>
          {isLong ? (
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
              <span style={{ fontSize: 27, fontWeight: 800, fontStyle: 'italic' }}>{firstName}</span>
              <span style={{ fontSize: 27, fontWeight: 800, fontStyle: 'italic' }}>{lastName}</span>
            </div>
          ) : (
            <span style={{ fontSize: 27, fontWeight: 800, fontStyle: 'italic', marginTop: 5 }}>{player.name}</span>
          )}
          <span style={{ fontSize: 35, fontWeight: 800, fontStyle: 'italic', alignSelf: 'center', marginRight: 20}}>
            {player.position}
          </span>
        </div>
      );

    })()}
    <div style={{ color: 'white', display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 5 }}>
      <span style={{ fontSize: 17, fontWeight: 400, opacity: 0.88 }}>
        {player.bats}/{player.throws}
        <span style={{ margin: '0 6px', opacity: 0.7 }}>•</span>
        Age: {player.age}
        <span style={{ margin: '0 6px', opacity: 0.7 }}>•</span>
        MLS: {Number(player.mls).toFixed(3)}
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
