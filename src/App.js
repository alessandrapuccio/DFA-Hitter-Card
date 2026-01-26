import React, { useState } from 'react';
import TrinityTrident from './components/TrinityTrident';
import DeviationSlider from './components/DeviationSlider';
import WRCPlusChart from './components/WRCPlusChart.js';
import LevelTimeBar from './components/LevelTimeBar.js';
import CatchingChart from './components/CatchingChart.js';
import RollingTMWRCPlot from './components/RollingWRCPlot.js';

export default function App() {
  return (
    
    <div className="min-h-screen bg-gray-50 py-8">
      <RollingTMWRCPlot/>
      <LevelTimeBar/>
      <CatchingChart/>
      <h1 className="text-3xl font-bold text-center mb-8">Standard Deviation Slider</h1>
      
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">batspeed</h2>
          <DeviationSlider 
            currentValue={72.5}
            avgValue={70.5}
            stdDev={2.6}
            aboveOrBelowRed="below"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">sprint speed (ft / s)</h2>
          <DeviationSlider 
            currentValue={26.8}
            avgValue={27.6}
            stdDev={1.40}
            aboveOrBelowRed="below"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">avg ev</h2>
          <DeviationSlider 
            currentValue={89.4}
            avgValue={88.6}
            stdDev={5}
            aboveOrBelowRed="below"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">sac</h2>
          <DeviationSlider 
            currentValue={105}
            avgValue={100}
            stdDev={10}
            aboveOrBelowRed="below"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">adv</h2>
          <DeviationSlider 
            currentValue={117}
            avgValue={100}
            stdDev={10}
            aboveOrBelowRed="below"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">gdp</h2>
          <DeviationSlider 
            currentValue={98}
            avgValue={100}
            stdDev={10}
            aboveOrBelowRed="below"
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">sb+</h2>
          <DeviationSlider 
            currentValue={101}
            avgValue={100}
            stdDev={10}
            aboveOrBelowRed="below"
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">max ev</h2>
          <DeviationSlider 
            currentValue={113.1}
            avgValue={122.9}
            stdDev={10}
            aboveOrBelowRed="below"
          />
        </div>

        <TrinityTrident/>
        <WRCPlusChart vL={74} vR={99}/>
       
      </div>
       
      

    </div>
    
  );
}