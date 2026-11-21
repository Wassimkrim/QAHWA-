import React, { useEffect, useState } from 'react';
import {
  Copy,
  ExternalLink,
  Instagram,
  MapPin,
  MessageCircle,
  MousePointerClick,
  Navigation,
} from 'lucide-react';
import { COPY, Lang, VENUE_CONFIG } from '../config/content';
import { useQahwa } from '../context/QahwaContext';
import {
  MagneticButton,
  QahwaLogoSVG,
  QahwaWordmark,
  SectionLabel,
} from './BrandPrimitives';
import { PressedClayHeadline } from './ClayType';

interface VenueStatus {
  state: 'open' | 'break' | 'closed';
  label: string;
  tagLabel: string;
  algiersTime: string;
}

function getAlgiersVenueStatus(lang: Lang): VenueStatus {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: VENUE_CONFIG.timezone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const weekday = parts.find((p) => p.type === 'weekday')?.value || 'Mon';
  const hour = parseInt(parts.find((p) => p.type === 'hour')?.value || '12', 10);
  const minute = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
  const mins = hour * 60 + minute;
  const algiersTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  const h = VENUE_CONFIG.hoursInstagram;
  const parseHM = (str: string) => {
    const [hh, mm] = str.split(':').map((n) => parseInt(n, 10));
    return hh * 60 + mm;
  };

  const isFriday = weekday === 'Fri';

  if (isFriday) {
    const morningOpen = parseHM(h.fridayMorningOpen);
    const morningClose = parseHM(h.fridayMorningClose);
    const afternoonOpen = parseHM(h.fridayAfternoonOpen);
    const eveningClose = parseHM(h.fridayAfternoonClose);

    if (mins >= morningOpen && mins < morningClose) {
      return {
        state: 'open',
        label: `${COPY.visit.openNow[lang]} • ${COPY.visit.closesAt[lang]} ${h.fridayMorningClose}`,
        tagLabel: COPY.visit.tagOpen[lang],
        algiersTime,
      };
    }
    if (mins >= morningClose && mins < afternoonOpen) {
      return {
        state: 'break',
        label: `${COPY.visit.middayBreak[lang]} • ${COPY.visit.opensAt[lang]} ${h.fridayAfternoonOpen}`,
        tagLabel: COPY.visit.tagBreak[lang],
        algiersTime,
      };
    }
    if (mins >= afternoonOpen && mins < eveningClose) {
      return {
        state: 'open',
        label: `${COPY.visit.openNow[lang]} • ${COPY.visit.closesAt[lang]} ${h.fridayAfternoonClose}`,
        tagLabel: COPY.visit.tagOpen[lang],
        algiersTime,
      };
    }
    return {
      state: 'closed',
      label: `${COPY.visit.closedNow[lang]} • ${COPY.visit.opensAt[lang]} ${
        mins < morningOpen ? h.fridayMorningOpen : h.weekdayOpen
      }`,
      tagLabel: COPY.visit.tagClosed[lang],
      algiersTime,
    };
  }

  const openMins = parseHM(h.weekdayOpen);
  const closeMins = parseHM(h.weekdayClose);
  if (mins >= openMins && mins < closeMins) {
    return {
      state: 'open',
      label: `${COPY.visit.openNow[lang]} • ${COPY.visit.closesAt[lang]} ${h.weekdayClose}`,
      tagLabel: COPY.visit.tagOpen[lang],
      algiersTime,
    };
  }

  const isThursdayNight = weekday === 'Thu' && mins >= closeMins;
  return {
    state: 'closed',
    label: `${COPY.visit.closedNow[lang]} • ${COPY.visit.opensAt[lang]} ${
      isThursdayNight ? h.fridayMorningOpen : h.weekdayOpen
    }`,
    tagLabel: COPY.visit.tagClosed[lang],
    algiersTime,
  };
}

