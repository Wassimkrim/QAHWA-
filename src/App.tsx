import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { BlendBagSection } from './components/BlendBagSection';
import { CeramicWallSection } from './components/CeramicWallSection';
import { RibbonTypePath } from './components/ClayType';
import { CustomCursor } from './components/CustomCursor';
import { DelightsOverlay } from './components/DelightsOverlay';
import { FirstPourSection } from './components/FirstPourSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { LeafShadowOverlay } from './components/LeafShadowOverlay';
import { Loader } from './components/Loader';
import { ManifestoSection } from './components/ManifestoSection';
import { MarqueeSection } from './components/MarqueeSection';
import { MenuSection } from './components/MenuSection';
import { Navbar } from './components/Navbar';
import { PickYourSceneSection } from './components/PickYourSceneSection';
import { PolaroidWallSection } from './components/PolaroidWallSection';
import { RitualSection } from './components/RitualSection';
import { ScrollProgressRail } from './components/ScrollProgressRail';
import { StoneStackSection } from './components/StoneStackSection';
import { SunClockSection } from './components/SunClockSection';
import { TableTalkSection } from './components/TableTalkSection';
import { VisitSection } from './components/VisitSection';
import { COPY } from './config/content';
import { QahwaProvider, useQahwa } from './context/QahwaContext';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const QahwaExperience: React.FC = () => {
  const { lang } = useQahwa();
  const [loaderDone, setLoaderDone] = useState(false);

  // Smooth scrolling via Lenis on desktop wheel; native touch scroll on mobile
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!loaderDone) return;
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 180);
    return () => window.clearTimeout(id);
  }, [loaderDone, lang]);

  useEffect(() => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#C1501F] text-[#2A140B] selection:bg-[#FFE600] selection:text-[#2A140B]">
      {!loaderDone && <Loader onDone={() => setLoaderDone(true)} />}

      {/* Signature Continuous Sunlit Leaf Shadow Layer (Behavior D) */}
      <LeafShadowOverlay />

      <CustomCursor />
      <ScrollProgressRail />
      <DelightsOverlay />
      <Navbar />

      <main>
        {/* 1. Hero (Pinned Terracotta Suede + Stone Mask) */}
        <HeroSection />

        {/* Scroll-Reactive Marquee */}
        <MarqueeSection />

        {/* 2. Manifesto (Cream Plaster + Ribbon Type + 3 Arches) */}
        <ManifestoSection />

        {/* 3. The Ritual (Espresso Dark + 9:16 Arched Reel) */}
        <RitualSection />

        {/* 4 & 4b. The Line (Hanging Posters + Kraft Tags) & Full Menu */}
        <MenuSection />

        {/* 5. Pick Your Scene (Accordion Strips + Thermal Order Slip) */}
        <PickYourSceneSection />

        {/* 6. Sun Clock (Drives global leaf-shadow angle & warmth) */}
        <SunClockSection />

        {/* Ribbon Divider */}
        <div className="cream-plaster py-2">
          <RibbonTypePath phrase={COPY.manifesto.ribbonPhrase[lang]} />
        </div>

        {/* 7. The First Pour (Photo A + Shimmering Espresso Streams + Hotspots) */}
        <FirstPourSection />

        {/* 8. Blend #2 (Photo B Hotspots + 3D-Tilt Flippable Label Card) */}
        <BlendBagSection />

        {/* 9. The Ceramic Wall + Lightbox */}
        <CeramicWallSection />

        {/* 10. Stone Stack "The Balance" Physics + Kiln + Certificate */}
        <StoneStackSection />

        {/* 11. What People Wear at Qahwa (Draggable Polaroid Wall) */}
        <PolaroidWallSection />

        {/* 11b. Table Talk (Real Google Reviews & Word Stones Wall) */}
        <TableTalkSection />

        {/* 13. Visit Us — "The Window" (Pine Wood Frame + Neon Squiggle + Hydra Hours) */}
        <VisitSection />
      </main>

      {/* 14. Giant Glaze-Fill Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <QahwaProvider>
      <QahwaExperience />
    </QahwaProvider>
  );
}
