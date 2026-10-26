/**
 * Image helpers. An image is `{ url, alt, width?, height?, variants? }`;
 * `variants` (`[{ width, url }]`) feed the responsive srcset.
 */

/** A free-to-use Unsplash photo (https://unsplash.com/license) in several widths. */
export const unsplash = (id, alt) => {
  const src = (w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;
  return { url: src(1600), alt, variants: [640, 1024, 1600, 2200].map((width) => ({ width, url: src(width) })) };
};

/**
 * Your own photo, placed in `frontend/public/images/…`.
 * Example: photo('/images/projects/kitchen-after.jpg', 'Kitchen after repainting')
 * Tip: resize photos to about 1600px wide and compress them before adding.
 */
export const photo = (url, alt) => ({ url, alt });
