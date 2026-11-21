import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
  COPY,
  DRINK_POSTERS,
  DrinkPosterItem,
  KRAFT_TAGS,
  MENU_CATEGORIES,
} from '../config/content';
import { useQahwa } from '../context/QahwaContext';
import { MagneticButton, SectionLabel } from './BrandPrimitives';
import { PressedClayHeadline } from './ClayType';
import { DrinkPosterGraphic } from './DrinkPosterGraphic';

gsap.registerPlugin(ScrollTrigger);

/** Small wooden clothespin peg */
const WoodenPeg: React.FC<{ released?: boolean }> = ({ released = false }) => (
  <div
    className={`relative z-20 mx-auto w-3.5 h-8 rounded-[3px] bg-gradient-to-b from-[#D4A777] via-[#B98B5E] to-[#8C5E34] border border-[#2A140B]/30 shadow-md transition-transform duration-300 ${
      released ? '-translate-y-4 rotate-12 opacity-0' : 'translate-y-0 opacity-100'
    }`}
    aria-hidden="true"
  >
    <div className="absolute inset-x-0.5 top-2.5 h-[2px] bg-[#2A140B]/30" />
  </div>
);

export const MenuSection: React.FC = () => {
  const {
    lang,
    isRtl,
    activeMenuTab,
    setActiveMenuTab,
    openPosterId,
    clearOpenPoster,
  } = useQahwa();

  const pinWrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ropeGroupRef = useRef<HTMLDivElement>(null);

  const tagRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [selectedPoster, setSelectedPoster] = useState<DrinkPosterItem | null>(null);
  const [highlightedTagId, setHighlightedTagId] = useState<string | null>(null);
  const [swayDeg, setSwayDeg] = useState(0);

  // Sync external deep-link requests ("See it on the line", Full Menu camera glyph, or Word Stones)
  useEffect(() => {
    if (!openPosterId) return;
    const foundPoster = DRINK_POSTERS.find((p) => p.id === openPosterId);
    if (foundPoster) {
      const timer = window.setTimeout(() => {
        setSelectedPoster(foundPoster);
        clearOpenPoster();
      }, 450);
      return () => window.clearTimeout(timer);
    }

    const foundTag = KRAFT_TAGS.find((t) => t.id === openPosterId);
    if (foundTag) {
      setHighlightedTagId(foundTag.id);
      const tagEl = tagRefs.current[foundTag.id];
      if (tagEl) {
        tagEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
      const clearTimer = window.setTimeout(() => setHighlightedTagId(null), 3200);
      clearOpenPoster();
      return () => window.clearTimeout(clearTimer);
    }

    clearOpenPoster();
  }, [openPosterId, clearOpenPoster]);

  // Keyboard navigation for expanded poster lightbox
  useEffect(() => {
    if (!selectedPoster) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPoster(null);
      if (e.key === 'ArrowRight') {
        const idx = DRINK_POSTERS.findIndex((p) => p.id === selectedPoster.id);
        setSelectedPoster(DRINK_POSTERS[(idx + 1) % DRINK_POSTERS.length]);
      }
      if (e.key === 'ArrowLeft') {
        const idx = DRINK_POSTERS.findIndex((p) => p.id === selectedPoster.id);
        setSelectedPoster(
          DRINK_POSTERS[(idx - 1 + DRINK_POSTERS.length) % DRINK_POSTERS.length]
        );
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedPoster]);

  // Pinned horizontal scroll + wind sway reactive to scroll velocity on desktop
  useEffect(() => {
    const pinWrap = pinWrapRef.current;
    const track = trackRef.current;
    if (!pinWrap || !track) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.innerWidth >= 1024;
    if (prefersReduced || !isDesktop) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => Math.max(0, track.scrollWidth - window.innerWidth + 180);

      gsap.to(track, {
        x: () => (isRtl ? getScrollAmount() : -getScrollAmount()),
        ease: 'none',
        scrollTrigger: {
          trigger: pinWrap,
          start: 'top top',
          end: () => `+=${Math.max(1300, getScrollAmount() * 1.15)}`,
          pin: true,
          scrub: 0.9,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const vel = Math.max(-1, Math.min(1, self.getVelocity() / 1800));
            setSwayDeg(vel * 3.2);
          },
        },
      });
    }, pinWrap);

    return () => ctx.revert();
  }, [isRtl, lang]);

  // Sliding neon-yellow squiggle underline for Full Menu tabs
  const tabsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const activeBtn = tabsRef.current[activeMenuTab];
    if (activeBtn) {
      setUnderlineStyle({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
    }
  }, [activeMenuTab, lang]);

  const currentCategory =
    MENU_CATEGORIES.find((c) => c.id === activeMenuTab) || MENU_CATEGORIES[0];

  // Interleave posters with blank kraft tags on The Line
  const lineNodes: Array<
    | { type: 'poster'; data: DrinkPosterItem }
    | { type: 'tag'; data: (typeof KRAFT_TAGS)[number] }
  > = [
    { type: 'poster', data: DRINK_POSTERS[0] },
    { type: 'tag', data: KRAFT_TAGS[0] },
    { type: 'poster', data: DRINK_POSTERS[1] },
    { type: 'tag', data: KRAFT_TAGS[1] },
    { type: 'poster', data: DRINK_POSTERS[2] },
    { type: 'tag', data: KRAFT_TAGS[2] },
    { type: 'poster', data: DRINK_POSTERS[3] },
    { type: 'tag', data: KRAFT_TAGS[3] },
    { type: 'poster', data: DRINK_POSTERS[4] },
  ];

  return (
    <section id="menu" className="relative">
      {/* 4. THE LINE (Terracotta suede + hanging posters on hand-drawn wavy rope) */}
      <div
        id="the-line"
        ref={pinWrapRef}
        className="relative py-20 lg:py-0 lg:min-h-screen terracotta-suede text-[#F7EEDD] flex flex-col justify-center overflow-hidden"
      >
        <div className="max-w-7xl mx-auto w-full px-5 md:px-10 mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <SectionLabel text={COPY.theLine.label[lang]} light />
            <PressedClayHeadline
              text={COPY.theLine.heading[lang]}
              as="h2"
              className="mt-4 text-[clamp(2.4rem,6vw,5.2rem)] text-[#F7EEDD]"
            />
          </div>
          <p className="text-xs md:text-sm px-3.5 py-2 rounded-lg bg-[#A9431A]/85 text-[#F7EEDD]/90 max-w-xs">
            {COPY.theLine.hint[lang]}
          </p>
        </div>

        {/* Horizontal Rope & Hanging Items Track */}
        <div className="relative w-full overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none no-scrollbar px-6 md:px-12 pb-10">
          <div
            ref={trackRef}
            className="relative flex items-start gap-8 md:gap-12 w-max pt-6"
          >
            {/* Hand-drawn wavy rope SVG spanning the entire line */}
            <svg
              viewBox="0 0 2600 44"
              preserveAspectRatio="none"
              className="absolute top-3 left-0 w-full h-11 pointer-events-none z-10"
              aria-hidden="true"
            >
              <path
                d="M0,22 Q160,6 325,22 T650,22 T975,22 T1300,22 T1625,22 T1950,22 T2275,22 T2600,22"
                fill="none"
                stroke="#F7EEDD"
                strokeOpacity="0.65"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>

            {lineNodes.map((node) => {
              if (node.type === 'poster') {
                const poster = node.data;
                const isSelected = selectedPoster?.id === poster.id;
                return (
                  <div
                    key={poster.id}
                    ref={ropeGroupRef}
                    style={{
                      marginTop: `${poster.pegOffsetY}px`,
                      transform: `rotate(${poster.tiltDeg + swayDeg}deg)`,
                      transformOrigin: 'top center',
                    }}
                    className={`relative z-20 shrink-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      selectedPoster && !isSelected ? 'opacity-35 blur-[2px]' : 'opacity-100'
                    }`}
                  >
                    <WoodenPeg released={isSelected} />
                    <button
                      type="button"
                      onClick={() => setSelectedPoster(poster)}
                      data-cursor="view"
                      aria-label={poster.title[lang]}
                      className="group -mt-1.5 block w-[230px] sm:w-[260px] md:w-[275px] rounded-md overflow-hidden shadow-[0_22px_42px_rgba(42,20,11,0.38)] hover:shadow-[0_28px_54px_rgba(42,20,11,0.5)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FFE600]"
                    >
                      <DrinkPosterGraphic poster={poster} alt={poster.title[lang]} />
                    </button>
                  </div>
                );
              }

              // Blank kraft tag for drinks without a supplied photo
              const tag = node.data;
              const isHighlighted = highlightedTagId === tag.id;
              return (
                <div
                  key={tag.id}
                  ref={(el) => {
                    tagRefs.current[tag.id] = el;
                  }}
                  style={{
                    marginTop: `${tag.pegOffsetY + 8}px`,
                    transform: `rotate(${tag.tiltDeg + swayDeg * 1.3}deg)`,
                    transformOrigin: 'top center',
                  }}
                  className={`relative z-20 shrink-0 transition-all duration-500 ${
                    selectedPoster ? 'opacity-30 blur-[2px]' : 'opacity-100'
                  }`}
                >
                  <WoodenPeg />
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenuTab(tag.menuCategoryId);
                      document
                        .getElementById('full-menu')
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`-mt-1.5 w-[158px] min-h-[164px] kraft-card-bg text-[#2A140B] p-4 rounded-sm shadow-[0_14px_26px_rgba(42,20,11,0.3)] border flex flex-col justify-between text-start hover:-translate-y-1 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FFE600] ${
                      isHighlighted
                        ? 'border-[#FFE600] ring-4 ring-[#FFE600]/80 -translate-y-2 scale-105'
                        : 'border-[#2A140B]/15'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#2A140B]/60">
                      {COPY.theLine.kraftTagLabel[lang]}
                    </span>
                    <span className="font-hand text-xl leading-tight text-[#2A140B]">
                      {tag.title[lang]}
                    </span>
                    <span className="text-[11px] text-[#2A140B]/70 border-t border-[#2A140B]/15 pt-2">
                      {tag.subtitle[lang]}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expanded Poster Spotlight Modal */}
      {selectedPoster && (
        <div
          className="fixed inset-0 z-[80] bg-[#2A140B]/90 backdrop-blur-md text-[#F7EEDD] flex items-center justify-center p-4 md:p-10"
          onClick={() => setSelectedPoster(null)}
        >
          {/* Huge Clay Type drink name behind */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-15 px-6"
            aria-hidden="true"
          >
            <PressedClayHeadline
              text={selectedPoster.title[lang]}
              as="h3"
              className="text-[clamp(3.6rem,11vw,9.5rem)] text-center text-[#F7EEDD]"
            />
          </div>

          <button
            type="button"
            onClick={() => setSelectedPoster(null)}
            aria-label={COPY.theLine.backBtn[lang]}
            className="absolute top-5 right-5 z-30 w-11 h-11 rounded-full bg-[#F7EEDD]/10 hover:bg-[#C1501F] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="relative z-20 max-w-4xl w-full flex flex-col md:flex-row items-center gap-8 md:gap-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                const idx = DRINK_POSTERS.findIndex((p) => p.id === selectedPoster.id);
                setSelectedPoster(
                  DRINK_POSTERS[(idx - 1 + DRINK_POSTERS.length) % DRINK_POSTERS.length]
                );
              }}
              aria-label="Previous drink"
              className="hidden md:flex w-11 h-11 rounded-full border border-[#F7EEDD]/25 hover:border-[#FFE600] items-center justify-center shrink-0 cursor-pointer"
            >
              {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            <div className="w-full max-w-[330px] sm:max-w-[360px] rounded-lg overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.55)] border border-[#F7EEDD]/20 shrink-0">
              <DrinkPosterGraphic
                poster={selectedPoster}
                alt={selectedPoster.title[lang]}
              />
            </div>

            <div className="max-w-sm text-center md:text-start">
              <h3 className="font-hand text-3xl md:text-4xl text-[#FFE600]">
                {selectedPoster.title[lang]}
              </h3>
              <p className="mt-4 font-slip text-sm md:text-base leading-relaxed text-[#F7EEDD]/90">
                {selectedPoster.blurb[lang]}
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <MagneticButton
                  onClick={() => setSelectedPoster(null)}
                  className="btn-liquid px-6 py-3 rounded-full bg-[#F7EEDD] text-[#2A140B] text-sm font-medium"
                >
                  {COPY.theLine.backBtn[lang]}
                </MagneticButton>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const idx = DRINK_POSTERS.findIndex((p) => p.id === selectedPoster.id);
                setSelectedPoster(DRINK_POSTERS[(idx + 1) % DRINK_POSTERS.length]);
              }}
              aria-label="Next drink"
              className="hidden md:flex w-11 h-11 rounded-full border border-[#F7EEDD]/25 hover:border-[#FFE600] items-center justify-center shrink-0 cursor-pointer"
            >
              {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}

      {/* 4b. FULL MENU (Cream Plaster Panel with Neon-Yellow Squiggle Tab Underline & Dotted Leaders) */}
      <div id="full-menu" className="cream-plaster text-[#2A140B] py-20 md:py-28 px-5 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <PressedClayHeadline
              text={COPY.menu.fullMenuTitle[lang]}
              as="h3"
              className="text-3xl md:text-5xl text-[#2A140B]"
            />
            <span className="text-xs uppercase tracking-[0.22em] text-[#C1501F] font-medium">
              @qahwathecoffee
            </span>
          </div>

          {/* Tabs with sliding neon-yellow squiggle underline */}
          <div className="relative border-b border-[#2A140B]/15 mb-12 overflow-x-auto no-scrollbar">
            <div className="relative inline-flex items-center gap-6 md:gap-8 pb-4">
              {MENU_CATEGORIES.map((cat) => {
                const active = cat.id === activeMenuTab;
                return (
                  <button
                    key={cat.id}
                    ref={(el) => {
                      tabsRef.current[cat.id] = el;
                    }}
                    type="button"
                    onClick={() => setActiveMenuTab(cat.id)}
                    className={`text-sm md:text-base font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors pb-1 focus-visible:outline-2 focus-visible:outline-[#FFE600] ${
                      active ? 'text-[#C1501F]' : 'text-[#2A140B]/65 hover:text-[#2A140B]'
                    }`}
                  >
                    {cat.label[lang]}
                  </button>
                );
              })}

              {/* Sliding Neon-Yellow Squiggle Underline */}
              <svg
                viewBox="0 0 120 12"
                preserveAspectRatio="none"
                className="absolute bottom-0 h-3 transition-all duration-300 ease-out pointer-events-none"
                style={{
                  left: `${underlineStyle.left}px`,
                  width: `${underlineStyle.width}px`,
                }}
                aria-hidden="true"
              >
                <path
                  d="M2,6 Q17,1 32,6 T62,6 T92,6 T118,6"
                  fill="none"
                  stroke="#FFE600"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Menu Items with Dotted Leaders & Camera Glyph Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-6">
            {currentCategory.items.map((item) => {
              const linkedPoster = item.posterId
                ? DRINK_POSTERS.find((p) => p.id === item.posterId)
                : null;
              return (
                <div key={item.id} className="pb-4 group">
                  <div className="flex items-baseline gap-2.5">
                    <h4 className="hand-thrown text-xl md:text-2xl text-[#2A140B] group-hover:text-[#C1501F] transition-all duration-300 group-hover:[font-variation-settings:'opsz'_144,'wght'_720,'SOFT'_100,'WONK'_1]">
                      {item.name[lang]}
                    </h4>

                    {linkedPoster && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPoster(linkedPoster);
                          document
                            .getElementById('the-line')
                            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        title={COPY.menu.photoHint[lang]}
                        aria-label={`${item.name[lang]} — ${COPY.menu.photoHint[lang]}`}
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[#C1501F] hover:bg-[#FFE600]/40 transition-colors cursor-pointer shrink-0"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Dotted leader */}
                    <span
                      className="flex-1 border-b border-dotted border-[#2A140B]/30 mx-1"
                      aria-hidden="true"
                    />

                    {/* Empty price slot ready in config */}
                    <span className="shrink-0 text-sm md:text-base font-medium tnums text-[#2A140B]/75">
                      {item.price || '—'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#2A140B]/70">{item.note[lang]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
