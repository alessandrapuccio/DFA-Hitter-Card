import React, { useState } from 'react';

export default function ShortDeviationSlider({ currentValue, avgValue, stdDev, aboveOrBelowRed, minRange, maxRange, title, percent = false }) {

  const [value, setValue] = useState(currentValue);
  
  // Calculate the color based on deviation from average
  const getColor = () => {
    const deviation = (value - avgValue) / stdDev;
    
    // At least 1 SD above average
    if (deviation >= 1) {
      return aboveOrBelowRed === 'above' ? '#dc2626' : '#16a34a'; // red : green
    }
    // At least 1 SD below average
    else if (deviation <= -1) {
      return aboveOrBelowRed === 'below' ? '#dc2626' : '#16a34a'; // red : green
    }
    // Within 1 SD of average (default)
    else {
      return '#9ca3af'; // gray
    }
  };
  
  // Use provided range or calculate symmetric range around average (3 SD on each side)
  const range = stdDev * 7;
  const minValue = minRange !== undefined ? minRange : avgValue - range;
  const maxValue = maxRange !== undefined ? maxRange : avgValue + range;
  
  const color = getColor();
  
  // Calculate position of average tick mark (should always be at 50% when range is symmetric)
  const avgPosition = 50;
  
  // Calculate position of current value for label
  const valuePosition = ((value - minValue) / (maxValue - minValue)) * 100;
  
  // Determine if title should be on right side (when value is low and would obscure title)
  const titleOnRight = valuePosition < 33;
  
  // Format value label
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
            background: color
          }}
        />
       {/* Custom Thumb */}
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


        
        {/* Title inside slider */}
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
        
        {/* Tick mark at average */}
        <div 
          className="absolute w-1 bg-black pointer-events-none"
          style={{ 
            left: `${avgPosition}%`, 
            top: '45%',
            transform: 'translate(-50%, -50%)',
            height: '64px'
          }}
        >
        </div>
      </div>
    </div>
  );
}