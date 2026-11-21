import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { COPY, POLAROIDS } from '../config/content';
import { useQahwa } from '../context/QahwaContext';
import { GlazeHeadline, SectionLabel } from './BrandPrimitives';

export const PolaroidWallSection: React.FC = () => {
  const { lang } = useQahwa();
  const boardRef = useRef<HTMLDivElement>(null);
  const [zOrder, setZOrder] = useState<string[]>(() => POLAROIDS.map((p) => p.id));
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const bringToFront = (id: string) => {
    setZOrder((prev) => [...prev.filter((item) => item !== id), id]);
  };

  return (
    <section className="relative py-20 md:py-32 px-5 md:px-10 cream-plaster text-[#2A140B] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-12">
          <div>
            <SectionLabel text={COPY.polaroids.label[lang]} />
            <GlazeHeadline className="mt-4 text-[clamp(2.1rem,5.4vw,4.5rem)]">
              {COPY.polaroids.heading[lang]}
            </GlazeHeadline>
          </div>
          <p className="text-xs md:text-sm text-[#2A140B]/70">{COPY.polaroids.hint[lang]}</p>
        </div>

        {/* Desktop: Interactive Drag Board | Mobile: Smooth Horizontal Swipe Carousel */}
        <div
          ref={boardRef}
          className="relative w-full md:min-h-[560px] rounded-3xl bg-[#EFE4D0] border border-[#2A140B]/10 p-5 md:p-10 flex flex-nowrap md:flex-wrap items-center justify-start md:justify-center gap-5 md:gap-8 overflow-x-auto md:overflow-hidden snap-x snap-mandatory no-scrollbar"
        >
          {POLAROIDS.map((item, idx) => {
            const zIndex = zOrder.indexOf(item.id) + 10;
            return (
              <motion.div
                key={item.id}
                drag={isDesktop}
                dragConstraints={boardRef}
                dragElastic={0.14}
                dragMomentum={true}
                onPointerDown={() => bringToFront(item.id)}
                whileDrag={isDesktop ? { scale: 1.05, rotate: 0 } : undefined}
                whileHover={isDesktop ? { y: -4 } : undefined}
                initial={{
                  rotate: isDesktop ? item.rotation : item.rotation * 0.6,
                  x: isDesktop ? item.offsetX : 0,
                  y: isDesktop ? item.offsetY : 0,
                }}
                style={{ zIndex }}
                className="snap-center w-[235px] sm:w-[245px] bg-[#FAF4E8] p-3 pb-5 rounded-sm shadow-[0_16px_38px_rgba(42,20,11,0.18)] border border-[#2A140B]/10 md:cursor-grab md:active:cursor-grabbing select-none shrink-0"
              >
                <div className="w-full aspect-[4/5] overflow-hidden bg-[#2A140B]/10">
                  <img
                    src={item.image}
                    alt={item.caption[lang]}
                    draggable={false}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </div>
                <p className="mt-3 font-hand text-base md:text-lg leading-snug text-[#2A140B] text-center">
                  {item.caption[lang]}
                </p>
                <span className="mt-1 block text-center text-[10px] uppercase tracking-[0.22em] text-[#2A140B]/40 tnums">
                  0{idx + 1}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
