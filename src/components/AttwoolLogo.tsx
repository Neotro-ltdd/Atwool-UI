import React from 'react';

interface AttwoolLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  subtitleText?: string;
}

export const AttwoolLogo: React.FC<AttwoolLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  subtitleText = 'Skills, Ethos & Excellence'
}) => {
  const sizeMap = {
    sm: { img: 'w-10 h-10', title: 'text-sm', sub: 'text-[10px]', gap: 'gap-2.5' },
    md: { img: 'w-12 h-12', title: 'text-base', sub: 'text-[11px]', gap: 'gap-3' },
    lg: { img: 'w-16 h-16', title: 'text-xl', sub: 'text-xs', gap: 'gap-3.5' },
    xl: { img: 'w-20 h-20', title: 'text-2xl', sub: 'text-sm', gap: 'gap-4' }
  }[size];

  return (
    <div className={`inline-flex items-center ${sizeMap.gap} select-none ${className}`}>
      <div className={`${sizeMap.img} rounded-xl bg-white p-1 flex items-center justify-center shadow-xs border border-slate-200/80 dark:border-white/10 shrink-0`}>
        <img
          src="/attwool-logo.jpg"
          alt="Attwool Schools Official Crest"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex flex-col min-w-0">
        <span className={`font-brand-serif font-bold text-slate-900 dark:text-white leading-tight ${sizeMap.title}`}>
          Attwool Schools
        </span>
        {showSubtitle && (
          <span className={`font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5 truncate ${sizeMap.sub}`}>
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};
