import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { COPY, Lang, SunPhase, VENUE_CONFIG } from '../config/content';

type ActiveAudioSource = 'none' | 'ambient' | 'hero' | 'ritual';

interface QahwaContextValue {
  lang: Lang;
  isRtl: boolean;
  switchLanguage: (nextLang: Lang) => void;
  curtainState: 'idle' | 'in' | 'out';
  activeAudio: ActiveAudioSource;
  setActiveAudio: (src: ActiveAudioSource) => void;
  toggleAmbientSound: () => void;
  playCeramicClink: () => void;
  activeMenuTab: string;
  setActiveMenuTab: (tabId: string) => void;
  jumpToMenuTab: (tabId: string) => void;
  openPosterId: string | null;
  openPosterOnLine: (posterId: string) => void;
  clearOpenPoster: () => void;
  sunPhase: SunPhase;
  sunHour: number;
}

const QahwaContext = createContext<QahwaContextValue | null>(null);

function computeSunPhase(hour: number): SunPhase {
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 15) return 'noon';
  if (hour >= 15 && hour < 19) return 'golden';
  return 'evening';
}

export const QahwaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = window.localStorage.getItem('qahwa_lang');
      if (saved === 'en' || saved === 'fr' || saved === 'ar') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const [curtainState, setCurtainState] = useState<'idle' | 'in' | 'out'>('idle');
  const [activeAudio, setActiveAudioState] = useState<ActiveAudioSource>('none');
  const [activeMenuTab, setActiveMenuTab] = useState<string>('classics');
  const [openPosterId, setOpenPosterId] = useState<string | null>(null);
  const [sunHour, setSunHour] = useState(() => {
    const d = new Date();
    return d.getHours() + d.getMinutes() / 60;
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientNodesRef = useRef<{ stop: () => void } | null>(null);
  const externalAudioRef = useRef<HTMLAudioElement | null>(null);
  const curtainTimerRef = useRef<number | null>(null);

  const isRtl = lang === 'ar';
  const sunPhase = computeSunPhase(Math.floor(sunHour));

  useEffect(() => {
    const id = window.setInterval(() => {
      const d = new Date();
      setSunHour(d.getHours() + d.getMinutes() / 60);
    }, 60000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    try {
      window.localStorage.setItem('qahwa_lang', lang);
    } catch {
      // ignore
    }
  }, [lang, isRtl]);

  useEffect(() => {
    const defaultTitle = 'QAHWA — More than coffee.';
    const handleVisibility = () => {
      document.title = document.hidden ? COPY.delights.awayTitle[lang] : defaultTitle;
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      document.title = defaultTitle;
    };
  }, [lang]);

  const stopAmbientNodes = useCallback(() => {
    if (ambientNodesRef.current) {
      ambientNodesRef.current.stop();
      ambientNodesRef.current = null;
    }
    if (externalAudioRef.current) {
      externalAudioRef.current.pause();
    }
  }, []);

  const startAmbientNodes = useCallback(() => {
    if (VENUE_CONFIG.ambientAudioUrl) {
      try {
        if (!externalAudioRef.current) {
          externalAudioRef.current = new Audio(VENUE_CONFIG.ambientAudioUrl);
          externalAudioRef.current.loop = true;
          externalAudioRef.current.volume = 0.25;
        }
        externalAudioRef.current.play().catch(() => {});
        return;
      } catch {
        // fallback
      }
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});

      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 0.22;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 340;

      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.001;
      masterGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.8);

      noise.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);
      noise.start();

      ambientNodesRef.current = {
        stop: () => {
          try {
            masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
            window.setTimeout(() => {
              try {
                noise.stop();
                noise.disconnect();
              } catch {
                // ignore
              }
            }, 280);
          } catch {
            // ignore
          }
        },
      };
    } catch {
      // ignore
    }
  }, []);

  const setActiveAudio = useCallback(
    (next: ActiveAudioSource) => {
      if (next !== 'ambient') {
        stopAmbientNodes();
      } else if (activeAudio !== 'ambient') {
        startAmbientNodes();
      }
      setActiveAudioState(next);
    },
    [activeAudio, startAmbientNodes, stopAmbientNodes]
  );

  const toggleAmbientSound = useCallback(() => {
    if (activeAudio === 'ambient') {
      stopAmbientNodes();
      setActiveAudioState('none');
    } else {
      startAmbientNodes();
      setActiveAudioState('ambient');
    }
  }, [activeAudio, startAmbientNodes, stopAmbientNodes]);

  const playCeramicClink = useCallback(() => {
    if (activeAudio === 'none') return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const now = ctx.currentTime;
      [1180, 1765, 2640].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.06 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55 - idx * 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      });
    } catch {
      // ignore
    }
  }, [activeAudio]);

  const switchLanguage = useCallback(
    (nextLang: Lang) => {
      if (nextLang === lang) return;
      if (curtainTimerRef.current) window.clearTimeout(curtainTimerRef.current);
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        setLang(nextLang);
        return;
      }
      setCurtainState('in');
      curtainTimerRef.current = window.setTimeout(() => {
        setLang(nextLang);
        setCurtainState('out');
        curtainTimerRef.current = window.setTimeout(() => {
          setCurtainState('idle');
        }, 550);
      }, 380);
    },
    [lang]
  );

  const jumpToMenuTab = useCallback((tabId: string) => {
    setActiveMenuTab(tabId);
    const el = document.getElementById('full-menu');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const openPosterOnLine = useCallback((posterId: string) => {
    setOpenPosterId(posterId);
    const lineEl = document.getElementById('the-line');
    if (lineEl) {
      lineEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const clearOpenPoster = useCallback(() => setOpenPosterId(null), []);

  useEffect(() => {
    return () => {
      stopAmbientNodes();
      if (curtainTimerRef.current) window.clearTimeout(curtainTimerRef.current);
    };
  }, [stopAmbientNodes]);

  return (
    <QahwaContext.Provider
      value={{
        lang,
        isRtl,
        switchLanguage,
        curtainState,
        activeAudio,
        setActiveAudio,
        toggleAmbientSound,
        playCeramicClink,
        activeMenuTab,
        setActiveMenuTab,
        jumpToMenuTab,
        openPosterId,
        openPosterOnLine,
        clearOpenPoster,
        sunPhase,
        sunHour,
      }}
    >
      {children}
    </QahwaContext.Provider>
  );
};

export const useQahwa = (): QahwaContextValue => {
  const ctx = useContext(QahwaContext);
  if (!ctx) throw new Error('useQahwa must be used inside QahwaProvider');
  return ctx;
};
