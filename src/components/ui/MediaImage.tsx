import { useEffect, useState, type CSSProperties } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { DEFAULT_IMAGE_TRANSFORM, type ImageTransformConfig } from '@/src/types/media';
import { cn } from '@/src/utils/cn';

export function buildMediaTransformStyle(
  transform?: Partial<ImageTransformConfig> | null,
): CSSProperties {
  const fit = transform?.fit === 'contain' ? 'contain' : 'cover';
  const posX = typeof transform?.posX === 'number' ? transform.posX : DEFAULT_IMAGE_TRANSFORM.posX;
  const posY = typeof transform?.posY === 'number' ? transform.posY : DEFAULT_IMAGE_TRANSFORM.posY;
  const scale =
    typeof transform?.scale === 'number' ? transform.scale : DEFAULT_IMAGE_TRANSFORM.scale;

  return {
    objectFit: fit,
    objectPosition: `${posX}% ${posY}%`,
    transform: `scale(${scale})`,
    transformOrigin: `${posX}% ${posY}%`,
  };
}

export interface MediaImageProps {
  src?: string | null;
  alt: string;
  fallbackLabel?: string;
  className?: string;
  imgClassName?: string;
  transform?: Partial<ImageTransformConfig> | null;
  priority?: boolean;
}

export function MediaImage({
  src,
  alt,
  fallbackLabel = 'Academy Visual',
  className,
  imgClassName,
  transform,
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
        style={buildMediaTransformStyle(transform)}
        className={cn('h-full w-full transition-transform duration-150 ease-out', imgClassName)}
      />
    </div>
  );
}
