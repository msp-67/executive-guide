import Image from "next/image";
import { PORTRAITS, type PortraitKey } from "@/src/lib/portraits";

const ICON_SIZE: Record<"lg" | "md" | "sm", string> = {
  lg: "h-14 w-14",
  md: "h-11 w-11",
  sm: "h-8 w-8",
};

const MONOGRAM_SIZE: Record<"lg" | "md" | "sm", string> = {
  lg: "text-2xl",
  md: "text-xl",
  sm: "text-base",
};

export function Portrait({
  k,
  alt,
  className = "",
  size = "md",
  priority = false,
  sizes = "(min-width: 1024px) 33vw, 90vw",
}: {
  k: PortraitKey;
  alt: string;
  className?: string;
  size?: "lg" | "md" | "sm";
  priority?: boolean;
  sizes?: string;
}) {
  const { src, aspectRatio } = PORTRAITS[k];

  return (
    <div
      role={src ? undefined : "img"}
      aria-label={src ? undefined : alt}
      className={`glass relative overflow-hidden rounded-2xl border border-white/55 ${className}`}
      style={{ aspectRatio }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <>
          <div aria-hidden className="portrait-placeholder-tint absolute inset-0" />
          <div
            aria-hidden
            className="relative flex h-full w-full flex-col items-center justify-center gap-3"
          >
            <svg viewBox="0 0 100 100" fill="none" className={`${ICON_SIZE[size]} text-accent-navy/35`}>
              <circle cx="50" cy="38" r="16" stroke="currentColor" strokeWidth="2" />
              <path
                d="M22 86c0-18 12-30 28-30s28 12 28 30"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span
              className={`font-serif tracking-[0.15em] text-foreground/25 ${MONOGRAM_SIZE[size]}`}
            >
              JS
            </span>
          </div>
        </>
      )}
    </div>
  );
}
