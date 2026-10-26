import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Modal } from './ui/Modal.jsx';
import { ResponsiveImage } from './ui/ResponsiveImage.jsx';

/** Thumbnail grid that opens a keyboard-navigable lightbox. */
export function Gallery({ images, title }) {
  const [index, setIndex] = useState(null);
  const open = index !== null;
  const count = images.length;

  const go = useCallback((delta) => setIndex((i) => (i + delta + count) % count), [count]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go]);

  if (!count) return null;
  const current = open ? images[index] : null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {images.map((img, i) => (
          <li key={`${img.url}-${i}`} className={i === 0 && count > 2 ? 'col-span-2 row-span-2' : ''}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block size-full overflow-hidden rounded-xl bg-beige-100"
            >
              <ResponsiveImage
                image={img}
                sizes={i === 0 ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 50vw'}
                className="aspect-[4/3] size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span className="absolute right-3 bottom-3 inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-navy-900 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Expand className="size-4" aria-hidden="true" />
              </span>
              <span className="sr-only">
                View photo {i + 1} of {count}
                {img.alt ? `: ${img.alt}` : ''}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Modal open={open} onClose={() => setIndex(null)} title={`${title} photos`} hideHeader className="max-w-6xl" panelClassName="bg-navy-950 rounded-xl">
        {current && (
          <figure className="relative">
            <ResponsiveImage image={current} sizes="100vw" priority className="max-h-[80dvh] w-full object-contain" />
            <figcaption className="flex items-center justify-between gap-4 px-4 py-3 text-sm text-navy-100">
              <span className="truncate">{current.alt}</span>
              <span className="shrink-0" aria-live="polite">
                {index + 1} / {count}
              </span>
            </figcaption>
            <button type="button" onClick={() => setIndex(null)} className="absolute top-3 right-3 inline-flex size-10 items-center justify-center rounded-full bg-navy-950/70 text-white hover:bg-navy-950">
              <X className="size-5" aria-hidden="true" />
              <span className="sr-only">Close</span>
            </button>
            {count > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} className="absolute top-1/2 left-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-900 hover:bg-white">
                  <ChevronLeft className="size-6" aria-hidden="true" />
                  <span className="sr-only">Previous photo</span>
                </button>
                <button type="button" onClick={() => go(1)} className="absolute top-1/2 right-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-900 hover:bg-white">
                  <ChevronRight className="size-6" aria-hidden="true" />
                  <span className="sr-only">Next photo</span>
                </button>
              </>
            )}
          </figure>
        )}
      </Modal>
    </>
  );
}
