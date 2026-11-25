import { Quote } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { RevealSection, StaggerGrid, StaggerItem } from '@/src/components/motion/MotionPrimitives';
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
    <RevealSection>
      <section aria-labelledby="testimonials-heading" className="space-y-8">
        <SectionHeader
          id="testimonials-heading"
          kicker="Testimonials"
          title="Player & Guardian Perspectives"
          description="Verified feedback shared by SK Tape Ball Academy athletes and families."
        />

        <StaggerGrid className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {approvedTestimonials.slice(0, 3).map((item) => (
            <StaggerItem key={item.id}>
              <Card padding="lg" className="h-full flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <Quote className="h-6 w-6 text-[#D5A52B]" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-[#07152C] dark:text-[#E2E8F0]">
                    {item.content}
                  </p>
                </div>

                <div className="border-t border-[#E2E8F0] pt-4 dark:border-white/10">
                  <p className="text-sm font-bold text-[#07152C] dark:text-white">
                    {item.authorName}
                  </p>
                  <p className="text-xs text-[#64748B] dark:text-[#7F95B8]">{item.authorRole}</p>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>
    </RevealSection>
  );
}
