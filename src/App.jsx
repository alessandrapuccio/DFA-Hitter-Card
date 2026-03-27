import React, { useState } from 'react';
import TrinityTrident from './components/TrinityTrident';
import DeviationSlider from './components/DeviationSlider';
// import ShortDeviationSlider from './components/ShortDeviationSlider';
import ShortDeviationSlider, { DeviationSliderV1, DeviationSliderV2, DeviationSliderV3 } from './components/ShortDeviationSlider';
import WRCPlusChart from './components/WRCPlusChart.js';
import LevelTimeBar from './components/LevelTimeBar.js';
import CatchingChart from './components/CatchingChart.js';
import RollingTMWRCPlot from './components/RollingWRCPlot.js';
import HitterCard from './components/HitterCard.js';


const SLIDERS_LEFT = [
  { currentValue: 350, avgValue: 350, stdDev: 28, aboveOrBelowRed: "NA", title: "PA" },
  { currentValue: 95, avgValue: 100, stdDev: 10, aboveOrBelowRed: "below", title: "TM wRC+" },
  { currentValue: 100, avgValue: 100, stdDev: 10, aboveOrBelowRed: "below", title: "wRC+" },
  { currentValue: 34, avgValue: 21.4, stdDev: 6.7, aboveOrBelowRed: "above", title: "K%", percent: true },
  { currentValue: 22, avgValue: 10.5, stdDev: 3.6, aboveOrBelowRed: "below", title: "BB%", percent: true },
];

const SLIDERS_RIGHT = [
  { currentValue: 14.7, avgValue: 24.7, stdDev: 5.8, aboveOrBelowRed: "above", title: "Chase" },
  { currentValue: 62.2, avgValue: 65.6, stdDev: 5.8, aboveOrBelowRed: "below", title: "ZSwing" },
  { currentValue: 29.5, avgValue: 16.2, stdDev: 5.1, aboveOrBelowRed: "above", title: "ZWhiff" },
  { currentValue: 111.7, avgValue: 106, stdDev: 2.8, aboveOrBelowRed: "below", title: "EV T10%" },
  { currentValue: 72.4, avgValue: 70.5, stdDev: 2.6, aboveOrBelowRed: "below", title: "Bat T10%" },
];

const VARIANTS = [
  { label: "Original", Component: ShortDeviationSlider },
  { label: "V1 — Black outline, white unfilled", Component: DeviationSliderV1 },
  { label: "V2 — Color outline, white unfilled", Component: DeviationSliderV2 },
  { label: "V3 — No outline, phantom grey", Component: DeviationSliderV3 },
];

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <HitterCard />
    </div>
  );
}
