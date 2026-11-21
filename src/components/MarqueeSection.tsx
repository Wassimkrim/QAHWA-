import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COPY } from '../config/content';
import { useQahwa } from '../context/QahwaContext';
import { SunRaysSVG } from './BrandPrimitives';

gsap.registerPlugin(ScrollTrigger);

export const MarqueeSection: React.FC = () => {
  const { lang, isRtl } = useQahwa();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let offset = 0;
    let direction = isRtl ? 1 : -1;
    let velocityBoost = 0;
    let raf = 0;
    let isVisible = false;

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        if (!isVisible) return;
        const vel = self.getVelocity();
        if (Math.abs(vel) > 30) {
          direction = vel > 0 ? (isRtl ? 1 : -1) : (isRtl ? -1 : 1);
          velocityBoost = Math.min(4.5, Math.abs(vel) / 420);
        }
      },
    });

    const loop = () => {
      raf = 0;
      if (!isVisible) return;
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) {
        velocityBoost *= 0.92;
        const speed = (0.75 + velocityBoost) * direction;
        offset += speed;
        if (offset <= -halfWidth) offset += halfWidth;
        if (offset >= 0) offset -= halfWidth;
        track.style.transform = `translate3d(${offset.toFixed(1)}px, 0, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !raf) {
          raf = requestAnimationFrame(loop);
        } else if (!isVisible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0.01 }
    );
    obs.observe(track);

    return () => {
      obs.disconnect();
      if (raf) cancelAnimationFrame(raf);
      st.kill();
    };
  }, [isRtl]);

  const segments = COPY.marquee.text[lang]
    .split('•')
    .map((s) => s.trim())
    .filter(Boolean);

  const renderGroup = (prefix: string) => (
    <div className="flex items-center shrink-0">
      {segments.map((item, idx) => (
        <React.Fragment key={`${prefix}-${idx}`}>
          <span
            className={`px-6 md:px-10 text-lg md:text-2xl font-display font-medium whitespace-nowrap ${
              isRtl ? '' : 'tracking-wide'
            }`}
          >
            {item}
          </span>
          <SunRaysSVG
            className="w-6 h-6 md:w-7 md:h-7 shrink-0 opacity-85"
            strokeColor="#F7EEDD"
            strokeWidth={7}
          />
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <section
      className="relative w-full bg-[#C1501F] text-[#F7EEDD] py-4 md:py-5 border-y border-[#2A140B]/15 overflow-hidden select-none"
      aria-label="Qahwa highlights"
    >
      <div dir="ltr" className="w-full overflow-hidden">
        <div ref={trackRef} className="flex items-center w-max will-change-transform">
          {renderGroup('a')}
          {renderGroup('b')}
        </div>
      </div>
    </section>
  );
};
