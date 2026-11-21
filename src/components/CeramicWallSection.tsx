import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { CERAMIC_PIECES, COPY } from '../config/content';
import { useQahwa } from '../context/QahwaContext';
import { GlazeHeadline, SectionLabel } from './BrandPrimitives';

export const CeramicWallSection: React.FC = () => {
  const { lang, isRtl } = useQahwa();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (selectedIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIdx(null);
      if (e.key === 'ArrowRight') {
        setSelectedIdx((i) => (i === null ? 0 : (i + 1) % CERAMIC_PIECES.length));
      }
      if (e.key === 'ArrowLeft') {
        setSelectedIdx((i) =>
          i === null ? 0 : (i - 1 + CERAMIC_PIECES.length) % CERAMIC_PIECES.length
        );
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedIdx]);

  const selectedPiece = selectedIdx !== null ? CERAMIC_PIECES[selectedIdx] : null;

  return (
    <section
      id="ceramics"
      className="relative py-24 md:py-32 px-5 md:px-10 cream-plaster text-[#2A140B]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <SectionLabel text={COPY.ceramics.label[lang]} />
            <GlazeHeadline className="mt-4 text-[clamp(2.3rem,5.8vw,4.9rem)]">
              {COPY.ceramics.heading[lang]}
            </GlazeHeadline>
          </div>

          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-[#EAE0CE] text-[#2A140B]/75 text-xs uppercase tracking-[0.2em] ceramic-deboss self-start">
            {COPY.ceramics.stamp[lang]}
          </div>
        </div>

        {/* Arched-shelf layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {CERAMIC_PIECES.map((piece, idx) => (
            <button
              key={piece.id}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              data-cursor="view"
              className="group text-start flex flex-col items-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FFE600] rounded-2xl"
            >
              {/* Recessed Arched Niche */}
              <div className="relative w-full aspect-[3/4] p-3 rounded-t-full rounded-b-2xl bg-[#E8DCC6] shadow-inner border border-[#2A140B]/10 transition-transform duration-500 group-hover:rotate-[-1.2deg] group-hover:-translate-y-1">
                <div className="w-full h-full arch-mask overflow-hidden">
                  <img
                    src={piece.image}
                    alt={piece.title[lang]}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Debossed ceramic stamp appearing on hover */}
                <span className="absolute bottom-5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#F7EEDD]/95 text-[#2A140B] text-[10px] uppercase tracking-[0.18em] ceramic-deboss opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap">
                  {COPY.ceramics.stamp[lang]}
                </span>
              </div>

              {/* Plaster shelf ledge */}
              <div className="w-[92%] h-2.5 bg-[#D9C7AC] rounded-b-md shadow-sm" aria-hidden="true" />

              <h3 className="mt-4 font-display text-lg md:text-xl font-medium text-center text-[#2A140B] group-hover:text-[#C1501F] transition-colors">
                {piece.title[lang]}
              </h3>
              <p className="mt-1 text-xs md:text-sm text-[#2A140B]/70 text-center max-w-[26ch]">
                {piece.subtitle[lang]}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      {selectedPiece && selectedIdx !== null && (
        <div
          className="fixed inset-0 z-[80] bg-[#2A140B]/95 backdrop-blur-md text-[#F7EEDD] flex flex-col items-center justify-center p-4 md:p-10"
          onClick={() => setSelectedIdx(null)}
          onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX === null) return;
            const diff = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(diff) > 45) {
              setSelectedIdx((i) =>
                i === null
                  ? 0
                  : diff < 0
                  ? (i + 1) % CERAMIC_PIECES.length
                  : (i - 1 + CERAMIC_PIECES.length) % CERAMIC_PIECES.length
              );
            }
            setTouchStartX(null);
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedIdx(null)}
            aria-label={COPY.ceramics.close[lang]}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-[#F7EEDD]/10 hover:bg-[#C1501F] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="relative max-w-4xl w-full flex flex-col md:flex-row items-center gap-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() =>
                setSelectedIdx(
                  (selectedIdx - 1 + CERAMIC_PIECES.length) % CERAMIC_PIECES.length
                )
              }
              aria-label={COPY.ceramics.prev[lang]}
              className="hidden md:flex w-11 h-11 rounded-full border border-[#F7EEDD]/25 hover:border-[#FFE600] items-center justify-center shrink-0 cursor-pointer"
            >
              {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            <div className="w-full max-w-md aspect-[3/4] arch-mask overflow-hidden border-2 border-[#F7EEDD]/20 shadow-2xl mx-auto">
              <img
                src={selectedPiece.image}
                alt={selectedPiece.title[lang]}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center md:text-start max-w-sm">
              <span className="inline-block px-3 py-1 rounded bg-[#F7EEDD]/10 text-[#FFE600] text-[11px] uppercase tracking-[0.2em]">
                {COPY.ceramics.stamp[lang]}
              </span>
              <h3 className="mt-4 font-display text-3xl font-medium">
                {selectedPiece.title[lang]}
              </h3>
              <p className="mt-3 text-sm md:text-base text-[#F7EEDD]/80">
                {selectedPiece.subtitle[lang]}
              </p>
              <p className="mt-6 text-xs tnums text-[#F7EEDD]/55">
                {selectedIdx + 1} / {CERAMIC_PIECES.length}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedIdx((selectedIdx + 1) % CERAMIC_PIECES.length)}
              aria-label={COPY.ceramics.next[lang]}
              className="hidden md:flex w-11 h-11 rounded-full border border-[#F7EEDD]/25 hover:border-[#FFE600] items-center justify-center shrink-0 cursor-pointer"
            >
              {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
