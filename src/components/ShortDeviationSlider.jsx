import React from 'react';

export default function ShortDeviationSlider({
  currentValue,
  avgValue,
  stdDev,
  aboveOrBelowRed,
  minRange,
  maxRange,
  title,
  percent = false,
  noValue = false,
}) {
  const value = currentValue ?? avgValue;

  const shouldInvert = aboveOrBelowRed === 'above';
  const range = stdDev * 7;
  const minValue = minRange !== undefined ? minRange : avgValue - range;
  const maxValue = maxRange !== undefined ? maxRange : avgValue + range;

  const getColor = (v) => {
    const deviation = (v - avgValue) / stdDev;
    if (title == "PA") return '#9ca3af';
    if (deviation >= 1) return aboveOrBelowRed === 'above' ? '#dc2626' : '#16a34a';
    if (deviation <= -1) return aboveOrBelowRed === 'below' ? '#dc2626' : '#16a34a';
    return '#9ca3af';
  };

  const color = noValue ? '#9ca3af' : getColor(value);
  const rawPosition = ((value - minValue) / (maxValue - minValue)) * 100;
  const valuePosition = shouldInvert ? 100 - rawPosition : rawPosition;
  const titleOnRight = noValue ? false : valuePosition < 33;
  const labelOnShadow = titleOnRight;
  const titleColor = noValue ? '#6b7280' : (labelOnShadow ? '#6b7280' : '#fff');
  const valueLabel = percent ? `${Math.round(value)}%` : Math.round(value);
  const fillStyle = noValue ? { display: 'none' } : { left: 0, width: `${valuePosition}%` };

  return (
    <div style={{ padding: '3px 12px', width: '102%', boxSizing: 'border-box' }}>
      <div style={{ position: 'relative', marginTop: '7px', marginLeft: '-2px', height: '32px' }}>

        {/* Grey background track */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            height: '24px',
            borderRadius: '12px',
            background: '#e5e7eb',
            zIndex: 0,
          }}
        />

        {/* Colored fill up to thumb — hidden when noValue */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            height: '24px',
            borderRadius: '12px',
            background: color,
            zIndex: 1,
            ...fillStyle,
          }}
        />

        {/* Average marker line */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '2px',
            height: '30px',
            background: '#000',
            zIndex: 20,
            pointerEvents: 'none',
          }}
        />

        {/* Title label */}
        <div
          style={{
            position: 'absolute',
            top: '53%',
            transform: 'translateY(-60%)',
            fontSize: '12px',
            fontWeight: 'bold',
            color: titleColor,
            pointerEvents: 'none',
            zIndex: 25,
            whiteSpace: 'nowrap',
            ...(titleOnRight ? { right: '6px' } : { left: '6px' }),
          }}
        >
          {title}
        </div>

        {/* Value thumb — hidden when noValue */}
        {!noValue && (
          <div
            style={{
              position: 'absolute',
              left: `${valuePosition}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#fff',
              border: `2px solid ${color}`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              zIndex: 30,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {valueLabel}
          </div>
        )}

      </div>
    </div>
  );
}