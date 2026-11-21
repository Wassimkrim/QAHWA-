import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, motion, useMotionValue } from 'motion/react';
import {
  ACTIVE_BLEND_DATASET_ID,
  BLEND_DATASETS,
  BLEND_PUSH_IN_ORIGIN,
  COPY,
  VENUE_CONFIG,
} from '../config/content';
import { useQahwa } from '../context/QahwaContext';
import { HandDrawnArrow, QahwaLogoSVG, SectionLabel } from './BrandPrimitives';
import { PressedClayHeadline, StampCollageWord } from './ClayType';

gsap.registerPlugin(ScrollTrigger);

/** Sparse floating coffee beans behind the sun (12 max, transform + opacity only) */
const COFFEE_BEANS = [
  { id: 1, top: '12%', left: '6%', rot: 22, speed: 0.4, scale: 0.9 },
  { id: 2, top: '24%', left: '16%', rot: -38, speed: 0.7, scale: 0.72 },
  { id: 3, top: '68%', left: '8%', rot: 48, speed: 0.55, scale: 0.85 },
  { id: 4, top: '82%', left: '22%', rot: -20, speed: 0.8, scale: 0.68 },
  { id: 5, top: '16%', left: '88%', rot: 65, speed: 0.5, scale: 0.92 },
  { id: 6, top: '38%', left: '92%', rot: -50, speed: 0.65, scale: 0.75 },
  { id: 7, top: '76%', left: '86%', rot: 14, speed: 0.45, scale: 0.82 },
  { id: 8, top: '88%', left: '72%', rot: -62, speed: 0.75, scale: 0.7 },
  { id: 9, top: '10%', left: '48%', rot: 34, speed: 0.6, scale: 0.65 },
  { id: 10, top: '86%', left: '46%', rot: -15, speed: 0.5, scale: 0.78 },
];

/** Organic wavy sun-ray path from innerR out to outerR along a given clock-angle (0 = top 12 o'clock) */
function buildWavyRayPath(angleDeg: number, innerR: number, outerR: number, seed: number): string {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const perp = rad + Math.PI / 2;
  const len = outerR - innerR;

  const p0x = 300 + Math.cos(rad) * innerR;
  const p0y = 300 + Math.sin(rad) * innerR;

  const w1 = Math.sin(seed * 2.1) * 14;
  const w2 = Math.cos(seed * 1.7) * 15;

  const c1x = 300 + Math.cos(rad) * (innerR + len * 0.34) + Math.cos(perp) * w1;
  const c1y = 300 + Math.sin(rad) * (innerR + len * 0.34) + Math.sin(perp) * w1;

  const c2x = 300 + Math.cos(rad) * (innerR + len * 0.68) + Math.cos(perp) * w2;
  const c2y = 300 + Math.sin(rad) * (innerR + len * 0.68) + Math.sin(perp) * w2;

  const p1x = 300 + Math.cos(rad) * outerR;
  const p1y = 300 + Math.sin(rad) * outerR;

  return `M ${p0x.toFixed(1)} ${p0y.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(
    1
  )}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p1x.toFixed(1)} ${p1y.toFixed(1)}`;
}

/** Sun-ray styled vertical wavy barcode on the peeled spec sheet */
const SunRayBarcode: React.FC = () => (
  <svg viewBox="0 0 220 44" className="w-44 h-9" fill="none" aria-hidden="true">
    {[8, 16, 23, 33, 41, 52, 60, 71, 78, 89, 98, 108, 118, 127, 138, 146, 158, 168, 178, 189, 198, 209].map(
      (x, idx) => {
        const w = idx % 4 === 0 ? 3.2 : idx % 2 === 0 ? 2 : 1.3;
        const bend = idx % 2 === 0 ? 3.5 : -3.5;
        return (
          <path
            key={x}
            d={`M ${x} 4 Q ${x + bend} 22 ${x} 40`}
            stroke="#2A140B"
            strokeWidth={w}
            strokeLinecap="round"
          />
        );
      }
    )}
  </svg>
);

