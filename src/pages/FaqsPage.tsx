import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { FAQ_CATEGORIES, FAQS_DATA, type FaqCategory } from '@/src/data/admissionsContent';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { cn } from '@/src/utils/cn';
import { RevealSection } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { FaqAccordion } from '@/src/components/ui/FaqAccordion';
import { PageHero } from '@/src/components/ui/PageHero';

export function FaqsPage() {
  useDocumentTitle('Frequently Asked Questions');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | FaqCategory>('All');

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return FAQS_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-12 sm:space-y-16">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'FAQs' }]}
        kicker="Help & Support"
        title="Frequently Asked Questions"
        description="Search or browse questions covering admissions, structured training programs, league play, and onboarding at SK Tape Ball Academy."
      />

      {/* Search & Category Controls */}
      <RevealSection>
        <section aria-label="FAQ Search and Filters" className="space-y-5">
          <div className="relative max-w-2xl">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#7F95B8]"
              aria-hidden="true"
            />
            <input
              type="search"
              aria-label="Search frequently asked questions"
              placeholder="Search questions by keyword (e.g., admission, batting, fees, kit)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[52px] w-full rounded-[10px] border border-[#E2E8F0] bg-white pl-11 pr-11 text-sm text-[#07152C] placeholder:text-[#64748B]/75 focus:outline-none focus:ring-2 focus:ring-[#D5A52B]/60 focus:border-[#07152C] dark:border-white/15 dark:bg-[#0F213B] dark:text-white dark:placeholder:text-[#7F95B8] dark:focus:border-[#D5A52B]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear FAQ search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#64748B] hover:bg-[#F5F7FA] hover:text-[#07152C] dark:text-[#7F95B8] dark:hover:bg-white/10 dark:hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div
            role="tablist"
            aria-label="Filter FAQs by category"
            className="flex flex-wrap items-center gap-1.5 rounded-[12px] border border-[#E2E8F0] bg-white p-1.5 w-fit dark:border-white/10 dark:bg-[#0F213B]"
          >
            {FAQ_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'rounded-[8px] px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap',
                  selectedCategory === category
                    ? 'bg-[#07152C] text-white dark:bg-[#D5A52B] dark:text-[#07152C]'
                    : 'text-[#64748B] hover:text-[#07152C] hover:bg-[#F5F7FA] dark:text-[#B4C4DC] dark:hover:text-white dark:hover:bg-white/5',
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* Results Accordion */}
      <RevealSection>
        <section aria-label="FAQ Results" className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <Card padding="lg" className="text-center space-y-3">
              <p className="text-base font-bold text-[#07152C] dark:text-white">
                No Matching Questions Found
              </p>
              <p className="text-sm text-[#475569] dark:text-[#B4C4DC]">
                Try a broader search term or reset category filters to browse all FAQs.
              </p>
              <div className="pt-1 flex justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                >
                  Reset Search &amp; Filters
                </Button>
                <Button to="/contact" variant="primary" size="sm">
                  Ask via Contact Form
                </Button>
              </div>
            </Card>
          ) : (
            <>
              <p className="text-xs font-medium text-[#64748B] dark:text-[#7F95B8]">
                Showing{' '}
                <span className="font-bold text-[#07152C] dark:text-white tabular-nums">
                  {filteredFaqs.length}
                </span>{' '}
                {filteredFaqs.length === 1 ? 'question' : 'questions'}
              </p>
              <FaqAccordion items={filteredFaqs} defaultOpenIndex={0} />
            </>
          )}
        </section>
      </RevealSection>

      <CtaBanner
        title="Still Have Questions for Our Coaching Desk?"
        description="Contact our academy team directly or submit an online registration application."
        primaryLabel="Contact Us"
        primaryTo="/contact"
        secondaryLabel="Register Now"
        secondaryTo="/register"
      />
    </div>
  );
}
