import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COPY, VENUE_CONFIG } from '../config/content';
import { useQahwa } from '../context/QahwaContext';
import { GlazeHeadline, SectionLabel } from './BrandPrimitives';

gsap.registerPlugin(ScrollTrigger);

export const FirstPourSection: React.FC = () => {
  const { lang } = useQahwa();
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const [activePin, setActivePin] = useState<'left' | 'right'>('left');

  useEffect(() => {
    const section = sectionRef.current;
    const photo = photoRef.current;
    if (!section || !photo) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        photo,
        { scale: 1.0 },
        {
          scale: 1.24,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'bottom 25%',
            scrub: 0.9,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 px-5 md:px-10 cream-plaster text-[#2A140B] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Photo A in tall arched frame with scroll zoom + shimmering golden SVG stream trace + hotspots */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-[440px] aspect-[4/5] arch-mask overflow-hidden border-[3px] border-[#F7EEDD] shadow-[0_24px_60px_rgba(42,20,11,0.18)] bg-[#2A140B]">
            {/* Zooming Container */}
            <div
              ref={photoRef}
              className="relative w-full h-full will-change-transform"
              style={{ transformOrigin: '60% 62%' }}
            >
              <img
                src={VENUE_CONFIG.assets.photoAEspressoCups}
                alt={COPY.firstPour.headline[lang]}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover warm-video-grade"
              />

              {/* Two thin shimmering golden SVG strokes tracing the real espresso streams */}
              <svg
                viewBox="0 0 400 500"
                className="absolute inset-0 w-full h-full pointer-events-none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="espressoStreamGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E69D35" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#FFE680" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#C1501F" stopOpacity="0.2" />
                    <animateTransform
                      attributeName="gradientTransform"
                      type="translate"
                      from="0 -1"
                      to="0 1"
                      dur="1.4s"
                      repeatCount="indefinite"
                    />
                  </linearGradient>
                </defs>
                {/* Left stream into brown cup */}
                <path
                  d="M229 194 Q226 232 227 272"
                  stroke="url(#espressoStreamGrad)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Right stream into cream cup */}
                <path
                  d="M286 196 Q290 236 292 278"
                  stroke="url(#espressoStreamGrad)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              {/* Left Cup Hotspot */}
              <button
                type="button"
                onClick={() => setActivePin('left')}
                aria-label={COPY.firstPour.leftHotspot[lang]}
                style={{ left: '49%', top: '63%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 w-7 h-7 flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FFE600] rounded-full"
              >
                <span className="absolute w-6 h-6 rounded-full bg-[#FFE600]/60 animate-ping" />
                <span
                  className={`relative w-3.5 h-3.5 rounded-full border-2 border-[#2A140B] transition-transform ${
                    activePin === 'left' ? 'bg-[#FFE600] scale-125' : 'bg-[#F7EEDD]'
                  }`}
                />
              </button>

              {/* Right Cup Hotspot */}
              <button
                type="button"
                onClick={() => setActivePin('right')}
                aria-label={COPY.firstPour.rightHotspot[lang]}
                style={{ left: '74%', top: '65%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 w-7 h-7 flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FFE600] rounded-full"
              >
                <span className="absolute w-6 h-6 rounded-full bg-[#FFE600]/60 animate-ping" />
                <span
                  className={`relative w-3.5 h-3.5 rounded-full border-2 border-[#2A140B] transition-transform ${
                    activePin === 'right' ? 'bg-[#FFE600] scale-125' : 'bg-[#F7EEDD]'
                  }`}
                />
              </button>
            </div>

            {/* Handwritten Kraft Label popping on cup hotspot */}
            <div className="absolute bottom-5 inset-x-5 z-30 flex justify-center pointer-events-none">
              <div className="kraft-card-bg px-4 py-2 rounded-md border border-[#2A140B]/20 shadow-lg text-[#2A140B] font-hand text-lg md:text-xl tracking-wide transform -rotate-1">
                {activePin === 'left'
                  ? COPY.firstPour.leftHotspot[lang]
                  : COPY.firstPour.rightHotspot[lang]}
              </div>
            </div>
          </div>
        </div>

        {/* Right Clay Type Headline */}
        <div className="lg:col-span-6">
          <SectionLabel text={COPY.firstPour.label[lang]} />
          <GlazeHeadline className="mt-5 text-[clamp(2.4rem,5.8vw,5rem)]">
            {COPY.firstPour.headline[lang]}
          </GlazeHeadline>

          <p className="mt-6 text-sm text-[#2A140B]/70">{COPY.firstPour.tapHint[lang]}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActivePin('left')}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium border transition-colors cursor-pointer ${
                activePin === 'left'
                  ? 'bg-[#C1501F] text-[#F7EEDD] border-[#C1501F]'
                  : 'border-[#2A140B]/20 text-[#2A140B] hover:border-[#C1501F]'
              }`}
            >
              {COPY.firstPour.leftHotspot[lang]}
            </button>
            <button
              type="button"
              onClick={() => setActivePin('right')}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium border transition-colors cursor-pointer ${
                activePin === 'right'
                  ? 'bg-[#C1501F] text-[#F7EEDD] border-[#C1501F]'
                  : 'border-[#2A140B]/20 text-[#2A140B] hover:border-[#C1501F]'
              }`}
            >
              {COPY.firstPour.rightHotspot[lang]}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
