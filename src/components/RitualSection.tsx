import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COPY, VENUE_CONFIG } from '../config/content';
import { useQahwa } from '../context/QahwaContext';
import { GlazeHeadline, HandDrawnArrow, SectionLabel, SunRaysSVG } from './BrandPrimitives';

gsap.registerPlugin(ScrollTrigger);

export const RitualSection: React.FC = () => {
  const { lang, activeAudio, setActiveAudio } = useQahwa();
  const sectionRef = useRef<HTMLElement>(null);
  const archRef = useRef<HTMLDivElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [linkHovered, setLinkHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const isRitualSoundOn = activeAudio === 'ritual';

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        const mainVid = mainVideoRef.current;
        const bgVid = bgVideoRef.current;
        if (entry.isIntersecting) {
          mainVid?.play().catch(() => {});
          bgVid?.play().catch(() => {});
        } else {
          mainVid?.pause();
          bgVid?.pause();
          if (isRitualSoundOn) {
            setActiveAudio('none');
          }
        }
      },
      { threshold: 0.15 }
    );

    obs.observe(section);
    return () => obs.disconnect();
  }, [isRitualSoundOn, setActiveAudio]);

  useEffect(() => {
    const vid = mainVideoRef.current;
    if (vid) {
      vid.defaultMuted = !isRitualSoundOn;
      vid.muted = !isRitualSoundOn;
      vid.playsInline = true;
      vid.setAttribute('playsinline', '');
      vid.setAttribute('webkit-playsinline', '');
      if (vid.paused) {
        vid.play().catch(() => {});
      }
    }
  }, [isRitualSoundOn]);

  useEffect(() => {
    const arch = archRef.current;
    const section = sectionRef.current;
    if (!arch || !section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        arch,
        { y: 48, scale: 0.94 },
        {
          y: -16,
          scale: 1.02,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 25%',
            scrub: 0.8,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDesktop || e.pointerType === 'touch') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -ny * 7, ry: nx * 9 });
  };

  const toggleSound = () => {
    setActiveAudio(isRitualSoundOn ? 'none' : 'ritual');
  };

  return (
    <section
      id="ritual"
      ref={sectionRef}
      onPointerMove={handleMove}
      onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
      className="relative py-28 md:py-36 px-5 md:px-10 bg-[#2A140B] text-[#F7EEDD] overflow-hidden"
    >
      {/* Top smooth blend */}
      <div
        className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-[#F7EEDD] to-transparent pointer-events-none z-10 opacity-15"
        aria-hidden="true"
      />

      {/* Desktop Ambient Blurred Duplicate Video Backdrop; Mobile Static Warm Espresso Gradient */}
      {isDesktop ? (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <video
            ref={bgVideoRef}
            src={VENUE_CONFIG.assets.ritualVideo}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover scale-125 blur-3xl opacity-35 warm-video-grade"
          />
          <div className="absolute inset-0 bg-[#2A140B]/60" />
        </div>
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#2A140B] via-[#3A1B0E] to-[#2A140B] pointer-events-none"
          aria-hidden="true"
        />
      )}

      <div className="absolute inset-0 paper-grain pointer-events-none" aria-hidden="true" />

      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20"
        aria-hidden="true"
      >
        <div className="animate-[spin_75s_linear_infinite]">
          <SunRaysSVG className="w-[740px] h-[740px]" strokeColor="#C1501F" strokeWidth={1.8} />
        </div>
      </div>

      <div className="relative z-20 max-w-6xl mx-auto flex flex-col items-center">
        <SectionLabel text={COPY.ritual.label[lang]} light />

        <div className="relative w-full mt-10 flex items-center justify-center">
          {/* Layer 1: Giant Outlined Condensed Title */}
          <div className="absolute inset-x-0 flex justify-center pointer-events-none select-none z-10">
            <GlazeHeadline
              cream
              className="font-condensed uppercase tracking-tight text-[clamp(3.6rem,13vw,11rem)] text-center leading-none opacity-85"
            >
              {COPY.ritual.bigTitle[lang]}
            </GlazeHeadline>
          </div>

          <div className="hidden md:flex flex-col gap-36 items-end pe-10 text-xs uppercase tracking-[0.28em] text-[#F7EEDD]/90 z-20 self-stretch justify-between py-12">
            <span>{COPY.ritual.captions.one[lang]}</span>
            <span>{COPY.ritual.captions.two[lang]}</span>
          </div>

          <div
            ref={archRef}
            className="relative z-20 w-[88%] max-w-[330px] sm:max-w-[360px] aspect-[9/16] arch-mask border-[2px] border-[#F7EEDD]/80 shadow-[0_28px_70px_rgba(0,0,0,0.55)] overflow-hidden bg-[#2A140B] transition-transform duration-300 ease-out"
            style={{
              transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            }}
          >
            <video
              ref={mainVideoRef}
              src={VENUE_CONFIG.assets.ritualVideo}
              poster={VENUE_CONFIG.assets.spicedMatcha}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover scale-[1.07] warm-video-grade"
            />

            <button
              type="button"
              onClick={toggleSound}
              aria-label={isRitualSoundOn ? COPY.nav.soundOn[lang] : COPY.nav.soundOff[lang]}
              className="absolute bottom-4 right-4 z-30 w-10 h-10 rounded-full bg-[#2A140B]/75 backdrop-blur-sm border border-[#F7EEDD]/40 hover:border-[#FFE600] flex items-center justify-center cursor-pointer transition-colors"
            >
              <span className="inline-flex items-end gap-[2.5px] h-3.5" aria-hidden="true">
                {[0.5, 1, 0.7, 0.85].map((h, i) => (
                  <span
                    key={i}
                    className={`w-[2px] rounded-full bg-[#F7EEDD] transition-all duration-300 ${
                      isRitualSoundOn ? 'animate-pulse' : ''
                    }`}
                    style={{
                      height: isRitualSoundOn ? `${Math.round(h * 13)}px` : '4px',
                      animationDelay: `${i * 100}ms`,
                    }}
                  />
                ))}
              </span>
            </button>
          </div>

          <div className="hidden md:flex flex-col items-start ps-10 text-xs uppercase tracking-[0.28em] text-[#F7EEDD]/90 z-20 self-end pb-12">
            <span>{COPY.ritual.captions.three[lang]}</span>
          </div>
        </div>

        <div className="mt-6 flex md:hidden items-center gap-6 text-xs uppercase tracking-[0.25em] text-[#F7EEDD]/85">
          <span>{COPY.ritual.captions.one[lang]}</span>
          <span>{COPY.ritual.captions.two[lang]}</span>
          <span>{COPY.ritual.captions.three[lang]}</span>
        </div>

        <a
          href={VENUE_CONFIG.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setLinkHovered(true)}
          onMouseLeave={() => setLinkHovered(false)}
          className="mt-10 inline-flex items-center gap-3 text-sm md:text-base font-medium text-[#F7EEDD] hover:text-[#FFE600] transition-colors group"
        >
          <span className="border-b border-[#F7EEDD]/40 group-hover:border-[#FFE600] pb-0.5">
            {COPY.ritual.watchMore[lang]}
          </span>
          <HandDrawnArrow className="w-9 h-5" color="currentColor" active={linkHovered} />
        </a>
      </div>
    </section>
  );
};
