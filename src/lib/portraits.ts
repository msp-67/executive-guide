/**
 * Central registry of Jan Spáčil's portrait photos.
 *
 * TO ADD A REAL PHOTO:
 * 1. Export it as JPG/WEBP — portrait orientation for "about"/"home", a tighter
 *    square crop works for "contact". ~1600px on the long edge is plenty.
 * 2. Drop the file into `public/portraits/` (create the folder if it doesn't exist).
 * 3. Set the matching `src` below to its public path, e.g. "/portraits/about.jpg".
 *    Leave `src: null` to keep showing the elegant placeholder.
 * 4. If the real photo's crop differs from the `aspectRatio` below, either crop it
 *    to match or update the ratio here — this is what reserves the layout space,
 *    so keeping it accurate avoids any shift when the photo is swapped in.
 */
export const PORTRAITS = {
  about: { src: null as string | null, aspectRatio: "4 / 5" },
  home: { src: null as string | null, aspectRatio: "4 / 5" },
  contact: { src: null as string | null, aspectRatio: "1 / 1" },
} satisfies Record<string, { src: string | null; aspectRatio: string }>;

export type PortraitKey = keyof typeof PORTRAITS;
