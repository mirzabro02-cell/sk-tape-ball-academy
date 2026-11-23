import { ArrowRight, CheckCircle2, Layers, LayoutGrid, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ACADEMY_BRAND } from '@/src/data/brand';
import { ADMIN_NAV_ITEMS, ALL_PUBLIC_ROUTES } from '@/src/data/navigation';
import { FOUNDATION_PILLARS_PLACEHOLDER } from '@/src/data/placeholders';
import { BRAND_COLORS } from '@/src/styles/tokens';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { SectionHeader } from '@/src/components/ui/SectionHeader';
import { WhatsAppCta } from '@/src/components/ui/WhatsAppCta';

const PALETTE_SWATCHES = [
  { name: 'Deep Navy', hex: BRAND_COLORS.deepNavy, lightText: true },
  { name: 'Dark Navy', hex: BRAND_COLORS.darkNavy, lightText: true },
  { name: 'Royal Gold', hex: BRAND_COLORS.royalGold, lightText: false },
  { name: 'Cricket Red', hex: BRAND_COLORS.cricketRed, lightText: true },
  { name: 'Light Background', hex: BRAND_COLORS.lightBackground, lightText: false },
  { name: 'White', hex: BRAND_COLORS.white, lightText: false },
] as const;

export function HomePage() {
  useDocumentTitle();

  return (
    <div className="space-y-12">
      <section className="rounded-[18px] bg-[#071A36] px-6 py-10 sm:px-10 sm:py-14 text-white border border-[#050D1B]">
        <div className="max-w-3xl space-y-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#D9A52E]">
            {ACADEMY_BRAND.tagline}
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
            {ACADEMY_BRAND.name}
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-white/80 max-w-2xl">
            Part 1 Project Foundation. This placeholder landing view verifies the official color system, Sora and Inter typography, global header and footer navigation, reusable UI primitives, and complete route structure before building the full academy homepage in Part 2.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button to="/book-trial" variant="primary" size="lg">
              Book Free Trial
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button to="/register" variant="outlineLight" size="lg">
              Register Now
            </Button>
            <WhatsAppCta variant="inline" />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          kicker="Part 1 Architecture"
          title="Foundation Pillars"
          description="Modular TypeScript, React Router DOM, Tailwind CSS, and Framer Motion setup prepared for subsequent feature builds."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FOUNDATION_PILLARS_PLACEHOLDER.map((item, idx) => {
            const icons = [Palette, LayoutGrid, Layers];
            const Icon = icons[idx] ?? CheckCircle2;
            return (
              <Card key={item.code} interactive padding="lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wider text-[#C8202B]">
                    {item.code}
                  </span>
                  <Icon className="h-5 w-5 text-[#071A36]" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#071A36]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          kicker="Official Branding System"
          title="Locked Color Palette & Typography"
          description="Headings set in Sora; body copy set in Inter. Strictly adhering to the academy color tokens."
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {PALETTE_SWATCHES.map((swatch) => (
            <Card key={swatch.name} padding="sm">
              <div
                className="h-16 w-full rounded-[10px] border border-[#E2E8F0]"
                style={{ backgroundColor: swatch.hex }}
              />
              <p className="mt-3 text-sm font-semibold text-[#071A36]">{swatch.name}</p>
              <p className="text-xs font-mono text-[#64748B]">{swatch.hex}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-8" padding="lg">
          <SectionHeader
            kicker="Routing Verification"
            title="Public Placeholder Routes"
            description="Every public route is active and connected to the global layout."
          />
          <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3">
            {ALL_PUBLIC_ROUTES.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className="flex items-center justify-between rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] px-3.5 py-2.5 text-sm font-medium text-[#071A36] transition-colors hover:border-[#D9A52E] hover:bg-white"
              >
                <span className="truncate">{route.label}</span>
                <span className="ml-2 text-xs font-mono text-[#64748B]">{route.path}</span>
              </Link>
            ))}
          </div>
        </Card>

        <Card tone="navy" className="lg:col-span-4" padding="lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#D9A52E]">
            Admin Foundation
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">
            Admin Route Placeholders
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/75">
            Prepared under <span className="font-mono text-white">/admin</span> without premature dashboard widgets or fake authentication.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            {ADMIN_NAV_ITEMS.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className="flex items-center justify-between rounded-[10px] border border-white/10 bg-[#050D1B] px-3.5 py-2 text-xs font-medium text-white/85 transition-colors hover:border-[#D9A52E]/60 hover:text-white"
              >
                <span>{route.label}</span>
                <span className="font-mono text-white/55">{route.path}</span>
              </Link>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
