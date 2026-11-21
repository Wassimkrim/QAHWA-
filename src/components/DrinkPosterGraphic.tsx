import React from 'react';
import { DrinkPosterItem } from '../config/content';

/**
 * Renders any of the 5 supplied kraft drink photos EXACTLY as supplied:
 * - No cropping of original title or taste bars
 * - No filters, no recoloring, natural aspect ratio preserved
 * - For the 2x2 sheet (quadrant: 'tl' | 'tr' | 'bl' | 'br'), slices cleanly onto the exact card quadrant.
 */
export const DrinkPosterGraphic: React.FC<{
  poster: DrinkPosterItem;
  alt: string;
  className?: string;
}> = ({ poster, alt, className = '' }) => {
  if (!poster.quadrant) {
    return (
      <div className={`relative w-full aspect-[3/4] overflow-hidden bg-[#B98B5E] ${className}`}>
        <img
          src={poster.image}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const posMap = {
    tl: { left: '0%', top: '0%' },
    tr: { left: '-100%', top: '0%' },
    bl: { left: '0%', top: '-100%' },
    br: { left: '-100%', top: '-100%' },
  }[poster.quadrant];

  return (
    <div className={`relative w-full aspect-[3/4] overflow-hidden bg-[#B98B5E] ${className}`}>
      <img
        src={poster.image}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="absolute max-w-none w-[200%] h-[200%] object-cover"
        style={{
          left: posMap.left,
          top: posMap.top,
        }}
      />
    </div>
  );
};
