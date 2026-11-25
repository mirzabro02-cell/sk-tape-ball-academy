import { Compass, Target } from 'lucide-react';
import { MISSION_VISION_VALUES } from '@/src/data/homeContent';
import { RevealSection } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function WhyChooseSection() {
  return (
    <RevealSection>
      <section
        aria-labelledby="mission-vision-values-heading"
        className="rounded-[20px] border border-white/10 bg-[#050D1B] p-6 sm:p-10 lg:p-12 text-white shadow-[0_20px_50px_-28px_rgba(5,13,27,0.8)]"
      >
        <div className="space-y-8">
          <SectionHeader
            id="mission-vision-values-heading"
            tone="dark"
            kicker={MISSION_VISION_VALUES.kicker}
            title={MISSION_VISION_VALUES.title}
            action={
              <Button to="/about" variant="outlineLight" shape="pill">
                About Academy
              </Button>
            }
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-[14px] border border-white/10 bg-[#0F213B]/90 p-5 sm:p-6 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#07152C] border border-[#D5A83C]/35 text-[#D5A83C]">
                  <Target className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {MISSION_VISION_VALUES.mission.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-[#B8C7DF]">
                {MISSION_VISION_VALUES.mission.summary}
              </p>
            </div>

            <div className="rounded-[14px] border border-white/10 bg-[#0F213B]/90 p-5 sm:p-6 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#07152C] border border-[#D5A83C]/35 text-[#D5A83C]">
                  <Compass className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {MISSION_VISION_VALUES.vision.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-[#B8C7DF]">
                {MISSION_VISION_VALUES.vision.summary}
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D5A83C]">
              {MISSION_VISION_VALUES.valuesTitle}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {MISSION_VISION_VALUES.values.map((value) => (
                <span
                  key={value}
                  className="inline-flex items-center rounded-[8px] border border-white/12 bg-[#0F213B] px-3.5 py-2 text-xs sm:text-sm font-semibold text-white"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </RevealSection>
  );
}
