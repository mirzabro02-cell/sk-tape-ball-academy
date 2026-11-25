import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Share2 } from 'lucide-react';
import { ACADEMY_BRAND } from '@/src/data/brand';
import { FOOTER_LINK_GROUPS } from '@/src/data/navigation';
import { Button } from '@/src/components/ui/Button';
import { OfficialLogo } from '@/src/components/ui/OfficialLogo';
import { WhatsAppCta } from '@/src/components/ui/WhatsAppCta';
import { PageContainer } from './PageContainer';

const SOCIAL_PLACEHOLDERS = [
  { id: 'instagram', label: 'Instagram (Placeholder)' },
  { id: 'facebook', label: 'Facebook (Placeholder)' },
  { id: 'youtube', label: 'YouTube (Placeholder)' },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [socialNotice, setSocialNotice] = useState<string | null>(null);

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
              Dedicated tape ball cricket coaching focused on structured drills, match intelligence, athletic fitness, and team discipline. Official ground address and contact channels are marked as placeholders until verified.
            </p>

            <div className="rounded-[14px] border border-white/10 bg-[#071A36] p-4 space-y-2 text-xs text-white/75">
              <p className="font-semibold text-white">Academy &amp; Contact Information (Placeholders)</p>
              <p>{ACADEMY_BRAND.contactPlaceholders.addressPlaceholder}</p>
              <p>{ACADEMY_BRAND.contactPlaceholders.phonePlaceholder}</p>
              <p>{ACADEMY_BRAND.contactPlaceholders.emailPlaceholder}</p>
              <p>{ACADEMY_BRAND.contactPlaceholders.hoursPlaceholder}</p>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex flex-wrap items-center gap-3">
                <Button to="/book-trial" variant="primary" size="sm">
                  Book Free Trial
                </Button>
                <Button to="/register" variant="outlineLight" size="sm">
                  Register Now
                </Button>
                <WhatsAppCta variant="inline" />
              </div>

              <div className="pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">
                  Social Channels (Placeholders)
                </p>
                <div className="flex flex-wrap gap-2">
                  {SOCIAL_PLACEHOLDERS.map((social) => (
                    <button
                      key={social.id}
                      type="button"
                      onClick={() =>
                        setSocialNotice(
                          `${social.label}: Official social profile URL pending academy configuration.`,
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-[8px] border border-white/15 bg-[#071A36] px-3 py-1.5 text-xs font-medium text-white/80 hover:border-[#D9A52E]/60 hover:text-white transition-colors cursor-pointer"
                    >
                      <Share2 className="h-3.5 w-3.5 text-[#D9A52E]" aria-hidden="true" />
                      <span>{social.label}</span>
                    </button>
                  ))}
                </div>
                {socialNotice && (
                  <p className="mt-2 text-xs text-[#D9A52E]">{socialNotice}</p>
                )}
              </div>
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
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link to="/child-safety" className="hover:text-white transition-colors">
              Child Safety
            </Link>
            <Link to="/admin" className="inline-flex items-center gap-1 hover:text-[#D9A52E] transition-colors">
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
