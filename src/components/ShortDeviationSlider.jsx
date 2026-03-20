import React, { useState } from 'react';

export default function ShortDeviationSlider({
  currentValue,
  avgValue,
  stdDev,
  aboveOrBelowRed,
  minRange,
  maxRange,
  title,
  percent = false,
}) {
  const [value, setValue] = useState(currentValue);

  const shouldInvert = aboveOrBelowRed === 'above';
  const range = stdDev * 7;
  const minValue = minRange !== undefined ? minRange : avgValue - range;
  const maxValue = maxRange !== undefined ? maxRange : avgValue + range;

  const getColor = (v) => {
    const deviation = (v - avgValue) / stdDev;
    if (deviation >= 1) return aboveOrBelowRed === 'above' ? '#dc2626' : '#16a34a';
    if (deviation <= -1) return aboveOrBelowRed === 'below' ? '#dc2626' : '#16a34a';
    return '#9ca3af';
  };

  const color = getColor(value);
  const rawPosition = ((value - minValue) / (maxValue - minValue)) * 100;
  // valuePosition controls thumb placement (inverted for descending sliders)
  const valuePosition = shouldInvert ? 100 - rawPosition : rawPosition;
  const titleOnRight = valuePosition < 33;

  // Fill always grows from the left, so label is on shadow when it's to the right of the thumb
  const labelOnShadow = titleOnRight;
  const titleColor = labelOnShadow ? '#6b7280' : '#fff';

  const valueLabel = percent ? `${Math.round(value)}%` : Math.round(value);

  // Fill always anchors to left, width tracks valuePosition
  const fillStyle = { left: 0, width: `${valuePosition}%` };

  return (
    <div style={{ padding: '3px 12px', width: '102%', boxSizing: 'border-box' }}>
      <div style={{ position: 'relative', marginTop: '7px',marginLeft: '-2px', height: '32px' }}>

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

        {/* Colored fill up to thumb */}
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

        {/* Value thumb */}
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

        {/* Invisible range input for interaction */}
        <input
          type="range"
          min={minValue}
          max={maxValue}
          step={(maxValue - minValue) / 100}
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '100%',
            margin: 0,
            zIndex: 10,
            opacity: 0,
            cursor: 'grab',
            height: '28px',
          }}
        />
      </div>
    </div>
  );
}