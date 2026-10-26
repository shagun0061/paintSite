import { ChevronsLeftRight } from 'lucide-react';
import { useId, useState } from 'react';
import { ResponsiveImage } from './ui/ResponsiveImage.jsx';

/** Drag (or use arrow keys on) the slider to compare before and after photos. */
export function BeforeAfter({ before, after, title }) {
  const [pos, setPos] = useState(50);
  const id = useId();

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-beige-100 select-none sm:aspect-[16/10]">
      <ResponsiveImage image={after} alt={after.alt || `${title} — after`} sizes="(min-width: 1024px) 66vw, 100vw" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <ResponsiveImage image={before} alt={before.alt || `${title} — before`} sizes="(min-width: 1024px) 66vw, 100vw" className="size-full object-cover" />
      </div>

      <span className="absolute top-4 left-4 rounded-full bg-navy-950/80 px-3 py-1 text-xs font-bold tracking-wider text-white uppercase">Before</span>
      <span className="absolute top-4 right-4 rounded-full bg-accent-600 px-3 py-1 text-xs font-bold tracking-wider text-white uppercase">After</span>

      <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.1)]" style={{ left: `${pos}%` }} aria-hidden="true">
        <span className="absolute top-1/2 left-1/2 inline-flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy-900 shadow-lift">
          <ChevronsLeftRight className="size-5" />
        </span>
      </div>

      <label htmlFor={id} className="sr-only">
        Compare before and after: slide to reveal more of the before photo
      </label>
      <input
        id={id}
        type="range"
        min="0"
        max="100"
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-valuetext={`${pos}% before`}
        className="absolute inset-0 size-full cursor-ew-resize opacity-0 focus-visible:opacity-0"
      />
    </div>
  );
}
