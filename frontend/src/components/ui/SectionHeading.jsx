import { cn } from '../../utils/cn.js';

export function SectionHeading({ eyebrow, title, description, align = 'left', as: Tag = 'h2', light = false, className, children }) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <p className={cn('eyebrow mb-3', light && 'text-accent-300')}>{eyebrow}</p>}
      <Tag className={cn('text-3xl font-semibold sm:text-4xl', light ? 'text-white' : 'text-navy-900')}>{title}</Tag>
      {description && (
        <p className={cn('mt-4 text-base leading-relaxed sm:text-lg', light ? 'text-navy-100' : 'text-navy-600')}>{description}</p>
      )}
      {children}
    </div>
  );
}
