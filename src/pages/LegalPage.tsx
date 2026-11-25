import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { LEGAL_DOCUMENTS } from '@/src/data/legalContent';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { cn } from '@/src/utils/cn';
import { RevealSection } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { PageHero } from '@/src/components/ui/PageHero';

export interface LegalPageProps {
  slug: string;
}

export function LegalPage({ slug }: LegalPageProps) {
  const doc =
    LEGAL_DOCUMENTS.find((item) => item.slug === slug) ?? LEGAL_DOCUMENTS[0];

  useDocumentTitle(doc.title);

  return (
    <div className="space-y-10 sm:space-y-12">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: doc.title }]}
        kicker="Academy Policy"
        title={doc.title}
        description={doc.summary}
        actions={
          <Button to="/contact" variant="outlineLight" size="sm">
            Policy Enquiries
          </Button>
        }
      />

      <RevealSection>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <aside className="lg:col-span-4 lg:sticky lg:top-[96px]">
            <Card padding="md" className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#7F95B8]">
                <FileText className="h-4 w-4 text-[#07152C] dark:text-[#D5A52B]" aria-hidden="true" />
                <span>All Policy Documents</span>
              </div>
              <nav aria-label="Legal Documents Navigation" className="flex flex-col gap-1">
                {LEGAL_DOCUMENTS.map((item) => (
                  <Link
                    key={item.slug}
                    to={item.routePath}
                    className={cn(
                      'rounded-[10px] px-3.5 py-2.5 text-sm font-medium transition-colors',
                      item.slug === doc.slug
                        ? 'bg-[#07152C] text-white font-semibold dark:bg-[#D5A52B] dark:text-[#07152C]'
                        : 'text-[#07152C] hover:bg-[#F5F7FA] dark:text-[#E2E8F0] dark:hover:bg-white/5',
                    )}
                  >
                    {item.shortLabel}
                  </Link>
                ))}
              </nav>
            </Card>
          </aside>

          <div className="lg:col-span-8 space-y-6">
            {doc.sections.map((section) => (
              <Card key={section.heading} padding="lg" className="space-y-3">
                <h2 className="text-lg font-bold text-[#07152C] dark:text-white">
                  {section.heading}
                </h2>
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm sm:text-base leading-relaxed text-[#475569] dark:text-[#B4C4DC]"
                  >
                    {paragraph}
                  </p>
                ))}
              </Card>
            ))}
          </div>
        </div>
      </RevealSection>
    </div>
  );
}
