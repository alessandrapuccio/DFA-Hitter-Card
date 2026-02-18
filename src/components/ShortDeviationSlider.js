import React, { useState } from 'react';

export default function ShortDeviationSlider({ currentValue, avgValue, stdDev, aboveOrBelowRed, minRange, maxRange, title, percent = false }) {

  const [value, setValue] = useState(currentValue);
  
  const shouldInvert = aboveOrBelowRed === 'above';
  
  const getColor = () => {
    const deviation = (value - avgValue) / stdDev;
    if (deviation >= 1) return aboveOrBelowRed === 'above' ? '#dc2626' : '#16a34a';
    else if (deviation <= -1) return aboveOrBelowRed === 'below' ? '#dc2626' : '#16a34a';
    else return '#9ca3af';
  };
  
  const range = stdDev * 7;
  const minValue = minRange !== undefined ? minRange : avgValue - range;
  const maxValue = maxRange !== undefined ? maxRange : avgValue + range;
  const color = getColor();
  const avgPosition = 50;
  const rawPosition = ((value - minValue) / (maxValue - minValue)) * 100;
  const valuePosition = shouldInvert ? 100 - rawPosition : rawPosition;
  const titleOnRight = valuePosition < 33;
  const valueLabel = percent ? `${value.toFixed(0)}%` : value.toFixed(0);
  
  return (
    <div className="px-6 py-2 mx-auto" style={{ maxWidth: '440px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-slider {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          width: 100%;
          height: 48px;
          border-radius: 24px;
          outline: none;
          cursor: pointer;
        }
        .custom-slider::-ms-thumb {
          width: 72px !important;
          height: 72px !important;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
        }
      `}} />
      
      <div className="relative" style={{ marginTop: '20px' }}>
        <input
          type="range"
          min={minValue}
          max={maxValue}
          step={(maxValue - minValue) / 100}
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          className="custom-slider"
          style={{
            background: color,
            direction: shouldInvert ? 'rtl' : 'ltr'
          }}
        />
        <div
          className="absolute flex items-center justify-center font-bold"
          style={{
            left: `${valuePosition}%`,
            top: '45%',
            transform: 'translate(-50%, -50%)',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            border: `4px solid ${color}`,
            color: color,
            zIndex: 30,
            fontSize: '28px'
          }}
        >
          {valueLabel}
        </div>
        <div 
          className="absolute top-1/2 text-white font-bold pointer-events-none"
          style={{ 
            [titleOnRight ? 'right' : 'left']: '10px',
            transform: 'translateY(-60%)',
            fontSize: '26px'
          }}
        >
          {title}
        </div>
        <div 
          className="absolute w-1 bg-black pointer-events-none"
          style={{ 
            left: `${avgPosition}%`, 
            top: '45%',
            transform: 'translate(-50%, -50%)',
            height: '64px'
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Variation 1: Black outline pill shows full range, filled portion is colored,
// unfilled portion is white inside a black-bordered pill.
// ─────────────────────────────────────────────────────────────────────────────
export function DeviationSliderV1({ currentValue, avgValue, stdDev, aboveOrBelowRed, minRange, maxRange, title, percent = false }) {
  const [value, setValue] = useState(currentValue);
  const shouldInvert = aboveOrBelowRed === 'above';

  const getColor = () => {
    const deviation = (value - avgValue) / stdDev;
    if (deviation >= 1) return aboveOrBelowRed === 'above' ? '#dc2626' : '#16a34a';
    else if (deviation <= -1) return aboveOrBelowRed === 'below' ? '#dc2626' : '#16a34a';
    else return '#9ca3af';
  };

  const range = stdDev * 7;
  const minValue = minRange !== undefined ? minRange : avgValue - range;
  const maxValue = maxRange !== undefined ? maxRange : avgValue + range;
  const color = getColor();
  const avgPosition = 50;
  const rawPosition = ((value - minValue) / (maxValue - minValue)) * 100;
  const valuePosition = shouldInvert ? 100 - rawPosition : rawPosition;
  const titleOnRight = valuePosition < 33;
  const valueLabel = percent ? `${value.toFixed(0)}%` : value.toFixed(0);

  // Always fill left-to-right using rawPosition (the actual data position, not flipped)
  const fillGradient = `linear-gradient(to right, ${color} ${valuePosition}%, white ${valuePosition}%)`;

  return (
    <div className="px-6 py-2 mx-auto" style={{ maxWidth: '440px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .v1-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 48px;
          border-radius: 24px;
          outline: none;
          cursor: pointer;
          border: 3px solid #111;
          box-sizing: border-box;
        }
        .v1-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 0; height: 0; opacity: 0; }
        .v1-slider::-moz-range-thumb { width: 0; height: 0; opacity: 0; border: none; }
      `}} />

      <div className="relative" style={{ marginTop: '20px' }}>
        <input
          type="range"
          min={minValue}
          max={maxValue}
          step={(maxValue - minValue) / 100}
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          className="v1-slider"
          style={{ background: fillGradient }}
        />

        {/* Dot */}
        <div
          className="absolute flex items-center justify-center font-bold"
          style={{
            left: `${valuePosition}%`,
            top: '45%',
            transform: 'translate(-50%, -50%)',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            border: `4px solid #111`,
            color: color,
            zIndex: 30,
            fontSize: '28px'
          }}
        >
          {valueLabel}
        </div>

        {/* Title */}
        <div
          className="absolute top-1/2 font-bold pointer-events-none"
          style={{
            [titleOnRight ? 'right' : 'left']: '10px',
            transform: 'translateY(-60%)',
            fontSize: '26px',
            color: titleOnRight ? '#111' : '#fff',
            zIndex: 20,
          }}
        >
          {title}
        </div>

        {/* Avg tick */}
        <div
          className="absolute w-1 bg-black pointer-events-none"
          style={{ left: `${avgPosition}%`, top: '45%', transform: 'translate(-50%, -50%)', height: '64px' }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Variation 2: Outline matches slider color, unfilled portion is white.
// ─────────────────────────────────────────────────────────────────────────────
export function DeviationSliderV2({ currentValue, avgValue, stdDev, aboveOrBelowRed, minRange, maxRange, title, percent = false }) {
  const [value, setValue] = useState(currentValue);
  const shouldInvert = aboveOrBelowRed === 'above';

  const getColor = () => {
    const deviation = (value - avgValue) / stdDev;
    if (deviation >= 1) return aboveOrBelowRed === 'above' ? '#dc2626' : '#16a34a';
    else if (deviation <= -1) return aboveOrBelowRed === 'below' ? '#dc2626' : '#16a34a';
    else return '#9ca3af';
  };

  const range = stdDev * 7;
  const minValue = minRange !== undefined ? minRange : avgValue - range;
  const maxValue = maxRange !== undefined ? maxRange : avgValue + range;
  const color = getColor();
  const avgPosition = 50;
  const rawPosition = ((value - minValue) / (maxValue - minValue)) * 100;
  const valuePosition = shouldInvert ? 100 - rawPosition : rawPosition;
  const titleOnRight = valuePosition < 33;
  const valueLabel = percent ? `${value.toFixed(0)}%` : value.toFixed(0);

  const fillGradient = `linear-gradient(to right, ${color} ${valuePosition}%, white ${valuePosition}%)`;

  return (
    <div className="px-6 py-2 mx-auto" style={{ maxWidth: '440px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .v2-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 48px;
          border-radius: 24px;
          outline: none;
          cursor: pointer;
          box-sizing: border-box;
        }
        .v2-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 0; height: 0; opacity: 0; }
        .v2-slider::-moz-range-thumb { width: 0; height: 0; opacity: 0; border: none; }
      `}} />

      <div className="relative" style={{ marginTop: '20px' }}>
        <input
          type="range"
          min={minValue}
          max={maxValue}
          step={(maxValue - minValue) / 100}
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          className="v2-slider"
          style={{
            background: fillGradient,
            border: `3px solid ${color}`,
          }}
        />

        {/* Dot */}
        <div
          className="absolute flex items-center justify-center font-bold"
          style={{
            left: `${valuePosition}%`,
            top: '45%',
            transform: 'translate(-50%, -50%)',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            border: `4px solid ${color}`,
            color: color,
            zIndex: 30,
            fontSize: '28px'
          }}
        >
          {valueLabel}
        </div>

        {/* Title */}
        <div
          className="absolute top-1/2 font-bold pointer-events-none"
          style={{
            [titleOnRight ? 'right' : 'left']: '10px',
            transform: 'translateY(-60%)',
            fontSize: '26px',
            color: titleOnRight ? color : '#fff',
            zIndex: 20,
          }}
        >
          {title}
        </div>

        {/* Avg tick */}
        <div
          className="absolute w-1 pointer-events-none"
          style={{ left: `${avgPosition}%`, top: '45%', transform: 'translate(-50%, -50%)', height: '64px', backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Variation 3: No outline. Unfilled portion is a phantom light grey.
// The filled portion is the colored track; unfilled is #e5e7eb (light grey).
// ─────────────────────────────────────────────────────────────────────────────
export function DeviationSliderV3({ currentValue, avgValue, stdDev, aboveOrBelowRed, minRange, maxRange, title, percent = false }) {
  const [value, setValue] = useState(currentValue);
  const shouldInvert = aboveOrBelowRed === 'above';

  const getColor = () => {
    const deviation = (value - avgValue) / stdDev;
    if (deviation >= 1) return aboveOrBelowRed === 'above' ? '#dc2626' : '#16a34a';
    else if (deviation <= -1) return aboveOrBelowRed === 'below' ? '#dc2626' : '#16a34a';
    else return '#9ca3af';
  };

  const range = stdDev * 7;
  const minValue = minRange !== undefined ? minRange : avgValue - range;
  const maxValue = maxRange !== undefined ? maxRange : avgValue + range;
  const color = getColor();
  const avgPosition = 50;
  const rawPosition = ((value - minValue) / (maxValue - minValue)) * 100;
  const valuePosition = shouldInvert ? 100 - rawPosition : rawPosition;
  const titleOnRight = valuePosition < 33;
  const valueLabel = percent ? `${value.toFixed(0)}%` : value.toFixed(0);

  const phantomGrey = '#e5e7eb';
  const fillGradient = `linear-gradient(to right, ${color} ${valuePosition}%, ${phantomGrey} ${valuePosition}%)`;

  return (
    <div className="px-6 py-2 mx-auto" style={{ maxWidth: '440px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .v3-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 48px;
          border-radius: 24px;
          outline: none;
          cursor: pointer;
          border: none;
          box-sizing: border-box;
        }
        .v3-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 0; height: 0; opacity: 0; }
        .v3-slider::-moz-range-thumb { width: 0; height: 0; opacity: 0; border: none; }
      `}} />

      <div className="relative" style={{ marginTop: '20px' }}>
        <input
          type="range"
          min={minValue}
          max={maxValue}
          step={(maxValue - minValue) / 100}
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          className="v3-slider"
          style={{ background: fillGradient }}
        />

        {/* Dot */}
        <div
          className="absolute flex items-center justify-center font-bold"
          style={{
            left: `${valuePosition}%`,
            top: '45%',
            transform: 'translate(-50%, -50%)',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            border: `4px solid ${color}`,
            color: color,
            zIndex: 30,
            fontSize: '28px'
          }}
        >
          {valueLabel}
        </div>

        {/* Title - colored text when on the grey side, white when on colored side */}
        <div
          className="absolute top-1/2 font-bold pointer-events-none"
          style={{
            [titleOnRight ? 'right' : 'left']: '10px',
            transform: 'translateY(-60%)',
            fontSize: '26px',
            color: titleOnRight ? '#6b7280' : '#fff',
            zIndex: 20,
          }}
        >
          {title}
        </div>

        {/* Avg tick */}
        <div
          className="absolute w-1 bg-black pointer-events-none"
          style={{ left: `${avgPosition}%`, top: '45%', transform: 'translate(-50%, -50%)', height: '64px', opacity: 0.7 }}
        />
      </div>
    </div>
  );
}