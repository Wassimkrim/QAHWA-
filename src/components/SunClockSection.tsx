import React, { useEffect, useState } from 'react';
import { COPY } from '../config/content';
import { useQahwa } from '../context/QahwaContext';
import { SectionLabel, SunRaysSVG } from './BrandPrimitives';
import { PressedClayHeadline } from './ClayType';

export const SunClockSection: React.FC = () => {
  const { lang, sunPhase } = useQahwa();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(id);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const sunAngle = ((hours + minutes / 60) / 24) * 360;

  useEffect(() => {
    const tint =
      sunPhase === 'morning'
        ? 'rgba(255, 240, 210, 0.08)'
        : sunPhase === 'noon'
        ? 'rgba(255, 250, 235, 0.04)'
        : sunPhase === 'golden'
        ? 'rgba(193, 80, 31, 0.06)'
        : 'rgba(42, 20, 11, 0.05)';
    document.documentElement.style.setProperty('--sun-tint', tint);
  }, [sunPhase]);

  const timeFormatted = now.toLocaleTimeString(
    lang === 'ar' ? 'ar-DZ' : lang === 'fr' ? 'fr-FR' : 'en-GB',
    { hour: '2-digit', minute: '2-digit' }
  );

  const emblemColor =
    sunPhase === 'morning'
      ? '#C1501F'
      : sunPhase === 'noon'
      ? '#A9431A'
      : sunPhase === 'golden'
      ? '#D8301C'
      : '#2A140B';

  return (
    <section
      className="relative py-20 md:py-28 px-5 md:px-10 cream-plaster text-[#2A140B] border-y border-[#2A140B]/10 overflow-hidden"
      style={{ backgroundImage: 'linear-gradient(180deg, var(--sun-tint), transparent)' }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
        <div className="relative flex items-center justify-center shrink-0">
          <div
            className="transition-transform duration-1000 ease-out"
            style={{ transform: `rotate(${sunAngle}deg)` }}
          >
            <SunRaysSVG
              className="w-52 h-52 md:w-64 md:h-64"
              strokeColor={emblemColor}
              centerFill={sunPhase === 'golden' ? 'rgba(193,80,31,0.14)' : 'none'}
              strokeWidth={3.2}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-sm md:text-base font-medium tnums bg-[#F7EEDD]/92 px-3 py-1 rounded-full border border-[#2A140B]/15">
              {timeFormatted}
            </span>
          </div>
        </div>

        <div className="text-center md:text-start max-w-xl">
          <SectionLabel text={COPY.sunClock.label[lang]} />
          <PressedClayHeadline
            text={COPY.sunClock[sunPhase].greeting[lang]}
            as="h2"
            className="mt-5 text-[clamp(2rem,4.8vw,3.8rem)] text-[#2A140B]"
          />
          <p className="mt-4 text-base md:text-lg text-[#2A140B]/75">
            {COPY.sunClock[sunPhase].note[lang]}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.22em] text-[#C1501F] tnums">
            {COPY.sunClock.localTime[lang]} · {timeFormatted}
          </p>
        </div>
      </div>
    </section>
  );
};
