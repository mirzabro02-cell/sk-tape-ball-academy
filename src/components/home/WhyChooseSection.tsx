import { WHY_CHOOSE_PILLARS } from '@/src/data/homeContent';
import { Button } from '@/src/components/ui/Button';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function WhyChooseSection() {
  return (
    <section
      aria-labelledby="why-choose-heading"
      className="rounded-[18px] bg-[#071A36] p-6 sm:p-10 lg:p-12 text-white border border-[#050D1B]"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          <SectionHeader
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

        <div className="lg:col-span-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {WHY_CHOOSE_PILLARS.map((pillar, index) => (
            <div
              key={pillar.code}
              className={`rounded-[14px] border border-white/10 bg-[#050D1B]/80 p-5 sm:p-6 ${
                index === WHY_CHOOSE_PILLARS.length - 1 ? 'sm:col-span-2' : ''
              }`}
            >
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-bold tracking-wider text-[#D9A52E]">
                  {pillar.code}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {pillar.title}
                </h3>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-white/75">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
