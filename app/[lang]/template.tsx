"use client";

import { useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { ScrollTrigger } from "@/src/lib/gsap";
import { getLenis } from "@/src/components/smooth-scroll";
import { EASE_CURTAIN } from "@/src/lib/easing";
import { DrawLine } from "@/src/components/draw-line";

const overlayVariants: Variants = {
  initial: { scaleY: 1 },
  animate: {
    scaleY: 0,
    transition: { duration: 1.2, delay: 0.15, ease: EASE_CURTAIN },
  },
};

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[100] origin-bottom will-change-transform bg-background motion-reduce:hidden"
        initial="initial"
        animate="animate"
        variants={overlayVariants}
      />
      <DrawLine />
      {children}
    </>
  );
}
