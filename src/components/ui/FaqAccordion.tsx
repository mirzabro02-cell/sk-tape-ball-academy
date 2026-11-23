import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/src/utils/cn';

export interface FaqAccordionItem {
  id?: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FaqAccordionProps {
  items: readonly FaqAccordionItem[];
  defaultOpenIndex?: number | null;
}

export function FaqAccordion({ items, defaultOpenIndex = 0 }: FaqAccordionProps) {
  const [openKey, setOpenKey] = useState<string | null>(
    defaultOpenIndex !== null && items[defaultOpenIndex]
      ? (items[defaultOpenIndex].id ?? String(defaultOpenIndex))
      : null,
  );

  return (
    <div className="divide-y divide-[#E2E8F0] rounded-[16px] border border-[#E2E8F0] bg-white overflow-hidden">
      {items.map((item, idx) => {
        const itemKey = item.id ?? String(idx);
        const isOpen = openKey === itemKey;

        return (
          <div key={itemKey} className="transition-colors">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenKey(isOpen ? null : itemKey)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 text-left hover:bg-[#F5F7FA]/70 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D9A52E]"
            >
              <div className="space-y-1">
                {item.category && (
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C8202B]">
                    {item.category}
                  </p>
                )}
                <span className="block text-sm sm:text-base font-semibold text-[#071A36]">
                  {item.question}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  'h-5 w-5 shrink-0 text-[#64748B] transition-transform duration-150',
                  isOpen && 'rotate-180 text-[#071A36]',
                )}
                aria-hidden="true"
              />
            </button>

            {isOpen && (
              <div className="border-t border-[#E2E8F0] bg-[#F5F7FA]/60 px-5 py-4 sm:px-6 text-sm leading-relaxed text-[#64748B]">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
