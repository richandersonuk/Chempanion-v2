import React from 'react';
import logoUrl from './assets/logo.svg';
import iconUrl from './assets/icon.svg';

/**
 * 1. THE ICON ONLY
 * Renders just the square icon.svg
 */
export const Icon = ({ className = "h-8 w-auto" }) => (
  <img src={iconUrl} alt="CHEMpanion Icon" className={className} style={{ display: 'block' }} />
);

/**
 * 2. THE FULL LOGO
 * Renders the full logo.svg (used on the dashboard)
 */
export const Logo = ({ className = "h-16 w-auto" }) => (
  <img src={logoUrl} alt="CHEMpanion Logo" className={className} style={{ display: 'block' }} />
);

/**
 * 3. THE HEADER BRAND (Icon + Dynamic Text)
 * Uses responsive text sizes to scale down on small screens, preventing overlap.
 */
export const HeaderBrand = ({ className = "" }) => (
  <div className={`flex items-center gap-2 md:gap-3 shrink min-w-0 ${className}`}>
    <Icon className="h-6 sm:h-7 md:h-8 shrink-0" />
    <div className="flex items-baseline tracking-tight select-none font-sans truncate">
      <span className="text-xl sm:text-2xl md:text-3xl" style={{ color: '#326fa0', fontWeight: '900', lineHeight: '1' }}>
        CHEM
      </span>
      <span className="text-xl sm:text-2xl md:text-3xl" style={{ color: '#80b5c6', fontWeight: '400', lineHeight: '1' }}>
        panion
      </span>
    </div>
  </div>
);
