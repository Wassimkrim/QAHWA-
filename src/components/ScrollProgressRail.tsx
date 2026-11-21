import React, { useEffect, useRef } from 'react';
import { useQahwa } from '../context/QahwaContext';

export const ScrollProgressRail: React.FC = () => {
  const { isRtl } = useQahwa();
  const activePathRef = useRef<SVGPathElement>(null);
  const pctLabelRef = useRef<HTMLSpanElement>(null);
  const totalLength = 220;

  useEffect(() => {
    const pathEl = activePathRef.current;
    const textEl = pctLabelRef.current;
    if (!pathEl || !textEl) return;

    let scheduled = false;

    const update = () => {
      scheduled = false;
      if (window.innerWidth < 1024) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / total));
      pathEl.style.strokeDashoffset = `${(totalLength * (1 - p)).toFixed(1)}`;
      textEl.textContent = `${Math.round(p * 100)}%`;
    };

    const onScroll = () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`hidden lg:flex fixed top-1/2 -translate-y-1/2 z-40 pointer-events-none flex-col items-center gap-2 ${
        isRtl ? 'left-4' : 'right-4'
      }`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 220" className="w-5 h-44 overflow-visible">
        <path
          d="M12 4 C18 28, 6 52, 12 76 C18 100, 6 124, 12 148 C18 172, 6 196, 12 216"
          fill="none"
          stroke="rgba(193, 80, 31, 0.2)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          ref={activePathRef}
          d="M12 4 C18 28, 6 52, 12 76 C18 100, 6 124, 12 148 C18 172, 6 196, 12 216"
          fill="none"
          stroke="#C1501F"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength}
        />
      </svg>
      <span ref={pctLabelRef} className="text-[10px] font-medium tnums text-[#C1501F]/70">
        0%
      </span>
    </div>
  );
};
