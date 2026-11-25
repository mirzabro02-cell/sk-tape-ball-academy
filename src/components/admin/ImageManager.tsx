import { useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Link2,
  Maximize2,
  Minimize2,
  RotateCcw,
  SlidersHorizontal,
  Trash2,
  Upload,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { isSupabaseConfigured, rawSupabase } from '@/src/services/supabaseClient';
import {
  DEFAULT_IMAGE_TRANSFORM,
  normalizeImageTransform,
  type ImageTransformConfig,
  type ManagedMediaValue,
} from '@/src/types/media';
import { sanitizeExternalUrl, validateImageFile } from '@/src/utils/validation';
import { MediaImage } from '@/src/components/ui/MediaImage';
import { cn } from '@/src/utils/cn';

export interface ImageManagerPresetAsset {
  label: string;
  src: string;
}

export interface ImageManagerProps {
  label: string;
  value: ManagedMediaValue;
  onChange: (next: ManagedMediaValue) => void;
  aspectRatio?: 'square' | '4/3' | '16/9';
  helperText?: string;
  allowRemove?: boolean;
  presetAssets?: ImageManagerPresetAsset[];
  storageFolder?: string;
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

async function compressForLocalPreview(file: File): Promise<string> {
  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Unable to read image file.'));
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });

  if (file.size <= 260 * 1024) {
    return rawDataUrl;
  }

  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 1400;
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const targetW = Math.max(1, Math.round(img.width * scale));
      const targetH = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(rawDataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, targetW, targetH);
      const outputMime = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
      const compressed = canvas.toDataURL(outputMime, 0.82);
      resolve(compressed.length < rawDataUrl.length ? compressed : rawDataUrl);
    };
    img.onerror = () => resolve(rawDataUrl);
    img.src = rawDataUrl;
  });
}

