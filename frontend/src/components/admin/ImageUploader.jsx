import { ArrowLeft, ArrowRight, ImagePlus, Trash2 } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { admin } from '../../services/endpoints.js';
import { cn } from '../../utils/cn.js';
import { ResponsiveImage } from '../ui/ResponsiveImage.jsx';
import { useToast } from './Toast.jsx';

const ACCEPT = 'image/jpeg,image/png,image/webp';
const MAX_MB = 5;

/**
 * Uploads images to the API (which validates, strips metadata and creates
 * WebP variants) and manages the resulting list: alt text, order, removal.
 * Removed images are deleted from disk by the server when the form is saved.
 */
export function ImageUploader({ label, value = [], onChange, max = 1, folder = 'projects', error, hint, required }) {
  const inputId = useId();
  const inputRef = useRef(null);
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const images = value.filter(Boolean);
  const remaining = max - images.length;

  async function onFiles(e) {
    const files = [...e.target.files].slice(0, remaining);
    e.target.value = '';
    if (!files.length) return;
    const tooBig = files.find((f) => f.size > MAX_MB * 1024 * 1024);
    if (tooBig) {
      toast(`"${tooBig.name}" is larger than ${MAX_MB} MB.`, 'error');
      return;
    }
    setUploading(true);
    try {
      const { images: uploaded } = await admin.uploadImages(files, folder);
      onChange([...images, ...uploaded]);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setUploading(false);
    }
  }

  const update = (i, patch) => onChange(images.map((img, j) => (j === i ? { ...img, ...patch } : img)));
  const remove = (i) => onChange(images.filter((_, j) => j !== i));
  const move = (i, d) => {
    const next = [...images];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };

  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-navy-800">
        {label}
        {required && <span className="text-accent-600"> *</span>}
        {max > 1 && <span className="font-normal text-navy-400"> ({images.length}/{max})</span>}
      </p>
      <ul className={cn('grid gap-3', max > 1 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'max-w-xs')}>
        {images.map((img, i) => (
          <li key={img.url} className="overflow-hidden rounded-xl border border-navy-100 bg-white">
            <div className="relative aspect-[4/3] bg-beige-100">
              <ResponsiveImage image={img} sizes="240px" className="size-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-1">
                {max > 1 && i > 0 && (
                  <button type="button" onClick={() => move(i, -1)} className="rounded-md bg-white/90 p-1.5 text-navy-800 hover:bg-white" title="Move earlier">
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    <span className="sr-only">Move image {i + 1} earlier</span>
                  </button>
                )}
                {max > 1 && i < images.length - 1 && (
                  <button type="button" onClick={() => move(i, 1)} className="rounded-md bg-white/90 p-1.5 text-navy-800 hover:bg-white" title="Move later">
                    <ArrowRight className="size-4" aria-hidden="true" />
                    <span className="sr-only">Move image {i + 1} later</span>
                  </button>
                )}
                <button type="button" onClick={() => remove(i)} className="rounded-md bg-white/90 p-1.5 text-red-600 hover:bg-white" title="Remove">
                  <Trash2 className="size-4" aria-hidden="true" />
                  <span className="sr-only">Remove image {i + 1}</span>
                </button>
              </div>
            </div>
            <label className="block p-2">
              <span className="sr-only">Alt text for image {i + 1}</span>
              <input
                className="w-full rounded-md border border-navy-100 px-2 py-1.5 text-xs focus:border-navy-400 focus:outline-none"
                placeholder="Describe the photo (alt text)"
                maxLength={200}
                value={img.alt || ''}
                onChange={(e) => update(i, { alt: e.target.value })}
              />
            </label>
          </li>
        ))}
        {remaining > 0 && (
          <li>
            <label
              htmlFor={inputId}
              className={cn(
                'flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center text-sm transition-colors has-focus-visible:outline-2 has-focus-visible:outline-accent-500',
                error ? 'border-red-300 bg-red-50 text-red-700' : 'border-navy-200 text-navy-500 hover:border-accent-400 hover:bg-accent-50 hover:text-accent-700',
                uploading && 'pointer-events-none opacity-60',
              )}
            >
              <ImagePlus className="size-7" aria-hidden="true" />
              <span className="font-semibold">{uploading ? 'Uploading…' : max > 1 ? 'Add photos' : 'Upload photo'}</span>
              <span className="text-xs">JPG, PNG or WebP · max {MAX_MB} MB</span>
              <input
                ref={inputRef}
                id={inputId}
                type="file"
                accept={ACCEPT}
                multiple={remaining > 1}
                onChange={onFiles}
                className="sr-only"
                disabled={uploading}
              />
            </label>
          </li>
        )}
      </ul>
      {error ? <p className="mt-1.5 text-sm text-red-600">{error}</p> : hint && <p className="mt-1.5 text-xs text-navy-500">{hint}</p>}
    </div>
  );
}
