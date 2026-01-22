import React from 'react';

export default function WRCPlusChart({ vR, vL }) {
  const getBarColor = (value) => {
    if (value >= 110) return 'bg-green-500';
    if (value <= 90) return 'bg-red-500';
    return 'bg-gray-500';
  };

  const getBarHeight = (value) => {
    // Scale: 0 = 0%, 100 = 50%, 170 = 85%
    const maxHeight = 85; // 170 is the max
    const height = (value / 170) * 100;
    return Math.min(Math.max(height, 0), maxHeight);
  };

  const BarColumn = ({ value, label }) => {
    const height = getBarHeight(value);
    const color = getBarColor(value);

    return (
      <div className="flex flex-col items-center flex-1">
        <div className="relative w-20 h-64 bg-gray-200 rounded-lg overflow-hidden">
          {/* Bar */}
          <div
            className={`absolute bottom-0 w-full ${color} transition-all duration-500 rounded-t-lg flex flex-col items-center`}
            style={{ height: `${height}%` }}
          >
            <span className="text-white font-bold text-3xl mt-4">{value}</span>
            <div className="flex-1"></div>
            <span className="text-white font-semibold text-2xl mb-3">{label}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="bg-white rounded-2xl shadow-lg px-16 py-12 relative overflow-visible">
        <div className="flex gap-6 items-end relative">
          <BarColumn value={vL} label="vL" />
          <BarColumn value={vR} label="vR" />

          {/* Dotted line spanning both bars and extending beyond - on top */}
          <div
            className="absolute border-t-2 border-dashed border-gray-400 z-10"
            style={{ bottom: '58.82%', left: '-40px', right: '-40px' }}
          >
            <span className="absolute -left-8 -top-2 text-sm text-gray-600 font-medium">
              100
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
