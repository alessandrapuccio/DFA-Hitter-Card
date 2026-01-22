import React from 'react';

export default function TrinityTrident({ swdec = 111, dmg = 104, con = 63 }) {
  // Calculate prong heights with more variation for typical ranges (50-150)
  const minValue = 50;
  const maxValue = 150;
  const minHeight = 170; // Longer prongs - moved up 10 pixels
  const maxHeight = 290;
  
  const getHeight = (value) => {
    // Clamp value to expected range for better visualization
    const clampedValue = Math.max(minValue, Math.min(value, maxValue));
    const normalized = (clampedValue - minValue) / (maxValue - minValue);
    return minHeight + (normalized * (maxHeight - minHeight));
  };

  const leftHeight = getHeight(swdec);
  const centerHeight = getHeight(dmg);
  const rightHeight = getHeight(con);
  
  // Calculate the height for value 100 (the baseline)
  const baselineHeight = getHeight(100);

  // Function to get color based on value
  const getColor = (value) => {
    if (value > 110) return '#22c55e'; // green
    if (value < 90) return '#ef4444'; // red
    return '#64748b'; // default slate
  };

  // Function to get background color based on value
  const getBgColor = (value) => {
    if (value > 110) return '#dcfce7'; // light green
    if (value < 90) return '#fee2e2'; // light red
    return '#f1f5f9'; // light slate
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl">

        {/* Trident Visualization */}
        <div className="relative h-96 flex items-end justify-center">
          <svg width="400" height="384" viewBox="0 0 400 384" className="relative z-10">

            {/* Ghost prongs (baseline at 100) */}
            <g opacity="0.3">
              <line x1="120" y1={384 - baselineHeight + 15} x2="120" y2="280" stroke="#94a3b8" strokeWidth="28" strokeLinecap="butt" />
              <line x1="200" y1={384 - baselineHeight + 15} x2="200" y2="280" stroke="#94a3b8" strokeWidth="28" strokeLinecap="butt" />
              <line x1="280" y1={384 - baselineHeight + 15} x2="280" y2="280" stroke="#94a3b8" strokeWidth="28" strokeLinecap="butt" />
            </g>

            {/* Dotted line at 100 */}
            <line 
              x1="80" 
              y1={384 - baselineHeight} 
              x2="320" 
              y2={384 - baselineHeight} 
              stroke="#94a3b8" 
              strokeWidth="2" 
              strokeDasharray="4,4"
            />
            <text 
              x="73" 
              y={384 - baselineHeight + 7} 
              textAnchor="end" 
              fontSize={24} 
              fontWeight="600" 
              fill="#94a3b8"
            >
              100
            </text>

            {/* Left prong (swDEC+) */}
            <g>
                <line x1="120" y1={384 - leftHeight + 30} x2="120" y2="280" stroke="#d97706" strokeWidth="28" strokeLinecap="butt" />
                <polygon points={`120,${384 - leftHeight} 100,${384 - leftHeight + 35} 140,${384 - leftHeight + 35}`} fill="#d97706" />
                <rect x="80" y={384 - leftHeight - 50} width="80" height="40" rx="6" fill={getBgColor(swdec)} />
                <text x="120" y={384 - leftHeight - 15} textAnchor="middle" fontSize={40} fontWeight="bold" fill={getColor(swdec)}>{swdec}</text>
            </g>

            {/* Center prong (DMG+) */}
            <g>
                <line x1="200" y1={384 - centerHeight + 30} x2="200" y2="280" stroke="#d97706" strokeWidth="28" strokeLinecap="butt" />
                <polygon points={`200,${384 - centerHeight} 180,${384 - centerHeight + 35} 220,${384 - centerHeight + 35}`} fill="#d97706" />
                <rect x="162" y={384 - centerHeight - 50} width="80" height="40" rx="6" fill={getBgColor(dmg)} />
                <text x="200" y={384 - centerHeight - 15} textAnchor="middle" fontSize={40} fontWeight="bold" fill={getColor(dmg)}>{dmg}</text>
            </g>
            
            {/* Right prong (CON+) */}
            <g>
                <line x1="280" y1={384 - rightHeight + 30} x2="280" y2="280" stroke="#d97706" strokeWidth="28" strokeLinecap="butt" />
                <polygon points={`280,${384 - rightHeight} 260,${384 - rightHeight + 35} 300,${384 - rightHeight + 35}`} fill="#d97706" />
                <rect x="244" y={384 - rightHeight - 50} width="80" height="40" rx="6" fill={getBgColor(con)} />
                <text x="280" y={384 - rightHeight - 15} textAnchor="middle" fontSize={40} fontWeight="bold" fill={getColor(con)}>{con}</text>
            </g>

            
            {/* Base/Handle */}
            <g>
              {/* Curved connections to center */}
              <path 
                d="M 120 280 Q 160 300, 200 300" 
                stroke="#d97706" 
                strokeWidth="28" 
                fill="none"
                strokeLinecap="round"
              />
              <path 
                d="M 280 280 Q 240 300, 200 300" 
                stroke="#d97706" 
                strokeWidth="28" 
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Center prong connection to handle */}
              <line 
                x1="200" 
                y1="280" 
                x2="200" 
                y2="300" 
                stroke="#d97706" 
                strokeWidth="28" 
                strokeLinecap="round"
              />
              
              {/* Main handle */}
              <line 
                x1="200" 
                y1="300" 
                x2="200" 
                y2="355" 
                stroke="#d97706" 
                strokeWidth="32" 
                strokeLinecap="round"
              />
            </g>

            {/* Labels on top layer */}
            <g>
              <text 
                x="136" 
                y="256" 
                textAnchor="middle" 
                fontSize={22} 
                fontWeight="bold" 
                fill="#ffffff"
                transform="rotate(-90, 128, 256)"
              >
                swDEC+
              </text>
              <text 
                x="208" 
                y="270" 
                textAnchor="middle" 
                fontSize={22} 
                fontWeight="bold" 
                fill="#ffffff"
                transform="rotate(-90, 208, 270)"
              >
                DMG+
              </text>
              <text 
                x="290" 
                y="260" 
                textAnchor="middle" 
                fontSize={22} 
                fontWeight="bold" 
                fill="#ffffff"
                transform="rotate(-90, 288, 260)"
              >
                CON+
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}