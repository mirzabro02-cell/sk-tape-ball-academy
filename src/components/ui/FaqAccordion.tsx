import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
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
  const prefersReduced = useReducedMotion();
  const [openKey, setOpenKey] = useState<string | null>(
    defaultOpenIndex !== null && items[defaultOpenIndex]
      ? (items[defaultOpenIndex].id ?? String(defaultOpenIndex))
      : null,
  );

  return (
    <div className="divide-y divide-[#E2E8F0] dark:divide-white/10 rounded-[16px] border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#0F213B] overflow-hidden shadow-[var(--shadow-card)]">
      {items.map((item, idx) => {
        const itemKey = item.id ?? String(idx);
        const isOpen = openKey === itemKey;

        return (
          <div key={itemKey} className="transition-colors">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenKey(isOpen ? null : itemKey)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 text-left hover:bg-[#F5F7FA]/70 dark:hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D5A52B]"
            >
              <div className="space-y-1">
                {item.category && (
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#C8202B] dark:text-[#D5A52B]">
                    {item.category}
                  </p>
                )}
                <span className="block text-sm sm:text-base font-semibold text-[#07152C] dark:text-white">
                  {item.question}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  'h-5 w-5 shrink-0 text-[#64748B] dark:text-[#8499B8] transition-transform duration-200',
                  isOpen && 'rotate-180 text-[#07152C] dark:text-[#D5A52B]',
                )}
                aria-hidden="true"
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={prefersReduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={prefersReduced ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[#E2E8F0] dark:border-white/10 bg-[#F5F7FA]/70 dark:bg-[#07152C]/65 px-5 py-4 sm:px-6 text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
