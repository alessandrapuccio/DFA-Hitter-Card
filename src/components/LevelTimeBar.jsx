export default function LevelTimeBar({ levels = ['3A', 'MLB'], percentages = [83, 17], barHeight = 38, inline = false, borderRadius = 3 }) {
  const levelColors = {
    'ML':  '#08519c',
    '3A':  '#3182bd',
    '2A':  '#6baed6',
    'A+':  '#9ecae1',
    'A':   '#74a9cf',
    'RK':  '#4a90c2'
  };
  const getColor = (level) => levelColors[level] || '#9ca3af';
  const fontSize = Math.round(barHeight * 0.62);
  const subFontSize = Math.round(barHeight * 0.55);
  const maxIndex = percentages.indexOf(Math.max(...percentages));

  return (
    <div style={{ width: '100%' }}>
      <div style={{ position: 'relative', height: barHeight, background: '#e5e7eb', borderRadius: borderRadius, display: 'flex', overflow: 'hidden' }}>
        {levels.map((level, index) => {
          const pct = percentages[index];
          const color = getColor(level);
          const showLevelOnly = pct >= 10 && (pct < 30 || index !== maxIndex);
          const showFullLabel = pct >= 30 && index === maxIndex;

          return (
            <div
              key={index}
              style={{ width: `${pct}%`, backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {(showLevelOnly || showFullLabel) && (
                inline ? (
                  <div style={{ color: 'white', fontWeight: 700, display: 'flex', alignItems: 'baseline', gap: 3, lineHeight: 1.5, marginTop:-1 }}>
                    <span style={{ fontSize }}>{level}{showFullLabel && ':'}</span>
                    {showFullLabel && <span style={{ fontSize: fontSize }}>{pct}%</span>}
                  </div>
                ) : (
                  <div style={{ color: 'white', fontWeight: 700, textAlign: 'center', lineHeight: 1 }}>
                    <div style={{ fontSize }}>{level}{showFullLabel && ':'}</div>
                    {showFullLabel && <div style={{ fontSize: fontSize }}>{pct}%</div>}
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}