export function ImageManager({
  label,
  value,
  onChange,
  aspectRatio = '16/9',
  helperText,
  allowRemove = true,
  presetAssets,
  storageFolder = 'academy-media',
}: ImageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sourceMode, setSourceMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square max-w-[240px]'
      : aspectRatio === '4/3'
        ? 'aspect-[4/3] max-w-[340px]'
        : 'aspect-video max-w-[440px]';

  function updateTransform(patch: Partial<ImageTransformConfig>) {
    onChange({
      ...value,
      transform: normalizeImageTransform({
        ...value.transform,
        ...patch,
      }),
    });
  }

  async function handleFilePicked(file: File | undefined) {
    if (!file) return;
    setStatusError(null);
    setStatusNote(null);

    const validationError = validateImageFile(file);
    if (validationError) {
      setStatusError(validationError);
      return;
    }

    setIsBusy(true);
    try {
      if (isSupabaseConfigured && rawSupabase) {
        const cleanExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const objectPath = `${storageFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${cleanExt}`;
        const { error: uploadErr } = await rawSupabase.storage
          .from('academy-media')
          .upload(objectPath, file, { upsert: true, contentType: file.type });

        if (uploadErr) {
          setStatusError(
            `Supabase Storage upload failed: ${uploadErr.message}. Verify the "academy-media" bucket and admin upload policy exist, or apply an HTTPS Image URL instead.`,
          );
          return;
        }

        const { data: urlData } = rawSupabase.storage
          .from('academy-media')
          .getPublicUrl(objectPath);

        if (!urlData?.publicUrl) {
          setStatusError(
            'Upload completed, but no public URL was returned for the "academy-media" bucket.',
          );
          return;
        }

        onChange({
          src: urlData.publicUrl,
          transform: { ...DEFAULT_IMAGE_TRANSFORM, fit: value.transform.fit },
        });
        setStatusNote(`Uploaded "${file.name}" to Supabase Storage.`);
        return;
      }

      const optimizedDataUrl = await compressForLocalPreview(file);
      if (optimizedDataUrl.length > 900_000) {
        setStatusError(
          'Compressed image is still too large for browser-only localStorage (>900 KB). Use an Image URL or connect Supabase Storage.',
        );
        return;
      }

      onChange({
        src: optimizedDataUrl,
        transform: { ...DEFAULT_IMAGE_TRANSFORM, fit: value.transform.fit },
      });
      setStatusNote(`Loaded "${file.name}" into local preview.`);
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setIsBusy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  async function handleApplyUrl() {
    setStatusError(null);
    setStatusNote(null);
    const cleanUrl = sanitizeExternalUrl(urlInput);
    if (!cleanUrl) {
      setStatusError('Please enter a valid http:// or https:// image URL.');
      return;
    }

    setIsBusy(true);
    try {
      await new Promise<void>((resolve, reject) => {
        const probe = new Image();
        probe.referrerPolicy = 'no-referrer';
        probe.onload = () => resolve();
        probe.onerror = () => reject(new Error('Image URL could not be loaded. Check the link.'));
        probe.src = cleanUrl;
      });

      onChange({
        src: cleanUrl,
        transform: { ...DEFAULT_IMAGE_TRANSFORM, fit: value.transform.fit },
      });
      setUrlInput('');
      setStatusNote('Image URL applied.');
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : 'Unable to load image URL.');
    } finally {
      setIsBusy(false);
    }
  }

  function handleRemove() {
    setAdjustOpen(false);
    setStatusError(null);
    setStatusNote(null);
    onChange({
      src: null,
      transform: DEFAULT_IMAGE_TRANSFORM,
    });
  }

  return (
    <div className="space-y-3 rounded-[14px] border border-[#E2E8F0] bg-[#F5F7FA]/80 p-4 dark:border-white/10 dark:bg-[#07152C]/80">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-[#07152C] dark:text-white">{label}</p>
          {helperText && (
            <p className="text-xs text-[#64748B] dark:text-[#A3B4CC]">{helperText}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {value.src && (
            <button
              type="button"
              onClick={() => setAdjustOpen((prev) => !prev)}
              className={cn(
                'inline-flex h-9 items-center gap-1.5 rounded-[9px] border px-3 text-xs font-semibold transition-colors cursor-pointer',
                adjustOpen
                  ? 'border-[#D5A52B] bg-[#D5A52B] text-[#050D1B]'
                  : 'border-[#E2E8F0] bg-white text-[#07152C] hover:border-[#07152C]/40 dark:border-white/15 dark:bg-[#162B4D] dark:text-white dark:hover:border-[#D5A52B]/60',
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{adjustOpen ? 'Close Adjuster' : 'Adjust Image'}</span>
            </button>
          )}

          {value.src && allowRemove && (
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[#C8202B]/30 bg-white px-3 text-xs font-semibold text-[#C8202B] hover:bg-[#C8202B]/5 dark:border-[#F87171]/35 dark:bg-[#162B4D] dark:text-[#FCA5A5] dark:hover:bg-[#C8202B]/20 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>

      {/* Bounded Live Preview */}
      <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-3 dark:border-white/10 dark:bg-[#0F213B]">
        <div
          className={cn(
            'mx-auto w-full overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-[#07152C] dark:border-white/10 dark:bg-[#050D1B]',
            aspectClass,
          )}
        >
          <MediaImage
            src={value.src}
            alt={label}
            fallbackLabel="No image selected"
            transform={value.transform}
            className="h-full w-full"
          />
        </div>
      </div>

      {/* Hidden-by-default Image Adjustment Controller */}
      {adjustOpen && value.src && (
        <div className="space-y-4 rounded-[12px] border border-[#07152C]/20 bg-white p-4 dark:border-[#D5A52B]/35 dark:bg-[#0F213B]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2.5 dark:border-white/10">
            <p className="text-xs font-bold uppercase tracking-wider text-[#07152C] dark:text-white">
              Image Positioning &amp; Framing
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateTransform(DEFAULT_IMAGE_TRANSFORM)}
                className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-[#E2E8F0] px-2.5 text-[11px] font-semibold text-[#07152C] hover:bg-[#F5F7FA] dark:border-white/15 dark:text-white dark:hover:bg-[#162B4D] cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={() => setAdjustOpen(false)}
                className="inline-flex h-8 items-center gap-1 rounded-[8px] bg-[#D5A52B] px-3 text-[11px] font-bold text-[#050D1B] hover:bg-[#E2B84A] cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Done</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Fit vs Fill */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-[#07152C] dark:text-white">Display Mode</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateTransform({ fit: 'cover' })}
                  className={cn(
                    'inline-flex h-9 items-center justify-center gap-1.5 rounded-[8px] border text-xs font-semibold cursor-pointer',
                    value.transform.fit === 'cover'
                      ? 'border-[#07152C] bg-[#07152C] text-white dark:border-[#D5A52B] dark:bg-[#D5A52B] dark:text-[#050D1B]'
                      : 'border-[#E2E8F0] bg-[#F5F7FA] text-[#07152C] dark:border-white/15 dark:bg-[#162B4D] dark:text-[#E2E8F0]',
                  )}
                >
                  <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Fill Frame</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateTransform({ fit: 'contain' })}
                  className={cn(
                    'inline-flex h-9 items-center justify-center gap-1.5 rounded-[8px] border text-xs font-semibold cursor-pointer',
                    value.transform.fit === 'contain'
                      ? 'border-[#07152C] bg-[#07152C] text-white dark:border-[#D5A52B] dark:bg-[#D5A52B] dark:text-[#050D1B]'
                      : 'border-[#E2E8F0] bg-[#F5F7FA] text-[#07152C] dark:border-white/15 dark:bg-[#162B4D] dark:text-[#E2E8F0]',
                  )}
                >
                  <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Fit Full</span>
                </button>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#07152C] dark:text-white">
                <span>Zoom</span>
                <span className="font-mono text-[#64748B] dark:text-[#A3B4CC] tabular-nums">
                  {value.transform.scale.toFixed(2)}x
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateTransform({ scale: clamp(value.transform.scale - 0.1, 1, 2.5) })
                  }
                  aria-label="Zoom out"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-[#E2E8F0] bg-[#F5F7FA] text-[#07152C] hover:bg-[#E2E8F0]/50 dark:border-white/15 dark:bg-[#162B4D] dark:text-white dark:hover:bg-[#1E3963] cursor-pointer"
                >
                  <ZoomOut className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <input
                  type="range"
                  aria-label="Zoom level"
                  min={1}
                  max={2.5}
                  step={0.05}
                  value={value.transform.scale}
                  onChange={(e) => updateTransform({ scale: Number(e.target.value) })}
                  className="w-full accent-[#D5A52B]"
                />
                <button
                  type="button"
                  onClick={() =>
                    updateTransform({ scale: clamp(value.transform.scale + 0.1, 1, 2.5) })
                  }
                  aria-label="Zoom in"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-[#E2E8F0] bg-[#F5F7FA] text-[#07152C] hover:bg-[#E2E8F0]/50 dark:border-white/15 dark:bg-[#162B4D] dark:text-white dark:hover:bg-[#1E3963] cursor-pointer"
                >
                  <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Position Nudge + Sliders */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#07152C] dark:text-white">
                <span>Horizontal Position</span>
                <span className="font-mono text-[#64748B] dark:text-[#A3B4CC] tabular-nums">
                  {value.transform.posX}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateTransform({ posX: clamp(value.transform.posX - 5, 0, 100) })}
                  aria-label="Move left"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[#E2E8F0] bg-[#F5F7FA] text-[#07152C] dark:border-white/15 dark:bg-[#162B4D] dark:text-white cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <input
                  type="range"
                  aria-label="Horizontal focal position"
                  min={0}
                  max={100}
                  step={1}
                  value={value.transform.posX}
                  onChange={(e) => updateTransform({ posX: Number(e.target.value) })}
                  className="w-full accent-[#D5A52B]"
                />
                <button
                  type="button"
                  onClick={() => updateTransform({ posX: clamp(value.transform.posX + 5, 0, 100) })}
                  aria-label="Move right"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[#E2E8F0] bg-[#F5F7FA] text-[#07152C] dark:border-white/15 dark:bg-[#162B4D] dark:text-white cursor-pointer"
                >
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#07152C] dark:text-white">
                <span>Vertical Position</span>
                <span className="font-mono text-[#64748B] dark:text-[#A3B4CC] tabular-nums">
                  {value.transform.posY}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateTransform({ posY: clamp(value.transform.posY - 5, 0, 100) })}
                  aria-label="Move up"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[#E2E8F0] bg-[#F5F7FA] text-[#07152C] dark:border-white/15 dark:bg-[#162B4D] dark:text-white cursor-pointer"
                >
                  <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <input
                  type="range"
                  aria-label="Vertical focal position"
                  min={0}
                  max={100}
                  step={1}
                  value={value.transform.posY}
                  onChange={(e) => updateTransform({ posY: Number(e.target.value) })}
                  className="w-full accent-[#D5A52B]"
                />
                <button
                  type="button"
                  onClick={() => updateTransform({ posY: clamp(value.transform.posY + 5, 0, 100) })}
                  aria-label="Move down"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[#E2E8F0] bg-[#F5F7FA] text-[#07152C] dark:border-white/15 dark:bg-[#162B4D] dark:text-white cursor-pointer"
                >
                  <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Source Tabs: Upload from Device | Image URL */}
      <div className="space-y-3">
        <div className="inline-flex rounded-[9px] border border-[#E2E8F0] bg-white p-1 gap-1 dark:border-white/15 dark:bg-[#0F213B]">
          <button
            type="button"
            onClick={() => {
              setSourceMode('upload');
              setStatusError(null);
            }}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-xs font-semibold cursor-pointer',
              sourceMode === 'upload'
                ? 'bg-[#07152C] text-white dark:bg-[#D5A52B] dark:text-[#050D1B]'
                : 'text-[#64748B] hover:text-[#07152C] dark:text-[#A3B4CC] dark:hover:text-white',
            )}
          >
            <Upload className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Upload from Device</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSourceMode('url');
              setStatusError(null);
            }}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-xs font-semibold cursor-pointer',
              sourceMode === 'url'
                ? 'bg-[#07152C] text-white dark:bg-[#D5A52B] dark:text-[#050D1B]'
                : 'text-[#64748B] hover:text-[#07152C] dark:text-[#A3B4CC] dark:hover:text-white',
            )}
          >
            <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Image URL</span>
          </button>
        </div>

        {sourceMode === 'upload' ? (
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={(e) => void handleFilePicked(e.target.files?.[0])}
              className="hidden"
            />
            <button
              type="button"
              disabled={isBusy}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#07152C]/20 bg-white px-4 text-xs font-semibold text-[#07152C] hover:border-[#07152C]/50 hover:bg-[#F5F7FA] disabled:opacity-50 dark:border-white/15 dark:bg-[#162B4D] dark:text-white dark:hover:border-[#D5A52B]/60 cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5 text-[#D5A52B]" aria-hidden="true" />
              <span>{isBusy ? 'Processing...' : value.src ? 'Replace Image File' : 'Choose Image File'}</span>
            </button>
            <span className="text-[11px] text-[#64748B] dark:text-[#A3B4CC]">
              JPG, PNG, or WebP · Max 5 MB
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="h-10 flex-1 rounded-[10px] border border-[#E2E8F0] bg-white px-3.5 text-xs text-[#07152C] placeholder:text-[#64748B]/70 focus:outline-none focus:ring-2 focus:ring-[#D5A52B]/60 dark:border-white/15 dark:bg-[#0F213B] dark:text-white dark:placeholder:text-[#8499B8]"
            />
            <button
              type="button"
              disabled={isBusy || !urlInput.trim()}
              onClick={() => void handleApplyUrl()}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[10px] bg-[#D5A52B] px-4 text-xs font-semibold text-[#050D1B] hover:bg-[#E2B84A] disabled:opacity-50 cursor-pointer shrink-0"
            >
              <span>{isBusy ? 'Checking...' : 'Apply URL'}</span>
            </button>
          </div>
        )}

        {presetAssets && presetAssets.length > 0 && (
          <div className="pt-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#A3B4CC] mb-1.5">
              Or choose an existing academy asset
            </label>
            <select
              value={presetAssets.some((p) => p.src === value.src) ? value.src ?? '' : ''}
              onChange={(e) => {
                if (!e.target.value) return;
                setStatusError(null);
                setStatusNote('Academy visual selected.');
                onChange({
                  src: e.target.value,
                  transform: { ...DEFAULT_IMAGE_TRANSFORM, fit: value.transform.fit },
                });
              }}
              className="h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 text-xs text-[#07152C] dark:border-white/15 dark:bg-[#0F213B] dark:text-white"
            >
              <option value="">Select bundled asset...</option>
              {presetAssets.map((asset) => (
                <option key={asset.src} value={asset.src}>
                  {asset.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {statusError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-[9px] border border-[#C8202B]/30 bg-[#C8202B]/10 px-3 py-2 text-xs font-medium text-[#C8202B] dark:border-[#F87171]/35 dark:text-[#FCA5A5]"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{statusError}</span>
        </div>
      )}

      {statusNote && !statusError && (
        <p className="text-[11px] font-medium text-[#07152C]/80 dark:text-[#D5A52B]">
          {statusNote}
        </p>
      )}
    </div>
  );
}
