import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Image as ImageIcon, X } from 'lucide-react';
import { useScrollLock } from '@/src/hooks/useScrollLock';
import { Button } from './Button';

export interface LightboxImageData {
  src: string;
  alt: string;
  title: string;
  category?: string;
  caption?: string;
}

export interface ImageLightboxModalProps {
  item: LightboxImageData | null;
  onClose: () => void;
  onStep?: (direction: -1 | 1) => void;
  canNavigate?: boolean;
  counterLabel?: string;
  footerAction?: ReactNode;
  closeLabel?: string;
}

export function ImageLightboxModal({
  item,
  onClose,
  onStep,
  canNavigate = false,
  counterLabel,
  footerAction,
  closeLabel = 'Close image viewer',
}: ImageLightboxModalProps) {
  const [hasError, setHasError] = useState(false);

  useScrollLock(Boolean(item));

  useEffect(() => {
    setHasError(false);
  }, [item?.src]);

  useEffect(() => {
    if (!item) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      } else if (canNavigate && onStep) {
        if (event.key === 'ArrowRight') {
          onStep(1);
        } else if (event.key === 'ArrowLeft') {
          onStep(-1);
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose, onStep, canNavigate]);

  if (!item || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050D1B]/90 p-3 sm:p-6 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[18px] border border-white/15 bg-white shadow-2xl dark:bg-[#0F213B]"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#E2E8F0] px-4 py-3 sm:px-5 sm:py-4 dark:border-white/10">
          <div className="min-w-0">
            {(item.category || counterLabel) && (
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#C8202B] dark:text-[#D5A52B] truncate">
                {item.category}
                {item.category && counterLabel ? ' · ' : ''}
                {counterLabel}
              </p>
            )}
            <h3 className="text-base sm:text-lg font-bold text-[#07152C] dark:text-white truncate">
              {item.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-[#CBD5E1] bg-white text-[#07152C] hover:bg-[#F5F7FA] dark:border-white/20 dark:bg-[#07152C] dark:text-white dark:hover:bg-[#162B4D] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A52B]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Full-frame Uncropped Image Stage */}
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#050D1B] p-2 sm:p-4">
          {!item.src || hasError ? (
            <div
              role="img"
              aria-label={item.alt}
              className="flex min-h-[220px] w-full flex-col items-center justify-center gap-2.5 p-6 text-center text-white/80"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D9A52E]/40 bg-[#07152C] text-[#D9A52E]">
                <ImageIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-xs font-medium tracking-wide text-white/85">{item.title}</span>
            </div>
          ) : (
            <img
              src={item.src}
              alt={item.alt}
              referrerPolicy="no-referrer"
              onError={() => setHasError(true)}
              className="block max-h-[calc(100dvh-13rem)] sm:max-h-[calc(100dvh-14.5rem)] max-w-full w-auto h-auto object-contain select-none"
            />
          )}
        </div>

        {/* Footer */}
        {(item.caption || footerAction || (canNavigate && onStep)) && (
          <div className="flex shrink-0 flex-col gap-3 border-t border-[#E2E8F0] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4 dark:border-white/10">
            <p className="text-xs sm:text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
              {item.caption || ''}
            </p>

            {(footerAction || (canNavigate && onStep)) && (
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {footerAction}
                {canNavigate && onStep && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => onStep(-1)}>
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      <span>Previous</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onStep(1)}>
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
