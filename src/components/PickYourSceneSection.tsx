import React, { useState } from 'react';
import { RefreshCw, Share2, Sparkles } from 'lucide-react';
import {
  COPY,
  DRINK_POSTERS,
  SCENES,
  SceneItem,
  SURPRISE_SLIP_MOOD,
  VENUE_CONFIG,
} from '../config/content';
import { useQahwa } from '../context/QahwaContext';
import { MagneticButton, SectionLabel } from './BrandPrimitives';
import { StampCollageWord } from './ClayType';
import { DrinkPosterGraphic } from './DrinkPosterGraphic';

export const PickYourSceneSection: React.FC = () => {
  const { lang, isRtl, openPosterOnLine } = useQahwa();
  const [hoveredId, setHoveredId] = useState<string>(SCENES[0].id);
  const [activeSlip, setActiveSlip] = useState<{
    scene: SceneItem | null;
    posterId: string;
    moodLine: string;
    timestamp: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const getAlgiersTimestamp = () => {
    try {
      return new Intl.DateTimeFormat(
        lang === 'ar' ? 'ar-DZ' : lang === 'fr' ? 'fr-FR' : 'en-GB',
        {
          timeZone: VENUE_CONFIG.timezone,
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }
      ).format(new Date());
    } catch {
      return new Date().toLocaleTimeString();
    }
  };

  const handleSelectScene = (scene: SceneItem) => {
    setActiveSlip({
      scene,
      posterId: scene.matchedPosterId,
      moodLine: scene.slipMood[lang],
      timestamp: getAlgiersTimestamp(),
    });
  };

  const handleSurprise = () => {
    const randomPoster =
      DRINK_POSTERS[Math.floor(Math.random() * DRINK_POSTERS.length)];
    setActiveSlip({
      scene: null,
      posterId: randomPoster.id,
      moodLine: SURPRISE_SLIP_MOOD[lang],
      timestamp: getAlgiersTimestamp(),
    });
  };

  const matchedPoster = activeSlip
    ? DRINK_POSTERS.find((p) => p.id === activeSlip.posterId) || DRINK_POSTERS[0]
    : null;

  const handleShareSlip = async () => {
    if (!matchedPoster || !activeSlip) return;
    const text = `QAHWA · ${matchedPoster.title[lang]} — "${activeSlip.moodLine}" @qahwathecoffee`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'QAHWA', text, url: window.location.href });
        return;
      } catch {
        // fallback
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${window.location.href}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // ignore
    }
  };

  return (
    <section className="relative py-24 md:py-32 px-5 md:px-10 bg-[#2A140B] text-[#F7EEDD] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <SectionLabel text={COPY.scenePicker.label[lang]} light />
            <h2 className="mt-4 text-[clamp(2.5rem,6.5vw,5.4rem)] leading-[1.02]">
              <StampCollageWord text={COPY.scenePicker.headingWords[lang]} light />
            </h2>
          </div>

          {!activeSlip && (
            <p className="text-xs md:text-sm text-[#F7EEDD]/70">
              {COPY.scenePicker.tapHint[lang]}
            </p>
          )}
        </div>

        {/* Scene Accordion Strips OR Printed Order Slip */}
        {!activeSlip ? (
          <div>
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:h-[490px]">
              {SCENES.map((scene) => {
                const isExpanded = hoveredId === scene.id;
                return (
                  <button
                    key={scene.id}
                    type="button"
                    onMouseEnter={() => setHoveredId(scene.id)}
                    onFocus={() => setHoveredId(scene.id)}
                    onClick={() => handleSelectScene(scene)}
                    data-cursor="view"
                    className={`relative overflow-hidden rounded-2xl border border-[#F7EEDD]/15 text-start cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-[#FFE600] ${
                      isExpanded
                        ? 'h-[260px] md:h-full md:flex-[3.2]'
                        : 'h-[115px] md:h-full md:flex-[1]'
                    }`}
                  >
                    <img
                      src={scene.image}
                      alt={scene.title[lang]}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2A140B]/88 via-[#2A140B]/25 to-transparent" />
                    <div className="absolute bottom-4 inset-x-4 md:bottom-6 md:inset-x-6 flex items-end justify-between gap-3">
                      <span className="font-display text-xl md:text-2xl font-medium text-[#F7EEDD]">
                        {scene.title[lang]}
                      </span>
                      <span
                        className={`w-2.5 h-2.5 rounded-full bg-[#FFE600] shrink-0 transition-opacity ${
                          isExpanded ? 'opacity-100' : 'opacity-40'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-center">
              <MagneticButton
                onClick={handleSurprise}
                className="px-6 py-3 rounded-full border border-[#F7EEDD]/35 hover:border-[#FFE600] hover:text-[#FFE600] text-sm font-medium gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#FFE600]" />
                <span>{COPY.scenePicker.surpriseBtn[lang]}</span>
              </MagneticButton>
            </div>
          </div>
        ) : (
          /* Printed Order Slip */
          matchedPoster && (
            <div className="max-w-lg mx-auto">
              {/* Thermal Printer Slot */}
              <div className="mx-auto w-[92%] h-4 rounded-full bg-[#150904] border-b border-[#F7EEDD]/20 shadow-inner" />

              {/* Slip Paper */}
              <div
                dir={isRtl ? 'rtl' : 'ltr'}
                className="relative -mt-2 bg-[#FAF5EA] text-[#2A140B] px-6 md:px-9 pt-8 pb-12 shadow-[0_24px_60px_rgba(0,0,0,0.45)] receipt-zigzag"
              >
                {/* Paperclip holding the unaltered drink photo */}
                <div className="relative mx-auto sm:mx-0 sm:float-end sm:ms-4 mb-5 sm:mb-3 w-40 sm:w-44">
                  <svg
                    viewBox="0 0 36 72"
                    className="absolute -top-4 left-4 z-20 w-6 h-12 pointer-events-none"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 10 V54 C12 62 24 62 24 54 V16 C24 8 10 8 10 16 V46"
                      stroke="#6E6359"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="rounded-sm overflow-hidden shadow-md border border-[#2A140B]/15 transform rotate-2">
                    <DrinkPosterGraphic
                      poster={matchedPoster}
                      alt={matchedPoster.title[lang]}
                    />
                  </div>
                </div>

                {/* Typewriter Slip Copy */}
                <div className="font-slip text-xs md:text-sm space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] uppercase opacity-70 tnums border-b border-dashed border-[#2A140B]/25 pb-2">
                    <span>QAHWA · ALGIERS</span>
                    <span>{activeSlip.timestamp}</span>
                  </div>

                  <p className="pt-1 font-semibold">{COPY.scenePicker.tableForYou[lang]}</p>

                  <p className="leading-relaxed text-[#2A140B]/90 pt-1">
                    {activeSlip.moodLine}
                  </p>

                  <div className="pt-3 clear-both border-t border-dashed border-[#2A140B]/25">
                    <p className="font-hand text-2xl md:text-3xl text-[#C1501F] leading-tight">
                      {matchedPoster.title[lang]}
                    </p>
                  </div>

                  {/* Sun-ray Barcode */}
                  <div className="pt-4 flex flex-col items-center">
                    <svg viewBox="0 0 240 34" className="w-48 h-8" aria-hidden="true">
                      {Array.from({ length: 28 }).map((_, idx) => {
                        const x = 6 + idx * 8.2;
                        const w = idx % 3 === 0 ? 3 : idx % 2 === 0 ? 1.8 : 1.1;
                        return (
                          <path
                            key={idx}
                            d={`M${x} 2 Q${x + (idx % 2 === 0 ? 2 : -2)} 17 ${x} 32`}
                            stroke="#2A140B"
                            strokeWidth={w}
                            fill="none"
                          />
                        );
                      })}
                    </svg>
                    <span className="text-[10px] tracking-[0.28em] opacity-55 tnums">
                      @QAHWATHECOFFEE
                    </span>
                  </div>
                </div>
              </div>

              {/* Slip Actions */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <MagneticButton
                  onClick={() => openPosterOnLine(matchedPoster.id)}
                  className="btn-liquid px-6 py-3 rounded-full bg-[#F7EEDD] text-[#2A140B] text-xs md:text-sm font-medium"
                >
                  {COPY.scenePicker.seeOnLineBtn[lang]}
                </MagneticButton>

                <button
                  type="button"
                  onClick={() => setActiveSlip(null)}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full border border-[#F7EEDD]/30 hover:border-[#FFE600] text-xs md:text-sm cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{COPY.scenePicker.anotherSceneBtn[lang]}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareSlip}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full border border-[#F7EEDD]/30 hover:border-[#FFE600] text-xs md:text-sm cursor-pointer transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? COPY.scenePicker.copiedNotice[lang] : COPY.scenePicker.shareBtn[lang]}</span>
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};
