import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/utils/cn';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';

export interface CardProps {
  children: ReactNode;
  className?: string;
  tone?: 'light' | 'navy' | 'muted' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const TONE_CLASSES: Record<NonNullable<CardProps['tone']>, string> = {
  light:
    'bg-white border border-[#E2E8F0] text-[#07152C] shadow-[var(--shadow-card)] dark:bg-gradient-to-b dark:from-[#112647] dark:to-[#0A1933] dark:border-white/12 dark:text-white',
  navy:
    'bg-gradient-to-b from-[#0F213B] to-[#07152C] border border-white/14 text-white shadow-[var(--shadow-card)] dark:from-[#0C1D38] dark:to-[#050D1B] dark:border-white/14',
  muted:
    'bg-[#F5F7FA] border border-[#E2E8F0] text-[#07152C] dark:bg-[#132645]/85 dark:border-white/10 dark:text-white',
  elevated:
    'bg-white border border-[#CBD5E1] text-[#07152C] shadow-[var(--shadow-card-hover)] dark:bg-gradient-to-b dark:from-[#162B4D] dark:to-[#0D1E3A] dark:border-[#2B599E]/45 dark:text-white',
};

const PADDING_CLASSES: Record<NonNullable<CardProps['padding']>, string> = {
  none: 'p-0',
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

  const baseClasses = cn(
    'relative rounded-[16px] transition-[border-color,box-shadow,background-color] duration-150',
    TONE_CLASSES[tone],
    PADDING_CLASSES[padding],
    interactive &&
      'hover:border-[#D5A52B]/65 hover:shadow-[var(--shadow-card-hover)] dark:hover:border-[#D5A52B]/60',
    className,
  );

  if (interactive && !prefersReduced) {
    return (
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
        className={baseClasses}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={baseClasses}>{children}</div>;
}
