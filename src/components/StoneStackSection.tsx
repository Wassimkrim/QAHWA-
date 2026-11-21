import React, { useCallback, useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { Download, RotateCcw, Share2 } from 'lucide-react';
import { COPY } from '../config/content';
import { useQahwa } from '../context/QahwaContext';
import {
  GlazeHeadline,
  MagneticButton,
  QAHWA_STONE_PATHS,
  QahwaLogoSVG,
  SectionLabel,
} from './BrandPrimitives';
import { StampCollageWord } from './ClayType';

type GamePhase = 'playing' | 'firing' | 'won';

interface Particle {
  x: number;
  y: number;
  vy: number;
  vx: number;
  size: number;
  alpha: number;
  rot: number;
}

export const StoneStackSection: React.FC = () => {
  const { lang, isRtl, playCeramicClink } = useQahwa();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [phase, setPhase] = useState<GamePhase>('playing');
  const [holdProgress, setHoldProgress] = useState(0); // 0..1 for 3s stillness
  const [elapsedSec, setElapsedSec] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(() => {
    try {
      const raw = window.localStorage.getItem('qahwa_best_balance');
      if (raw) {
        const num = parseFloat(raw);
        if (!Number.isNaN(num) && num > 0) return num;
      }
    } catch {
      // ignore
    }
    return null;
  });
  const [playerName, setPlayerName] = useState('');
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [resetNonce, setResetNonce] = useState(0);

  const phaseRef = useRef<GamePhase>('playing');
  phaseRef.current = phase;
  const startTimeRef = useRef<number | null>(null);
  const attemptsRef = useRef(0);
  const kilnAnimRef = useRef(0);

  const triggerWin = useCallback(
    (finalSec: number) => {
      phaseRef.current = 'firing';
      setPhase('firing');
      kilnAnimRef.current = 0;

      // Save personal best
      setBestTime((prev) => {
        const nextBest = prev === null ? finalSec : Math.min(prev, finalSec);
        try {
          window.localStorage.setItem('qahwa_best_balance', nextBest.toFixed(1));
        } catch {
          // ignore
        }
        return nextBest;
      });

      playCeramicClink();

      window.setTimeout(() => {
        phaseRef.current = 'won';
        setPhase('won');
      }, 2100);
    },
    [playCeramicClink]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = Math.min(680, container.clientWidth || 360);
    const height = width < 480 ? 400 : 440;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1.05, scale: 0.001 },
    });

    const groundY = height - 34;
    const wallOpts = {
      isStatic: true,
      friction: 0.9,
      restitution: 0.1,
    };

    const floor = Matter.Bodies.rectangle(width / 2, groundY + 25, width + 100, 50, wallOpts);
    const leftWall = Matter.Bodies.rectangle(-25, height / 2, 50, height * 2, wallOpts);
    const rightWall = Matter.Bodies.rectangle(width + 25, height / 2, 50, height * 2, wallOpts);
    const ceiling = Matter.Bodies.rectangle(width / 2, -60, width + 100, 60, wallOpts);

    // Three stones scattered gently so the visitor can pick & stack them
    const scaleFactor = width < 460 ? 0.8 : 0.96;

    const botStone = Matter.Bodies.rectangle(
      width * 0.25,
      90,
      128 * scaleFactor,
      54 * scaleFactor,
      {
        chamfer: { radius: 18 * scaleFactor },
        friction: 0.94,
        frictionStatic: 1.2,
        frictionAir: 0.03,
        restitution: 0.05,
        density: 0.0045,
        label: 'bottom',
      }
    );

    const midStone = Matter.Bodies.rectangle(
      width * 0.54,
      60,
      104 * scaleFactor,
      58 * scaleFactor,
      {
        chamfer: { radius: 22 * scaleFactor },
        friction: 0.94,
        frictionStatic: 1.2,
        frictionAir: 0.03,
        restitution: 0.05,
        density: 0.0038,
        label: 'middle',
      }
    );

    const topStone = Matter.Bodies.rectangle(
      width * 0.78,
      110,
      74 * scaleFactor,
      32 * scaleFactor,
      {
        chamfer: { radius: 14 * scaleFactor },
        friction: 0.94,
        frictionStatic: 1.2,
        frictionAir: 0.035,
        restitution: 0.05,
        density: 0.003,
        label: 'top',
      }
    );

    Matter.World.add(engine.world, [floor, leftWall, rightWall, ceiling, botStone, midStone, topStone]);

    const mouse = Matter.Mouse.create(canvas);
    mouse.pixelRatio = dpr;
    // Allow page scroll on wheel
    mouse.element.removeEventListener('wheel', (mouse as unknown as { mousewheel: EventListener }).mousewheel);

    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.22,
        damping: 0.14,
        render: { visible: false },
      },
    });
    Matter.World.add(engine.world, mouseConstraint);

    let isDragging = false;
    Matter.Events.on(mouseConstraint, 'startdrag', () => {
      if (phaseRef.current !== 'playing') return;
      isDragging = true;
      if (startTimeRef.current === null) {
        startTimeRef.current = performance.now();
      }
      attemptsRef.current += 1;
      setAttempts(attemptsRef.current);
    });

    Matter.Events.on(mouseConstraint, 'enddrag', () => {
      isDragging = false;
    });

    const particles: Particle[] = [];
    let steadyStart: number | null = null;
    let lastTimeUpdate = 0;
    let rafId = 0;
    let lastTick = performance.now();

    const botPath = new Path2D(QAHWA_STONE_PATHS.bottom);
    const midPath = new Path2D(QAHWA_STONE_PATHS.middle);
    const topPath = new Path2D(QAHWA_STONE_PATHS.top);

    const drawStoneBody = (
      body: Matter.Body,
      path: Path2D,
      cxOffset: number,
      cyOffset: number,
      fillStyle: string,
      glowAlpha: number
    ) => {
      ctx.save();
      ctx.translate(body.position.x, body.position.y);
      ctx.rotate(body.angle);
      ctx.scale(scaleFactor * 0.92, scaleFactor * 0.92);
      ctx.translate(-cxOffset, -cyOffset);

      if (glowAlpha > 0) {
        ctx.shadowColor = `rgba(255, 160, 40, ${glowAlpha})`;
        ctx.shadowBlur = 24 * glowAlpha;
      } else {
        ctx.shadowColor = 'rgba(42, 20, 11, 0.22)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;
      }

      ctx.fillStyle = fillStyle;
      ctx.fill(path);

      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = 'rgba(42, 20, 11, 0.18)';
      ctx.lineWidth = 2;
      ctx.stroke(path);
      ctx.restore();
    };

    const tick = (now: number) => {
      const dt = Math.min(32, now - lastTick);
      lastTick = now;

      if (phaseRef.current === 'playing') {
        Matter.Engine.update(engine, dt);

        if (startTimeRef.current !== null && now - lastTimeUpdate > 80) {
          lastTimeUpdate = now;
          setElapsedSec((now - startTimeRef.current) / 1000);
        }

        // Check vertical stacking order & stillness
        const verticallyOrdered =
          topStone.position.y < midStone.position.y - 20 * scaleFactor &&
          midStone.position.y < botStone.position.y - 24 * scaleFactor;
        const horizontallyAligned =
          Math.abs(topStone.position.x - midStone.position.x) < 56 * scaleFactor &&
          Math.abs(midStone.position.x - botStone.position.x) < 64 * scaleFactor;

        const maxSpeed = Math.max(botStone.speed, midStone.speed, topStone.speed);
        const maxAng = Math.max(
          Math.abs(botStone.angularSpeed),
          Math.abs(midStone.angularSpeed),
          Math.abs(topStone.angularSpeed)
        );
        const stackedStill =
          !isDragging &&
          verticallyOrdered &&
          horizontallyAligned &&
          maxSpeed < 0.45 &&
          maxAng < 0.045;

        if (stackedStill) {
          if (steadyStart === null) steadyStart = now;
          const heldMs = now - steadyStart;
          const pct = Math.min(1, heldMs / 3000);
          setHoldProgress(pct);
          if (heldMs >= 3000) {
            const finalTime =
              startTimeRef.current !== null
                ? Math.max(0.5, (now - startTimeRef.current) / 1000)
                : 3.0;
            setElapsedSec(finalTime);
            triggerWin(finalTime);
          }
        } else {
          steadyStart = null;
          setHoldProgress(0);
        }
      } else {
        kilnAnimRef.current = Math.min(1, kilnAnimRef.current + dt / 2000);
        if (Math.random() < 0.35 && particles.length < 36) {
          particles.push({
            x: midStone.position.x + (Math.random() - 0.5) * 90,
            y: midStone.position.y + (Math.random() - 0.5) * 40,
            vy: -(0.7 + Math.random() * 1.4),
            vx: (Math.random() - 0.5) * 0.6,
            size: 5 + Math.random() * 7,
            alpha: 1,
            rot: Math.random() * Math.PI * 2,
          });
        }
      }

      // Draw frame
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Subtle ceramic plinth
      ctx.fillStyle = '#E5D6BE';
      ctx.fillRect(width * 0.14, groundY, width * 0.72, 12);
      ctx.strokeStyle = 'rgba(42, 20, 11, 0.14)';
      ctx.lineWidth = 1;
      ctx.strokeRect(width * 0.14, groundY, width * 0.72, 12);

      // Subtle target stack guide outline while playing
      if (phaseRef.current === 'playing') {
        ctx.save();
        ctx.setLineDash([4, 5]);
        ctx.strokeStyle = 'rgba(193, 80, 31, 0.22)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(width / 2, groundY - 12);
        ctx.lineTo(width / 2, groundY - 175 * scaleFactor);
        ctx.stroke();
        ctx.restore();
      }

      const firingGlow =
        phaseRef.current === 'firing'
          ? Math.sin(kilnAnimRef.current * Math.PI)
          : phaseRef.current === 'won'
          ? 0.25
          : 0;

      const stoneColor =
        phaseRef.current === 'firing'
          ? `rgb(${Math.round(247 - firingGlow * 45)}, ${Math.round(238 - firingGlow * 140)}, ${Math.round(
              221 - firingGlow * 185
            )})`
          : phaseRef.current === 'won'
          ? '#C1501F'
          : '#F7EEDD';

      drawStoneBody(botStone, botPath, 100, 170, stoneColor, firingGlow);
      drawStoneBody(midStone, midPath, 102, 95, stoneColor, firingGlow);
      drawStoneBody(topStone, topPath, 108, 35, stoneColor, firingGlow);

      // Kiln sweep light pass
      if (phaseRef.current === 'firing') {
        const sweepY = height - kilnAnimRef.current * height;
        const grad = ctx.createLinearGradient(0, sweepY - 60, 0, sweepY + 60);
        grad.addColorStop(0, 'rgba(255, 230, 0, 0)');
        grad.addColorStop(0.5, 'rgba(255, 160, 40, 0.28)');
        grad.addColorStop(1, 'rgba(255, 230, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, sweepY - 60, width, 120);
      }

      // Drifting sun-ray particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.012;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.strokeStyle = `rgba(193, 80, 31, ${p.alpha})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
        for (let r = 0; r < 6; r++) {
          const a = (r / 6) * Math.PI * 2;
          ctx.moveTo(Math.cos(a) * p.size * 0.5, Math.sin(a) * p.size * 0.5);
          ctx.lineTo(Math.cos(a) * p.size, Math.sin(a) * p.size);
        }
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
    };
  }, [resetNonce, triggerWin]);

  const handleReset = () => {
    startTimeRef.current = null;
    attemptsRef.current = 0;
    setAttempts(0);
    setElapsedSec(0);
    setHoldProgress(0);
    setPhase('playing');
    setResetNonce((n) => n + 1);
  };

  const rankKey = elapsedSec < 10 ? 'master' : elapsedSec <= 25 ? 'potter' : 'apprentice';
  const rankLabel = COPY.balance.ranks[rankKey][lang];
  const todayStr = new Date().toLocaleDateString(
    lang === 'ar' ? 'ar-DZ' : lang === 'fr' ? 'fr-FR' : 'en-GB',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );

  // Export 1080x1920 Instagram Story PNG via Canvas
  const handleDownloadCertificate = async () => {
    try {
      await document.fonts.ready;
    } catch {
      // proceed
    }

    const W = 1080;
    const H = 1920;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    // Terracotta outer backdrop
    ctx.fillStyle = '#C1501F';
    ctx.fillRect(0, 0, W, H);

    // Subtle sun-rays behind certificate
    ctx.save();
    ctx.translate(W / 2, 310);
    ctx.strokeStyle = 'rgba(247, 238, 221, 0.22)';
    ctx.lineWidth = 4;
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 120, Math.sin(a) * 120);
      ctx.quadraticCurveTo(
        Math.cos(a + 0.14) * 380,
        Math.sin(a + 0.14) * 380,
        Math.cos(a) * 760,
        Math.sin(a) * 760
      );
      ctx.stroke();
    }
    ctx.restore();

    // Kraft Certificate Card
    const cardX = 88;
    const cardY = 210;
    const cardW = W - 176;
    const cardH = H - 420;
    ctx.save();
    ctx.shadowColor = 'rgba(42, 20, 11, 0.35)';
    ctx.shadowBlur = 48;
    ctx.shadowOffsetY = 20;
    ctx.fillStyle = '#F7EEDD';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 36);
    ctx.fill();
    ctx.restore();

    // Inner hairline frame
    ctx.strokeStyle = 'rgba(193, 80, 31, 0.35)';
    ctx.lineWidth = 3;
    ctx.strokeRect(cardX + 36, cardY + 36, cardW - 72, cardH - 72);

    ctx.textAlign = 'center';
    ctx.direction = isRtl ? 'rtl' : 'ltr';

    // Header caps
    ctx.fillStyle = '#C1501F';
    ctx.font = `600 26px ${isRtl ? 'Cairo' : 'Outfit'}, sans-serif`;
    ctx.fillText(COPY.balance.certHeader[lang], W / 2, cardY + 125);

    // Stacked Logo Seal
    ctx.save();
    ctx.translate(W / 2 - 90, cardY + 185);
    ctx.scale(0.9, 0.9);
    ctx.fillStyle = '#C1501F';
    ctx.fill(new Path2D(QAHWA_STONE_PATHS.top));
    ctx.fill(new Path2D(QAHWA_STONE_PATHS.middle));
    ctx.fill(new Path2D(QAHWA_STONE_PATHS.bottom));
    ctx.restore();

    // Main Headline
    ctx.fillStyle = '#2A140B';
    ctx.font = `600 66px ${isRtl ? 'Cairo' : 'Fraunces'}, serif`;
    ctx.fillText(COPY.balance.wonHeadline[lang], W / 2, cardY + 495);

    // Player Name
    if (playerName.trim()) {
      ctx.fillStyle = '#C1501F';
      ctx.font = `italic 500 58px ${isRtl ? 'Cairo' : 'Fraunces'}, serif`;
      ctx.fillText(playerName.trim(), W / 2, cardY + 610);
    }

    // Rank Stamp
    ctx.save();
    ctx.translate(W / 2, cardY + 755);
    ctx.rotate(-0.04);
    ctx.strokeStyle = '#C1501F';
    ctx.lineWidth = 4;
    ctx.strokeRect(-240, -52, 480, 104);
    ctx.fillStyle = '#C1501F';
    ctx.font = `700 38px ${isRtl ? 'Cairo' : 'Outfit'}, sans-serif`;
    ctx.fillText(rankLabel.toUpperCase(), 0, 14);
    ctx.restore();

    // Stats Row
    const statsY = cardY + 950;
    const cols = [
      { label: COPY.balance.timeLabel[lang], val: `${elapsedSec.toFixed(1)}s` },
      { label: COPY.balance.attemptsLabel[lang], val: String(attempts || 1) },
      { label: COPY.balance.dateLabel[lang], val: todayStr },
    ];
    cols.forEach((col, i) => {
      const x = cardX + 170 + i * ((cardW - 340) / 2);
      ctx.fillStyle = 'rgba(42, 20, 11, 0.58)';
      ctx.font = `500 24px ${isRtl ? 'Cairo' : 'Outfit'}, sans-serif`;
      ctx.fillText(col.label, x, statsY);
      ctx.fillStyle = '#2A140B';
      ctx.font = `700 40px ${isRtl ? 'Cairo' : 'Outfit'}, sans-serif`;
      ctx.fillText(col.val, x, statsY + 54);
    });

    // Quote
    ctx.fillStyle = '#2A140B';
    ctx.font = `italic 400 36px ${isRtl ? 'Cairo' : 'Fraunces'}, serif`;
    ctx.fillText(`“${COPY.balance.quote[lang]}”`, W / 2, cardY + 1190);

    // Handle footer
    ctx.fillStyle = '#C1501F';
    ctx.font = `600 28px Outfit, sans-serif`;
    ctx.fillText('@qahwathecoffee', W / 2, cardY + cardH - 95);

    const dataUrl = c.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qahwa-certificate-of-balance.png';
    a.click();
  };

  const handleShare = async () => {
    const shareText = `${COPY.balance.wonHeadline[lang]} — ${rankLabel} (${elapsedSec.toFixed(
      1
    )}s) · @qahwathecoffee`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QAHWA — Certificate of Balance',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      setCopiedNotice(true);
      window.setTimeout(() => setCopiedNotice(false), 2400);
    } catch {
      // ignore
    }
  };

  return (
    <section
      id="balance"
      className="relative py-24 md:py-32 px-4 md:px-10 bg-[#EAE0CE] text-[#2A140B] paper-grain border-y border-[#2A140B]/10 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <SectionLabel text={COPY.balance.label[lang]} />
          {phase === 'won' ? (
            <GlazeHeadline className="mt-4 text-[clamp(2.2rem,5.5vw,4.5rem)]">
              {COPY.balance.wonHeadline[lang]}
            </GlazeHeadline>
          ) : (
            <h2 className="mt-4 font-display text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[1.08] text-[#2A140B]">
              <span>{COPY.balance.headingPre[lang]}</span>
              <StampCollageWord text={COPY.balance.headingStamp[lang]} />
            </h2>
          )}
          <p className="mt-3 text-sm md:text-base text-[#2A140B]/75">
            {COPY.balance.instructions[lang]}
          </p>
        </div>

        {/* Status Bar */}
        <div className="max-w-[680px] mx-auto mb-4 flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm tnums">
          <div className="flex items-center gap-4">
            <span>
              <strong className="text-[#C1501F]">{COPY.balance.timeLabel[lang]}:</strong>{' '}
              {elapsedSec.toFixed(1)}s
            </span>
            <span>
              <strong className="text-[#C1501F]">{COPY.balance.attemptsLabel[lang]}:</strong>{' '}
              {attempts}
            </span>
            {bestTime !== null && (
              <span className="text-[#2A140B]/75">
                {COPY.balance.bestLabel[lang]}: {bestTime.toFixed(1)}s
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-[#2A140B]/75 hover:text-[#C1501F] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{COPY.balance.resetBtn[lang]}</span>
          </button>
        </div>

        {/* Matter.js Physics Stage */}
        <div
          ref={containerRef}
          className="relative max-w-[680px] mx-auto rounded-2xl bg-[#F7EEDD] border border-[#2A140B]/15 shadow-[0_20px_50px_rgba(42,20,11,0.1)] overflow-hidden flex justify-center"
        >
          <canvas
            ref={canvasRef}
            className="block max-w-full touch-none cursor-grab active:cursor-grabbing"
          />

          {/* Stillness Hold Indicator */}
          {phase === 'playing' && holdProgress > 0 && (
            <div className="absolute top-4 inset-x-0 flex justify-center pointer-events-none">
              <div className="px-4 py-1.5 rounded-full bg-[#2A140B] text-[#F7EEDD] text-xs uppercase tracking-[0.18em] flex items-center gap-2 shadow-md">
                <span>{COPY.balance.holdLabel[lang]}</span>
                <span className="w-16 h-1.5 bg-[#F7EEDD]/25 rounded-full overflow-hidden">
                  <span
                    className="block h-full bg-[#FFE600] transition-all duration-75"
                    style={{ width: `${Math.round(holdProgress * 100)}%` }}
                  />
                </span>
              </div>
            </div>
          )}

          {/* Kiln Firing Label */}
          {phase === 'firing' && (
            <div className="absolute top-5 inset-x-0 flex justify-center pointer-events-none">
              <span className="px-4 py-1.5 rounded-full bg-[#C1501F] text-[#F7EEDD] text-xs uppercase tracking-[0.2em] shadow-md">
                {COPY.balance.firingLabel[lang]}
              </span>
            </div>
          )}
        </div>

        {/* BALANCE CERTIFICATE */}
        {phase === 'won' && (
          <div className="mt-12 max-w-[460px] mx-auto">
            <div className="kraft-card-bg rounded-2xl p-6 md:p-8 border border-[#2A140B]/20 shadow-[0_24px_60px_rgba(42,20,11,0.2)] transform -rotate-1 transition-transform duration-500 hover:rotate-0">
              <div className="border border-[#2A140B]/20 rounded-xl p-5 md:p-6 bg-[#F7EEDD]/85 text-center">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#C1501F] font-semibold">
                  {COPY.balance.certHeader[lang]}
                </p>

                {/* Stacked Logo Seal */}
                <div className="my-4 flex justify-center">
                  <div className="w-14 h-16 rounded-full bg-[#C1501F]/10 border border-[#C1501F]/30 flex items-center justify-center p-2.5 ceramic-deboss">
                    <QahwaLogoSVG className="w-full h-full" color="#C1501F" />
                  </div>
                </div>

                {/* Optional Name Input in Fraunces Italic */}
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder={COPY.balance.namePlaceholder[lang]}
                  maxLength={32}
                  className="w-full text-center bg-transparent border-b border-[#2A140B]/20 focus:border-[#C1501F] outline-none py-1.5 font-display italic text-xl md:text-2xl text-[#2A140B] placeholder:text-[#2A140B]/40"
                />

                {/* Pressed Stamp Rank */}
                <div className="mt-5 inline-block px-5 py-2 border-2 border-[#C1501F] text-[#C1501F] font-semibold uppercase tracking-[0.18em] text-sm transform -rotate-2 ceramic-deboss">
                  {rankLabel}
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-3 gap-2 pt-4 border-t border-[#2A140B]/15 text-xs tnums">
                  <div>
                    <span className="block text-[#2A140B]/60">{COPY.balance.timeLabel[lang]}</span>
                    <strong className="text-sm md:text-base">{elapsedSec.toFixed(1)}s</strong>
                  </div>
                  <div>
                    <span className="block text-[#2A140B]/60">{COPY.balance.attemptsLabel[lang]}</span>
                    <strong className="text-sm md:text-base">{attempts || 1}</strong>
                  </div>
                  <div>
                    <span className="block text-[#2A140B]/60">{COPY.balance.dateLabel[lang]}</span>
                    <strong className="text-xs md:text-sm">{todayStr}</strong>
                  </div>
                </div>

                <p className="mt-5 font-display italic text-sm md:text-base text-[#2A140B]/85">
                  “{COPY.balance.quote[lang]}”
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <MagneticButton
                onClick={handleDownloadCertificate}
                className="btn-liquid px-5 py-3 rounded-full bg-[#2A140B] text-[#F7EEDD] text-xs md:text-sm font-medium gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{COPY.balance.downloadBtn[lang]}</span>
              </MagneticButton>

              <MagneticButton
                onClick={handleShare}
                className="px-5 py-3 rounded-full border border-[#2A140B]/30 hover:border-[#C1501F] text-[#2A140B] text-xs md:text-sm font-medium gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedNotice ? COPY.balance.copiedNotice[lang] : COPY.balance.shareBtn[lang]}</span>
              </MagneticButton>

              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-3 text-xs uppercase tracking-[0.16em] text-[#C1501F] font-semibold cursor-pointer"
              >
                {COPY.balance.playAgainBtn[lang]}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
