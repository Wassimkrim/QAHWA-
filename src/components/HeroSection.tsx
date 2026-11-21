import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COPY, VENUE_CONFIG } from '../config/content';
import { useQahwa } from '../context/QahwaContext';
import { MagneticButton, QAHWA_STONE_PATHS, QahwaWordmark, SunRaysSVG } from './BrandPrimitives';
import { StampCollageWord } from './ClayType';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection: React.FC = () => {
  const { lang } = useQahwa();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const maskWrapRef = useRef<HTMLDivElement>(null);
  const stoneMaskRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const introSubRef = useRef<HTMLDivElement>(null);
  const endContentRef = useRef<HTMLDivElement>(null);
  const [wordmarkSpread, setWordmarkSpread] = useState(0);
  const [revealEnd, setRevealEnd] = useState(false);

  // Bulletproof mobile autoplay for iOS Safari / Android Chrome / In-App WebViews
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = true;
    vid.defaultMuted = true;
    vid.playsInline = true;
    vid.setAttribute('muted', '');
    vid.setAttribute('playsinline', '');
    vid.setAttribute('webkit-playsinline', '');

    const tryPlay = () => {
      if (vid.paused) {
        vid.play().catch(() => {});
      }
    };

    tryPlay();
    vid.addEventListener('loadeddata', tryPlay);
    vid.addEventListener('canplay', tryPlay);

    // Fallback unlock on first touch/pointer/scroll in strict mobile power-saving modes
    const unlockOnGesture = () => {
      tryPlay();
      window.removeEventListener('touchstart', unlockOnGesture);
      window.removeEventListener('pointerdown', unlockOnGesture);
      window.removeEventListener('scroll', unlockOnGesture);
    };

    window.addEventListener('touchstart', unlockOnGesture, { passive: true, once: true });
    window.addEventListener('pointerdown', unlockOnGesture, { passive: true, once: true });
    window.addEventListener('scroll', unlockOnGesture, { passive: true, once: true });

    return () => {
      vid.removeEventListener('loadeddata', tryPlay);
      vid.removeEventListener('canplay', tryPlay);
      window.removeEventListener('touchstart', unlockOnGesture);
      window.removeEventListener('pointerdown', unlockOnGesture);
      window.removeEventListener('scroll', unlockOnGesture);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReduced) {
      setRevealEnd(true);
      if (maskWrapRef.current) maskWrapRef.current.style.clipPath = 'inset(0% 0% 0% 0% round 0px)';
      if (stoneMaskRef.current) stoneMaskRef.current.style.opacity = '0';
      if (scrimRef.current) scrimRef.current.style.opacity = '1';
      if (introSubRef.current) introSubRef.current.style.opacity = '0';
      if (endContentRef.current) {
        endContentRef.current.style.opacity = '1';
        endContentRef.current.style.pointerEvents = 'auto';
      }
      return;
    }

    // Apply initial frame geometry cleanly before any scroll
    if (maskWrapRef.current) {
      maskWrapRef.current.style.clipPath = isMobile
        ? 'inset(18% 12% 24% 12% round 140px)'
        : 'inset(21% 31% 21% 31% round 190px)';
    }

    const ctx = gsap.context(() => {
      if (raysRef.current) {
        gsap.to(raysRef.current, {
          rotation: 360,
          duration: 64,
          repeat: -1,
          ease: 'none',
        });
      }

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: isMobile ? '+=95%' : '+=175%',
        pin: true,
        scrub: 0.75,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          setWordmarkSpread(Math.min(1, p * (isMobile ? 0.65 : 1.4)));

          if (maskWrapRef.current) {
            if (isMobile) {
              const topPct = Math.max(0, 18 * (1 - p * 1.45));
              const sidePct = Math.max(0, 12 * (1 - p * 1.45));
              const botPct = Math.max(0, 24 * (1 - p * 1.45));
              const rad = Math.max(0, 140 * (1 - p * 1.4));
              maskWrapRef.current.style.clipPath = `inset(${topPct}% ${sidePct}% ${botPct}% ${sidePct}% round ${rad}px)`;
            } else {
              const topPct = Math.max(0, 21 * (1 - p * 1.38));
              const sidePct = Math.max(0, 31 * (1 - p * 1.38));
              const botPct = Math.max(0, 21 * (1 - p * 1.38));
              const rad = Math.max(0, 190 * (1 - p * 1.32));
              maskWrapRef.current.style.clipPath = `inset(${topPct}% ${sidePct}% ${botPct}% ${sidePct}% round ${rad}px)`;
            }
          }

          if (stoneMaskRef.current) {
            const s = 1 + p * 3.4;
            stoneMaskRef.current.style.transform = `scale(${s})`;
            stoneMaskRef.current.style.opacity = `${Math.max(0, 1 - p * 2.2)}`;
          }

          if (raysRef.current) {
            const rayScale = 1 + p * 1.35;
            const rayOpacity = Math.max(0.05, 0.32 * (1 - p * 1.1));
            raysRef.current.style.transform = `scale(${rayScale})`;
            raysRef.current.style.opacity = `${rayOpacity}`;
          }

          if (introSubRef.current) {
            introSubRef.current.style.opacity = `${Math.max(0, 1 - p * 3.2)}`;
            introSubRef.current.style.transform = `translate3d(0, ${-p * 42}px, 0)`;
          }

          if (scrimRef.current) {
            scrimRef.current.style.opacity = `${Math.min(1, Math.max(0, (p - 0.25) * 1.5))}`;
          }

          if (endContentRef.current) {
            const ep = Math.min(1, Math.max(0, (p - 0.48) * 2.2));
            endContentRef.current.style.opacity = `${ep}`;
            endContentRef.current.style.pointerEvents = ep > 0.35 ? 'auto' : 'none';
          }

          setRevealEnd(p > 0.54);
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative w-full h-[100svh] min-h-[580px] terracotta-suede text-[#F7EEDD] overflow-hidden flex flex-col items-center justify-between py-16 sm:py-20 md:py-24"
    >
      {/* Background giant outlined sun-rays */}
      <div
        ref={raysRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30"
        aria-hidden="true"
      >
        <SunRaysSVG
          className="w-[135vw] h-[135vw] md:w-[88vw] md:h-[88vw] max-w-[1200px] max-h-[1200px]"
          strokeColor="#F7EEDD"
          strokeWidth={1.6}
        />
      </div>

      {/* Video Layer inside expanding stone/arch mask */}
      <div
        ref={maskWrapRef}
        className="absolute inset-0 z-10 overflow-hidden will-change-transform bg-[#2A140B]"
      >
        <video
          ref={videoRef}
          src={VENUE_CONFIG.assets.heroVideo}
          poster={VENUE_CONFIG.assets.dimpledCup}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover warm-video-grade scale-[1.03]"
        />
        <div
          ref={scrimRef}
          className="absolute inset-0 bg-gradient-to-t from-[#2A140B]/88 via-[#2A140B]/44 to-[#2A140B]/35 opacity-0 transition-opacity duration-200"
        />
      </div>

      {/* Center Stone Silhouette Rim */}
      <div
        ref={stoneMaskRef}
        className="flex absolute inset-0 z-[15] items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 220" className="w-[62vw] max-w-[290px] md:w-[38vw] md:max-w-[460px] h-auto opacity-80">
          <path
            d={QAHWA_STONE_PATHS.middle}
            fill="none"
            stroke="#F7EEDD"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* Top Centered Wordmark with 3 signature marks */}
      <div className="relative z-20 pt-2 md:pt-4 px-4 flex justify-center w-full">
        <QahwaWordmark
          sizeClass="text-xl sm:text-3xl md:text-4xl"
          color="#F7EEDD"
          markColor="#F7EEDD"
          spread={wordmarkSpread}
          interactive={true}
          dropped={true}
        />
      </div>

      {/* Initial Tagline below stone mask */}
      <div
        ref={introSubRef}
        className="relative z-20 text-center px-5 pb-3 sm:pb-4 pointer-events-none"
      >
        <p className="hand-thrown glaze-text-cream text-2xl sm:text-4xl md:text-5xl tracking-tight">
          {COPY.hero.tagline[lang]}
        </p>
        <div className="mt-3 sm:mt-4 flex flex-col items-center gap-1.5 text-[#F7EEDD]/85">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.26em]">
            {COPY.hero.scrollCue[lang]}
          </span>
          <svg viewBox="0 0 24 42" className="w-4 h-6 sm:h-7 animate-bounce" fill="none" aria-hidden="true">
            <path
              d="M12 2 C15 10, 9 18, 12 26 C14 31, 12 36, 12 39"
              stroke="#FFE600"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M7 33 L12 39 L17 33"
              stroke="#FFE600"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* End State: Fullscreen Headline + MORE as Stamp Collage + CTAs */}
      <div
        ref={endContentRef}
        className="absolute inset-0 z-30 flex flex-col items-center justify-end pb-10 sm:pb-14 md:pb-20 px-4 sm:px-6 text-center opacity-0 pointer-events-none"
      >
        <h1 className="max-w-5xl mx-auto flex flex-wrap items-baseline justify-center gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-0.5 text-[clamp(2.25rem,9.2vw,8.8rem)] leading-[0.98] text-[#F7EEDD]">
          {[
            { text: COPY.hero.headlineLine1[lang], delay: '0ms' },
            { text: COPY.hero.headlineLine2[lang], delay: '90ms' },
            { text: COPY.hero.headlineLine3[lang], delay: '180ms' },
          ].map((word, idx) => (
            <span key={idx} className="overflow-hidden inline-block py-1">
              <span
                className="inline-block hand-thrown transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  transform: revealEnd ? 'translateY(0)' : 'translateY(110%)',
                  opacity: revealEnd ? 1 : 0,
                  transitionDelay: word.delay,
                  ['--type-wght' as string]: revealEnd ? '600' : '320',
                  ['--type-soft' as string]: revealEnd ? '100' : '20',
                }}
              >
                {word.text}
              </span>
            </span>
          ))}

          <span className="overflow-visible inline-block py-1">
            {revealEnd && (
              <StampCollageWord text={COPY.hero.headlineMore[lang]} light />
            )}
          </span>
        </h1>

        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <MagneticButton
            onClick={() => scrollToSection('the-line')}
            className="btn-liquid px-5 py-3 sm:px-7 sm:py-3.5 rounded-full bg-[#F7EEDD] text-[#2A140B] font-medium text-xs sm:text-sm md:text-base shadow-lg border border-[#F7EEDD]"
          >
            {COPY.hero.ctaMenu[lang]}
          </MagneticButton>
          <MagneticButton
            onClick={() => scrollToSection('visit')}
            className="px-5 py-3 sm:px-7 sm:py-3.5 rounded-full bg-[#2A140B]/55 backdrop-blur-sm text-[#F7EEDD] border border-[#F7EEDD]/65 hover:border-[#FFE600] hover:text-[#FFE600] font-medium text-xs sm:text-sm md:text-base transition-colors"
          >
            {COPY.hero.ctaVisit[lang]}
          </MagneticButton>
        </div>

        <div className="mt-5 sm:mt-7 flex items-center gap-2 text-[#F7EEDD]/75">
          <svg viewBox="0 0 80 12" className="w-16 h-3" fill="none" aria-hidden="true">
            <path
              d="M2 6 Q12 1, 22 6 T42 6 T62 6 T78 6"
              stroke="#FFE600"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};
