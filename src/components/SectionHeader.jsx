import React from 'react';
import { HEADER_BG } from './constants';

export default function SectionHeader({ label, align = 'center' }) {
  return (
    <div style={{
      background: HEADER_BG,
      color: 'white',
      fontWeight: 700,
      fontStyle: 'italic',
      fontSize: 14,
      padding: '4px 8px',
      letterSpacing: '0.4px',
      textAlign: align,
    }}>
      {label}
    </div>
  );
}
