import React from 'react';
import RollingAveragePlot from '../components/RollingAveragePlot';
import julioData from '../data/julio_tmrc.json';

export default function RollingAvgPreview() {
  return (
    <div style={{ padding: 24, maxWidth: 700 }}>
      <RollingAveragePlot
        rawData={julioData}
        rollingWindow={1000}
        maxPAs={500}
        height={160}
      />
    </div>
  );
}