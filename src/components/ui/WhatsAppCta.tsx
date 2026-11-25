import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { cn } from '@/src/utils/cn';

export interface WhatsAppCtaProps {
  variant?: 'inline' | 'banner';
  className?: string;
  hideIfUnconfigured?: boolean;
}

export function WhatsAppCta({
  variant = 'inline',
  className,
  hideIfUnconfigured = false,
}: WhatsAppCtaProps) {
  const { getSafeWhatsAppHref } = useAcademyState();
  const safeHref = getSafeWhatsAppHref();

  if (!safeHref) {
    if (hideIfUnconfigured) {
      return null;
    }

    return (
      <Link
        to="/contact"
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-[10px] border border-[#E2E8F0] bg-white px-4 h-11 text-sm font-semibold text-[#071A36] hover:border-[#D9A52E] hover:bg-[#F5F7FA] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A52E]',
          variant === 'banner' && 'w-full justify-between px-5 h-12',
          className,
        )}
      >
        <span className="inline-flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-[#071A36]" aria-hidden="true" />
          <span>Academy Inquiry Desk</span>
        </span>
        {variant === 'banner' && (
          <span className="text-xs font-medium text-[#64748B]">Contact Form</span>
        )}
      </Link>
    );
  }

  return (
    <a
      href={safeHref}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[10px] border border-[#E2E8F0] bg-white px-4 h-11 text-sm font-semibold text-[#071A36] hover:border-[#D9A52E] hover:bg-[#F5F7FA] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A52E]',
        variant === 'banner' && 'w-full justify-between px-5 h-12',
        className,
      )}
    >
      <span className="inline-flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-[#071A36]" aria-hidden="true" />
        <span>WhatsApp Inquiry</span>
      </span>
      {variant === 'banner' && (
        <span className="text-xs font-medium text-[#64748B]">Open Chat</span>
      )}
    </a>
  );
}
