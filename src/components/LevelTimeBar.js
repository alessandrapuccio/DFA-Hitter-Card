export default function LevelTimeBar({ levels = ['3A', 'MLB'], percentages = [83, 17] }) {
  // Color mapping for different levels
  const levelColors = {
    'MLB': '#08519c', // blue
    '3A': '#3182bd', // grey
    '2A': '#6baed6', // green
    '1A': '#bdd7e7', // amber
    'RK': '#eff3ff', // purple
  };

  // Default color if level not in mapping
  const getColor = (level) => levelColors[level] || '#9ca3af';

  return (
    <div className="w-full max-w-[990px] mx-auto p-6">
        <div className="relative h-[110px] bg-gray-200 rounded-lg overflow-hidden flex">
        {levels.map((level, index) => {
          const percentage = percentages[index];
          const color = getColor(level);
          const showLabel = percentage >= 10; // Only show label if segment is at least 10%
          
          return (
            <div
              key={index}
              className="relative flex items-center justify-center transition-all duration-300 hover:opacity-80"
              style={{
                width: `${percentage}%`,
                backgroundColor: color,
              }}
            >
            {showLabel && (
                <div
                    className="text-white font-bold text-center px-2 flex flex-col gap-1"
                    style={{ fontSize: '60px', lineHeight: '.8' }}
                >
                    <div>{level}</div>
                    <div style={{ fontSize: '48px' }}>{percentage}%</div>
                </div>
            )}
            </div>
          );
        })}
      </div>
      
      {/* Legend below for segments too small to label */}
      {percentages.some(p => p < 10) && (
        <div className="mt-4 flex flex-wrap gap-4 justify-center" style={{ fontSize: '48px' }}>
          {levels.map((level, index) => {
            if (percentages[index] < 10) {
              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: getColor(level) }}
                  />
                  <span>{level}: {percentages[index]}%</span>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}