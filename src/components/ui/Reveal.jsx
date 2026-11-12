import { useReveal } from '../../hooks/useReveal.js';

/** Wrapper that fades its content in on scroll (respects reduced motion). variant: 'zoom' | 'left' | 'right' (default: up). */
export function Reveal({ as: Tag = 'div', delay = 0, variant, style, ...props }) {
  const ref = useReveal();
  return <Tag ref={ref} data-reveal={variant} style={delay ? { transitionDelay: `${delay}ms`, ...style } : style} {...props} />;
}
