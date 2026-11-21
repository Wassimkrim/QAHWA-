import React, { useEffect, useId, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useQahwa } from '../context/QahwaContext';

gsap.registerPlugin(ScrollTrigger);

/**
 * BEHAVIOR A — PRESSED CLAY
 * Splits headline into individual characters (EN/FR) or words (AR — never breaks letter joining).
 * Cursor distance (160px radius) drives variable wght (300..850) and SOFT (0..100).
 * Touch devices trigger a sweeping wave across entry and follow finger touch.
 */
export const PressedClayHeadline: React.FC<{
  text: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  color?: string;
}> = ({ text, as = 'h2', className = '', color }) => {
  const { isRtl } = useQahwa();
  const containerRef = useRef<HTMLHeadingElement>(null);
  const unitRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const inViewRef = useRef(false);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  // Tokenize: in Arabic split by word to preserve cursive letter joining; in EN/FR split by word + character
  const tokens = isRtl
    ? text.split(' ').map((w) => ({ word: w, units: [w] }))
    : text.split(' ').map((w) => ({ word: w, units: Array.from(w) }));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchOrSmall =
      window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;

    if (prefersReduced || isTouchOrSmall) {
      unitRefs.current.forEach((span) => {
        if (!span) return;
        span.style.fontVariationSettings = isRtl
          ? '"wght" 700'
          : '"opsz" 144, "wght" 560, "SOFT" 80, "WONK" 1';
      });
      return;
    }

    const units = unitRefs.current.filter(Boolean) as HTMLSpanElement[];
    const currentWght = units.map(() => 480);
    const currentSoft = units.map(() => 35);
    let rafId = 0;

    const startRaf = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };
    const stopRaf = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          startRaf();
        } else {
          stopRaf();
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);

    const onPointerMove = (e: PointerEvent) => {
      if (!inViewRef.current || e.pointerType === 'touch') return;
      pointerRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const onLeave = () => {
      pointerRef.current.active = false;
    };

    function tick(now: number) {
      rafId = 0;
      if (!inViewRef.current) return;

      const radius = 160;
      const p = pointerRef.current;

      units.forEach((span, idx) => {
        let targetWght = 480;
        let targetSoft = 35;

        if (p.active) {
          const rect = span.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dist = Math.hypot(p.x - cx, p.y - cy);
          const influence = Math.max(0, 1 - dist / radius);
          const eased = influence * influence * (3 - 2 * influence);
          targetWght = 420 + eased * 430;
          targetSoft = 20 + eased * 80;
        } else {
          const wave = (Math.sin(now * 0.0018 + idx * 0.38) + 1) * 0.5;
          targetWght = 430 + wave * 120;
          targetSoft = 30 + wave * 35;
        }

        currentWght[idx] += (targetWght - currentWght[idx]) * 0.16;
        currentSoft[idx] += (targetSoft - currentSoft[idx]) * 0.16;

        span.style.fontVariationSettings = isRtl
          ? `"wght" ${Math.round(currentWght[idx])}`
          : `"opsz" 144, "wght" ${Math.round(currentWght[idx])}, "SOFT" ${Math.round(
              currentSoft[idx]
            )}, "WONK" 1`;
      });

      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      obs.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onLeave);
      stopRaf();
    };
  }, [isRtl, text]);

  const Tag = as;
  let globalIdx = 0;

  return (
    <Tag
      ref={containerRef}
      className={`font-display leading-[1.06] text-balance ${className}`}
      style={{ color }}
    >
      {tokens.map((tok, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap me-[0.26em]">
          {tok.units.map((unit, uIdx) => {
            const idx = globalIdx++;
            return (
              <span
                key={uIdx}
                ref={(el) => {
                  unitRefs.current[idx] = el;
                }}
                className="inline-block"
                style={{
                  fontVariationSettings: isRtl
                    ? '"wght" 600'
                    : '"opsz" 144, "wght" 480, "SOFT" 40, "WONK" 1',
                }}
              >
                {unit}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
};

/**
 * BEHAVIOR B — RIBBON TYPE
 * Phrase set on an SVG textPath along the hand-drawn wavy sun-ray curve,
 * scrubbing startOffset with scroll. Mirrors curve cleanly in RTL.
 */
export const RibbonTypePath: React.FC<{
  phrase: string;
  color?: string;
  className?: string;
}> = ({ phrase, color = '#C1501F', className = '' }) => {
  const { isRtl } = useQahwa();
  const uid = useId().replace(/:/g, '');
  const wrapRef = useRef<HTMLDivElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const tp = textPathRef.current;
    if (!wrap || !tp) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const state = { offset: isRtl ? 30 : 0 };
      gsap.to(state, {
        offset: isRtl ? -18 : -38,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
        onUpdate: () => {
          tp.setAttribute('startOffset', `${state.offset.toFixed(2)}%`);
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, [isRtl]);

  const pathD = isRtl
    ? 'M1460,55 C1200,15 1020,95 760,52 C500,10 260,95 -40,48'
    : 'M-40,48 C260,95 500,10 760,52 C1020,95 1200,15 1460,55';

  const repeatedPhrase = `${phrase} ${phrase} ${phrase}`;

  return (
    <div ref={wrapRef} className={`w-full overflow-hidden select-none pointer-events-none ${className}`}>
      <svg viewBox="0 0 1440 104" className="w-full h-16 md:h-24 overflow-visible" aria-hidden="true">
        <defs>
          <path id={`ribbon-${uid}`} d={pathD} />
        </defs>
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeOpacity="0.22"
          strokeWidth="1.4"
        />
        <text
          fill={color}
          className="font-sans-brand text-[16px] md:text-[18px] font-medium uppercase"
          style={{ letterSpacing: isRtl ? '0' : '0.26em' }}
        >
          <textPath ref={textPathRef} href={`#ribbon-${uid}`} startOffset="0%">
            {repeatedPhrase}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

/**
 * BEHAVIOR C — STAMP COLLAGE
 * Hero impact word built from mixed letter cuts (Fraunces Soft, Anton, Outlined, Patrick Hand SC)
 * with slight rotation and SVG ink-stamp edge, stamping in one unit at a time.
 * In Arabic: mixes styles at WORD level only (Reem Kufi, Aref Ruqaa, Cairo Black).
 */
export const StampCollageWord: React.FC<{
  text: string;
  className?: string;
  light?: boolean;
}> = ({ text, className = '', light = false }) => {
  const { isRtl } = useQahwa();
  const ref = useRef<HTMLSpanElement>(null);
  const [stamped, setStamped] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStamped(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStamped(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const primaryColor = light ? '#F7EEDD' : '#2A140B';
  const accentColor = light ? '#FFE600' : '#C1501F';

  // Arabic mixes fonts at WORD level only
  if (isRtl) {
    const words = text.split(' ');
    const arStyles = [
      'font-display font-bold',
      'font-ruqaa font-bold',
      'font-sans-brand font-black',
    ];
    return (
      <span
        ref={ref}
        className={`inline-flex flex-wrap items-baseline gap-x-3 ink-stamp-edge ${className}`}
      >
        {words.map((w, idx) => {
          const rot = idx % 2 === 0 ? -2 : 2.2;
          return (
            <span
              key={idx}
              className={`inline-block transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                arStyles[idx % arStyles.length]
              }`}
              style={{
                color: idx === words.length - 1 ? accentColor : primaryColor,
                transform: stamped
                  ? `rotate(${rot}deg) scale(1)`
                  : `rotate(${rot * 2}deg) scale(1.35)`,
                opacity: stamped ? 1 : 0,
                transitionDelay: `${idx * 110}ms`,
              }}
            >
              {w}
            </span>
          );
        })}
      </span>
    );
  }

  const chars = Array.from(text);
  const cutStyles = [
    { cls: 'font-condensed uppercase', outline: false, rot: -3.2, color: primaryColor },
    { cls: 'hand-thrown italic', outline: false, rot: 2.8, color: accentColor },
    { cls: 'font-condensed uppercase', outline: true, rot: -1.8, color: primaryColor },
    { cls: 'font-hand', outline: false, rot: 3.5, color: primaryColor },
    { cls: 'hand-thrown font-bold', outline: false, rot: -2.4, color: accentColor },
  ];

  return (
    <span
      ref={ref}
      className={`inline-flex flex-wrap items-baseline ink-stamp-edge ${className}`}
    >
      {chars.map((ch, idx) => {
        if (ch === ' ') {
          return <span key={idx} className="inline-block w-[0.28em]" />;
        }
        const style = cutStyles[idx % cutStyles.length];
        return (
          <span
            key={idx}
            className={`inline-block transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${style.cls}`}
            style={{
              color: style.outline ? 'transparent' : style.color,
              WebkitTextStroke: style.outline ? `1.8px ${primaryColor}` : undefined,
              transform: stamped
                ? `rotate(${style.rot}deg) scale(1)`
                : `rotate(${style.rot * 2.2}deg) scale(1.45)`,
              opacity: stamped ? 1 : 0,
              transitionDelay: `${idx * 65}ms`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
};
