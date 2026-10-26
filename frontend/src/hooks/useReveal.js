import { useEffect, useRef } from 'react';

/** Fades an element in when it scrolls into view. No-op with reduced motion. */
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    // Skip elements already on screen at mount so above-the-fold content never flashes.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return undefined;

    el.classList.add('reveal-ready');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}
