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

  const sharedClasses = cn(
    'inline-flex items-center justify-center gap-2 rounded-[10px] border border-[#CBD5E1] bg-white px-4 h-11 text-sm font-semibold text-[#07152C] hover:border-[#D5A83C] hover:bg-[#F4F6FA] dark:border-white/15 dark:bg-[#0F213B] dark:text-white dark:hover:border-[#D5A83C]/65 dark:hover:bg-[#162B4D] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]',
    variant === 'banner' && 'w-full justify-between px-5 h-12',
    className,
  );

  if (!safeHref) {
    if (hideIfUnconfigured) {
      return null;
    }

    return (
      <Link to="/contact" className={sharedClasses}>
        <span className="inline-flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-[#D5A83C]" aria-hidden="true" />
          <span>Academy Inquiry Desk</span>
        </span>
        {variant === 'banner' && (
          <span className="text-xs font-medium text-[#64748B] dark:text-[#859BB9]">
            Contact Form
          </span>
        )}
      </Link>
    );
  }

  return (
    <a
      href={safeHref}
      target="_blank"
      rel="noopener noreferrer"
      className={sharedClasses}
    >
      <span className="inline-flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-[#D5A83C]" aria-hidden="true" />
        <span>WhatsApp Inquiry</span>
      </span>
      {variant === 'banner' && (
        <span className="text-xs font-medium text-[#64748B] dark:text-[#859BB9]">Open Chat</span>
      )}
    </a>
  );
}
