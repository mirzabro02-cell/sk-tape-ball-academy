import { WHY_CHOOSE_PILLARS } from '@/src/data/homeContent';
import { RevealSection, StaggerGrid, StaggerItem } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function WhyChooseSection() {
  return (
    <RevealSection>
      <section
        aria-labelledby="why-choose-heading"
        className="rounded-[20px] border border-white/10 bg-[#050D1B] p-6 sm:p-10 lg:p-12 text-white shadow-[0_20px_50px_-28px_rgba(5,13,27,0.8)]"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4 flex flex-col justify-between gap-6">
            <SectionHeader
              id="why-choose-heading"
              tone="dark"
              kicker="Why Choose Our Academy"
              title="Built on Standards That Hold Under Match Pressure"
              description="Training goes beyond casual net practice. Players develop repeatable habits across five foundational pillars."
            />
            <div>
              <Button to="/admissions" variant="primary">
                Explore Admissions
              </Button>
            </div>
          </div>

          <StaggerGrid className="lg:col-span-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {WHY_CHOOSE_PILLARS.map((pillar, index) => (
              <StaggerItem
                key={pillar.code}
                className={index === WHY_CHOOSE_PILLARS.length - 1 ? 'sm:col-span-2' : ''}
              >
                <div className="h-full rounded-[14px] border border-white/10 bg-[#0F213B]/90 p-5 sm:p-6 transition-colors hover:border-[#D5A52B]/40">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs font-bold tracking-wider text-[#D5A52B]">
                      {pillar.code}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#B4C4DC]">
                    {pillar.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>
    </RevealSection>
  );
}
