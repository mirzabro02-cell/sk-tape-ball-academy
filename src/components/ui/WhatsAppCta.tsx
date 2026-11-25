import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { ACADEMY_BRAND } from '@/src/data/brand';
import { cn } from '@/src/utils/cn';
import { Button } from './Button';

export interface WhatsAppCtaProps {
  variant?: 'inline' | 'banner';
  className?: string;
}

export function WhatsAppCta({ variant = 'inline', className }: WhatsAppCtaProps) {
  const [showNotice, setShowNotice] = useState(false);

  return (
    <div className={cn('relative inline-block', variant === 'banner' && 'w-full', className)}>
      <button
        type="button"
        onClick={() => setShowNotice((prev) => !prev)}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-[10px] border border-[#E2E8F0] bg-white px-4 h-11 text-sm font-semibold text-[#071A36] hover:border-[#D9A52E] hover:bg-[#F5F7FA] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A52E]',
          variant === 'banner' && 'w-full justify-between px-5 h-12',
        )}
      >
        <span className="inline-flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-[#071A36]" aria-hidden="true" />
          <span>{ACADEMY_BRAND.contactPlaceholders.whatsappLabel}</span>
        </span>
        {variant === 'banner' && (
          <span className="text-xs font-medium text-[#64748B]">Configure Later</span>
        )}
      </button>

      {showNotice && (
        <div
          role="dialog"
          aria-label="WhatsApp CTA Placeholder Details"
          className={cn(
            'rounded-[14px] border border-[#E2E8F0] bg-white p-4 text-left shadow-xl',
            variant === 'inline'
              ? 'absolute left-0 bottom-full mb-2 z-30 w-72 sm:w-80'
              : 'mt-2 w-full',
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#071A36]">
                WhatsApp CTA Placeholder
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                {ACADEMY_BRAND.contactPlaceholders.whatsappStatus} No number has been invented in Part 1. Connect the official WhatsApp link when academy details are finalized.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowNotice(false)}
              aria-label="Close WhatsApp placeholder notice"
              className="rounded-md p-1 text-[#64748B] hover:bg-[#F5F7FA] hover:text-[#071A36] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 flex justify-end">
            <Button size="sm" variant="secondary" to="/contact" onClick={() => setShowNotice(false)}>
              Go to Contact Page
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
