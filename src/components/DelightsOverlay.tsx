import React, { useEffect, useRef, useState } from 'react';
import { useQahwa } from '../context/QahwaContext';
import { QAHWA_STONE_PATHS } from './BrandPrimitives';

interface FallingStone {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotate: number;
  color: string;
  shape: 'top' | 'middle' | 'bottom';
}

export const DelightsOverlay: React.FC = () => {
  const { curtainState } = useQahwa();
  const [rainStones, setRainStones] = useState<FallingStone[]>([]);
  const bufferRef = useRef('');

  // Easter egg: typing "qahwa" makes the logo stones rain down
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (e.key.length !== 1) return;

      bufferRef.current = (bufferRef.current + e.key.toLowerCase()).slice(-5);
      if (bufferRef.current === 'qahwa') {
        bufferRef.current = '';
        const shapes: Array<'top' | 'middle' | 'bottom'> = ['top', 'middle', 'bottom'];
        const colors = ['#C1501F', '#F7EEDD', '#2A140B', '#B98B5E'];
        const batch: FallingStone[] = Array.from({ length: 24 }).map((_, idx) => ({
          id: Date.now() + idx,
          x: Math.random() * 94 + 3,
          delay: Math.random() * 0.9,
          duration: 2.2 + Math.random() * 1.4,
          size: 30 + Math.random() * 34,
          rotate: (Math.random() - 0.5) * 360,
          color: colors[idx % colors.length],
          shape: shapes[idx % 3],
        }));
        setRainStones(batch);
        window.setTimeout(() => setRainStones([]), 4200);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      {/* Terracotta Curtain Wipe on Language Switch */}
      {curtainState !== 'idle' && (
        <div
          className={`fixed inset-0 z-[85] bg-[#C1501F] paper-grain pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            curtainState === 'in' ? 'translate-y-0' : '-translate-y-full'
          }`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1440 70"
            preserveAspectRatio="none"
            className="absolute -bottom-[68px] left-0 w-full h-[70px]"
          >
            <path d="M0,0 L1440,0 L1440,20 Q720,76 0,20 Z" fill="#C1501F" />
          </svg>
        </div>
      )}

      {/* Typing "qahwa" stone-rain easter egg */}
      {rainStones.length > 0 && (
        <div className="fixed inset-0 z-[80] pointer-events-none overflow-hidden" aria-hidden="true">
          <style>{`
            @keyframes qahwaStoneFall {
              0% { transform: translateY(-15vh) rotate(0deg); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translateY(115vh) rotate(260deg); opacity: 0; }
            }
          `}</style>
          {rainStones.map((stone) => (
            <svg
              key={stone.id}
              viewBox="0 0 200 220"
              className="absolute top-0"
              style={{
                left: `${stone.x}%`,
                width: `${stone.size}px`,
                height: `${stone.size}px`,
                animation: `qahwaStoneFall ${stone.duration}s cubic-bezier(0.32, 0, 0.67, 0.85) ${stone.delay}s forwards`,
              }}
            >
              <path d={QAHWA_STONE_PATHS[stone.shape]} fill={stone.color} />
            </svg>
          ))}
        </div>
      )}
    </>
  );
};
