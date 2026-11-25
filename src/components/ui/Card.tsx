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
  light: 'bg-white border border-[#E2E8F0] text-[#071A36]',
  navy: 'bg-[#071A36] border border-white/10 text-white',
  muted: 'bg-[#F5F7FA] border border-[#E2E8F0] text-[#071A36]',
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
        whileHover={{ y: -2 }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'rounded-[16px] transition-colors duration-150',
          TONE_CLASSES[tone],
          PADDING_CLASSES[padding],
          'hover:border-[#D9A52E]/60',
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
        interactive && 'hover:border-[#D9A52E]/60',
        className,
      )}
    >
      {children}
    </div>
  );
}
