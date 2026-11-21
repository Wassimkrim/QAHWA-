import React, { useEffect, useRef } from 'react';
import { useQahwa } from '../context/QahwaContext';

export const LeafShadowOverlay: React.FC = () => {
  const { sunPhase } = useQahwa();
  const topRightRef = useRef<HTMLDivElement>(null);
  const bottomLeftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let cursorX = 0;
    let cursorY = 0;
    let scrollY = window.scrollY;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      cursorX = (e.clientX / window.innerWidth - 0.5) * 14;
      cursorY = (e.clientY / window.innerHeight - 0.5) * 10;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    const update = () => {
      const parallaxA = (scrollY * 0.04) % 90;
      const parallaxB = (scrollY * -0.03) % 90;
      if (topRightRef.current) {
        topRightRef.current.style.transform = `translate3d(${cursorX * 0.6}px, ${
          cursorY * 0.6 - parallaxA
        }px, 0)`;
      }
      if (bottomLeftRef.current) {
        bottomLeftRef.current.style.transform = `translate3d(${-cursorX * 0.8}px, ${
          -cursorY * 0.5 - parallaxB
        }px, 0)`;
      }
      raf = requestAnimationFrame(update);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Sun Clock modifies shadow angle, stretch, softness, and opacity subtly
  const sunParams = {
    morning: { angle: -10, scaleX: 1.15, opacity: 0.28, blur: 18 },
    noon: { angle: 4, scaleX: 0.92, opacity: 0.24, blur: 13 },
    golden: { angle: 12, scaleX: 1.22, opacity: 0.32, blur: 20 },
    evening: { angle: 16, scaleX: 1.1, opacity: 0.26, blur: 22 },
  }[sunPhase];

  return (
    <>
      {/* Global SVG Filters (Leaf blur + Ink Stamp edge for Stamp Collage) */}
      <svg className="fixed w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="leaf-blur-1" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation={sunParams.blur} />
          </filter>
          <filter id="leaf-blur-2" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation={sunParams.blur + 6} />
          </filter>
          <filter id="qahwa-ink-stamp" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.065"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="1.85"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Fixed continuous sunlit leaf-shadow layer passing over suede & headlines (Behavior D) */}
      <div
        className="fixed inset-0 z-[25] pointer-events-none overflow-hidden"
        style={{
          mixBlendMode: 'multiply',
          opacity: sunParams.opacity,
          transition: 'opacity 1.2s ease',
        }}
        aria-hidden="true"
      >
        {/* Branch Group 1: Entering diagonally from top-right (matching Photo B) */}
        <div
          ref={topRightRef}
          className="absolute -top-[10%] -right-[10%] w-[75vw] h-[75vh] max-w-[920px] will-change-transform"
        >
          <div
            className="w-full h-full leaf-sway-a origin-top-right transition-transform duration-1000"
            style={{
              transform: `rotate(${sunParams.angle}deg) scaleX(${sunParams.scaleX})`,
            }}
          >
            <svg viewBox="0 0 800 600" className="w-full h-full overflow-visible">
              <g filter="url(#leaf-blur-1)" fill="#3A1608">
                {/* Main diagonal stem */}
                <path d="M820 -20 C680 95, 510 190, 290 290 L310 315 C530 215, 700 120, 840 10 Z" />
                {/* Palm / ficus fronds */}
                <path d="M680 95 C560 40, 410 55, 295 110 C425 105, 575 115, 675 135 Z" />
                <path d="M585 155 C450 115, 300 140, 175 205 C315 190, 470 190, 575 200 Z" />
                <path d="M490 215 C340 205, 210 245, 95 330 C240 285, 390 265, 495 255 Z" />
                <path d="M640 135 C680 230, 620 340, 520 420 C565 320, 600 225, 600 145 Z" />
                <path d="M510 225 C535 325, 465 430, 365 490 C425 395, 470 305, 475 235 Z" />
              </g>
            </svg>
          </div>
        </div>

        {/* Branch Group 2: Entering diagonally from bottom-left */}
        <div
          ref={bottomLeftRef}
          className="absolute -bottom-[14%] -left-[12%] w-[72vw] h-[72vh] max-w-[880px] will-change-transform"
        >
          <div
            className="w-full h-full leaf-sway-b origin-bottom-left transition-transform duration-1000"
            style={{
              transform: `rotate(${-sunParams.angle * 0.6}deg) scaleX(${sunParams.scaleX})`,
            }}
          >
            <svg viewBox="0 0 800 600" className="w-full h-full overflow-visible">
              <g filter="url(#leaf-blur-2)" fill="#3A1608">
                <path d="M-30 620 C120 500, 290 410, 510 315 L495 290 C275 385, 105 475, -45 590 Z" />
                <path d="M120 495 C255 540, 405 520, 535 455 C400 470, 250 470, 130 455 Z" />
                <path d="M235 435 C375 460, 515 415, 635 335 C495 375, 355 395, 240 400 Z" />
                <path d="M160 465 C120 365, 185 255, 285 175 C235 280, 195 375, 195 455 Z" />
                <path d="M305 385 C285 285, 355 185, 455 125 C395 215, 350 305, 345 375 Z" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};
