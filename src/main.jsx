import React from 'react';
import { createRoot } from 'react-dom/client';
import HitterCard from './components/HitterCard';
import './index.css'
// Track mounted React roots so we can re-render without remounting
const roots = {};

/**
 * Mount (or update) a HitterCard into the DOM element with the given id.
 * @param {string} divId  - id of the target <div> in the page
 * @param {object} data   - player data object (matches noda_data.json shape)
 */
function mountCard(divId, data) {
  const el = document.getElementById(divId);
  if (!el) {
    console.warn('[HitterCard] No element with id="' + divId + '" found.');
    return;
  }
  if (!roots[divId]) {
    roots[divId] = createRoot(el);
  }
  roots[divId].render(<HitterCard data={data} />);
}

// ── Shiny integration ────────────────────────────────────────────────────────
// In your Shiny server: session$sendCustomMessage('renderHitterCard', list(divId='card-1', data=playerList))
// In your Shiny UI:     div(id='card-1')
if (typeof window !== 'undefined' && window.Shiny) {
  Shiny.addCustomMessageHandler('renderHitterCard', function (msg) {
    mountCard(msg.divId, msg.data);
  });
}

// ── Dev preview (only runs during `npm run dev`, tree-shaken from prod build) ─
if (import.meta.env.DEV) {
  import('./data/noda_data.json').then((m) => mountCard('root', m.default));
}
