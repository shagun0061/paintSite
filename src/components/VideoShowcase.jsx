import { Pause, Play } from 'lucide-react';
import { useRef, useState } from 'react';
import { VIDEOS } from '../data/videos.js';
import { cn } from '../utils/cn.js';
import { SectionHeading } from './ui/SectionHeading.jsx';

/**
 * One video card. Audio is disabled: the clip is always muted, there are no
 * native controls (so no volume button), and any attempt to unmute is undone.
 * Clicking anywhere on the card plays or pauses it.
 */
function VideoCard({ video }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  return (
    <li className="group card relative overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift has-focus-visible:ring-2 has-focus-visible:ring-accent-500">
      <div className="relative cursor-pointer" onClick={toggle} aria-hidden="true">
        <video
          ref={ref}
          className="aspect-[9/16] w-full bg-navy-900 object-cover"
          src={video.src}
          poster={video.poster}
          muted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noplaybackrate noremoteplayback"
          preload="none"
          tabIndex={-1}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false);
            setProgress(0);
          }}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration) setProgress(v.currentTime / v.duration);
          }}
          onVolumeChange={(e) => {
            if (!e.currentTarget.muted) e.currentTarget.muted = true;
          }}
        />
        <span
          className={cn(
            'pointer-events-none absolute inset-0 flex items-center justify-center transition duration-300',
            playing ? 'bg-transparent opacity-0 group-hover:opacity-100' : 'bg-navy-950/20 group-hover:bg-navy-950/30',
          )}
        >
          <span className="inline-flex size-16 items-center justify-center rounded-full bg-white/95 text-accent-600 shadow-lift transition-transform group-hover:scale-110">
            {playing ? <Pause className="size-7 fill-current" /> : <Play className="ml-1 size-7 fill-current" />}
          </span>
        </span>
        {/* Progress bar */}
        <span className="absolute inset-x-0 bottom-0 h-1 bg-white/25">
          <span className="block h-full bg-accent-500 transition-[width] duration-200" style={{ width: `${progress * 100}%` }} />
        </span>
      </div>
      <button type="button" onClick={toggle} className="flex w-full items-start justify-between gap-4 p-5 text-left focus-visible:outline-none">
        <span>
          <span className="block font-display text-lg font-semibold text-navy-900">{video.title}</span>
          {video.caption && <span className="mt-1.5 block leading-relaxed text-navy-600">{video.caption}</span>}
        </span>
        <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-600 transition group-hover:bg-accent-600 group-hover:text-white">
          {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="ml-0.5 size-4" aria-hidden="true" />}
          <span className="sr-only">{playing ? 'Pause' : 'Play'} {video.title}</span>
        </span>
      </button>
    </li>
  );
}

/** Grid of short portrait job videos. Nothing renders when the list is empty. */
export function VideoShowcase({ videos = VIDEOS }) {
  if (!videos.length) return null;
  return (
    <section className="section bg-beige-50" aria-labelledby="videos-heading">
      <div className="container-page">
        <SectionHeading
          eyebrow="On the job"
          title={<span id="videos-heading">Watch us at work</span>}
          description="A quick look at how we prepare, spray and finish every surface."
        />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <VideoCard key={v.src} video={v} />
          ))}
        </ul>
      </div>
    </section>
  );
}
