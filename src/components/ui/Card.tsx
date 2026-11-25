import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/utils/cn';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';

export interface CardProps {
  children: ReactNode;
  className?: string;
  tone?: 'light' | 'navy' | 'muted';
  padding?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const TONE_CLASSES: Record<NonNullable<CardProps['tone']>, string> = {
  light:
    'bg-white border border-[#E2E8F0] text-[#07152C] shadow-[var(--shadow-card)] dark:bg-[#0F213B] dark:border-white/10 dark:text-white',
  navy:
    'bg-[#07152C] border border-white/12 text-white shadow-[var(--shadow-card)] dark:bg-[#050D1B] dark:border-white/12',
  muted:
    'bg-[#F5F7FA] border border-[#E2E8F0] text-[#07152C] dark:bg-[#162B4D]/75 dark:border-white/10 dark:text-white',
};

const PADDING_CLASSES: Record<NonNullable<CardProps['padding']>, string> = {
  sm: 'p-4 sm:p-5',
  md: 'p-6',
  lg: 'p-6 sm:p-8',
};

export function Card({
  children,
  className,
  tone = 'light',
  padding = 'md',
  interactive = false,
}: CardProps) {
  const prefersReduced = useReducedMotion();

  if (interactive && !prefersReduced) {
    return (
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'rounded-[16px] transition-colors duration-150',
          TONE_CLASSES[tone],
          PADDING_CLASSES[padding],
          'hover:border-[#D5A52B]/60 dark:hover:border-[#D5A52B]/55',
          className,
        )}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-[16px] transition-colors duration-150',
        TONE_CLASSES[tone],
        PADDING_CLASSES[padding],
        interactive && 'hover:border-[#D5A52B]/60 dark:hover:border-[#D5A52B]/55',
        className,
      )}
    >
      {children}
    </div>
  );
}
