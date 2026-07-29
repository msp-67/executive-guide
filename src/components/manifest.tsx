"use client";

import { useRef, useSyncExternalStore } from "react";
import { gsap, SplitText } from "@/src/lib/gsap";
import { useGSAP } from "@gsap/react";

const TEXT_PHASE_VH = 130;

function getIsEligible() {
  return (
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches &&
    window.matchMedia("(min-width: 768px)").matches
  );
}

function subscribe(callback: () => void) {
  const motionQuery = window.matchMedia("(prefers-reduced-motion: no-preference)");
  const widthQuery = window.matchMedia("(min-width: 768px)");
  motionQuery.addEventListener("change", callback);
  widthQuery.addEventListener("change", callback);
  return () => {
    motionQuery.removeEventListener("change", callback);
    widthQuery.removeEventListener("change", callback);
  };
}

function getServerSnapshot() {
  return false;
}

function StaticManifest({ body }: { body: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".manifest-static-item", {
          opacity: 0,
          y: 24,
          duration: 1,
          ease: "easeReveal",
          scrollTrigger: { trigger: containerRef.current, start: "top 75%" },
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
      <p className="manifest-static-item text-2xl leading-relaxed text-foreground/90 sm:text-3xl">
        {body}
      </p>
    </div>
  );
}

function PinnedManifest({ body }: { body: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const split = new SplitText(textRef.current, {
        type: "lines",
        linesClass: "manifest-line",
        autoSplit: true,
      });

      gsap.fromTo(
        split.lines,
        { opacity: 0, y: 24, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        }
      );

      return () => split.revert();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      <div className="relative" style={{ height: `${TEXT_PHASE_VH}vh` }}>
        <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-visible bg-background">
          <section ref={sectionRef} className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
            <p
              ref={textRef}
              className="text-2xl leading-relaxed text-foreground/90 sm:text-3xl"
            >
              {body}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export function Manifest({ body }: { body: string }) {
  const canAnimate = useSyncExternalStore(subscribe, getIsEligible, getServerSnapshot);

  if (!canAnimate) {
    return <StaticManifest body={body} />;
  }

  return <PinnedManifest body={body} />;
}
