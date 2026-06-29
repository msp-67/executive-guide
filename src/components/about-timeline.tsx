"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/src/lib/gsap";
import { useGSAP } from "@gsap/react";
import { AccentMark } from "@/src/components/accent-mark";
import { Portrait } from "@/src/components/portrait";

type Milestone = { title: string; body: string };

type Layout = {
  d: string;
  width: number;
  height: number;
  nodeXs: number[];
  nodeYs: number[];
  lotusY: number;
  lotusX: number;
};

function wobbleAt(y: number, baseX: number, amplitude: number) {
  return baseX + Math.sin(y / 380 + 0.6) * amplitude + Math.sin(y / 140 + 1.2) * amplitude * 0.4;
}

function buildPath(
  height: number,
  baseX: number,
  amplitude: number,
  bumpAmount: number,
  nodeYs: number[]
) {
  const step = 12;
  const bumpRadius = 60;
  const points: string[] = [];
  for (let y = 0; y <= height; y += step) {
    let x = wobbleAt(y, baseX, amplitude);
    for (const ny of nodeYs) {
      const dist = Math.abs(y - ny);
      if (dist < bumpRadius) {
        const t = 1 - dist / bumpRadius;
        x += Math.pow(Math.sin((t * Math.PI) / 2), 1.5) * bumpAmount;
      }
    }
    points.push(`${y === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(" ");
}

export function AboutTimeline({
  heading,
  intro,
  milestones,
  portraitAlt,
}: {
  heading: string;
  intro: string;
  milestones: Milestone[];
  portraitAlt: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const lotusRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);

  useEffect(() => {
    function measure() {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const width = container.clientWidth;

      const nodeYs = milestoneRefs.current.map((el) => {
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return r.top - containerRect.top + r.height / 2;
      });
      const lastNode = milestoneRefs.current[milestoneRefs.current.length - 1];
      const height = lastNode
        ? lastNode.getBoundingClientRect().bottom - containerRect.top + 110
        : containerRect.height;

      const isMobile = width < 640;
      const baseX = isMobile ? 9 : 22;
      const amplitude = isMobile ? 4 : 9;
      const bumpAmount = isMobile ? 9 : 20;

      const nodeXs = nodeYs.map((ny) => wobbleAt(ny, baseX, amplitude) + bumpAmount);
      const lotusY = height - 56;
      const lotusX = wobbleAt(lotusY, baseX, amplitude);

      setLayout({
        d: buildPath(height, baseX, amplitude, bumpAmount, nodeYs),
        width,
        height,
        nodeXs,
        nodeYs,
        lotusY,
        lotusX,
      });
    }

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [milestones.length]);

  useGSAP(
    () => {
      if (!layout || !pathRef.current || !lotusRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Draw-on for most of the section, then the line dissolves while
        // the lotus appears in its place — a crossfade, not a path morph.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 70%",
              end: "bottom 65%",
              scrub: 1.2,
            },
          })
          .fromTo(
            pathRef.current,
            { drawSVG: "0%" },
            { drawSVG: "100%", ease: "none", duration: 0.78 },
            0
          )
          .to(pathRef.current, { opacity: 0, ease: "none", duration: 0.18 }, 0.78)
          .fromTo(
            lotusRef.current,
            { opacity: 0, scale: 0.85, filter: "blur(8px)" },
            { opacity: 1, scale: 1, filter: "blur(0px)", ease: "none", duration: 0.2 },
            0.8
          );

        milestoneRefs.current.forEach((el) => {
          if (!el) return;
          gsap.from(el, {
            opacity: 0,
            y: 24,
            duration: 0.9,
            ease: "easeReveal",
            scrollTrigger: { trigger: el, start: "top 82%", end: "top 55%", scrub: 0.6 },
          });
        });

        ScrollTrigger.refresh();
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(pathRef.current, { drawSVG: "100%", opacity: 1 });
        gsap.set(lotusRef.current, { opacity: 1, scale: 1, filter: "blur(0px)" });
      });

      return () => mm.revert();
    },
    // revertOnUpdate is required here: @gsap/react only auto-reverts on
    // unmount by default when a dependency array is supplied, so without
    // this, every re-measure (layout changing) would pile up duplicate
    // ScrollTriggers on the same elements instead of replacing them.
    { dependencies: [layout], scope: containerRef, revertOnUpdate: true }
  );

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <div className="mb-12 flex justify-center sm:mb-16">
        <Portrait k="about" alt={portraitAlt} size="lg" className="w-36 sm:w-44" />
      </div>

      <h2 className="flex items-center gap-2.5 text-sm uppercase tracking-[0.2em] text-foreground/40">
        <AccentMark accent="navy" />
        {heading}
      </h2>
      <p className="mt-4 max-w-xl text-foreground/80">{intro}</p>

      <div ref={containerRef} className="relative mt-12">
        {layout && (
          <svg
            aria-hidden
            className="pointer-events-none absolute left-0 top-0"
            width={layout.width}
            height={layout.height}
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            fill="none"
          >
            <path
              ref={pathRef}
              d={layout.d}
              stroke="var(--color-fg)"
              strokeOpacity={0.35}
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {layout.nodeXs.map((x, i) => (
              <circle
                key={i}
                cx={x}
                cy={layout.nodeYs[i]}
                r={3.5}
                fill="var(--color-fg)"
                fillOpacity={0.4}
              />
            ))}
          </svg>
        )}

        <div className="space-y-16 pl-12 sm:pl-16">
          {milestones.map((m, i) => (
            <div
              key={m.title}
              ref={(el) => {
                milestoneRefs.current[i] = el;
              }}
            >
              <h3 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                {m.title}
              </h3>
              <p className="mt-2 text-foreground/70">{m.body}</p>
            </div>
          ))}
        </div>

        {layout && (
          <div
            ref={lotusRef}
            aria-hidden
            className="pointer-events-none absolute opacity-0"
            style={{ left: layout.lotusX - 28, top: layout.lotusY - 28 }}
          >
            <Image src="/lotus-mark.png" alt="" width={56} height={56} className="h-14 w-14" />
          </div>
        )}
      </div>
    </section>
  );
}
