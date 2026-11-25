export type ImageFitMode = 'cover' | 'contain';

export interface ImageTransformConfig {
  fit: ImageFitMode;
  posX: number; // 0..100 percentage
  posY: number; // 0..100 percentage
  scale: number; // 1..2.5 zoom multiplier
}

export interface ManagedMediaValue {
  src: string | null;
  transform: ImageTransformConfig;
}

export const DEFAULT_IMAGE_TRANSFORM: ImageTransformConfig = {
  fit: 'cover',
  posX: 50,
  posY: 50,
  scale: 1,
};

export function normalizeImageTransform(
  input?: Partial<ImageTransformConfig> | null,
): ImageTransformConfig {
  const fit: ImageFitMode = input?.fit === 'contain' ? 'contain' : 'cover';
  const rawX = typeof input?.posX === 'number' && Number.isFinite(input.posX) ? input.posX : 50;
  const rawY = typeof input?.posY === 'number' && Number.isFinite(input.posY) ? input.posY : 50;
  const rawScale =
    typeof input?.scale === 'number' && Number.isFinite(input.scale) ? input.scale : 1;

  return {
    fit,
    posX: Math.min(100, Math.max(0, Math.round(rawX))),
    posY: Math.min(100, Math.max(0, Math.round(rawY))),
    scale: Math.min(2.5, Math.max(1, Number(rawScale.toFixed(2)))),
  };
}

export function createManagedMedia(
  src?: string | null,
  transform?: Partial<ImageTransformConfig> | null,
): ManagedMediaValue {
  return {
    src: src?.trim() || null,
    transform: normalizeImageTransform(transform),
  };
}
