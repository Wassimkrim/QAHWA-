import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  COPY,
  GoogleMentionStone,
  GoogleReviewItem,
  TABLE_TALK_DATA,
} from '../config/content';
import { useQahwa } from '../context/QahwaContext';
import {
  HandDrawnArrow,
  QAHWA_STONE_PATHS,
  SectionLabel,
  SunRaysSVG,
} from './BrandPrimitives';
import { PressedClayHeadline, StampCollageWord } from './ClayType';

/** 5 wavy hand-drawn rays around the 4.7 rating sun disc (5th ray fills to 70%) */
const RATING_RAYS = [
  { angle: -68, path: 'M 150 112 C 138 86, 114 74, 82 54' },
  { angle: -34, path: 'M 158 106 C 156 76, 146 52, 134 22' },
  { angle: 0, path: 'M 170 105 C 176 74, 186 48, 200 18' },
  { angle: 34, path: 'M 182 110 C 204 86, 228 70, 258 46' },
  { angle: 68, path: 'M 188 122 C 216 110, 244 106, 280 94' },
];

export const TableTalkSection: React.FC = () => {
  const { lang, isRtl, jumpToMenuTab, openPosterOnLine } = useQahwa();

  const sectionRef = useRef<HTMLElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);

  const [inView, setInView] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [sunFilled, setSunFilled] = useState(false);
  const [wobbleId, setWobbleId] = useState<string | null>(null);
  const [expandedReview, setExpandedReview] = useState<GoogleReviewItem | null>(null);
  const [translatedIds, setTranslatedIds] = useState<Record<string, boolean>>({});
  const [zOrder, setZOrder] = useState<string[]>(() =>
    TABLE_TALK_DATA.reviews.map((r) => r.id)
  );
  const [ctaHovered, setCtaHovered] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setPrefersReduced(mq.matches);
      if (mq.matches) setSunFilled(true);
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          setSunFilled(true);
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!expandedReview) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedReview(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expandedReview]);

  const bringToFront = (id: string) => {
    setZOrder((prev) => [...prev.filter((item) => item !== id), id]);
  };

  const toggleTranslation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTranslatedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStoneClick = (stone: GoogleMentionStone) => {
    setWobbleId(stone.id);
    window.setTimeout(() => setWobbleId((curr) => (curr === stone.id ? null : curr)), 650);

    if (stone.action === 'menu-matcha') {
      jumpToMenuTab('matcha');
    } else if (stone.action === 'line-pistachio-latte') {
      openPosterOnLine('tag-pistachio');
    }
  };

  // Max mention count = 125; scale stone padding & width smoothly by sqrt(count) with >= 56px min tap size
  const maxSqrt = Math.sqrt(125);

  const reviewWriteHref =
    TABLE_TALK_DATA.writeReviewUrl || TABLE_TALK_DATA.googleReviewsUrl;

  return (
    <section
      id="table-talk"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-5 md:px-10 cream-plaster text-[#2A140B] border-t border-[#2A140B]/10 overflow-hidden"
    >
      {/* Subtle 8% Leaf Shadow Wash on Café Wall */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 1200 700" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <g fill="#3A1608">
            <path d="M-40 120 C 120 40, 290 60, 420 210 C 260 220, 120 190, -40 120 Z" />
            <path d="M 880 -20 C 980 120, 1080 220, 1240 240 C 1090 290, 940 210, 880 -20 Z" />
            <path d="M 960 440 C 1050 380, 1140 390, 1240 460 C 1110 510, 1010 500, 960 440 Z" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 md:mb-16">
          <div>
            <SectionLabel text={COPY.tableTalk.label[lang]} />
            <h2 className="mt-4 text-[clamp(2.4rem,5.8vw,4.9rem)] leading-[1.02]">
              <StampCollageWord text={COPY.tableTalk.headline[lang]} />
            </h2>
          </div>
          <p className="hidden md:block text-xs uppercase tracking-[0.18em] text-[#2A140B]/65">
            {COPY.tableTalk.dragHint[lang]}
          </p>
        </div>

        {/* Desktop Split: Left Rating Sun + Word Stones | Right Note Wall */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
          {/* LEFT COLUMN (top on mobile): RATING SUN + WORD STONES */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start gap-10">
            {/* RATING SUN (4.7 out of 5 wavy rays) */}
            <div className="w-full flex flex-col items-center lg:items-start">
              <div className="relative w-[280px] sm:w-[310px] h-[220px] flex items-center justify-center">
                <svg viewBox="0 0 340 250" className="w-full h-full overflow-visible" aria-hidden="true">
                  {/* Unfilled faint guide under the 5 rays (helps 70% 5th ray read 4.7 cleanly) */}
                  {RATING_RAYS.map((r, i) => (
                    <path
                      key={`bg-${i}`}
                      d={r.path}
                      fill="none"
                      stroke="#2A140B"
                      strokeOpacity="0.16"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  ))}

                  {/* 5 Drawn-on Terracotta Rays (5th ray fills cleanly to 70%) */}
                  {RATING_RAYS.map((r, i) => {
                    const totalLen = 120;
                    const fillFraction = i === 4 ? 0.7 : 1;
                    const targetDashOffset = totalLen * (1 - fillFraction);
                    return (
                      <path
                        key={`fg-${i}`}
                        d={r.path}
                        fill="none"
                        stroke="#C1501F"
                        strokeWidth="5.5"
                        strokeLinecap="round"
                        strokeDasharray={totalLen}
                        strokeDashoffset={
                          prefersReduced || sunFilled ? targetDashOffset : totalLen
                        }
                        style={{
                          transition: prefersReduced
                            ? undefined
                            : `stroke-dashoffset 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${i * 150}ms`,
                        }}
                      />
                    );
                  })}

                  {/* Organic Sun Center Disc */}
                  <path
                    d="M170 112 C202 112 224 134 222 164 C220 194 198 214 168 214 C138 214 116 194 118 164 C120 134 140 112 170 112 Z"
                    fill="#F7EEDD"
                    stroke="#C1501F"
                    strokeWidth="3.5"
                  />
                </svg>

                {/* Center Disc "4.7" in Pressed Clay */}
                <div className="absolute inset-0 flex items-center justify-center pt-14 pointer-events-none">
                  <PressedClayHeadline
                    text={String(TABLE_TALK_DATA.rating)}
                    as="h3"
                    className="text-4xl md:text-5xl text-[#2A140B] tnums"
                  />
                </div>
              </div>

              <a
                href={TABLE_TALK_DATA.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-1 inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-[#C1501F] hover:text-[#2A140B] transition-colors focus-visible:outline-2 focus-visible:outline-[#FFE600] ${
                  isRtl ? '' : 'uppercase tracking-[0.2em]'
                }`}
              >
                <span className="tnums">{COPY.tableTalk.reviewsCountLabel[lang]}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* WORD STONES (4 Google mentions in ceramic-pebble silhouettes sized by sqrt(count)) */}
            <div className="w-full flex flex-col items-center lg:items-start">
              <p
                className={`text-[11px] font-semibold text-[#2A140B]/70 mb-4 ${
                  isRtl ? '' : 'uppercase tracking-[0.2em]'
                }`}
              >
                {COPY.tableTalk.mostMentioned[lang]}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 max-w-md">
                {TABLE_TALK_DATA.mentions.map((stone, idx) => {
                  const ratio = Math.sqrt(stone.count) / maxSqrt; // ~0.2 .. 1.0
                  const pxPadX = Math.round(16 + ratio * 16);
                  const pxPadY = Math.round(12 + ratio * 10);
                  const isWobbling = wobbleId === stone.id;
                  const driftAmp = inView && !prefersReduced ? 3 + (idx % 2) * 2 : 0;

                  const shapePaths = [
                    QAHWA_STONE_PATHS.bottom,
                    QAHWA_STONE_PATHS.middle,
                    QAHWA_STONE_PATHS.top,
                    QAHWA_STONE_PATHS.bottom,
                  ];

                  return (
                    <motion.button
                      key={stone.id}
                      type="button"
                      onClick={() => handleStoneClick(stone)}
                      animate={
                        prefersReduced
                          ? undefined
                          : isWobbling
                          ? { rotate: [0, -5, 5, -3, 2, 0], scale: [1, 1.06, 0.98, 1] }
                          : { y: [-driftAmp, driftAmp, -driftAmp] }
                      }
                      transition={
                        isWobbling
                          ? { duration: 0.55 }
                          : {
                              duration: 5 + idx * 1.1,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }
                      }
                      whileHover={prefersReduced ? undefined : { rotate: -3, scale: 1.04 }}
                      style={{
                        paddingLeft: `${pxPadX}px`,
                        paddingRight: `${pxPadX}px`,
                        paddingTop: `${pxPadY}px`,
                        paddingBottom: `${pxPadY}px`,
                      }}
                      className="relative min-w-[56px] min-h-[56px] inline-flex items-center justify-center gap-2 rounded-[26px] bg-[#EAE0CE] hover:bg-[#F7EEDD] border border-[#2A140B]/18 shadow-[0_10px_22px_rgba(42,20,11,0.1)] hover:border-[#C1501F] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FFE600] overflow-hidden group"
                    >
                      {/* Subtle ceramic-pebble silhouette watermark */}
                      <svg
                        viewBox="0 0 200 220"
                        className="absolute inset-0 w-full h-full opacity-[0.07] group-hover:opacity-[0.14] pointer-events-none transition-opacity"
                        fill="#C1501F"
                        aria-hidden="true"
                      >
                        <path d={shapePaths[idx % shapePaths.length]} />
                      </svg>

                      <span
                        className={`relative z-10 text-[#2A140B] ${
                          isRtl ? 'font-hand text-base' : 'font-hand text-lg md:text-xl'
                        }`}
                      >
                        {stone.label[lang]}
                      </span>
                      <span className="relative z-10 text-xs font-semibold tnums text-[#C1501F]">
                        · {stone.count}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: TAPED CREAM PAPER REVIEW NOTES */}
          <div className="lg:col-span-7 w-full">
            {/* Desktop Scatter Wall (draggable with inertia + click to lift) */}
            <div
              ref={wallRef}
              className="hidden md:flex relative min-h-[520px] rounded-3xl bg-[#EFE4CE]/70 border border-[#2A140B]/10 p-8 flex-wrap items-center justify-center gap-7"
            >
              {TABLE_TALK_DATA.reviews.map((rev) => {
                const zIndex = zOrder.indexOf(rev.id) + 10;
                const dimmed = Boolean(expandedReview && expandedReview.id !== rev.id);
                return (
                  <ReviewPaperNote
                    key={rev.id}
                    review={rev}
                    draggable={!prefersReduced}
                    dragConstraints={wallRef}
                    zIndex={zIndex}
                    dimmed={dimmed}
                    translated={Boolean(translatedIds[rev.id])}
                    onToggleTranslate={(e) => toggleTranslation(rev.id, e)}
                    onBringFront={() => bringToFront(rev.id)}
                    onOpen={() => {
                      bringToFront(rev.id);
                      setExpandedReview(rev);
                    }}
                  />
                );
              })}
            </div>

            {/* Mobile Horizontal Swipe Carousel (large readable >=16px text) */}
            <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-5 pb-4 -mx-2 px-2 no-scrollbar">
              {TABLE_TALK_DATA.reviews.map((rev) => (
                <div key={rev.id} className="snap-center shrink-0 w-[84vw] max-w-[330px] pt-3">
                  <ReviewPaperNote
                    review={rev}
                    draggable={false}
                    zIndex={10}
                    dimmed={false}
                    translated={Boolean(translatedIds[rev.id])}
                    onToggleTranslate={(e) => toggleTranslation(rev.id, e)}
                    onBringFront={() => {}}
                    onOpen={() => setExpandedReview(rev)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GUEST PHOTOS ROW — rendered only if showGuestPhotos === true and real guest photos exist */}
        {TABLE_TALK_DATA.showGuestPhotos && TABLE_TALK_DATA.guestPhotos.length > 0 && (
          <div className="mt-14 pt-10 border-t border-[#2A140B]/10">
            <div className="flex flex-wrap items-center justify-center gap-6">
              {TABLE_TALK_DATA.guestPhotos.map((photo, idx) => (
                <div
                  key={photo.id}
                  style={{ transform: `rotate(${idx % 2 === 0 ? -2.2 : 2.4}deg)` }}
                  className="relative w-44 sm:w-48 bg-[#FAF4E8] p-2.5 pb-4 rounded-sm shadow-md border border-[#2A140B]/10"
                >
                  {/* Tiny tape */}
                  <span
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#E4D3B3]/75 rotate-[-2deg] shadow-xs pointer-events-none"
                    aria-hidden="true"
                  />
                  <div className="w-full aspect-square overflow-hidden bg-[#2A140B]/10">
                    <img
                      src={photo.image}
                      alt={photo.alt[lang]}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-[#2A140B]/70 text-center">
                    {COPY.tableTalk.guestPhotoCredit[lang]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Under-the-wall Hand-Drawn Arrow CTA: "Been to Qahwa? Tell us." */}
        <div className="mt-14 flex justify-center">
          <a
            href={reviewWriteHref}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
            className="inline-flex items-center gap-3 px-4 py-2 text-base md:text-lg font-hand text-[#2A140B] hover:text-[#C1501F] transition-colors group focus-visible:outline-2 focus-visible:outline-[#FFE600] rounded-md"
          >
            <HandDrawnArrow
              className="w-10 h-6"
              color="#C1501F"
              active={inView || ctaHovered}
            />
            <span className="border-b border-[#2A140B]/35 group-hover:border-[#FFE600]">
              {COPY.tableTalk.beenHereCta[lang]}
            </span>
            <ExternalLink className="w-4 h-4 opacity-60" />
          </a>
        </div>
      </div>

      {/* Shared-Element Lifted & Scaled Note Modal on Desktop/Mobile Click */}
      <AnimatePresence>
        {expandedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedReview(null)}
            className="fixed inset-0 z-[80] bg-[#2A140B]/55 backdrop-blur-sm flex items-center justify-center p-5"
          >
            <motion.div
              layoutId={`note-${expandedReview.id}`}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-[#FAF4E8] text-[#2A140B] paper-grain rounded-sm p-7 md:p-8 shadow-[0_32px_72px_rgba(42,20,11,0.38)] border border-[#2A140B]/15"
            >
              {/* Masking tape strips */}
              <span
                className="absolute -top-3 left-8 w-16 h-5 bg-[#E4D3B3]/75 rotate-[-6deg] pointer-events-none"
                aria-hidden="true"
              />
              <span
                className="absolute -top-3 right-8 w-16 h-5 bg-[#E4D3B3]/75 rotate-[5deg] pointer-events-none"
                aria-hidden="true"
              />

              <button
                type="button"
                onClick={() => setExpandedReview(null)}
                aria-label="Close"
                className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-[#2A140B]/10 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* 5 Tiny Sun Glyphs */}
              <div className="flex items-center gap-1 mb-3" aria-label="5 out of 5 stars">
                {[0, 1, 2, 3, 4].map((s) => (
                  <SunRaysSVG
                    key={s}
                    className="w-4 h-4"
                    strokeColor="#C1501F"
                    centerFill="#FFE600"
                    strokeWidth={8}
                  />
                ))}
              </div>

              <p dir="ltr" className="font-display text-lg leading-relaxed text-[#2A140B]">
                “{expandedReview.text}”
              </p>

              {(lang === 'fr' || lang === 'ar') && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={(e) => toggleTranslation(expandedReview.id, e)}
                    className="text-xs font-semibold text-[#C1501F] underline underline-offset-4 cursor-pointer"
                  >
                    {translatedIds[expandedReview.id]
                      ? COPY.tableTalk.hideTranslationBtn[lang]
                      : COPY.tableTalk.translateBtn[lang]}
                  </button>

                  {translatedIds[expandedReview.id] && (
                    <div className="mt-3 pt-3 border-t border-[#2A140B]/15 text-sm leading-relaxed text-[#2A140B]/85">
                      <span className="block text-[10px] uppercase tracking-[0.16em] text-[#C1501F] font-semibold mb-1">
                        {COPY.tableTalk.translationLabel[lang]}
                      </span>
                      <p>{expandedReview.translations[lang]}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-[#2A140B]/15 flex items-end justify-between gap-3">
                <div>
                  <p className="font-hand text-2xl leading-none text-[#2A140B]">
                    {expandedReview.name}
                  </p>
                  <p className="mt-1 text-xs text-[#2A140B]/65">
                    {expandedReview.badge[lang]} · {COPY.tableTalk.googleReviewTag[lang]}
                  </p>
                </div>

                {expandedReview.truncated && (
                  <a
                    href={TABLE_TALK_DATA.googleReviewsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#C1501F] hover:underline shrink-0"
                  >
                    <span>{COPY.tableTalk.readFullLink[lang]}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
 * CREAM TAPED PAPER NOTE COMPONENT
 * ────────────────────────────────────────────────────────────────────────── */
interface ReviewPaperNoteProps {
  review: GoogleReviewItem;
  draggable: boolean;
  dragConstraints?: React.RefObject<HTMLDivElement | null>;
  zIndex: number;
  dimmed: boolean;
  translated: boolean;
  onToggleTranslate: (e: React.MouseEvent) => void;
  onBringFront: () => void;
  onOpen: () => void;
}

const ReviewPaperNote: React.FC<ReviewPaperNoteProps> = ({
  review,
  draggable,
  dragConstraints,
  zIndex,
  dimmed,
  translated,
  onToggleTranslate,
  onBringFront,
  onOpen,
}) => {
  const { lang } = useQahwa();

  return (
    <motion.article
      layoutId={`note-${review.id}`}
      drag={draggable}
      dragConstraints={dragConstraints}
      dragElastic={0.14}
      dragMomentum={true}
      onPointerDown={onBringFront}
      onClick={onOpen}
      whileDrag={draggable ? { scale: 1.05, rotate: 0 } : undefined}
      whileHover={draggable ? { y: -4 } : undefined}
      initial={
        draggable
          ? {
              rotate: review.rotation,
              x: review.offsetX,
              y: review.offsetY,
            }
          : undefined
      }
      style={{ zIndex }}
      className={`relative w-full md:w-[272px] bg-[#FAF4E8] text-[#2A140B] paper-grain p-5 pt-6 rounded-sm shadow-[0_14px_34px_rgba(42,20,11,0.14)] border border-[#2A140B]/12 select-none cursor-pointer transition-opacity duration-300 ${
        draggable ? 'active:cursor-grabbing' : ''
      } ${dimmed ? 'opacity-40' : 'opacity-100'}`}
    >
      {/* Two Semi-Transparent Masking Tape Strips */}
      <span
        className="absolute -top-2.5 left-5 w-14 h-4 bg-[#E4D3B3]/75 rotate-[-7deg] shadow-2xs pointer-events-none"
        aria-hidden="true"
      />
      <span
        className="absolute -top-2.5 right-5 w-14 h-4 bg-[#E4D3B3]/75 rotate-[6deg] shadow-2xs pointer-events-none"
        aria-hidden="true"
      />

      {/* 5 Tiny Sun Glyphs */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
          {[0, 1, 2, 3, 4].map((s) => (
            <SunRaysSVG
              key={s}
              className="w-3.5 h-3.5"
              strokeColor="#C1501F"
              centerFill="#FFE600"
              strokeWidth={8}
            />
          ))}
        </div>
        <span className="text-[10px] uppercase tracking-[0.14em] text-[#2A140B]/60 font-medium">
          {COPY.tableTalk.googleReviewTag[lang]}
        </span>
      </div>

      {/* Verbatim Review Text in Fraunces Regular (>= 16px) */}
      <p
        dir="ltr"
        className="font-display font-normal text-base leading-[1.58] text-[#2A140B]"
      >
        “{review.text}”
      </p>

      {/* FR / AR Opt-in Translation Toggle (never replaces the English original) */}
      {(lang === 'fr' || lang === 'ar') && (
        <div className="mt-3">
          <button
            type="button"
            onClick={onToggleTranslate}
            className="text-xs font-semibold text-[#C1501F] hover:text-[#2A140B] underline underline-offset-4 cursor-pointer"
          >
            {translated ? COPY.tableTalk.hideTranslationBtn[lang] : COPY.tableTalk.translateBtn[lang]}
          </button>

          {translated && (
            <div className="mt-2.5 pt-2.5 border-t border-[#2A140B]/15 text-sm leading-relaxed text-[#2A140B]/85">
              <span className="block text-[10px] font-semibold text-[#C1501F] mb-1">
                {COPY.tableTalk.translationLabel[lang]}
              </span>
              <p>{review.translations[lang]}</p>
            </div>
          )}
        </div>
      )}

      {/* Handwritten Name + Read Full Review Link */}
      <div className="mt-4 pt-3 border-t border-[#2A140B]/12 flex items-end justify-between gap-2">
        <div>
          <p className="font-hand text-xl leading-none text-[#2A140B]">{review.name}</p>
          <p className="mt-1 text-[11px] text-[#2A140B]/65">{review.badge[lang]}</p>
        </div>

        {review.truncated && (
          <a
            href={TABLE_TALK_DATA.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#C1501F] hover:underline shrink-0"
          >
            <span>{COPY.tableTalk.readFullLink[lang]}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </motion.article>
  );
};
