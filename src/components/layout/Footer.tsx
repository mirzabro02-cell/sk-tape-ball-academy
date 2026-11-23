import { Link } from 'react-router-dom';
import { ACADEMY_BRAND } from '@/src/data/brand';
import { FOOTER_LINK_GROUPS } from '@/src/data/navigation';
import { Button } from '@/src/components/ui/Button';
import { OfficialLogo } from '@/src/components/ui/OfficialLogo';
import { WhatsAppCta } from '@/src/components/ui/WhatsAppCta';
import { PageContainer } from './PageContainer';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#071A36] bg-[#050D1B] text-white">
      <PageContainer className="py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-5">
            <OfficialLogo tone="dark" />
            <p className="text-xs font-semibold tracking-widest text-[#D9A52E]">
              {ACADEMY_BRAND.tagline}
            </p>
            <p className="max-w-md text-sm leading-relaxed text-white/75">
              Official foundation platform for {ACADEMY_BRAND.name}. All contact numbers, ground locations, and academy records remain placeholders until officially confirmed.
            </p>

            <div className="rounded-[14px] border border-white/10 bg-[#071A36] p-4 space-y-2 text-xs text-white/75">
              <p className="font-semibold text-white">Official Contact Details (Placeholders)</p>
              <p>{ACADEMY_BRAND.contactPlaceholders.addressPlaceholder}</p>
              <p>{ACADEMY_BRAND.contactPlaceholders.phonePlaceholder}</p>
              <p>{ACADEMY_BRAND.contactPlaceholders.emailPlaceholder}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button to="/book-trial" variant="primary" size="sm">
                Book Free Trial
              </Button>
              <Button to="/register" variant="outlineLight" size="sm">
                Register Now
              </Button>
              <WhatsAppCta variant="inline" />
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {FOOTER_LINK_GROUPS.map((group) => (
              <div key={group.heading} className="space-y-3.5">
                <h3 className="text-sm font-semibold tracking-tight text-white">
                  {group.heading}
                </h3>
                <ul className="space-y-2.5">
                  {group.links.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="text-sm text-white/70 transition-colors duration-150 hover:text-[#D9A52E]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {currentYear} {ACADEMY_BRAND.name}. All rights reserved.
          </p>
          <p>Part 1 Foundation · Ready for Official Content &amp; Supabase Integration</p>
        </div>
      </PageContainer>
    </footer>
  );
}
