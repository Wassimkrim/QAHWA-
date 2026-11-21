import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { COPY, Lang, VENUE_CONFIG } from '../config/content';
import { useQahwa } from '../context/QahwaContext';

export const Navbar: React.FC = () => {
  const { lang, switchLanguage, activeAudio, toggleAmbientSound, isRtl } = useQahwa();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.4);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { id: 'menu', label: COPY.nav.menu[lang] },
    { id: 'ceramics', label: COPY.nav.ceramics[lang] },
    { id: 'balance', label: COPY.nav.balance[lang] },
    { id: 'visit', label: COPY.nav.visit[lang] },
  ];

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#F7EEDD]/92 backdrop-blur-md text-[#2A140B] border-b border-[#2A140B]/10 py-3'
          : 'bg-transparent text-[#F7EEDD] py-4 md:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
        {/* Zone 1: Brand lockup */}
        <a
          href="#top"
          className="inline-flex items-center gap-2 sm:gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#FFE600] rounded-sm"
        >
          <span
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors ${
              scrolled ? 'bg-[#C1501F]' : 'bg-[#C1501F]/90'
            }`}
          >
            <img
              src={VENUE_CONFIG.assets.logoPng}
              alt="QAHWA logo"
              className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
              referrerPolicy="no-referrer"
            />
          </span>
          <span
            dir="ltr"
            className={`text-sm sm:text-base md:text-lg font-semibold uppercase tracking-[0.22em] sm:tracking-[0.28em] transition-colors ${
              scrolled ? 'text-[#2A140B]' : 'text-[#F7EEDD]'
            }`}
          >
            QAHWA
          </span>
        </a>

        {/* Zone 2: 4 concise single-line links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`relative whitespace-nowrap shrink-0 py-1 cursor-pointer group focus-visible:outline-2 focus-visible:outline-[#FFE600] ${
                isRtl ? '' : 'tracking-wide'
              }`}
            >
              <span>{item.label}</span>
              <span
                className="absolute bottom-0 inset-x-0 h-[1.5px] bg-[#FFE600] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                aria-hidden="true"
              />
            </button>
          ))}
        </nav>

        {/* Zone 3: Language Switcher + Ambient Sound Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Language Switcher */}
          <div
            className={`inline-flex items-center rounded-full p-0.5 text-[11px] sm:text-xs border transition-colors ${
              scrolled
                ? 'border-[#2A140B]/15 bg-[#2A140B]/5'
                : 'border-[#F7EEDD]/25 bg-[#2A140B]/20'
            }`}
            role="group"
            aria-label="Language"
          >
            {(['en', 'fr', 'ar'] as Lang[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => switchLanguage(code)}
                className={`px-2 sm:px-2.5 py-1 rounded-full uppercase font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  lang === code
                    ? scrolled
                      ? 'bg-[#C1501F] text-[#F7EEDD]'
                      : 'bg-[#F7EEDD] text-[#2A140B]'
                    : scrolled
                    ? 'text-[#2A140B]/70 hover:text-[#2A140B]'
                    : 'text-[#F7EEDD]/80 hover:text-[#F7EEDD]'
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          {/* Ambient Sound Toggle with Animated Wave Bars */}
          <button
            type="button"
            onClick={toggleAmbientSound}
            aria-label={activeAudio === 'ambient' ? COPY.nav.soundOn[lang] : COPY.nav.soundOff[lang]}
            title={activeAudio === 'ambient' ? COPY.nav.soundOn[lang] : COPY.nav.soundOff[lang]}
            className={`w-9 h-9 rounded-full inline-flex items-center justify-center border transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-[#FFE600] ${
              scrolled
                ? 'border-[#2A140B]/15 hover:border-[#C1501F]'
                : 'border-[#F7EEDD]/25 hover:border-[#FFE600]'
            }`}
          >
            <span className="inline-flex items-end gap-[2.5px] h-3.5" aria-hidden="true">
              {[0.55, 1, 0.7, 0.9].map((h, i) => (
                <span
                  key={i}
                  className={`w-[2px] rounded-full transition-all duration-300 ${
                    scrolled ? 'bg-[#2A140B]' : 'bg-[#F7EEDD]'
                  } ${activeAudio === 'ambient' ? 'animate-pulse' : ''}`}
                  style={{
                    height: activeAudio === 'ambient' ? `${Math.round(h * 14)}px` : '4px',
                    animationDelay: `${i * 120}ms`,
                  }}
                />
              ))}
            </span>
          </button>

          {/* Mobile Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden w-9 h-9 rounded-full inline-flex items-center justify-center border border-current/25 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden mt-2 mx-4 rounded-2xl bg-[#F7EEDD] text-[#2A140B] border border-[#2A140B]/15 shadow-lg p-4 flex flex-col gap-2">
          {navLinks.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className="text-start py-2.5 px-3 rounded-xl hover:bg-[#C1501F]/10 font-medium text-base cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