export const VisitSection: React.FC = () => {
  const { lang } = useQahwa();
  const [status, setStatus] = useState<VenueStatus>(() => getAlgiersVenueStatus(lang));
  const [mapUnlocked, setMapUnlocked] = useState(false);
  const [embedFailed, setEmbedFailed] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);

  useEffect(() => {
    setStatus(getAlgiersVenueStatus(lang));
    const id = window.setInterval(() => {
      setStatus(getAlgiersVenueStatus(lang));
    }, 30000);
    return () => window.clearInterval(id);
  }, [lang]);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(
        `${VENUE_CONFIG.address[lang]} (${VENUE_CONFIG.plusCode})`
      );
      setCopiedAddr(true);
      window.setTimeout(() => setCopiedAddr(false), 2400);
    } catch {
      // ignore
    }
  };

  const isOpen = status.state === 'open';
  const keylessEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    VENUE_CONFIG.mapQuery
  )}&output=embed`;
  const activeEmbedSrc = VENUE_CONFIG.mapEmbedUrl || keylessEmbedUrl;
  const hasWhatsapp = Boolean(VENUE_CONFIG.whatsappNumber && VENUE_CONFIG.whatsappUrl);

  return (
    <section
      id="visit"
      className="relative py-24 md:py-32 px-5 md:px-10 terracotta-suede text-[#F7EEDD] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left/Top: Pine-Brown Wooden Storefront Window Frame */}
        <div className="lg:col-span-6">
          <div className="relative rounded-2xl p-3.5 md:p-5 bg-gradient-to-br from-[#7A4D2B] via-[#5C3A21] to-[#452A17] shadow-[0_30px_70px_rgba(42,20,11,0.48)] border-2 border-[#3A2211]">
            {/* Hanging Swinging Door Tag */}
            <div
              className="absolute top-6 right-6 z-30 origin-top animate-[leafSwayA_5s_ease-in-out_infinite]"
              aria-hidden="true"
            >
              <div className="mx-auto w-[1.5px] h-6 bg-[#F7EEDD]/80" />
              <div className="px-3.5 py-2 rounded-md bg-[#F7EEDD] text-[#2A140B] shadow-lg border border-[#2A140B]/20 text-[11px] font-semibold uppercase tracking-[0.12em] transform rotate-2">
                {status.tagLabel}
              </div>
            </div>

            {/* Inner Window Glass Pane */}
            <div className="relative w-full aspect-[4/4.3] rounded-lg overflow-hidden border border-[#2A140B]/40 bg-[#C9A177]">
              {/* Map Embed (Official -> Keyless Fallback -> Static Vector Placeholder on error) */}
              {!embedFailed ? (
                <iframe
                  title="Qahwa The Coffee — Hydra, Algiers Map"
                  src={activeEmbedSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onError={() => setEmbedFailed(true)}
                  className={`w-full h-full border-0 transition-all ${
                    mapUnlocked ? 'pointer-events-auto' : 'pointer-events-none'
                  }`}
                  style={{
                    filter: 'sepia(0.82) saturate(1.4) hue-rotate(-24deg) brightness(0.92)',
                  }}
                />
              ) : (
                <div
                  className={`w-full h-full relative ${
                    mapUnlocked ? 'pointer-events-auto' : 'pointer-events-none'
                  }`}
                >
                  <svg viewBox="0 0 600 600" className="w-full h-full" aria-hidden="true">
                    <rect width="600" height="600" fill="#B56E46" />
                    <path d="M-20 150 C140 130, 290 175, 620 115" stroke="#F7EEDD" strokeOpacity="0.45" strokeWidth="22" fill="none" />
                    <path d="M-10 380 C180 355, 340 410, 620 360" stroke="#F7EEDD" strokeOpacity="0.45" strokeWidth="18" fill="none" />
                    <path d="M180 -10 C195 190, 155 360, 205 610" stroke="#F7EEDD" strokeOpacity="0.4" strokeWidth="16" fill="none" />
                    <path d="M430 -10 C410 180, 455 380, 435 610" stroke="#F7EEDD" strokeOpacity="0.4" strokeWidth="15" fill="none" />
                    <rect x="225" y="185" width="165" height="145" rx="18" fill="#A04B24" />
                    <rect x="40" y="180" width="120" height="160" rx="16" fill="#A85730" />
                    <rect x="460" y="160" width="110" height="165" rx="16" fill="#A85730" />
                  </svg>
                </div>
              )}

              {/* Subtle terracotta glaze & glass reflection sheen */}
              <div
                className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-[#C1501F]/18 via-[#F7EEDD]/8 to-[#F7EEDD]/24 mix-blend-multiply"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-[#F7EEDD]/10 to-[#F7EEDD]/25"
                aria-hidden="true"
              />

              {/* Centered Settling Stone Pin */}
              <div className="absolute top-[54%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#C1501F] border-[3px] border-[#F7EEDD] shadow-xl flex items-center justify-center p-2.5">
                  <QahwaLogoSVG className="w-full h-full" color="#F7EEDD" />
                </div>
              </div>

              {/* Glass Etched Q A H W A Wordmark + Neon-Yellow Squiggle Sign */}
              <div className="absolute top-5 inset-x-0 flex flex-col items-center pointer-events-none z-20 px-4">
                <QahwaWordmark
                  sizeClass="text-lg sm:text-xl md:text-2xl"
                  color="#F7EEDD"
                  markColor="#F7EEDD"
                  interactive={false}
                />

                <svg
                  viewBox="0 0 220 58"
                  className={`mt-2 w-36 sm:w-44 h-11 transition-all duration-700 ${
                    isOpen ? 'opacity-100 drop-shadow-[0_0_12px_rgba(255,230,0,0.95)]' : 'opacity-25'
                  }`}
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 18 C12 46, 54 46, 62 24 C68 6, 84 6, 90 24 C98 48, 138 48, 146 22 C152 8, 168 10, 174 26 C182 44, 206 42, 208 18"
                    stroke={isOpen ? '#FFE600' : '#EAE0CE'}
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Storefront SVG Orange Flower Decal at bottom right */}
              <svg
                viewBox="0 0 90 120"
                className="absolute bottom-2 right-3 w-14 sm:w-16 h-20 pointer-events-none z-20 opacity-90"
                fill="none"
                aria-hidden="true"
              >
                <path d="M45 115 C46 88, 44 65, 45 48" stroke="#D8301C" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M44 92 C28 84, 18 72, 16 62 C28 65, 38 76, 44 86 Z" fill="#C1501F" />
                <path d="M46 84 C62 76, 72 64, 74 54 C62 57, 52 68, 46 78 Z" fill="#C1501F" />
                <path d="M45 48 C34 38, 30 22, 38 14 C42 24, 44 35, 45 48 Z" fill="#D8301C" />
                <path d="M45 48 C56 38, 60 22, 52 14 C48 24, 46 35, 45 48 Z" fill="#D8301C" />
                <path d="M45 48 C28 45, 18 32, 24 22 C33 28, 39 38, 45 48 Z" fill="#C1501F" />
                <path d="M45 48 C62 45, 72 32, 66 22 C57 28, 51 38, 45 48 Z" fill="#C1501F" />
                <circle cx="45" cy="45" r="5" fill="#FFE600" />
              </svg>

              {/* Tap to explore lock overlay (prevents scroll-trapping on mobile) */}
              {!mapUnlocked && (
                <button
                  type="button"
                  onClick={() => setMapUnlocked(true)}
                  className="absolute bottom-3 left-3 z-30 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#2A140B]/88 text-[#F7EEDD] text-xs font-medium border border-[#F7EEDD]/25 hover:border-[#FFE600] cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[#FFE600]"
                >
                  <MousePointerClick className="w-3.5 h-3.5 text-[#FFE600]" />
                  <span>{COPY.visit.tapToExplore[lang]}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right/Bottom: Live Hours, Real Hydra Address, Toggleable Info Chips & Actions */}
        <div className="lg:col-span-6">
          <SectionLabel text={COPY.visit.label[lang]} light />
          <PressedClayHeadline
            text={COPY.visit.heading[lang]}
            as="h2"
            className="mt-4 text-[clamp(2.3rem,5.5vw,4.8rem)] text-[#F7EEDD]"
          />

          {/* Live Algiers Status Badge */}
          <div className="mt-7 inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#2A140B] text-[#F7EEDD] text-xs md:text-sm font-medium tnums">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isOpen ? 'animate-ping bg-[#FFE600]' : 'bg-[#D8301C]'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isOpen ? 'bg-[#FFE600]' : 'bg-[#D8301C]'
                }`}
              />
            </span>
            <span>{status.label}</span>
            <span className="text-[#F7EEDD]/55">({status.algiersTime})</span>
          </div>

          {/* Toggleable Listing Info Chips from Google Maps */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {VENUE_CONFIG.visitChips.delivery && (
              <span className="px-3 py-1 rounded-full bg-[#A9431A] border border-[#F7EEDD]/25 text-xs text-[#F7EEDD]">
                {COPY.visit.chips.delivery[lang]}
              </span>
            )}
            {VENUE_CONFIG.visitChips.driveThrough && (
              <span className="px-3 py-1 rounded-full bg-[#A9431A] border border-[#F7EEDD]/25 text-xs text-[#F7EEDD]">
                {COPY.visit.chips.driveThrough[lang]}
              </span>
            )}
            {VENUE_CONFIG.visitChips.typicalSpend && (
              <span className="px-3 py-1 rounded-full bg-[#A9431A] border border-[#F7EEDD]/25 text-xs text-[#F7EEDD]">
                {COPY.visit.chips.typicalSpend[lang]}
              </span>
            )}
          </div>

          {/* Deep Terracotta panel for AA contrast */}
          <div className="mt-6 rounded-2xl bg-[#A9431A]/95 border border-[#F7EEDD]/20 p-6 space-y-5">
            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-[0.2em] text-[#FFE600] font-semibold">
                {COPY.visit.hoursTitle[lang]}
              </p>
              <p className="text-base md:text-lg font-medium tnums">{COPY.visit.dailyHours[lang]}</p>
              <p className="text-base md:text-lg font-medium tnums text-[#F7EEDD]/85">
                {COPY.visit.fridayHours[lang]}
              </p>
            </div>

            <div className="border-t border-[#F7EEDD]/15 pt-4 space-y-2">
              <p className="text-base md:text-lg font-medium text-[#F7EEDD]">
                {VENUE_CONFIG.address[lang]}
              </p>
              <p className="text-xs text-[#F7EEDD]/80 tnums">
                {COPY.visit.plusCodeLabel[lang]}: <strong>{VENUE_CONFIG.plusCode}</strong>
              </p>

              <div className="pt-2">
                <p className="text-xs uppercase tracking-[0.2em] text-[#F7EEDD]/75 mb-1.5">
                  {COPY.visit.howToFindUs[lang]}
                </p>
                <ul className="space-y-1 font-hand text-lg text-[#F7EEDD]/90">
                  {VENUE_CONFIG.landmarks.map((line, i) => (
                    <li key={i}>· {line[lang]}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticButton
              href={VENUE_CONFIG.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-liquid px-6 py-3.5 rounded-full bg-[#F7EEDD] text-[#2A140B] text-sm font-medium gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>{COPY.visit.directionsBtn[lang]}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </MagneticButton>

            <MagneticButton
              href={VENUE_CONFIG.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-full bg-[#A9431A] border border-[#F7EEDD]/35 hover:border-[#FFE600] text-[#F7EEDD] text-sm font-medium gap-2 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>{COPY.visit.mapsBtn[lang]}</span>
            </MagneticButton>

            <MagneticButton
              onClick={handleCopyAddress}
              className="px-5 py-3.5 rounded-full bg-[#A9431A] border border-[#F7EEDD]/35 hover:border-[#FFE600] text-[#F7EEDD] text-sm font-medium gap-2 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>{copiedAddr ? COPY.visit.copiedAddress[lang] : COPY.visit.copyAddressBtn[lang]}</span>
            </MagneticButton>

            <MagneticButton
              href={VENUE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-full bg-[#A9431A] border border-[#F7EEDD]/35 hover:border-[#FFE600] text-[#F7EEDD] text-sm font-medium gap-2 transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span>{COPY.visit.igBtn[lang]}</span>
            </MagneticButton>

            {hasWhatsapp ? (
              <MagneticButton
                href={VENUE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-full bg-[#A9431A] border border-[#F7EEDD]/35 hover:border-[#FFE600] text-[#F7EEDD] text-sm font-medium gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{COPY.visit.waBtn[lang]}</span>
              </MagneticButton>
            ) : (
              <span
                aria-disabled="true"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#A9431A]/60 border border-[#F7EEDD]/20 text-[#F7EEDD]/60 text-sm font-medium cursor-not-allowed"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{COPY.visit.waPending[lang]}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
