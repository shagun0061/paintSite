import { useReveal } from '../../hooks/useReveal.js';

/** Wrapper that fades its content in on scroll (respects reduced motion). */
export function Reveal({ as: Tag = 'div', delay = 0, style, ...props }) {
  const ref = useReveal();
  return <Tag ref={ref} style={delay ? { transitionDelay: `${delay}ms`, ...style } : style} {...props} />;
}
