import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useQahwa } from '../context/QahwaContext';

gsap.registerPlugin(ScrollTrigger);

/**
 * Exact traced paths of the QAHWA stacked-stone logo (viewBox 0 0 200 220)
 * 1. Top oval stone
 * 2. Large middle rounded stone with sweeping inner cutout
 * 3. Wide curved crescent bottom stone
 */
export const QAHWA_STONE_PATHS = {
  top: 'M108 18 C132 18 148 25 148 35 C148 45 132 52 108 52 C84 52 68 45 68 35 C68 25 84 18 108 18 Z',
  middle:
    'M103 60 C138 60 166 84 166 116 C166 127 162 132 152 126 C135 117 110 116 86 127 C72 134 55 135 45 123 C36 112 37 94 49 80 C62 66 81 60 103 60 Z',
  bottom:
    'M36 138 C44 134 54 140 68 147 C89 157 119 156 142 138 C154 128 167 129 170 142 C173 157 159 180 137 194 C112 210 78 212 52 196 C32 184 23 162 28 147 C30 142 32 140 36 138 Z',
};

export const QahwaLogoSVG: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = 'w-10 h-11', color = 'currentColor' }) => (
  <svg
    viewBox="0 0 200 220"
    fill={color}
    className={className}
    aria-hidden="true"
  >
    <path d={QAHWA_STONE_PATHS.top} />
    <path d={QAHWA_STONE_PATHS.middle} />
    <path d={QAHWA_STONE_PATHS.bottom} />
  </svg>
);

/**
 * Miniature 3 signature marks (bar, ring, bar) reused on section labels
 */
