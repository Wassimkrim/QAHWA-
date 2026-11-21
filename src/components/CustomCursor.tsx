import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<'default' | 'link' | 'view'>('default');
  const dotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduced) return;

    setEnabled(true);
    document.body.classList.add('qahwa-cursor-active');

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const onResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const points: Array<{ x: number; y: number; life: number }> = [];
    let targetX = -100;
    let targetY = -100;
    let curX = -100;
    let curY = -100;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      points.push({ x: targetX, y: targetY, life: 1 });
      if (points.length > 18) points.shift();

      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-cursor="view"]')) {
        setMode('view');
      } else if (target?.closest('a, button, [role="button"], input')) {
        setMode('link');
      } else {
        setMode('default');
      }
    };

    const render = () => {
      curX += (targetX - curX) * 0.24;
      curY += (targetY - curY) * 0.24;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;
      }

      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = points.length - 1; i >= 0; i--) {
          points[i].life -= 0.055;
          if (points[i].life <= 0) points.splice(i, 1);
        }

        if (points.length > 2) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
          }
          ctx.strokeStyle = 'rgba(255, 230, 0, 0.72)';
          ctx.lineWidth = 1.6;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', onResize);
    raf = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('qahwa-cursor-active');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[70] pointer-events-none"
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 z-[71] pointer-events-none flex items-center justify-center transition-[width,height,background-color,border-color] duration-200 ease-out ${
          mode === 'view'
            ? 'w-14 h-14 rounded-full bg-[#F7EEDD] text-[#2A140B] shadow-md border border-[#2A140B]/15'
            : mode === 'link'
            ? 'w-9 h-9 rounded-full bg-[#FFE600]/30 border border-[#FFE600] mix-blend-difference'
            : 'w-3.5 h-3 rounded-[48%_52%_45%_55%] bg-[#F7EEDD] border border-[#2A140B]/35 shadow-sm'
        }`}
        aria-hidden="true"
      >
        {mode === 'view' && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">VIEW</span>
        )}
      </div>
    </>
  );
};
