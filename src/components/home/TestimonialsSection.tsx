import { Quote } from 'lucide-react';
import { TESTIMONIALS_SAMPLES } from '@/src/data/homeContent';
import { Card } from '@/src/components/ui/Card';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function TestimonialsSection() {
  return (
    <section aria-labelledby="testimonials-heading" className="space-y-8">
      <SectionHeader
        kicker="Testimonials (Sample Placeholders)"
        title="Player & Parent Perspectives"
        description="Clearly labelled sample feedback cards. Verified academy testimonials will replace these samples once collected."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {TESTIMONIALS_SAMPLES.map((item) => (
          <Card key={item.id} padding="lg" className="flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <Quote className="h-6 w-6 text-[#D9A52E]" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-[#071A36]">{item.quote}</p>
            </div>

            <div className="border-t border-[#E2E8F0] pt-4">
              <p className="text-sm font-bold text-[#071A36]">{item.authorLabel}</p>
              <p className="text-xs text-[#64748B]">{item.roleLabel}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