export const ThreeMarksMini: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-8 h-3',
  color = 'currentColor',
}) => (
  <svg viewBox="0 0 64 18" fill="none" className={className} aria-hidden="true">
    <path d="M4 10 L18 7.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="32" cy="8.5" r="4" stroke={color} strokeWidth="2.2" />
    <path d="M46 10 L60 7.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/**
 * Q A H W A Wordmark with 3 independent animated & magnetic SVG marks above Q, H, W
 */
export const QahwaWordmark: React.FC<{
  sizeClass?: string;
  color?: string;
  markColor?: string;
  spread?: number; // 0 = default, 1 = spread toward screen edges
  interactive?: boolean;
  dropped?: boolean;
  glaze?: boolean;
  className?: string;
}> = ({
  sizeClass = 'text-3xl md:text-5xl',
  color = '#F7EEDD',
  markColor = '#F7EEDD',
  spread = 0,
  interactive = true,
  dropped = true,
  glaze = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!interactive) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const handleMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / 360));
      const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / 260));
      setMouseOffset({ x: dx * 7, y: dy * 5 });
    };

    const handleLeave = () => setMouseOffset({ x: 0, y: 0 });

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('pointerleave', handleLeave);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerleave', handleLeave);
    };
  }, [interactive]);

  const letters = ['Q', 'A', 'H', 'W', 'A'];
  const letterSpreadOffsets = [-2.2, -1.1, 0, 1.1, 2.2];

  return (
    <div
      ref={containerRef}
      dir="ltr"
      className={`relative inline-flex items-center justify-center font-sans-brand font-semibold uppercase select-none ${sizeClass} ${className}`}
      style={{ color }}
      aria-label="QAHWA"
    >
      <div className="inline-flex items-center" style={{ gap: `${0.32 + spread * 0.9}em` }}>
        {letters.map((char, idx) => {
          const hasBarLeft = idx === 0;
          const hasRing = idx === 2;
          const hasBarRight = idx === 4;
          const tx = spread * letterSpreadOffsets[idx] * 12;

          return (
            <span
              key={idx}
              className="relative inline-block transition-transform duration-150 ease-out"
              style={{ transform: `translate3d(${tx}px, 0, 0)` }}
            >
              <span className={glaze ? 'glaze-text' : ''}>{char}</span>

              {/* Mark above Q */}
              {hasBarLeft && (
                <svg
                  viewBox="0 0 28 12"
                  className="absolute -top-[0.42em] left-1/2 w-[0.58em] h-[0.26em] pointer-events-none"
                  style={{
                    transform: `translate3d(calc(-50% + ${mouseOffset.x * 0.85}px), ${
                      dropped ? mouseOffset.y * 0.8 : -28
                    }px, 0)`,
                    opacity: dropped ? 1 : 0,
                    transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease',
                  }}
                  aria-hidden="true"
                >
                  <path
                    d="M3 8.5 L25 4.5"
                    stroke={markColor}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                </svg>
              )}

              {/* Ring mark above H */}
              {hasRing && (
                <svg
                  viewBox="0 0 20 20"
                  className="absolute -top-[0.46em] left-1/2 w-[0.38em] h-[0.38em] pointer-events-none"
                  style={{
                    transform: `translate3d(calc(-50% + ${mouseOffset.x * 1.15}px), ${
                      dropped ? mouseOffset.y * 1.1 : -34
                    }px, 0)`,
                    opacity: dropped ? 1 : 0,
                    transition:
                      'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0.08s, opacity 0.45s ease 0.08s',
                  }}
                  aria-hidden="true"
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="6"
                    fill="none"
                    stroke={markColor}
                    strokeWidth="2.8"
                  />
                </svg>
              )}

              {/* Mark above W */}
              {hasBarRight && (
                <svg
                  viewBox="0 0 28 12"
                  className="absolute -top-[0.42em] left-1/2 w-[0.58em] h-[0.26em] pointer-events-none"
                  style={{
                    transform: `translate3d(calc(-50% + ${mouseOffset.x * 0.9}px), ${
                      dropped ? mouseOffset.y * 0.85 : -28
                    }px, 0)`,
                    opacity: dropped ? 1 : 0,
                    transition:
                      'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.14s, opacity 0.4s ease 0.14s',
                  }}
                  aria-hidden="true"
                >
                  <path
                    d="M3 8.5 L25 4.5"
                    stroke={markColor}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Hand-drawn wavy sun-rays motif inspired by the Blend 2# packaging
 */
export const SunRaysSVG: React.FC<{
  className?: string;
  strokeColor?: string;
  centerFill?: string;
  strokeWidth?: number;
}> = ({
  className = 'w-96 h-96',
  strokeColor = '#2A140B',
  centerFill = 'none',
  strokeWidth = 3,
}) => (
  <svg
    viewBox="0 0 400 400"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Organic central sun disc */}
    <path
      d="M202 162 C224 162 238 179 237 201 C236 223 220 237 199 237 C177 237 162 221 163 199 C164 177 180 162 202 162 Z"
      fill={centerFill}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
    />
    {/* 10 wavy organic sun rays */}
    <path d="M201 153 C196 115 212 75 198 18" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
    <path d="M229 162 C252 131 259 88 294 44" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
    <path d="M244 186 C284 172 318 192 378 172" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
    <path d="M241 215 C284 232 308 265 362 292" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
    <path d="M222 237 C238 278 220 318 242 378" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
    <path d="M192 243 C182 288 158 318 156 382" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
    <path d="M166 226 C128 258 98 252 46 302" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
    <path d="M155 198 C112 204 82 178 22 192" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
    <path d="M164 170 C128 142 122 104 72 64" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
    <path d="M182 156 C168 118 142 82 136 28" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

/**
 * Small-cap Section Label with miniature 3-stone mark and animated terracotta underline
 */
export const SectionLabel: React.FC<{
  text: string;
  light?: boolean;
  className?: string;
}> = ({ text, light = false, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const { isRtl } = useQahwa();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`inline-flex flex-col gap-2 ${className}`}>
      <div className="inline-flex items-center gap-2.5">
        <ThreeMarksMini
          className="w-6 h-2.5 shrink-0"
          color={light ? '#F7EEDD' : '#C1501F'}
        />
        <span
          className={`text-xs md:text-sm font-medium ${
            isRtl ? '' : 'uppercase tracking-[0.28em]'
          } ${light ? 'text-[#F7EEDD]' : 'text-[#C1501F]'}`}
        >
          {text}
        </span>
      </div>
      <div
        className={`h-[1.5px] origin-left transition-transform duration-1000 ease-out ${
          light ? 'bg-[#F7EEDD]/65' : 'bg-[#C1501F]/70'
        }`}
        style={{
          transform: revealed ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: isRtl ? 'right center' : 'left center',
        }}
      />
    </div>
  );
};

/**
 * Hand-drawn curved arrow that draws itself on hover or reveal
 */
export const HandDrawnArrow: React.FC<{
  className?: string;
  color?: string;
  active?: boolean;
}> = ({ className = 'w-10 h-6', color = '#2A140B', active = false }) => {
  const { isRtl } = useQahwa();
  return (
    <svg
      viewBox="0 0 64 28"
      fill="none"
      className={`${className} ${isRtl ? '-scale-x-100' : ''}`}
      aria-hidden="true"
    >
      <path
        d="M3 16 C18 9 38 10 56 14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="64"
        strokeDashoffset={active ? '0' : '16'}
        className="transition-[stroke-dashoffset] duration-700 ease-out"
      />
      <path
        d="M47 7 L58 14.5 L46 21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="34"
        strokeDashoffset={active ? '0' : '8'}
        className="transition-[stroke-dashoffset] duration-700 ease-out delay-100"
      />
    </svg>
  );
};

/**
 * Scroll-driven Hand-Thrown Fraunces / Cairo headline with bottom-to-top terracotta glaze fill
 */
export const GlazeHeadline: React.FC<{
  children: React.ReactNode;
  className?: string;
  cream?: boolean;
  as?: 'h1' | 'h2' | 'h3';
  scrub?: boolean;
}> = ({ children, className = '', cream = false, as = 'h2', scrub = true }) => {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !scrub) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.style.setProperty('--glaze', '100%');
      el.style.setProperty('--type-wght', '550');
      el.style.setProperty('--type-soft', '80');
      return;
    }

    const ctx = gsap.context(() => {
      const state = { glaze: 15, wght: 340, soft: 10 };
      gsap.to(state, {
        glaze: 100,
        wght: 660,
        soft: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 86%',
          end: 'top 36%',
          scrub: 0.7,
        },
        onUpdate: () => {
          el.style.setProperty('--glaze', `${state.glaze.toFixed(1)}%`);
          el.style.setProperty('--type-wght', `${Math.round(state.wght)}`);
          el.style.setProperty('--type-soft', `${Math.round(state.soft)}`);
        },
      });
    }, el);

    return () => ctx.revert();
  }, [scrub]);

  const Tag = as;

  return (
    <Tag
      ref={ref}
      className={`hand-thrown ${cream ? 'glaze-text-cream' : 'glaze-text'} leading-[1.03] text-balance ${className}`}
      style={{
        ['--glaze' as string]: scrub ? '15%' : '100%',
        ['--type-wght' as string]: scrub ? '340' : '580',
        ['--type-soft' as string]: scrub ? '10' : '85',
      }}
    >
      {children}
    </Tag>
  );
};

/**
 * Magnetic tactile button
 */
export const MagneticButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  ariaLabel?: string;
}> = ({ children, onClick, href, target, rel, className = '', ariaLabel }) => {
  const ref = useRef<HTMLElement>(null);

  const handleMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType === 'touch') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.22;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.22;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const handleLeave = () => {
    if (ref.current) {
      ref.current.style.transform = 'translate3d(0, 0, 0)';
    }
  };

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className={`inline-flex items-center justify-center transition-transform duration-300 ease-out whitespace-nowrap shrink-0 cursor-pointer ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`inline-flex items-center justify-center transition-transform duration-300 ease-out whitespace-nowrap shrink-0 cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
};
