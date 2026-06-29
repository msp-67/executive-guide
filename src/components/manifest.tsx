"use client";

import Image from "next/image";
import { useRef, useSyncExternalStore } from "react";
import { gsap, SplitText } from "@/src/lib/gsap";
import { useGSAP } from "@gsap/react";

// Two independent pinned stages: the logo gets its own short, dignified
// entrance → hold → exit, then — fully out of the way — the text gets its
// own stage with its own (unchanged) reveal tempo and reading hold.
const LOGO_PHASE_VH = 150;
const TEXT_PHASE_VH = 170;

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
          stagger: 0.2,
          scrollTrigger: { trigger: containerRef.current, start: "top 75%" },
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
      <div className="manifest-static-item flex justify-center">
        <Image
          src="/lotus-mark.png"
          alt="Executive Guide"
          width={64}
          height={64}
          className="h-14 w-14 sm:h-16 sm:w-16"
        />
      </div>
      <p className="manifest-static-item mt-10 text-2xl leading-relaxed text-foreground/90 sm:text-3xl">
        {body}
      </p>
    </div>
  );
}

function PinnedManifest({ body }: { body: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoOuterRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      // Phase A — entrance, a brief held beat, then exit, all driven by the
      // logo stage's own pinned scroll range ("top top" to "bottom bottom" is
      // exactly the window during which CSS sticky holds it in place).
      gsap
        .timeline({
          scrollTrigger: {
            trigger: logoOuterRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        })
        .fromTo(
          logoRef.current,
          { opacity: 0, scale: 0.85, filter: "blur(8px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", ease: "none", duration: 0.25 },
          0
        )
        .to(
          logoRef.current,
          { opacity: 0, scale: 0.9, filter: "blur(6px)", ease: "none", duration: 0.25 },
          0.7
        );

      // Phase B — text reveal, unchanged: same trigger config, same scrub,
      // same stagger as before. Its scroll distance depends only on the
      // section's own height, not on what sits above it, so moving the logo
      // into its own separate stage doesn't change this tempo at all.
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
      <div ref={logoOuterRef} className="relative" style={{ height: `${LOGO_PHASE_VH}vh` }}>
        <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-visible bg-background">
          <div ref={logoRef}>
            <Image
              src="/lotus-mark.png"
              alt="Executive Guide"
              width={64}
              height={64}
              className="h-14 w-14 sm:h-16 sm:w-16"
            />
          </div>
        </div>
      </div>

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
