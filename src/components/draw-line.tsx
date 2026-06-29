"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/src/lib/gsap";
import { useGSAP } from "@gsap/react";

// Three summed sine layers at different (fixed, pixel-based) wavelengths —
// a broad sway, a medium wobble, and fine texture — read together as an
// organic, hand-drawn wander rather than a single mechanical wave.
function wobbleAt(y: number, baseX: number, amplitude: number) {
  return (
    baseX +
    Math.sin(y / 600 + 0.4) * amplitude +
    Math.sin(y / 200 + 1.7) * amplitude * 0.5 +
    Math.sin(y / 55 + 0.9) * amplitude * 0.24
  );
}

// A small pen "flourish" — sweeps past a full revolution (so it crosses its
// own earlier path once) while drifting slightly downward, centered on a
// fixed, safe x so it never inherits whatever the wobble was doing right
// before it. Returns points only (no entry/exit blending — callers splice
// a short straight easing zone around it).
function loopPoints(centerX: number, startY: number, radius: number) {
  const steps = 32;
  const pts: { x: number; y: number }[] = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const angle = -Math.PI / 2 + t * Math.PI * 2.2;
    const x = centerX + radius * Math.cos(angle);
    const y = startY + radius * (Math.sin(angle) + 1) + t * radius * 0.5;
    pts.push({ x, y });
  }
  return pts;
}

function buildOrganicPath(
  height: number,
  baseX: number,
  amplitude: number,
  loopCenterX: number,
  loopRadius: number
) {
  const step = 20;
  const easeSpan = 70; // px of straight-line blend in/out around each loop

  // Place 0, 1, or 2 loops depending on how much page there is to work with,
  // each comfortably clear of the very top/bottom.
  const loopYs: number[] =
    height < 900 ? [] : height < 3200 ? [height * 0.45] : [height * 0.26, height * 0.68];

  const loops = loopYs.map((y) => ({
    enterY: y - easeSpan,
    exitY: y + loopRadius * 2.4 + easeSpan,
    points: loopPoints(loopCenterX, y, loopRadius),
    rawStartY: y,
  }));

  function offsetAt(y: number) {
    return wobbleAt(y, baseX, amplitude);
  }

  const points: string[] = [`M${offsetAt(0).toFixed(1)},0`];
  let y = step;
  while (y < height) {
    const activeLoop = loops.find((l) => y >= l.enterY && y <= l.exitY);
    if (activeLoop) {
      // Ease from the wobble onto the loop's fixed center, trace the loop,
      // then ease back onto the wobble — avoids a hard jump either side.
      const enterWobble = offsetAt(activeLoop.enterY);
      points.push(`L${enterWobble.toFixed(1)},${activeLoop.enterY.toFixed(1)}`);
      points.push(`L${loopCenterX.toFixed(1)},${activeLoop.rawStartY.toFixed(1)}`);
      activeLoop.points.forEach((p) => points.push(`L${p.x.toFixed(1)},${p.y.toFixed(1)}`));
      const exitWobble = offsetAt(activeLoop.exitY);
      points.push(`L${exitWobble.toFixed(1)},${activeLoop.exitY.toFixed(1)}`);
      y = activeLoop.exitY + step;
      continue;
    }
    points.push(`L${offsetAt(y).toFixed(1)},${y.toFixed(1)}`);
    y += step;
  }
  points.push(`L${offsetAt(height).toFixed(1)},${height}`);
  return points.join(" ");
}

export function DrawLine() {
  const pathRef = useRef<SVGPathElement>(null);
  const [layout, setLayout] = useState<{ d: string; width: number; height: number } | null>(
    null
  );

  useEffect(() => {
    let lastHeight = 0;
    let lastWidth = 0;

    function measure() {
      const width = window.innerWidth;
      const height = document.documentElement.scrollHeight;
      if (Math.abs(height - lastHeight) < 4 && Math.abs(width - lastWidth) < 4) return;
      lastHeight = height;
      lastWidth = width;

      // Amplitude (and the loop's center/radius) are tuned so the worst-case
      // reach stays clear of where text content starts on the widest
      // (desktop) and narrowest (mobile) containers on this site.
      const isMobile = width < 768;
      const baseX = isMobile ? 9 : 38;
      const amplitude = isMobile ? 6 : 24;
      const loopCenterX = isMobile ? 9 : 38;
      const loopRadius = isMobile ? 7 : 26;
      setLayout({
        d: buildOrganicPath(height, baseX, amplitude, loopCenterX, loopRadius),
        width,
        height,
      });
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!layout || !pathRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          pathRef.current,
          { drawSVG: "0% 8%" },
          {
            drawSVG: "0% 100%",
            ease: "none",
            scrollTrigger: {
              trigger: document.body,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.2,
            },
          }
        );
        ScrollTrigger.refresh();
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(pathRef.current, { drawSVG: "0% 100%" });
      });

      return () => mm.revert();
    },
    // revertOnUpdate: @gsap/react only auto-reverts on unmount by default
    // when a dependency array is supplied — without this, a re-measure
    // (e.g. late font load shifting height) would pile up a duplicate
    // ScrollTrigger/tween on the same path instead of replacing it.
    { dependencies: [layout], revertOnUpdate: true }
  );

  if (!layout) return null;

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-20 w-full mix-blend-multiply"
      style={{ height: layout.height }}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        ref={pathRef}
        d={layout.d}
        stroke="var(--color-fg)"
        strokeOpacity={0.32}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
