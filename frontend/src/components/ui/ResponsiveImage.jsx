import { assetUrl } from '../../services/api.js';
import { cn } from '../../utils/cn.js';

/**
 * Renders an image record `{ url, alt, width, height, variants[] }` with a
 * srcset so browsers download the smallest suitable file. Uploaded images are
 * WebP; Unsplash URLs use `auto=format` to get AVIF/WebP where supported.
 */
export function ResponsiveImage({ image, alt, sizes = '100vw', priority = false, className, ...rest }) {
  if (!image?.url) return <div className={cn('bg-beige-200', className)} aria-hidden="true" />;

  const variants = image.variants?.length ? [...image.variants].sort((a, b) => a.width - b.width) : null;
  const srcSet = variants?.map((v) => `${assetUrl(v.url)} ${v.width}w`).join(', ');
  const fallback = variants ? variants[Math.min(1, variants.length - 1)].url : image.url;

  return (
    <img
      src={assetUrl(fallback)}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt ?? image.alt ?? ''}
      width={image.width}
      height={image.height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={className}
      {...rest}
    />
  );
}
