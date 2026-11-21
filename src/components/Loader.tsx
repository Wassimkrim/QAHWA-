import React, { useEffect, useState } from 'react';
import { COPY } from '../config/content';
import { useQahwa } from '../context/QahwaContext';
import { QAHWA_STONE_PATHS, QahwaWordmark } from './BrandPrimitives';

export const Loader: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { lang } = useQahwa();
  const [progress, setProgress] = useState(0);
  const [stonesStage, setStonesStage] = useState(0); // 1: bottom, 2: middle, 3: top, 4: marks + wordmark
  const [wiping, setWiping] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      onDone();
      return;
    }

    const start = performance.now();
    const duration = 2050;
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 10 && stonesStage < 1) setStonesStage(1);
      if (pct >= 35 && stonesStage < 2) setStonesStage(2);
      if (pct >= 58 && stonesStage < 3) setStonesStage(3);
      if (pct >= 75 && stonesStage < 4) setStonesStage(4);

      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        setStonesStage(4);
        window.setTimeout(() => {
          setWiping(true);
          window.setTimeout(onDone, 680);
        }, 280);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[90] flex flex-col items-center justify-center terracotta-suede text-[#F7EEDD] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        wiping ? '-translate-y-full' : 'translate-y-0'
      }`}
      aria-hidden="true"
    >
      {/* Curved plaster-like bottom edge when wiping upward */}
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="absolute -bottom-[88px] left-0 w-full h-[90px] pointer-events-none"
      >
        <path
          d="M0,0 L1440,0 L1440,24 Q720,96 0,24 Z"
          fill="#C1501F"
        />
      </svg>

      <div
        className={`flex flex-col items-center transition-all duration-700 ${
          wiping ? 'scale-50 -translate-y-48 opacity-0' : 'scale-100 translate-y-0 opacity-100'
        }`}
      >
        {/* Stacked stones dropping one by one */}
        <svg viewBox="0 0 200 220" className="w-24 h-28 md:w-28 md:h-32 overflow-visible mb-6">
          <path
            d={QAHWA_STONE_PATHS.bottom}
            fill="#F7EEDD"
            style={{
              transform: stonesStage >= 1 ? 'translateY(0)' : 'translateY(-44px)',
              opacity: stonesStage >= 1 ? 1 : 0,
              transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease',
            }}
          />
          <path
            d={QAHWA_STONE_PATHS.middle}
            fill="#F7EEDD"
            style={{
              transform: stonesStage >= 2 ? 'translateY(0)' : 'translateY(-52px)',
              opacity: stonesStage >= 2 ? 1 : 0,
              transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease',
            }}
          />
          <path
            d={QAHWA_STONE_PATHS.top}
            fill="#F7EEDD"
            style={{
              transform: stonesStage >= 3 ? 'translateY(0)' : 'translateY(-58px)',
              opacity: stonesStage >= 3 ? 1 : 0,
              transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease',
            }}
          />
        </svg>

        {/* Wordmark with dropping 3 signature marks */}
        <div
          className="transition-opacity duration-500"
          style={{ opacity: stonesStage >= 3 ? 1 : 0 }}
        >
          <QahwaWordmark
            sizeClass="text-2xl md:text-3xl"
            color="#F7EEDD"
            markColor="#F7EEDD"
            interactive={false}
            dropped={stonesStage >= 4}
          />
        </div>

        {/* Counter 0-100 */}
        <div className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[#F7EEDD]/80 tnums">
          <span>{COPY.loader.preparing[lang]}</span>
          <span aria-hidden="true">·</span>
          <span>{String(progress).padStart(3, '0')}</span>
        </div>
      </div>
    </div>
  );
};
