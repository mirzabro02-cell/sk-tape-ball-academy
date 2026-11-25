import { Quote } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { Card } from '@/src/components/ui/Card';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function TestimonialsSection() {
  const { state } = useAcademyState();
  const approvedTestimonials = state.testimonials.filter(
    (item) => item.published && item.approvalStatus === 'Approved',
  );

  if (approvedTestimonials.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="testimonials-heading" className="space-y-8">
      <SectionHeader
        kicker="Testimonials"
        title="Player & Guardian Perspectives"
        description="Verified feedback shared by SK Tape Ball Academy athletes and families."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {approvedTestimonials.slice(0, 3).map((item) => (
          <Card key={item.id} padding="lg" className="flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <Quote className="h-6 w-6 text-[#D9A52E]" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-[#071A36]">{item.content}</p>
            </div>

            <div className="border-t border-[#E2E8F0] pt-4">
              <p className="text-sm font-bold text-[#071A36]">{item.authorName}</p>
              <p className="text-xs text-[#64748B]">{item.authorRole}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