export const BlendBagSection: React.FC = () => {
  const { lang, isRtl } = useQahwa();
  const dataset = BLEND_DATASETS[ACTIVE_BLEND_DATASET_ID];

  // In RTL, reverse the ray sequence around the dial
  const rays = useMemo(
    () => (isRtl ? [...dataset.rays].reverse() : dataset.rays),
    [dataset.rays, isRtl]
  );

  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const sunWrapRef = useRef<HTMLDivElement>(null);
  const mobileBagImgRef = useRef<HTMLImageElement>(null);

  const [inView, setInView] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [debugOrigin, setDebugOrigin] = useState(false);

  // Stage 1 -> Stage 2 scroll progress (0..1)
  const [progress, setProgress] = useState(0);
  const [sunDrawn, setSunDrawn] = useState(false);

  // Stage 2: Flavor Sun wheel state
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasInteractedSun, setHasInteractedSun] = useState(false);
  const rotationMV = useMotionValue(0);
  const [wheelDeg, setWheelDeg] = useState(0);
  const dragAngleRef = useRef<{ lastPointerAngle: number; active: boolean }>({
    lastPointerAngle: 0,
    active: false,
  });

  // Stage 3: Sticker peel state
  const [peeled, setPeeled] = useState(false);

  // Detect ?debug=1, viewport breakpoint, and reduced motion
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDebugOrigin(params.get('debug') === '1');

    const checkViewport = () => setIsDesktop(window.innerWidth >= 1024);
    checkViewport();
    window.addEventListener('resize', checkViewport);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncReduced = () => {
      setPrefersReduced(mq.matches);
      if (mq.matches) {
        setProgress(1);
        setSunDrawn(true);
      }
    };
    syncReduced();
    mq.addEventListener('change', syncReduced);

    return () => {
      window.removeEventListener('resize', checkViewport);
      mq.removeEventListener('change', syncReduced);
    };
  }, []);

  // Offscreen pausing observer
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Desktop pinned 250vh scroll scrub; Mobile gentle scale-only scrub
  useEffect(() => {
    const pinEl = pinRef.current;
    if (!pinEl || prefersReduced) return;

    const ctx = gsap.context(() => {
      if (isDesktop) {
        ScrollTrigger.create({
          trigger: pinEl,
          start: 'top top',
          end: '+=240%',
          pin: true,
          scrub: 0.75,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            setProgress(p);
            if (p >= 0.56) {
              setSunDrawn(true);
            }
          },
        });
      } else if (mobileBagImgRef.current) {
        gsap.fromTo(
          mobileBagImgRef.current,
          { scale: 1.0 },
          {
            scale: 1.32,
            ease: 'none',
            scrollTrigger: {
              trigger: pinEl,
              start: 'top 78%',
              end: 'top 12%',
              scrub: 0.5,
            },
          }
        );
      }
    }, pinEl);

    return () => ctx.revert();
  }, [isDesktop, prefersReduced]);

  // Reading angle: top-right on desktop (+45deg / -45deg mirrored in RTL), straight top (0deg) on mobile
  const readingAngleDeg = isDesktop ? (isRtl ? -45 : 45) : 0;
  const stepAngle = 360 / rays.length;

  // Keep motion value synced to React state for crisp upright counter-rotation on captions
  useEffect(() => {
    const unsub = rotationMV.on('change', (latest) => {
      setWheelDeg(latest);
      // Determine nearest ray to readingAngleDeg
      const normalized = (((readingAngleDeg - latest) % 360) + 360) % 360;
      const idx = Math.round(normalized / stepAngle) % rays.length;
      setActiveIndex(idx);
    });
    return () => unsub();
  }, [rays.length, readingAngleDeg, rotationMV, stepAngle]);

  // Snap sun rotation to bring a specific ray index cleanly to readingAngleDeg
  const snapToRay = useCallback(
    (targetIdx: number) => {
      setHasInteractedSun(true);
      const wrappedIdx = ((targetIdx % rays.length) + rays.length) % rays.length;
      const desiredMod = (((readingAngleDeg - wrappedIdx * stepAngle) % 360) + 360) % 360;
      const current = rotationMV.get();
      const currentMod = ((current % 360) + 360) % 360;
      let delta = desiredMod - currentMod;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      animate(rotationMV, current + delta, {
        type: 'spring',
        stiffness: 150,
        damping: 20,
        mass: 0.85,
      });
    },
    [rays.length, readingAngleDeg, rotationMV, stepAngle]
  );

  // Align ray 0 at initial mount/breakpoint
  useEffect(() => {
    rotationMV.set(readingAngleDeg);
    setWheelDeg(readingAngleDeg);
  }, [readingAngleDeg, rotationMV]);

  // Pointer angular drag around sun center with spring inertia snap
  const getPointerAngle = (clientX: number, clientY: number) => {
    const rect = sunWrapRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI;
  };

  const handleSunPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    if ((e.target as HTMLElement).closest('button[data-ray-btn="true"]')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragAngleRef.current = {
      lastPointerAngle: getPointerAngle(e.clientX, e.clientY),
      active: true,
    };
    setHasInteractedSun(true);
  };

  const handleSunPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragAngleRef.current.active) return;
    const nextA = getPointerAngle(e.clientX, e.clientY);
    let delta = nextA - dragAngleRef.current.lastPointerAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    dragAngleRef.current.lastPointerAngle = nextA;
    rotationMV.set(rotationMV.get() + delta);
  };

  const handleSunPointerUp = () => {
    if (!dragAngleRef.current.active) return;
    dragAngleRef.current.active = false;
    // Snap to closest ray with Framer Motion spring
    const current = rotationMV.get();
    const normalized = (((readingAngleDeg - current) % 360) + 360) % 360;
    const nearestIdx = Math.round(normalized / stepAngle) % rays.length;
    snapToRay(nearestIdx);
  };

  const handleSunKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      snapToRay(activeIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      snapToRay(activeIndex - 1);
    }
  };

  const activeRay = rays[activeIndex] || rays[0];

  // Derived desktop timeline values (p: 0..1)
  // Stage 1: p 0 -> 0.45 (Push-in scale 1.0 -> 1.8 max)
  // Match cut crossfade: p 0.28 -> 0.48
  // Stage 2: p 0.48 -> 0.72 (Label slides to side; Photo B ghosts to 15%; Sun draws)
  const stage1T = isDesktop ? Math.min(1, progress / 0.45) : Math.min(1, progress);
  const bagScale = isDesktop ? 1 + stage1T * 0.8 : 1 + stage1T * 0.35; // Max 1.8 on desktop!
  const crossfadeT = isDesktop
    ? Math.max(0, Math.min(1, (progress - 0.28) / 0.2))
    : Math.max(0, Math.min(1, (progress - 0.35) / 0.45));
  const stage2T = isDesktop
    ? Math.max(0, Math.min(1, (progress - 0.5) / 0.22))
    : 1;

  // Photo B opacity: 1 -> 0.15 ghost behind desktop stage 2
  const bagOpacity = prefersReduced
    ? 0.15
    : isDesktop
    ? 1 - crossfadeT * 0.85
    : 1 - crossfadeT * 0.85;

  const labelCardOpacity = prefersReduced ? 1 : crossfadeT;
  const sunOpacity = prefersReduced ? 1 : stage2T;

  return (
    <section
      id="blend"
      ref={sectionRef}
      className="relative terracotta-suede text-[#F7EEDD] overflow-hidden"
    >
      {/* Sparse Floating Coffee Beans behind (max 10, paused offscreen via IntersectionObserver) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {COFFEE_BEANS.map((b) => (
          <svg
            key={b.id}
            viewBox="0 0 32 44"
            className="w-7 h-9 absolute opacity-30 transition-transform duration-1000"
            style={{
              top: b.top,
              left: b.left,
              transform: `rotate(${b.rot}deg) scale(${b.scale}) translate3d(0, ${
                inView && !prefersReduced ? `${Math.round((progress - 0.5) * -70 * b.speed)}px` : '0px'
              }, 0)`,
            }}
          >
            <ellipse cx="16" cy="22" rx="11" ry="17" fill="#2A140B" />
            <path
              d="M16 7 C12 16, 20 28, 16 37"
              stroke="#C1501F"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        ))}
      </div>

      {/* Main Stage Wrapper */}
      <div
        ref={pinRef}
        className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-20 lg:min-h-screen flex flex-col justify-center"
      >
        {/* Header with AA Deep Terracotta badge & Stamp Collage "BLEND #2." headline */}
        <div className="mb-8 md:mb-10 flex flex-col items-start">
          <div className="inline-flex px-3.5 py-1.5 rounded-lg bg-[#A9431A] shadow-sm">
            <SectionLabel text={COPY.blend.label[lang]} light />
          </div>
          <h2 className="mt-4 text-[clamp(2.8rem,6.6vw,5.8rem)] leading-[0.98]">
            <StampCollageWord text={dataset.stampHeadline[lang]} light />
          </h2>
        </div>

        {/* DESKTOP COMPOSITION: Single unified canvas where Photo B pushes in -> Label card emerges -> glides aside -> Sun draws */}
        {isDesktop ? (
          <div className="relative w-full h-[540px] xl:h-[580px] flex items-center justify-center">
            {/* Ghosted / Push-in Arched Photo B */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                opacity: bagOpacity,
              }}
            >
              <div className="relative w-[380px] aspect-[4/5] arch-mask overflow-hidden border-[3px] border-[#F7EEDD]/65 shadow-[0_28px_60px_rgba(42,20,11,0.45)] bg-[#2A140B]">
                {/* Crop bottom 2% cleanly so black edge never appears; scale scrubbed 1.0 -> 1.8 */}
                <img
                  src={VENUE_CONFIG.assets.photoBBlendBags}
                  alt="QAHWA Blend #2 bag stack"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top will-change-transform"
                  style={{
                    clipPath: 'inset(0 0 2.5% 0)',
                    transformOrigin: `${BLEND_PUSH_IN_ORIGIN.xPercent}% ${BLEND_PUSH_IN_ORIGIN.yPercent}%`,
                    transform: `scale(${bagScale.toFixed(3)})`,
                  }}
                />

                {/* Soft vignette dimming surrounding bags during push-in */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    opacity: Math.min(0.85, stage1T * 0.9),
                    background: `radial-gradient(circle at ${BLEND_PUSH_IN_ORIGIN.xPercent}% ${BLEND_PUSH_IN_ORIGIN.yPercent}%, transparent 24%, rgba(42, 20, 11, 0.72) 78%)`,
                  }}
                />

                {/* ?debug=1 calibration crosshair */}
                {debugOrigin && (
                  <div
                    className="absolute z-40 pointer-events-none"
                    style={{
                      left: `${BLEND_PUSH_IN_ORIGIN.xPercent}%`,
                      top: `${BLEND_PUSH_IN_ORIGIN.yPercent}%`,
                    }}
                  >
                    <div className="relative -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                      <span className="w-8 h-[2px] bg-[#FFE600] shadow" />
                      <span className="absolute h-8 w-[2px] bg-[#FFE600] shadow" />
                      <span className="absolute top-5 left-2 px-1.5 py-0.5 rounded bg-[#2A140B] text-[#FFE600] text-[10px] font-mono whitespace-nowrap">
                        {BLEND_PUSH_IN_ORIGIN.xPercent}%, {BLEND_PUSH_IN_ORIGIN.yPercent}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stage 1 -> Stage 2 -> Stage 3: Uncropped Label Sticker Card + Peeled Spec Sheet (~38% width) */}
            <div
              className="relative z-20 w-[38%] max-w-[420px] transition-[opacity] duration-150 will-change-transform"
              style={{
                opacity: labelCardOpacity,
                pointerEvents: labelCardOpacity > 0.35 ? 'auto' : 'none',
                position: 'absolute',
                left: '50%',
                transform: `translate3d(calc(-50% + ${(isRtl ? 78 : -78) * stage2T}%), 0, 0) scale(${(
                  0.74 +
                  crossfadeT * 0.26
                ).toFixed(3)})`,
              }}
            >
              <LabelPeelCard
                dataset={dataset}
                peeled={peeled}
                onTogglePeel={setPeeled}
                prefersReduced={prefersReduced}
              />
            </div>

            {/* Stage 2: Interactive Flavor Sun (center-right in LTR, center-left in RTL) */}
            <div
              className={`relative z-30 w-[56%] flex items-center justify-center ${
                isRtl ? 'me-auto' : 'ms-auto'
              }`}
              style={{
                opacity: sunOpacity,
                pointerEvents: sunOpacity > 0.4 ? 'auto' : 'none',
                transform: `scale(${(0.92 + sunOpacity * 0.08).toFixed(3)})`,
              }}
            >
              <FlavorSunDial
                rays={rays}
                activeIndex={activeIndex}
                activeRay={activeRay}
                sunDrawn={sunDrawn}
                prefersReduced={prefersReduced}
                isDesktop={true}
                readingAngleDeg={readingAngleDeg}
                rotationMV={rotationMV}
                wheelDeg={wheelDeg}
                sunWrapRef={sunWrapRef}
                hasInteracted={hasInteractedSun}
                onPointerDown={handleSunPointerDown}
                onPointerMove={handleSunPointerMove}
                onPointerUp={handleSunPointerUp}
                onKeyDown={handleSunKeyDown}
                onSnapToRay={snapToRay}
              />
            </div>
          </div>
        ) : (
          /* MOBILE (390px) COMPOSITION: lighter push-in photo -> full-width label card -> Flavor Sun below */
          <div className="flex flex-col items-center gap-10">
            {/* Compact Mobile Arched Photo B */}
            <div className="relative w-full max-w-[300px] aspect-[4/5] arch-mask overflow-hidden border-[3px] border-[#F7EEDD]/70 shadow-2xl bg-[#2A140B]">
              <img
                ref={mobileBagImgRef}
                src={VENUE_CONFIG.assets.photoBBlendBags}
                alt="QAHWA Blend #2 bag stack"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top will-change-transform"
                style={{
                  clipPath: 'inset(0 0 2.5% 0)',
                  transformOrigin: `${BLEND_PUSH_IN_ORIGIN.xPercent}% ${BLEND_PUSH_IN_ORIGIN.yPercent}%`,
                }}
              />
              {debugOrigin && (
                <div
                  className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    left: `${BLEND_PUSH_IN_ORIGIN.xPercent}%`,
                    top: `${BLEND_PUSH_IN_ORIGIN.yPercent}%`,
                  }}
                >
                  <span className="block w-6 h-[2px] bg-[#FFE600]" />
                  <span className="block -mt-[13px] mx-auto h-6 w-[2px] bg-[#FFE600]" />
                </div>
              )}
            </div>

            {/* Label Card (full width, 24px padding all around, object-contain) */}
            <div className="w-full max-w-[400px]">
              <LabelPeelCard
                dataset={dataset}
                peeled={peeled}
                onTogglePeel={setPeeled}
                prefersReduced={prefersReduced}
              />
            </div>

            {/* Flavor Sun below (~86vw) */}
            <div className="w-full flex flex-col items-center">
              <FlavorSunDial
                rays={rays}
                activeIndex={activeIndex}
                activeRay={activeRay}
                sunDrawn={true}
                prefersReduced={prefersReduced}
                isDesktop={false}
                readingAngleDeg={0}
                rotationMV={rotationMV}
                wheelDeg={wheelDeg}
                sunWrapRef={sunWrapRef}
                hasInteracted={hasInteractedSun}
                onPointerDown={handleSunPointerDown}
                onPointerMove={handleSunPointerMove}
                onPointerUp={handleSunPointerUp}
                onKeyDown={handleSunKeyDown}
                onSnapToRay={snapToRay}
              />
            </div>
          </div>
        )}

        {/* Prefers-Reduced-Motion Accessible Full Ray List */}
        {prefersReduced && (
          <div className="mt-10 rounded-2xl bg-[#F7EEDD] text-[#2A140B] p-6 border border-[#2A140B]/15 max-w-3xl mx-auto">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {rays.map((ray) => (
                <li key={ray.id} className="border-b border-[#2A140B]/15 pb-2">
                  <span className="block text-[11px] uppercase tracking-[0.18em] text-[#A9431A] font-semibold">
                    {ray.category[lang]}
                  </span>
                  <span className="font-medium text-base">{ray.value[lang]}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
 * STAGE 3 — PEEL THE STICKER CARD (Uncropped object-contain + 24px padding)
 * ────────────────────────────────────────────────────────────────────────── */
interface LabelPeelCardProps {
  dataset: (typeof BLEND_DATASETS)['bag'];
  peeled: boolean;
  onTogglePeel: React.Dispatch<React.SetStateAction<boolean>>;
  prefersReduced: boolean;
}

const LabelPeelCard: React.FC<LabelPeelCardProps> = ({
  dataset,
  peeled,
  onTogglePeel,
  prefersReduced,
}) => {
  const { lang, isRtl } = useQahwa();

  return (
    <div className="relative w-full">
      <div className="relative rounded-2xl bg-[#F7EEDD] text-[#2A140B] shadow-[0_28px_64px_rgba(42,20,11,0.45)] border border-[#2A140B]/15 overflow-hidden">
        {/* Spec Sheet Revealed Underneath */}
        <div
          className={`p-6 md:p-7 min-h-[420px] flex flex-col justify-between bg-[#F7EEDD] text-[#2A140B] transition-opacity duration-500 ${
            peeled ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <div>
            <div className="flex items-start justify-between gap-3 border-b border-[#2A140B]/20 pb-3">
              <div>
                <p
                  className={`text-[11px] font-semibold text-[#A9431A] ${
                    isRtl ? '' : 'uppercase tracking-[0.2em]'
                  }`}
                >
                  {COPY.blend.specHeader[lang]}
                </p>
                <h3 className="font-slip text-2xl mt-1 text-[#2A140B]">{dataset.title[lang]}</h3>
              </div>
              <div className="w-10 h-11 rounded-md bg-[#2A140B] flex items-center justify-center p-1.5 shrink-0">
                <QahwaLogoSVG className="w-full h-full" color="#F7EEDD" />
              </div>
            </div>

            <dl className="mt-4 space-y-3 font-slip text-sm">
              {dataset.specs.map((row, idx) => (
                <div
                  key={idx}
                  className="border-b border-dotted border-[#2A140B]/25 pb-2.5 flex flex-col gap-0.5"
                >
                  <dt className="text-[11px] text-[#A9431A] font-sans-brand font-semibold uppercase">
                    {row.label[lang]}
                  </dt>
                  <dd className="text-sm md:text-base text-[#2A140B] leading-snug">
                    {row.value[lang]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6 pt-3 border-t border-[#2A140B]/20 flex items-end justify-between gap-4">
            <div>
              <SunRayBarcode />
              <p className="mt-1 font-slip text-xs text-[#2A140B]/80">
                {COPY.blend.roastedFor[lang]}
              </p>
            </div>

            {!prefersReduced && (
              <button
                type="button"
                onClick={() => onTogglePeel(false)}
                className="px-3.5 py-2 rounded-full bg-[#2A140B] hover:bg-[#C1501F] text-[#F7EEDD] text-xs font-medium transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-[#FFE600]"
              >
                {COPY.blend.stickBackBtn[lang]}
              </button>
            )}
          </div>
        </div>

        {/* Front Layer: Full Uncropped Label Artwork with 24px (p-6) Minimum Padding */}
        {(!prefersReduced || !peeled) && (
          <div
            className={`absolute inset-0 bg-[#EFE4CE] p-6 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              peeled
                ? isRtl
                  ? 'opacity-0 scale-90 -translate-x-10 -translate-y-12 rotate-6 pointer-events-none'
                  : 'opacity-0 scale-90 translate-x-10 -translate-y-12 -rotate-6 pointer-events-none'
                : 'opacity-100 scale-100 translate-x-0 translate-y-0 rotate-0'
            }`}
            style={{
              transformOrigin: isRtl ? 'bottom right' : 'bottom left',
            }}
          >
            <img
              src={VENUE_CONFIG.assets.blendPoster}
              alt={dataset.title[lang]}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-sm shadow-sm select-none pointer-events-none"
            />

            {/* Realistic Curled Sticker Corner (Desktop & Mobile interaction: click, tap, or drag) */}
            {!prefersReduced && !peeled && (
              <motion.button
                type="button"
                aria-label={COPY.blend.peelCornerLabel[lang]}
                onClick={() => onTogglePeel(true)}
                onPanEnd={(_e, info) => {
                  if (Math.hypot(info.offset.x, info.offset.y) > 18) {
                    onTogglePeel(true);
                  }
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                className={`group absolute top-0 ${
                  isRtl ? 'left-0' : 'right-0'
                } w-14 h-14 cursor-grab active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-[#FFE600] touch-none`}
              >
                {/* Revealed Cream Spec Edge Underneath Corner */}
                <span
                  className="absolute inset-0 bg-[#F7EEDD] shadow-inner"
                  style={{
                    clipPath: isRtl
                      ? 'polygon(0 0, 100% 0, 0 100%)'
                      : 'polygon(0 0, 100% 0, 100% 100%)',
                  }}
                />
                {/* Curled Backside Flap with soft shadow */}
                <span
                  className="absolute inset-0 bg-gradient-to-br from-[#D8C5A5] via-[#F7EEDD] to-[#B98B5E] shadow-[0_6px_14px_rgba(42,20,11,0.35)] transition-transform duration-300 group-hover:scale-110"
                  style={{
                    clipPath: isRtl
                      ? 'polygon(100% 0, 100% 100%, 0 100%)'
                      : 'polygon(0 0, 0 100%, 100% 100%)',
                  }}
                />
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Reduced motion simple button instead of 3D sticker peel */}
      {prefersReduced && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => onTogglePeel((p) => !p)}
            className="px-4 py-2 rounded-full bg-[#A9431A] text-[#F7EEDD] text-xs font-medium cursor-pointer border border-[#F7EEDD]/30"
          >
            {peeled ? COPY.blend.hideDetailsBtn[lang] : COPY.blend.showDetailsBtn[lang]}
          </button>
        </div>
      )}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
 * STAGE 2 — FLAVOR SUN SVG DIAL
 * ────────────────────────────────────────────────────────────────────────── */
interface FlavorSunDialProps {
  rays: (typeof BLEND_DATASETS)['bag']['rays'];
  activeIndex: number;
  activeRay: (typeof BLEND_DATASETS)['bag']['rays'][number];
  sunDrawn: boolean;
  prefersReduced: boolean;
  isDesktop: boolean;
  readingAngleDeg: number;
  rotationMV: ReturnType<typeof useMotionValue<number>>;
  wheelDeg: number;
  sunWrapRef: React.RefObject<HTMLDivElement | null>;
  hasInteracted: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onSnapToRay: (idx: number) => void;
}

const FlavorSunDial: React.FC<FlavorSunDialProps> = ({
  rays,
  activeIndex,
  activeRay,
  sunDrawn,
  prefersReduced,
  isDesktop,
  readingAngleDeg,
  wheelDeg,
  sunWrapRef,
  hasInteracted,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
  onSnapToRay,
}) => {
  const { lang, isRtl } = useQahwa();
  const stepAngle = 360 / rays.length;

  // Reading needle pointer position on outer rim (top-right on desktop, top on mobile)
  const readRad = ((readingAngleDeg - 90) * Math.PI) / 180;
  const indicatorX = 300 + Math.cos(readRad) * 265;
  const indicatorY = 300 + Math.sin(readRad) * 265;

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      {/* One-time hand-drawn arrow near the sun that disappears after first interaction */}
      {!prefersReduced && !hasInteracted && (
        <div
          className={`flex items-center gap-2 mb-2 px-3 py-1 rounded-md bg-[#A9431A]/95 text-[#F7EEDD] shadow-md transition-opacity duration-500 ${
            sunDrawn ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="font-hand text-base md:text-lg">{COPY.blend.turnSunHint[lang]}</span>
          <HandDrawnArrow className="w-8 h-5" color="#FFE600" active={sunDrawn} />
        </div>
      )}

      {/* Interactive Circular Flavor Sun */}
      <div
        ref={sunWrapRef}
        role="slider"
        tabIndex={0}
        aria-label={COPY.blend.wheelAriaLabel[lang]}
        aria-valuemin={1}
        aria-valuemax={rays.length}
        aria-valuenow={activeIndex + 1}
        aria-valuetext={`${activeRay.category[lang]}: ${activeRay.value[lang]}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className="relative w-[86vw] max-w-[350px] lg:w-[460px] xl:w-[500px] lg:max-w-none aspect-square select-none touch-none cursor-grab active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-[#FFE600] rounded-full"
      >
        {/* Fixed Reading Notch Indicator outside the rotating dial */}
        <svg viewBox="0 0 600 600" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          <circle
            cx={indicatorX}
            cy={indicatorY}
            r="7"
            fill="#FFE600"
            stroke="#2A140B"
            strokeWidth="2.5"
          />
        </svg>

        {/* Rotating Rays Layer */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `rotate(${wheelDeg}deg)`,
          }}
        >
          <svg viewBox="0 0 600 600" className="w-full h-full overflow-visible">
            {rays.map((ray, idx) => {
              const angle = idx * stepAngle;
              const isActive = idx === activeIndex;
              // Flavor rays vary length by intensity; uniform length for fact rays
              const outerR =
                ray.kind === 'flavor'
                  ? Math.round(168 + ray.intensity * 56)
                  : 178;
              const d = buildWavyRayPath(angle, 102, outerR, idx + 1.5);
              const pathLen = 190;

              return (
                <g key={ray.id}>
                  {/* Subtle neon yellow glow halo under active ray */}
                  {isActive && (
                    <path
                      d={d}
                      fill="none"
                      stroke="#FFE600"
                      strokeWidth="7.5"
                      strokeLinecap="round"
                      opacity="0.72"
                    />
                  )}
                  <path
                    d={d}
                    fill="none"
                    stroke="#F7EEDD"
                    strokeOpacity={isActive ? 1 : 0.65}
                    strokeWidth={isActive ? 4.4 : 2.3}
                    strokeLinecap="round"
                    strokeDasharray={pathLen}
                    strokeDashoffset={prefersReduced || sunDrawn ? 0 : pathLen}
                    style={{
                      transition: prefersReduced
                        ? undefined
                        : `stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 90}ms, stroke-width 0.25s ease, stroke-opacity 0.25s ease`,
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Clickable Upright Handwritten Labels Positioned Along Each Ray */}
          {rays.map((ray, idx) => {
            const angle = idx * stepAngle;
            const isActive = idx === activeIndex;
            const outerR =
              ray.kind === 'flavor' ? 168 + ray.intensity * 56 : 178;
            // Place badge near tip of ray with comfortable buffer inside 390px dial
            const tipRadiusPct = ((outerR + 18) / 600) * 100;
            const rad = ((angle - 90) * Math.PI) / 180;
            const leftPct = 50 + Math.cos(rad) * tipRadiusPct;
            const topPct = 50 + Math.sin(rad) * tipRadiusPct;

            return (
              <button
                key={ray.id}
                type="button"
                data-ray-btn="true"
                onClick={(e) => {
                  e.stopPropagation();
                  onSnapToRay(idx);
                }}
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: `translate(-50%, -50%) rotate(${-wheelDeg}deg)`,
                }}
                className={`absolute z-20 px-2.5 py-1 rounded-md text-center whitespace-nowrap cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#FFE600] ${
                  isRtl ? 'font-ruqaa text-xs sm:text-sm md:text-base' : 'font-hand text-xs sm:text-sm md:text-base'
                } ${
                  isActive
                    ? 'bg-[#2A140B] text-[#FFE600] border border-[#FFE600]/80 shadow-md'
                    : 'bg-[#A9431A]/92 text-[#F7EEDD] border border-[#F7EEDD]/25 hover:border-[#FFE600]'
                }`}
              >
                {ray.value[lang]}
              </button>
            );
          })}
        </div>

        {/* Fixed Upright Center Disc with Pressed Clay Readout */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            aria-live="polite"
            className={`w-[36%] min-w-[140px] max-w-[194px] aspect-square rounded-full bg-[#F7EEDD] text-[#2A140B] border-[3px] shadow-[0_14px_36px_rgba(42,20,11,0.38)] flex flex-col items-center justify-center p-3.5 text-center transition-colors ${
              isDesktop ? 'border-[#FFE600]' : 'border-[#F7EEDD]'
            }`}
          >
            <QahwaLogoSVG className="w-6 h-7 mb-1 opacity-85" color="#C1501F" />
            <span
              className={`text-[10px] font-semibold text-[#A9431A] ${
                isRtl ? '' : 'uppercase tracking-[0.18em]'
              }`}
            >
              {activeRay.category[lang]}
            </span>
            <PressedClayHeadline
              text={activeRay.value[lang]}
              as="h3"
              className="mt-1 text-base md:text-lg leading-tight text-[#2A140B]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
