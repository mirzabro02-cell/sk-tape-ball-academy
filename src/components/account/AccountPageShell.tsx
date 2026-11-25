import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { OfficialLogo } from '@/src/components/ui/OfficialLogo';
import { Card } from '@/src/components/ui/Card';

export interface AccountPageShellProps {
  kicker: string;
  title: string;
  description: string;
  children: ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl';
}

const WIDTH_CLASSES = {
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
} as const;

export function AccountPageShell({
  kicker,
  title,
  description,
  children,
  maxWidth = 'md',
}: AccountPageShellProps) {
  return (
    <div className={`mx-auto w-full ${WIDTH_CLASSES[maxWidth]} space-y-6`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <OfficialLogo tone="auto" />
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#07152C] hover:text-[#C8202B] dark:text-[#B4C4DC] dark:hover:text-[#D5A52B] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to Home</span>
        </Link>
      </div>

      <Card tone="navy" padding="lg" className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D5A52B]">
          {kicker}
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {title}
        </h1>
        <p className="text-sm leading-relaxed text-[#B4C4DC]">{description}</p>
      </Card>

      {children}
    </div>
  );
}
