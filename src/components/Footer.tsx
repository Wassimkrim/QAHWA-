import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COPY, VENUE_CONFIG } from '../config/content';
import { useQahwa } from '../context/QahwaContext';
import { QahwaWordmark, SunRaysSVG } from './BrandPrimitives';

gsap.registerPlugin(ScrollTrigger);

export const Footer: React.FC = () => {
  const { lang } = useQahwa();
  const wordmarkWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wordmarkWrapRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--glaze', '100%');
      return;
    }

    const ctx = gsap.context(() => {
      const state = { glaze: 10 };
      gsap.to(state, {
        glaze: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          end: 'bottom 95%',
          scrub: 0.6,
        },
        onUpdate: () => {
          el.style.setProperty('--glaze', `${state.glaze.toFixed(1)}%`);
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="relative bg-[#2A140B] text-[#F7EEDD] pt-20 pb-10 px-5 md:px-10 overflow-hidden">
      {/* Slow background sun-rays */}
      <div
        className="absolute -bottom-32 right-[-80px] opacity-15 pointer-events-none"
        aria-hidden="true"
      >
        <div className="animate-[spin_90s_linear_infinite]">
          <SunRaysSVG className="w-[480px] h-[480px]" strokeColor="#C1501F" strokeWidth={2.5} />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Top Row: Links & Craft line */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-14 border-b border-[#F7EEDD]/15 text-sm">
          <div className="flex flex-wrap items-center gap-6">
            <a href="#menu" className="hover:text-[#FFE600] transition-colors">
              {COPY.nav.menu[lang]}
            </a>
            <a href="#ceramics" className="hover:text-[#FFE600] transition-colors">
              {COPY.nav.ceramics[lang]}
            </a>
            <a href="#balance" className="hover:text-[#FFE600] transition-colors">
              {COPY.nav.balance[lang]}
            </a>
            <a href="#visit" className="hover:text-[#FFE600] transition-colors">
              {COPY.nav.visit[lang]}
            </a>
            <a
              href={VENUE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C1501F] hover:text-[#FFE600] transition-colors"
            >
              {VENUE_CONFIG.handle}
            </a>
          </div>

          <p className="text-xs md:text-sm text-[#F7EEDD]/70">
            {COPY.footer.madeWithCare[lang]} · {COPY.footer.rights[lang]}
          </p>
        </div>

        {/* Giant Footer QAHWA Wordmark filling the width with 3 floating marks */}
        <div
          ref={wordmarkWrapRef}
          className="pt-14 pb-4 flex flex-col items-center justify-center overflow-hidden"
          style={{ ['--glaze' as string]: '100%' }}
        >
          <QahwaWordmark
            sizeClass="text-[13vw] md:text-[11.5vw] leading-none"
            color="#C1501F"
            markColor="#C1501F"
            interactive={true}
            dropped={true}
            glaze={true}
          />
          <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-[#F7EEDD]/45">
            © {new Date().getFullYear()} QAHWA
          </p>
        </div>
      </div>
    </footer>
  );
};
