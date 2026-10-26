import { Link } from 'react-router';
import { useSettings } from '../../context/SettingsContext.jsx';
import { assetUrl } from '../../services/api.js';
import { cn } from '../../utils/cn.js';

export function Logo({ light = false, className }) {
  const { settings } = useSettings();
  return (
    <Link to="/" className={cn('flex items-center gap-2.5', className)} aria-label={`${settings.businessName} — home`}>
      {settings.logoUrl ? (
        <img src={assetUrl(settings.logoUrl)} alt="" className="h-10 w-auto" />
      ) : (
        <svg viewBox="0 0 64 64" className="size-10 shrink-0" aria-hidden="true">
          <rect width="64" height="64" rx="14" fill={light ? '#ffffff' : '#101d33'} />
          <rect x="14" y="14" width="30" height="14" rx="4" fill="#e8772e" />
          <path d="M44 21h6v12H32v8" fill="none" stroke={light ? '#101d33' : '#f5efe5'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="28" y="40" width="8" height="12" rx="2.5" fill={light ? '#101d33' : '#f5efe5'} />
        </svg>
      )}
      <span className={cn('font-display text-lg leading-tight font-semibold', light ? 'text-white' : 'text-navy-900')}>
        {settings.businessName}
      </span>
    </Link>
  );
}
