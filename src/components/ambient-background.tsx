"use client";

import { useRef } from "react";
import { gsap } from "@/src/lib/gsap";
import { useGSAP } from "@gsap/react";

// Each line: a base shape, a very close "drift" shape to morph slowly toward
// and back (layer 2 — ambient), plus its own scroll-reactive wavelength/phase
// so the three lines never move in lockstep (layer 1 — scroll-reactive).
const LINES = [
  {
    base: "M -100,300 C 300,120 700,480 1100,220 S 1750,420 2000,160",
    drift: "M -100,282 C 322,158 682,438 1118,258 S 1732,382 2000,198",
    color: "var(--color-accent-navy)",
    opacity: 0.16,
    driftDuration: 42,
    wavelength: 1300,
    phase: 0,
    yAmp: 14,
    rotAmp: 0.5,
  },
  {
    base: "M -100,620 C 420,820 820,460 1300,700 S 1950,560 2150,760",
    drift: "M -100,602 C 438,782 802,498 1318,662 S 1932,598 2150,722",
    color: "var(--color-accent-teal)",
    opacity: 0.14,
    driftDuration: 55,
    wavelength: 1550,
    phase: 2.1,
    yAmp: 11,
    rotAmp: 0.4,
  },
  {
    base: "M -100,120 C 500,300 900,40 1420,260 S 2050,140 2250,300",
    drift: "M -100,138 C 518,262 882,78 1438,298 S 2032,178 2250,262",
    color: "var(--color-accent-green)",
    opacity: 0.12,
    driftDuration: 48,
    wavelength: 1420,
    phase: 4.2,
    yAmp: 12,
    rotAmp: 0.45,
  },
] as const;

// Time constant (seconds) for the scroll damping — a manual, frame-rate
// independent stand-in for "scrub with a bit of lag", same technique used
// for the quadrant cards elsewhere on the site.
const SCROLL_SMOOTH_TIME = 1.1;

export function AmbientBackground() {
  const groupRefs = useRef<(SVGGElement | null)[]>([]);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
      // Layer 2 — ambient drift: an extremely slow, asynchronous morph
      // between two nearly-identical shapes per line. "Quiet breathing",
      // not a visible redraw.
      const driftTweens = LINES.map((line, i) =>
        gsap.to(pathRefs.current[i], {
          morphSVG: line.drift,
          duration: line.driftDuration,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      );

      // Layer 1 — scroll-reactive: each line's group gets a slow sine-driven
      // shift + tilt based on a damped (lagged) scroll position, so the
      // environment subtly ripples as the page moves rather than jumping
      // 1:1 with the wheel.
      let smoothedScroll = window.scrollY;

      const tick = (_time: number, deltaMs: number) => {
        const dt = deltaMs / 1000;
        const factor = 1 - Math.exp(-dt / SCROLL_SMOOTH_TIME);
        smoothedScroll += (window.scrollY - smoothedScroll) * factor;

        LINES.forEach((line, i) => {
          const group = groupRefs.current[i];
          if (!group) return;
          const angle = (smoothedScroll / line.wavelength) * Math.PI * 2 + line.phase;
          gsap.set(group, {
            y: Math.sin(angle) * line.yAmp,
            rotation: Math.sin(angle * 0.7) * line.rotAmp,
          });
        });
      };

      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        driftTweens.forEach((tween) => tween.kill());
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div aria-hidden className="ambient-gradient fixed inset-0 -z-10 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {LINES.map((line, i) => (
          <g
            key={line.color}
            ref={(el) => {
              groupRefs.current[i] = el;
            }}
          >
            <path
              ref={(el) => {
                pathRefs.current[i] = el;
              }}
              d={line.base}
              stroke={line.color}
              strokeOpacity={line.opacity}
              strokeWidth={1.2}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
