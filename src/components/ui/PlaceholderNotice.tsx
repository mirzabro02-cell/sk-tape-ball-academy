import type { ReactNode } from 'react';
import { Card } from './Card';
import { Button } from './Button';

export interface PlaceholderNoticeProps {
  routePath: string;
  sectionLabel: string;
  title: string;
  description: string;
  plannedModules: string[];
  children?: ReactNode;
}

export function PlaceholderNotice({
  routePath,
  sectionLabel,
  title,
  description,
  plannedModules,
  children,
}: PlaceholderNoticeProps) {
  return (
    <div className="space-y-8">
      <section className="rounded-[16px] bg-[#071A36] p-6 sm:p-10 text-white border border-[#050D1B]">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#D9A52E]">
          <span>{sectionLabel}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-white/80">{routePath}</span>
          <span aria-hidden="true">·</span>
          <span className="text-white/75">Part 1 Foundation Placeholder</span>
        </div>

        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white max-w-2xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-white/80">
          {description}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button to="/book-trial" variant="primary">
            Book Free Trial
          </Button>
          <Button to="/register" variant="outlineLight">
            Register Now
          </Button>
          <Button to="/" variant="outlineLight">
            Back to Foundation Home
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" padding="lg">
          <h2 className="text-lg font-bold text-[#071A36]">
            Planned Page Architecture (Pending Part 2+)
          </h2>
          <p className="mt-1.5 text-sm text-[#64748B]">
            This route is wired into React Router DOM and wrapped in the global SK Tape Ball Academy layout. Content modules below are structural placeholders only.
          </p>

          <ul className="mt-5 divide-y divide-[#E2E8F0] border-t border-b border-[#E2E8F0]">
            {plannedModules.map((moduleName, index) => (
              <li
                key={moduleName}
                className="flex items-center justify-between gap-4 py-3.5 text-sm"
              >
                <span className="font-medium text-[#071A36]">
                  {String(index + 1).padStart(2, '0')}. {moduleName}
                </span>
                <span className="text-xs text-[#64748B] whitespace-nowrap">
                  Placeholder Module
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card tone="muted" padding="lg">
          <h2 className="text-lg font-bold text-[#071A36]">Data & Integration Status</h2>
          <div className="mt-4 space-y-3 text-sm text-[#64748B]">
            <p>
              <strong className="font-semibold text-[#071A36]">Backend:</strong> Not connected yet (Part 1).
            </p>
            <p>
              <strong className="font-semibold text-[#071A36]">Supabase Readiness:</strong> Typed service contracts and config checks prepared.
            </p>
            <p>
              <strong className="font-semibold text-[#071A36]">Academy Copy:</strong> Reserved for verified official details.
            </p>
          </div>
        </Card>
      </div>

      {children}
    </div>
  );
}
