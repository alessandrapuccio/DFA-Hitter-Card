// Card-ready component. barHeight controls bar thickness. inline=true puts level+% on one line.
export default function LevelTimeBar({ levels = ['3A', 'MLB'], percentages = [83, 17], barHeight = 38, inline = false }) {
  const levelColors = {
    'MLB': '#08519c',
    '3A':  '#3182bd',
    '2A':  '#6baed6',
    '1A':  '#bdd7e7',
    'RK':  '#eff3ff',
  };

  const getColor = (level) => levelColors[level] || '#9ca3af';

  const fontSize     = Math.round(barHeight * 0.65);
  const subFontSize  = Math.round(barHeight * 0.55);

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          position: 'relative',
          height: barHeight,
          background: '#e5e7eb',
          borderRadius: 4,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {levels.map((level, index) => {
          const pct      = percentages[index];
          const color    = getColor(level);
          const showLabel = pct >= 10;

          return (
            <div
              key={index}
              style={{
                width: `${pct}%`,
                backgroundColor: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {showLabel && (
                inline ? (
                  <div style={{
                    color: 'white', fontWeight: 700,
                    display: 'flex', alignItems: 'baseline', gap: 3,
                    lineHeight: 1,
                  }}>
                    <span style={{ fontSize }}>{level}</span>
                    {pct >= 20 && <span style={{ fontSize: subFontSize }}>{pct}%</span>}
                  </div>
                ) : (
                  <div style={{ color: 'white', fontWeight: 700, textAlign: 'center', lineHeight: 1 }}>
                    <div style={{ fontSize }}>{level}</div>
                    <div style={{ fontSize: subFontSize }}>{pct}%</div>
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>

      {/* Legend for segments too narrow to label */}
      {percentages.some(p => p < 10) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '4px 0', fontSize: 11 }}>
          {levels.map((level, index) =>
            percentages[index] < 10 ? (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: getColor(level) }} />
                <span>{level}: {percentages[index]}%</span>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
