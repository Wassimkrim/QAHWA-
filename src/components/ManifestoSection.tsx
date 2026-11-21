import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COPY, VENUE_CONFIG } from '../config/content';
import { useQahwa } from '../context/QahwaContext';
import { SectionLabel } from './BrandPrimitives';
import { PressedClayHeadline, RibbonTypePath } from './ClayType';

gsap.registerPlugin(ScrollTrigger);

export const ManifestoSection: React.FC = () => {
  const { lang } = useQahwa();
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<Array<HTMLSpanElement | null>>([]);
  const frameRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      wordsRef.current.forEach((w) => {
        if (w) w.style.opacity = '1';
      });
      return;
    }

    const ctx = gsap.context(() => {
      const validWords = wordsRef.current.filter(Boolean) as HTMLSpanElement[];
      if (validWords.length > 0) {
        gsap.fromTo(
          validWords,
          { opacity: 0.2 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 72%',
              end: 'center 42%',
              scrub: 0.6,
            },
          }
        );
      }

      const speeds = [-36, 42, -24];
      frameRefs.current.forEach((frame, idx) => {
        if (!frame) return;
        gsap.to(frame, {
          y: speeds[idx] || -25,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [lang]);

  const statementWords = COPY.manifesto.statement[lang].split(' ');

  const arches = [
    {
      image: VENUE_CONFIG.assets.nicheShelves,
      caption: COPY.manifesto.archCaptions[0][lang],
      className: 'md:col-span-4 md:mt-4',
    },
    {
      image: VENUE_CONFIG.assets.interiorChess,
      caption: COPY.manifesto.archCaptions[1][lang],
      className: 'md:col-span-4 md:mt-20',
    },
    {
      image: VENUE_CONFIG.assets.storefrontWindow,
      caption: COPY.manifesto.archCaptions[2][lang],
      className: 'md:col-span-4 md:mt-0',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 px-5 md:px-10 cream-plaster text-[#2A140B] overflow-hidden"
    >
      {/* Behavior B: Ribbon Type sweeping across top */}
      <RibbonTypePath phrase={COPY.manifesto.ribbonPhrase[lang]} className="mb-10" />

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-10">
          <SectionLabel text={COPY.manifesto.label[lang]} />
        </div>

        {/* Scrubbed word-by-word lighting statement */}
        <h2 className="max-w-4xl mx-auto text-center font-display text-[clamp(2.3rem,6.2vw,5.4rem)] leading-[1.12] font-medium text-balance">
          {statementWords.map((word, idx) => (
            <span
              key={`${lang}-${idx}`}
              ref={(el) => {
                wordsRef.current[idx] = el;
              }}
              className="inline-block mx-[0.14em] transition-opacity duration-150"
              style={{ opacity: 0.22 }}
            >
              {word}
            </span>
          ))}
        </h2>

        {/* 3 Parallax Arched Niche Frames */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-12 gap-8 md:gap-10 items-start">
          {arches.map((arch, idx) => (
            <div
              key={idx}
              ref={(el) => {
                frameRefs.current[idx] = el;
              }}
              className={`${arch.className} flex flex-col items-center`}
            >
              <div
                data-cursor="view"
                className="w-full max-w-[300px] aspect-[3/4] arch-mask overflow-hidden border-[3px] border-[#F7EEDD] shadow-[0_18px_40px_rgba(42,20,11,0.12)] bg-[#B98B5E]/20"
              >
                <img
                  src={arch.image}
                  alt={arch.caption}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="mt-4 text-xs md:text-sm text-[#2A140B]/70 text-center max-w-[24ch]">
                {arch.caption}
              </p>
            </div>
          ))}
        </div>

        {/* Closing line in Pressed Clay */}
        <div className="mt-16 md:mt-24 text-center flex justify-center">
          <PressedClayHeadline
            text={COPY.manifesto.closing[lang]}
            as="h3"
            className="text-2xl md:text-4xl italic text-[#C1501F]"
          />
        </div>
      </div>
    </section>
  );
};
