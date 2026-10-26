import { LoaderCircle } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '../../utils/cn.js';

const VARIANTS = {
  primary: 'bg-accent-600 text-white shadow-sm hover:bg-accent-700',
  navy: 'bg-navy-900 text-white hover:bg-navy-800',
  outline: 'border border-navy-200 bg-white text-navy-900 hover:border-navy-400 hover:bg-navy-50',
  light: 'bg-white text-navy-900 shadow-sm hover:bg-beige-100',
  outlineLight: 'border border-white/50 text-white hover:border-white hover:bg-white/10',
  whatsapp: 'bg-whatsapp-dark text-white shadow-sm hover:bg-whatsapp-darker',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'text-navy-700 hover:bg-navy-50',
};

const SIZES = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-[15px] gap-2',
  lg: 'h-13 px-7 text-base gap-2.5',
};

/**
 * One button style for links (`to`), external links (`href`) and buttons.
 * `external` opens in a new tab with safe rel attributes.
 */
export function Button({
  to,
  href,
  external,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  className,
  children,
  type = 'button',
  ...props
}) {
  const classes = cn(
    'inline-flex shrink-0 items-center justify-center rounded-full font-semibold whitespace-nowrap transition-colors duration-200 select-none disabled:cursor-not-allowed disabled:opacity-60',
    VARIANTS[variant],
    SIZES[size],
    className,
  );
  const content = (
    <>
      {loading ? (
        <LoaderCircle className="size-[1.15em] animate-spin" aria-hidden="true" />
      ) : (
        Icon && <Icon className="size-[1.15em]" aria-hidden="true" />
      )}
      {children}
      {IconRight && <IconRight className="size-[1.1em] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cn('group', classes)} {...props}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        className={cn('group', classes)}
        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
        {...props}
      >
        {content}
      </a>
    );
  }
  return (
    // eslint-disable-next-line react/button-has-type
    <button type={type} className={classes} disabled={loading || props.disabled} aria-busy={loading || undefined} {...props}>
      {content}
    </button>
  );
}
