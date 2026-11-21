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
  const logoMatteRef = useRef<HTMLDivElement>(null);
  const stoneMaskRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);
  const wordmarkWrapRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const introSubRef = useRef<HTMLDivElement>(null);
  const endContentRef = useRef<HTMLDivElement>(null);
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
      if (maskWrapRef.current) maskWrapRef.current.style.clipPath = 'none';
      if (logoMatteRef.current) logoMatteRef.current.style.opacity = '0';
      if (stoneMaskRef.current) stoneMaskRef.current.style.opacity = '0';
      if (scrimRef.current) scrimRef.current.style.opacity = '1';
      if (introSubRef.current) introSubRef.current.style.opacity = '0';
      if (endContentRef.current) {
        endContentRef.current.style.opacity = '1';
        endContentRef.current.style.pointerEvents = 'auto';
      }
      return;
    }

    // Apply initial geometry cleanly before scroll
    if (maskWrapRef.current) {
      maskWrapRef.current.style.clipPath = isMobile
        ? 'none'
        : 'inset(21% 31% 21% 31% round 190px)';
    }

    if (logoMatteRef.current) {
      logoMatteRef.current.style.transform = 'translate3d(0, 0, 0) scale(1)';
      logoMatteRef.current.style.opacity = '1';
    }

    let revealedFlag = false;

    const ctx = gsap.context(() => {
      // Slow desktop ambient spin only (CSS handles lightweight fallback on mobile)
      if (!isMobile && raysRef.current) {
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
        end: isMobile ? '+=85%' : '+=165%',
        pin: true,
        scrub: isMobile ? 0.35 : 0.7,
        anticipatePin: 1,
        fastScrollEnd: true,
        onUpdate: (self) => {
          const p = self.progress;

          // Update wordmark spread directly via CSS var (zero React re-render)
          if (wordmarkWrapRef.current) {
            const wmTarget = wordmarkWrapRef.current.firstElementChild as HTMLElement | null;
            if (wmTarget) {
              const spreadVal = Math.min(1, p * (isMobile ? 0.55 : 1.35));
              wmTarget.style.setProperty('--qahwa-spread', spreadVal.toFixed(3));
            }
          }

          if (isMobile) {
            // Mobile: 100% GPU compositor transform + opacity on QAHWA 3-stone matte cutout
            // Video remains crisp underneath inside the logo silhouette and gradually fills the screen
            if (logoMatteRef.current) {
              const easedP = p * p * (3 - 2 * p);
              const logoScale = 1 + Math.pow(p, 1.35) * 7.8;
              const matteOpacity = p < 0.44 ? 1 : Math.max(0, 1 - (p - 0.44) / 0.34);
              logoMatteRef.current.style.transform = `translate3d(0, 0, 0) scale(${logoScale.toFixed(
                3
              )})`;
              logoMatteRef.current.style.opacity = `${matteOpacity.toFixed(3)}`;

              if (videoRef.current) {
                const vidScale = 1.02 + easedP * 0.04;
                videoRef.current.style.transform = `translate3d(0, 0, 0) scale(${vidScale.toFixed(3)})`;
              }
            }
          } else {
            // Desktop: Arched cutout expansion + stone rim scale
            if (maskWrapRef.current) {
              const topPct = Math.max(0, 21 * (1 - p * 1.38));
              const sidePct = Math.max(0, 31 * (1 - p * 1.38));
              const botPct = Math.max(0, 21 * (1 - p * 1.38));
              const rad = Math.max(0, 190 * (1 - p * 1.32));
              maskWrapRef.current.style.clipPath = `inset(${topPct.toFixed(1)}% ${sidePct.toFixed(
                1
              )}% ${botPct.toFixed(1)}% ${sidePct.toFixed(1)}% round ${rad.toFixed(0)}px)`;
            }

            if (stoneMaskRef.current) {
              const s = 1 + p * 3.4;
              stoneMaskRef.current.style.transform = `translate3d(0, 0, 0) scale(${s.toFixed(3)})`;
              stoneMaskRef.current.style.opacity = `${Math.max(0, 1 - p * 2.2).toFixed(3)}`;
            }

            if (raysRef.current) {
              const rayScale = 1 + p * 1.35;
              const rayOpacity = Math.max(0.05, 0.32 * (1 - p * 1.1));
              raysRef.current.style.transform = `translate3d(0, 0, 0) scale(${rayScale.toFixed(3)})`;
              raysRef.current.style.opacity = `${rayOpacity.toFixed(3)}`;
            }
          }

          if (introSubRef.current) {
            const subOp = Math.max(0, 1 - p * 3.4);
            introSubRef.current.style.opacity = `${subOp.toFixed(3)}`;
            introSubRef.current.style.transform = `translate3d(0, ${(-p * 38).toFixed(1)}px, 0)`;
          }

          if (scrimRef.current) {
            const scrimOp = Math.min(1, Math.max(0, (p - 0.3) * 1.55));
            scrimRef.current.style.opacity = `${scrimOp.toFixed(3)}`;
          }

          if (endContentRef.current) {
            const ep = Math.min(1, Math.max(0, (p - 0.5) * 2.3));
            endContentRef.current.style.opacity = `${ep.toFixed(3)}`;
            endContentRef.current.style.pointerEvents = ep > 0.35 ? 'auto' : 'none';
          }

          const shouldReveal = p > 0.55;
          if (shouldReveal !== revealedFlag) {
            revealedFlag = shouldReveal;
            setRevealEnd(shouldReveal);
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Full viewport SVG sheet with the 3 QAHWA logo stones punched out cleanly via fillRule="evenodd"
  const logoMatteCompoundPath = `M -700 -700 H 900 V 900 H -700 Z ${QAHWA_STONE_PATHS.top} ${QAHWA_STONE_PATHS.middle} ${QAHWA_STONE_PATHS.bottom}`;

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative w-full h-[100svh] min-h-[580px] terracotta-suede text-[#F7EEDD] overflow-hidden flex flex-col items-center justify-between pt-20 pb-10 sm:py-20 md:py-24"
    >
      {/* Desktop: Background giant outlined sun-rays */}
      <div
        ref={raysRef}
        className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none opacity-30"
        aria-hidden="true"
      >
        <SunRaysSVG
          className="w-[88vw] h-[88vw] max-w-[1200px] max-h-[1200px]"
          strokeColor="#F7EEDD"
          strokeWidth={1.6}
        />
      </div>

      {/* Video Layer (Full-bleed on Mobile revealed through Logo Matte; Arch-clipped on Desktop) */}
      <div
        ref={maskWrapRef}
        className="absolute inset-0 z-10 overflow-hidden bg-[#2A140B]"
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
          className="w-full h-full object-cover md:warm-video-grade scale-[1.02] will-change-transform"
        />
        {/* Subtle zero-cost warm glaze overlay on mobile instead of heavy per-frame video CSS filter */}
        <div
          className="md:hidden absolute inset-0 bg-[#C1501F]/10 pointer-events-none"
          aria-hidden="true"
        />
        <div
          ref={scrimRef}
          className="absolute inset-0 bg-gradient-to-t from-[#2A140B]/88 via-[#2A140B]/44 to-[#2A140B]/35 opacity-0"
        />
      </div>

      {/* MOBILE ONLY: QAHWA 3-Stone Logo Matte Cutout (video plays INSIDE the logo silhouette, scales up on scroll) */}
      <div
        className="md:hidden absolute inset-0 z-[15] pointer-events-none overflow-hidden flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          ref={logoMatteRef}
          className="w-[225vmax] h-[225vmax] shrink-0 flex items-center justify-center will-change-transform -mt-[3vh]"
          style={{ transformOrigin: '50% 50%' }}
        >
          <svg
            viewBox="-499 -504 1200 1200"
            className="w-full h-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="mobileHeroMatteGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#C65421" />
                <stop offset="54%" stopColor="#B74819" />
                <stop offset="100%" stopColor="#A83F14" />
              </linearGradient>
            </defs>

            {/* Terracotta sheet with transparent cutouts for all 3 stacked stones */}
            <path
              d={logoMatteCompoundPath}
              fillRule="evenodd"
              clipRule="evenodd"
              fill="url(#mobileHeroMatteGrad)"
            />

            {/* Delicate cream hand-drawn sun rays radiating softly from around the logo */}
            <g stroke="#F7EEDD" strokeOpacity="0.24" strokeWidth="1.2" strokeLinecap="round" fill="none">
              <path d="M 108 10 C 103 -32, 115 -68, 106 -118" />
              <path d="M 155 48 C 190 22, 224 4, 274 -26" />
              <path d="M 176 112 C 218 108, 256 122, 308 112" />
              <path d="M 164 176 C 204 202, 232 232, 276 268" />
              <path d="M 100 218 C 106 262, 92 304, 102 354" />
              <path d="M 38 186 C -4 218, -36 244, -84 282" />
              <path d="M 22 114 C -24 118, -62 104, -116 114" />
              <path d="M 46 50 C 8 24, -24 -6, -72 -42" />
            </g>

            {/* Crisp cream rim tracing the 3 stacked logo stones around the video window */}
            <g fill="none" stroke="#F7EEDD" strokeOpacity="0.92" strokeWidth="1.65">
              <path d={QAHWA_STONE_PATHS.top} />
              <path d={QAHWA_STONE_PATHS.middle} />
              <path d={QAHWA_STONE_PATHS.bottom} />
            </g>
          </svg>
        </div>
      </div>

      {/* DESKTOP ONLY: Center Stone Silhouette Rim */}
      <div
        ref={stoneMaskRef}
        className="hidden md:flex absolute inset-0 z-[15] items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 220" className="w-[38vw] max-w-[460px] h-auto opacity-80">
          <path
            d={QAHWA_STONE_PATHS.middle}
            fill="none"
            stroke="#F7EEDD"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* Top Centered Wordmark with 3 signature marks */}
      <div ref={wordmarkWrapRef} className="relative z-20 pt-2 md:pt-4 px-4 flex justify-center w-full">
        <QahwaWordmark
          sizeClass="text-xl sm:text-3xl md:text-4xl"
          color="#F7EEDD"
          markColor="#F7EEDD"
          spread={0}
          interactive={true}
          dropped={true}
        />
      </div>

      {/* Initial Tagline below logo mask */}
      <div
        ref={introSubRef}
        className="relative z-20 text-center px-5 pb-2 sm:pb-4 pointer-events-none"
      >
        <p className="hand-thrown glaze-text-cream text-2xl sm:text-4xl md:text-5xl tracking-tight">
          {COPY.hero.tagline[lang]}
        </p>
        <div className="mt-2.5 sm:mt-4 flex flex-col items-center gap-1.5 text-[#F7EEDD]/85">
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
                className="inline-block hand-thrown transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
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
