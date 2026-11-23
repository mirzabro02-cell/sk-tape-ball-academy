import { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/src/utils/cn';

export interface MediaImageProps {
  src?: string | null;
  alt: string;
  fallbackLabel?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

export function MediaImage({
  src,
  alt,
  fallbackLabel = 'Cricket Visual Placeholder',
  className,
  imgClassName,
  priority = false,
}: MediaImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#071A36] via-[#0b254b] to-[#050D1B] p-6 text-center text-white/80',
          className,
        )}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D9A52E]/40 bg-[#050D1B]/70 text-[#D9A52E]">
          <ImageIcon className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="text-xs font-medium tracking-wide text-white/85">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden bg-[#071A36]', className)}>
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={cn('h-full w-full object-cover', imgClassName)}
      />
    </div>
  );
}
