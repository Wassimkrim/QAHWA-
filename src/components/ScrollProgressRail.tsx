import React, { useEffect, useState } from 'react';
import { useQahwa } from '../context/QahwaContext';

export const ScrollProgressRail: React.FC = () => {
  const { isRtl } = useQahwa();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(1, Math.max(0, window.scrollY / total)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const totalLength = 220;
  const dashOffset = totalLength * (1 - progress);

  return (
    <div
      className={`hidden lg:flex fixed top-1/2 -translate-y-1/2 z-40 pointer-events-none flex-col items-center gap-2 ${
        isRtl ? 'left-4' : 'right-4'
      }`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 220" className="w-5 h-44 overflow-visible">
        {/* Background faint wavy path */}
        <path
          d="M12 4 C18 28, 6 52, 12 76 C18 100, 6 124, 12 148 C18 172, 6 196, 12 216"
          fill="none"
          stroke="rgba(193, 80, 31, 0.2)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Active wavy sun-ray progress */}
        <path
          d="M12 4 C18 28, 6 52, 12 76 C18 100, 6 124, 12 148 C18 172, 6 196, 12 216"
          fill="none"
          stroke="#C1501F"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray={totalLength}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="text-[10px] font-medium tnums text-[#C1501F]/70">
        {Math.round(progress * 100)}%
      </span>
    </div>
  );
};
