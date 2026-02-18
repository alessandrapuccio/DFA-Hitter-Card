import React, { useState } from 'react';
import TrinityTrident from './components/TrinityTrident';
import DeviationSlider from './components/DeviationSlider';
// import ShortDeviationSlider from './components/ShortDeviationSlider';
import ShortDeviationSlider, { DeviationSliderV1, DeviationSliderV2, DeviationSliderV3 } from './components/ShortDeviationSlider';
import WRCPlusChart from './components/WRCPlusChart.js';
import LevelTimeBar from './components/LevelTimeBar.js';
import CatchingChart from './components/CatchingChart.js';
import RollingTMWRCPlot from './components/RollingWRCPlot.js';


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
    <div className="min-h-screen bg-white">
      {VARIANTS.map(({ label, Component }) => (
        <div key={label}>
          {/* Section Header */}
          <div className="grid grid-cols-2 border-b-4 border-black">
            <div className="bg-blue-950 text-white px-8 py-4">
              <h1 className="text-4xl font-bold italic">RESULTS</h1>
            </div>
            <div className="bg-blue-950 text-white px-8 py-4 text-right">
              <h1 className="text-4xl font-bold italic">TM</h1>
            </div>
          </div>

          {/* Variant label */}
          <div className="bg-gray-100 px-8 py-2 text-sm font-mono text-gray-500 border-b border-gray-300">
            {label}
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-2 border-b-4 border-black mb-4">
            <div className="border-r-2 border-black">
              {SLIDERS_LEFT.map((props) => (
                <Component key={props.title} {...props} />
              ))}
            </div>
            <div>
              {SLIDERS_RIGHT.map((props) => (
                <Component key={props.title} {...props} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}





////// HITTING COLUMNS OF VALUES RESULTS AND TM
// export default function App() {

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <div className="grid grid-cols-2 border-b-4 border-black">
//         <div className="bg-blue-950 text-white px-8 py-4">
//           <h1 className="text-4xl font-bold italic">RESULTS</h1>
//         </div>
//         <div className="bg-blue-950 text-white px-8 py-4 text-right">
//           <h1 className="text-4xl font-bold italic">TM</h1>
//         </div>
//       </div>

//       {/* Sliders Grid */}
//       <div className="grid grid-cols-2">
//         {/* RESULTS Column */}
//         <div className="border-r-2 border-black">
//           <ShortDeviationSlider 
//             currentValue={350}
//             avgValue={350}
//             stdDev={28}
//             aboveOrBelowRed="NA"
//             title="PA"
//           />
          
//           <ShortDeviationSlider 
//             currentValue={95}
//             avgValue={100}
//             stdDev={10}
//             aboveOrBelowRed="below"
//             title="TM wRC+"
//           />
          
//           <ShortDeviationSlider 
//             currentValue={100}
//             avgValue={100}
//             stdDev={10}
//             aboveOrBelowRed="below"
//             title="wRC+"
//           />
          
//           <ShortDeviationSlider 
//             currentValue={34}
//             avgValue={21.4}
//             stdDev={6.7}
//             aboveOrBelowRed="above"
//             title="K%"
//             percent={true}
//           />
          
//           <ShortDeviationSlider 
//             currentValue={22}
//             avgValue={10.5}
//             stdDev={3.6}
//             aboveOrBelowRed="below"
//             title="BB%"
//             percent={true}
//           />
//         </div>

//         {/* TM Column */}
//         <div>
//           <ShortDeviationSlider 
//             currentValue={14.7}
//             avgValue={24.7}
//             stdDev={5.8}
//             aboveOrBelowRed="above"
//             title="Chase"
//           />
          
//           <ShortDeviationSlider 
//             currentValue={62.2}
//             avgValue={65.6}
//             stdDev={5.8}
//             aboveOrBelowRed="below"
//             title="ZSwing"
//           />
          
//           <ShortDeviationSlider 
//             currentValue={29.5}
//             avgValue={16.2}
//             stdDev={5.1}
//             aboveOrBelowRed="above"
//             title="ZWhiff"
//           />
          
//           <ShortDeviationSlider 
//             currentValue={111.7}
//             avgValue={106}
//             stdDev={2.8}
//             aboveOrBelowRed="below"
//             title="EV T10%"
//           />
          
//           <ShortDeviationSlider 
//             currentValue={72.4}
//             avgValue={70.5}
//             stdDev={2.6}
//             aboveOrBelowRed="below"
//             title="Bat T10%"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }






//////// ALL THE COMPONENTS 

//   return (
    
//     <div className="min-h-screen bg-gray-50 py-8">
//       <RollingTMWRCPlot/>
//       <LevelTimeBar/>
//       <CatchingChart/>
//       <h1 className="text-3xl font-bold text-center mb-8">Standard Deviation Slider</h1>
      
//       <div className="space-y-8 max-w-2xl mx-auto">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">batspeed</h2>
//           <DeviationSlider 
//             currentValue={72.5}
//             avgValue={70.5}
//             stdDev={2.6}
//             aboveOrBelowRed="below"
//           />
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">tm wrc+</h2>
//           <ShortDeviationSlider 
//             currentValue={95}
//             avgValue={100}
//             stdDev={10}
//             aboveOrBelowRed="above"
//             title="TM wRC+"
//           />
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">wrc+ real</h2>
//           <ShortDeviationSlider 
//             currentValue={100}
//             avgValue={100}
//             stdDev={10}
//             aboveOrBelowRed="above"
//             title="wRC+"
//           />
//         </div>
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">K%</h2>
//           <ShortDeviationSlider 
//             currentValue={34}
//             avgValue={21.4}
//             stdDev={6.7}
//             aboveOrBelowRed="above"
//             title="K%"
//             percent={true}
//           />
//         </div>
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">BB%</h2>
//           <ShortDeviationSlider 
//             currentValue={22}
//             avgValue={10.5}
//             stdDev={3.6}
//             aboveOrBelowRed="below"
//             title="BB%"
//             percent={true}
//           />
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">PAss</h2>
//           <ShortDeviationSlider 
//             currentValue={350}
//             avgValue={350}
//             stdDev={28}
//             aboveOrBelowRed="NA"
//             title="PA"
//           />
//         </div>



















//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">CHASE</h2>
//           <ShortDeviationSlider 
//             currentValue={-12.8}
//             avgValue={0}
//             stdDev={5.8}
//             aboveOrBelowRed="above"
//             title="Chase"
//           />
//         </div>

 
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">dmg zone sw rate</h2>
//           <ShortDeviationSlider 
//             currentValue={-3.1}
//             avgValue={0}
//             stdDev={5.8}
//             aboveOrBelowRed="below"
//             title="ZSwing"
//           />
//         </div>
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">in zone whiff rate</h2>
//           <ShortDeviationSlider 
//             currentValue={13.3}
//             avgValue={0}
//             stdDev={5.1}
//             aboveOrBelowRed="above"
//             title="ZWhiff"
//           />
//         </div>
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">EV top 10%</h2>
//           <ShortDeviationSlider 
//             currentValue={111.7}
//             avgValue={106}
//             stdDev={2.8}
//             aboveOrBelowRed="below"
//             title="EV T10%"
//           />
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">bat speed top 10%</h2>
//           <ShortDeviationSlider 
//             currentValue={72.4}
//             avgValue={70.5}
//             stdDev={2.6}
//             aboveOrBelowRed="below"
//             title="Bat T10%"
//           />
//         </div>


















//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">sprint speed (ft / s)</h2>
//           <DeviationSlider 
//             currentValue={26.8}
//             avgValue={27.6}
//             stdDev={1.40}
//             aboveOrBelowRed="below"
//           />
//         </div>


//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">BSR+</h2>
//           <DeviationSlider 
//             currentValue={108}
//             avgValue={100}
//             stdDev={10}
//             aboveOrBelowRed="below"
//           />
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">avg ev</h2>
//           <DeviationSlider 
//             currentValue={89.4}
//             avgValue={88.6}
//             stdDev={5}
//             aboveOrBelowRed="below"
//           />
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">sac</h2>
//           <DeviationSlider 
//             currentValue={105}
//             avgValue={100}
//             stdDev={10}
//             aboveOrBelowRed="below"
//           />
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">adv</h2>
//           <DeviationSlider 
//             currentValue={117}
//             avgValue={100}
//             stdDev={10}
//             aboveOrBelowRed="below"
//           />
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">gdp</h2>
//           <DeviationSlider 
//             currentValue={98}
//             avgValue={100}
//             stdDev={10}
//             aboveOrBelowRed="below"
//           />
//         </div>
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">sb+</h2>
//           <DeviationSlider 
//             currentValue={101}
//             avgValue={100}
//             stdDev={10}
//             aboveOrBelowRed="below"
//           />
//         </div>
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">max ev</h2>
//           <DeviationSlider 
//             currentValue={113.1}
//             avgValue={122.9}
//             stdDev={10}
//             aboveOrBelowRed="below"
//           />
//         </div>

//         <TrinityTrident/>
//         <WRCPlusChart vL={74} vR={99}/>
       
//       </div>
       
      

//     </div>
    
//   );
// }