import React, { useState } from 'react';

export default function DeviationSlider({ currentValue, avgValue, stdDev, aboveOrBelowRed, minRange, maxRange }) {

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
  
  return (
    <div className="p-6 mx-auto" style={{ maxWidth: '295px' }}>
      <div className="text-sm text-gray-600 mb-1 text-center">
        Avg: {avgValue.toFixed(1)}
      </div>
      
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
          border: none;
        }
      `}</style>
      
      <div className="relative">
        <input
          type="range"
          min={minValue}
          max={maxValue}
          step={(maxValue - minValue) / 100}
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          className="w-full h-4 rounded-lg appearance-none cursor-pointer"
          style={{
            background: color
          }}
        />
        
        {/* Tick mark at average */}
        <div 
          className="absolute top-0 w-0.5 h-5 bg-black"
          style={{ left: `${avgPosition}%`, transform: 'translateX(-50%)' }}
        />
      </div>
    </div>
  );
}