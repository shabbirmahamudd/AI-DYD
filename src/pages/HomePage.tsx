import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileCheck2,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import { useRef } from 'react';
import { IconMapper } from '../components/IconMapper';
import {
  AnimatedCounter,
  AnimatedHeadline,
  RevealSection,
  TextFadeSwitch,
  Tilt3DCard,
  WordReveal,
} from '../components/motion/MotionPrimitives';
import { HeroNeuralScene } from '../components/three/HeroNeuralScene';
import { useApp } from '../context/AppContext';
import type { StatItem } from '../types/dyd';

export function HomePage() {
  const { navigate, lang, bundle, setSelectedPackageId } = useApp();
  const { siteContent, modules, packages, liveCounts } = bundle;
  const {
    hero,
    stats,
    benefitsSection,
    whyAiSection,
    admissionSection,
    eligibilitySection,
    modulesSection,
    regionsSection,
    ctaSection,
  } = siteContent;

  const timelineRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 80%', 'end 60%'],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  const resolveStatValue = (s: StatItem): { num: number; suffix: string } => {
    if (s.sourceMode === 'live_centers') return { num: liveCounts.centers, suffix: s.suffix };
    if (s.sourceMode === 'live_courses') return { num: modules.length || liveCounts.courses, suffix: s.suffix };
    if (s.sourceMode === 'live_students') return { num: liveCounts.students, suffix: s.suffix };
    return { num: s.numericTarget, suffix: s.suffix };
  };

  return (
    <div className="bg-[#F4F8F6] text-[#0F241D]">
      {/* SECTION C: HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#F4F8F6] to-[#EAF3EE] border-b border-emerald-900/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 w-[640px] h-[640px] rounded-full bg-radial from-[#10B981]/14 via-[#006A4E]/8 to-transparent blur-3xl"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-6">
              <p className="text-sm font-semibold text-[#006A4E] tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D92B2B]" aria-hidden="true" />
                <TextFadeSwitch textKey={`hero-eye-${lang}`}>
                  {lang === 'bn' ? hero.eyebrowBn : hero.eyebrow}
                </TextFadeSwitch>
              </p>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.85rem] font-extrabold text-[#092A20] leading-[1.18] tracking-tight [text-wrap:balance]">
                <WordReveal text={lang === 'bn' ? hero.headingBn : hero.heading} />
              </h1>

              <p className="text-base sm:text-lg text-[#3F574E] leading-relaxed max-w-xl">
                <TextFadeSwitch textKey={`hero-desc-${lang}`}>
                  {lang === 'bn' ? hero.descriptionBn : hero.description}
                </TextFadeSwitch>
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  type="button"
                  onClick={() => navigate('/apply')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#006A4E] to-[#0E805F] hover:from-[#092A20] hover:to-[#006A4E] text-white font-semibold text-sm sm:text-base shadow-[0_10px_24px_rgba(0,106,78,0.28)] transition-all cursor-pointer"
                >
                  <TextFadeSwitch textKey={`hero-cta1-${lang}`}>
                    {lang === 'bn' ? hero.primaryCtaBn : hero.primaryCta}
                  </TextFadeSwitch>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/about')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-[#006A4E] text-[#092A20] hover:text-[#006A4E] font-semibold text-sm sm:text-base transition-colors cursor-pointer"
                >
                  <TextFadeSwitch textKey={`hero-cta2-${lang}`}>
                    {lang === 'bn' ? hero.secondaryCtaBn : hero.secondaryCta}
                  </TextFadeSwitch>
                </button>
              </div>

              <div className="pt-4 border-t border-emerald-900/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[#526860]">
                <button
                  type="button"
                  onClick={() => navigate('/admit-card')}
                  className="inline-flex items-center gap-1.5 font-medium text-[#092A20] hover:text-[#006A4E] transition-colors cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4 text-[#006A4E]" />
                  {lang === 'bn' ? 'অ্যাডমিট কার্ড ডাউনলোড' : 'Admit Card Download'}
                </button>
                <span aria-hidden="true" className="text-slate-300">
                  ·
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/verify-certificate')}
                  className="inline-flex items-center gap-1.5 font-medium text-[#092A20] hover:text-[#006A4E] transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#006A4E]" />
                  {lang === 'bn' ? 'সার্টিফিকেট যাচাই' : 'Verify Certificate'}
                </button>
                <span aria-hidden="true" className="text-slate-300">
                  ·
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/centers')}
                  className="inline-flex items-center gap-1.5 font-medium text-[#092A20] hover:text-[#006A4E] transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#D92B2B]" />
                  {lang === 'bn' ? 'প্রশিক্ষণ কেন্দ্রসমূহ' : 'Training Centers'}
                </button>
              </div>
            </div>

            {/* Right Column: 3D Neural Stage + Floating Glass Info Cards */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl bg-gradient-to-br from-[#051F17] via-[#092A20] to-[#0E4A38] p-3 sm:p-5 shadow-[0_24px_60px_rgba(9,42,32,0.24)] border border-emerald-400/15 overflow-hidden">
                <HeroNeuralScene />

                {/* Floating Glass Cards around perimeter */}
                {hero.floatingCards?.[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="hidden sm:block absolute top-5 left-5 bg-[#07241B]/92 border border-emerald-400/25 rounded-xl px-3.5 py-2.5 text-white shadow-lg"
                  >
                    <p className="text-xs font-bold text-[#34D399]">{hero.floatingCards[0].title}</p>
                    <p className="text-[11px] text-emerald-100/80">{hero.floatingCards[0].subtitle}</p>
                  </motion.div>
                )}

                {hero.floatingCards?.[1] && (
                  <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="hidden sm:block absolute bottom-5 right-5 bg-[#07241B]/92 border border-emerald-400/25 rounded-xl px-3.5 py-2.5 text-white shadow-lg"
                  >
                    <p className="text-xs font-bold text-white">{hero.floatingCards[1].title}</p>
                    <p className="text-[11px] text-emerald-200">{hero.floatingCards[1].subtitle}</p>
                  </motion.div>
                )}
              </div>

              {/* Lab Visual Inset Card */}
              <div className="mt-4 flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
                <div className="w-20 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-[#092A20] to-[#006A4E] shrink-0">
                  <img
                    src={hero.imageUrl || '/src/assets/images/hero_ai_training_lab_1795239118441.jpg'}
                    alt="DYD AI Practical Lab Session"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#092A20] truncate">
                    {lang === 'bn'
                      ? 'প্র্যাকটিক্যাল কম্পিউটার ল্যাব ও মেন্টর গাইডেন্স'
                      : 'Practical Computer Lab & Mentor Guidance'}
                  </p>
                  <p className="text-xs text-[#526860] truncate">
                    {lang === 'bn'
                      ? 'গাইবান্ধা ও আঞ্চলিক প্রশিক্ষণ কেন্দ্রসমূহ'
                      : 'Gaibandha & Regional Training Centers'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/centers')}
                  className="text-xs font-semibold text-[#006A4E] hover:text-white hover:bg-[#006A4E] px-3 py-1.5 rounded-lg bg-[#ECF3EF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {lang === 'bn' ? 'কেন্দ্র দেখুন' : 'View Labs'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION D: PROJECT STATISTICS */}
      <section className="py-12 -mt-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((item, idx) => {
              const resolved = resolveStatValue(item);
              return (
                <RevealSection key={item.id} delay={idx * 0.06}>
                  <Tilt3DCard className="h-full bg-white border border-slate-200/90 rounded-2xl p-6 shadow-[0_8px_24px_rgba(9,42,32,0.05)] hover:shadow-[0_14px_34px_rgba(0,106,78,0.12)] transition-shadow group">
                    <p className="text-xs font-semibold text-[#006A4E] mb-2">
                      <TextFadeSwitch textKey={`stat-lbl-${item.id}-${lang}`}>
                        {lang === 'bn' ? item.labelBn : item.label}
                      </TextFadeSwitch>
                    </p>
                    <div className="text-3xl sm:text-4xl font-extrabold text-[#092A20] tracking-tight">
                      <AnimatedCounter target={resolved.num} suffix={resolved.suffix} />
                    </div>
                    <p className="mt-2 text-xs text-[#526860] leading-relaxed">
                      <TextFadeSwitch textKey={`stat-desc-${item.id}-${lang}`}>
                        {lang === 'bn' ? item.descriptionBn : item.description}
                      </TextFadeSwitch>
                    </p>
                  </Tilt3DCard>
                </RevealSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION E: TRAINING BENEFITS */}
      <section className="py-16 lg:py-20 bg-white border-y border-emerald-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="max-w-2xl mb-12 space-y-3">
            <p className="text-sm font-semibold text-[#006A4E]">
              <TextFadeSwitch textKey={`ben-eye-${lang}`}>
                {lang === 'bn' ? benefitsSection.eyebrowBn : benefitsSection.eyebrow}
              </TextFadeSwitch>
            </p>
            <h2 className="font-display heading-glide text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#092A20] tracking-tight [text-wrap:balance]">
              <AnimatedHeadline text={lang === 'bn' ? benefitsSection.headingBn : benefitsSection.heading} />
            </h2>
            <p className="text-sm sm:text-base text-[#526860] leading-relaxed">
              <TextFadeSwitch textKey={`ben-sub-${lang}`}>
                {lang === 'bn' ? benefitsSection.subtitleBn : benefitsSection.subtitle}
              </TextFadeSwitch>
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefitsSection.items.map((benefit, idx) => (
              <RevealSection key={benefit.id} delay={idx * 0.05}>
                <Tilt3DCard className="h-full bg-[#F4F8F6] hover:bg-white border border-slate-200/80 hover:border-[#006A4E]/35 rounded-2xl p-6 transition-all group">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#092A20] to-[#006A4E] text-white flex items-center justify-center mb-5 shadow-sm">
                    <IconMapper name={benefit.icon} className="w-5 h-5" />
                  </div>
                  <h3 className="font-display heading-glide text-lg font-bold text-[#092A20] group-hover:text-[#006A4E] mb-2">
                    <TextFadeSwitch textKey={`ben-t-${benefit.id}-${lang}`}>
                      {lang === 'bn' ? benefit.titleBn : benefit.title}
                    </TextFadeSwitch>
                  </h3>
                  <p className="text-sm text-[#526860] leading-relaxed">
                    {lang === 'bn' ? benefit.descriptionBn : benefit.description}
                  </p>
                </Tilt3DCard>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION F: WHY AI TRAINING MATTERS */}
      <section className="py-16 lg:py-24 bg-[#F4F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
              <RevealSection className="space-y-4">
                <p className="text-sm font-semibold text-[#006A4E]">
                  <TextFadeSwitch textKey={`why-eye-${lang}`}>
                    {lang === 'bn' ? whyAiSection.eyebrowBn : whyAiSection.eyebrow}
                  </TextFadeSwitch>
                </p>
                <h2 className="font-display heading-glide text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#092A20] tracking-tight [text-wrap:balance]">
                  <AnimatedHeadline text={lang === 'bn' ? whyAiSection.headingBn : whyAiSection.heading} />
                </h2>
                <p className="text-sm sm:text-base text-[#3F574E] leading-relaxed">
                  {lang === 'bn' ? whyAiSection.descriptionBn : whyAiSection.description}
                </p>
              </RevealSection>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {whyAiSection.cards.map((card, idx) => (
                  <RevealSection key={card.id} delay={idx * 0.06}>
                    <Tilt3DCard className="h-full bg-white border border-slate-200 hover:border-[#006A4E]/40 rounded-2xl p-5 flex flex-col justify-between transition-colors group">
                      <div>
                        <div className="w-9 h-9 rounded-lg bg-[#006A4E]/10 text-[#006A4E] flex items-center justify-center mb-3.5">
                          <IconMapper name={card.icon} className="w-4 h-4" />
                        </div>
                        <h3 className="font-display heading-glide text-base font-bold text-[#092A20] group-hover:text-[#006A4E] mb-1.5">
                          {lang === 'bn' ? card.titleBn : card.title}
                        </h3>
                        <p className="text-xs text-[#526860] leading-relaxed">
                          {lang === 'bn' ? card.descriptionBn : card.description}
                        </p>
                      </div>
                      <p className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-[#006A4E] tabular-nums">
                        {card.metric}
                      </p>
                    </Tilt3DCard>
                  </RevealSection>
                ))}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => navigate('/programs')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#092A20] hover:bg-[#006A4E] text-white font-semibold text-sm transition-colors cursor-pointer"
                >
                  {lang === 'bn' ? whyAiSection.ctaLabelBn : whyAiSection.ctaLabel}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="h-full min-h-[320px] rounded-3xl overflow-hidden border border-slate-200 bg-gradient-to-br from-[#092A20] to-[#006A4E] shadow-lg relative">
                <img
                  src={whyAiSection.imageUrl || '/src/assets/images/about_youth_innovation_1795239118248.jpg'}
                  alt="Youth AI Training & Mentorship"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[#092A20]/95 via-[#092A20]/65 to-transparent text-white">
                  <p className="text-xs font-semibold text-[#34D399]">
                    {lang === 'bn' ? 'হাতে-কলমে প্রশিক্ষণ' : 'Guided Lab Execution'}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    {lang === 'bn'
                      ? 'প্রতিটি ব্যাচে প্রজেক্ট-ভিত্তিক মূল্যায়ন ও ক্যারিয়ার প্রস্তুতি'
                      : 'Project-based assessments and career preparation in every cohort.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION G: ADMISSION PROCESS (VERTICAL TIMELINE) */}
      <section className="py-16 lg:py-24 bg-white border-y border-emerald-900/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <p className="text-sm font-semibold text-[#006A4E]">
              <TextFadeSwitch textKey={`adm-eye-${lang}`}>
                {lang === 'bn' ? admissionSection.eyebrowBn : admissionSection.eyebrow}
              </TextFadeSwitch>
            </p>
            <h2 className="font-display heading-glide text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#092A20] tracking-tight [text-wrap:balance]">
              <AnimatedHeadline text={lang === 'bn' ? admissionSection.headingBn : admissionSection.heading} />
            </h2>
            <p className="text-sm sm:text-base text-[#526860]">
              {lang === 'bn' ? admissionSection.subtitleBn : admissionSection.subtitle}
            </p>
          </RevealSection>

          <div ref={timelineRef} className="relative pl-8 sm:pl-12 space-y-6">
            <div
              aria-hidden="true"
              className="absolute left-3.5 sm:left-5 top-3 bottom-3 w-0.5 bg-slate-200 rounded-full"
            />
            <motion.div
              aria-hidden="true"
              style={{ scaleY, originY: 0 }}
              className="absolute left-3.5 sm:left-5 top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#006A4E] via-[#10B981] to-[#D92B2B] rounded-full"
            />

            {admissionSection.steps.map((step, idx) => (
              <RevealSection key={step.id} delay={idx * 0.05}>
                <div className="relative bg-[#F4F8F6] hover:bg-white border border-slate-200 hover:border-[#006A4E]/35 rounded-2xl p-5 sm:p-6 transition-all group">
                  <div
                    className={`absolute -left-8 sm:-left-12 top-6 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-sm border-2 ${
                      step.status === 'active'
                        ? 'bg-[#006A4E] text-white border-white'
                        : step.status === 'completed'
                        ? 'bg-[#15803D] text-white border-white'
                        : 'bg-white text-[#092A20] border-[#006A4E]/40'
                    }`}
                  >
                    <span className="tabular-nums">{step.stepNumber}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <h3 className="font-display heading-glide text-lg font-bold text-[#092A20] group-hover:text-[#006A4E]">
                      {lang === 'bn' ? step.titleBn : step.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#526860] font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#006A4E]" />
                      <span>{step.dateLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          step.status === 'active'
                            ? 'text-[#D92B2B] font-semibold'
                            : step.status === 'completed'
                            ? 'text-[#006A4E] font-semibold'
                            : 'text-[#526860]'
                        }
                      >
                        {step.status === 'active'
                          ? lang === 'bn'
                            ? 'চলমান'
                            : 'Active'
                          : step.status === 'completed'
                          ? lang === 'bn'
                            ? 'সম্পন্ন'
                            : 'Completed'
                          : lang === 'bn'
                          ? 'পরবর্তী ধাপ'
                          : 'Upcoming'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-[#3F574E] leading-relaxed">
                    {lang === 'bn' ? step.descriptionBn : step.description}
                  </p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION H: ELIGIBILITY REQUIREMENTS */}
      <section className="py-16 lg:py-20 bg-[#F4F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="max-w-2xl mb-10 space-y-3">
            <p className="text-sm font-semibold text-[#006A4E]">
              <TextFadeSwitch textKey={`elg-eye-${lang}`}>
                {lang === 'bn' ? eligibilitySection.eyebrowBn : eligibilitySection.eyebrow}
              </TextFadeSwitch>
            </p>
            <h2 className="font-display heading-glide text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#092A20] tracking-tight [text-wrap:balance]">
              <AnimatedHeadline text={lang === 'bn' ? eligibilitySection.headingBn : eligibilitySection.heading} />
            </h2>
            <p className="text-sm sm:text-base text-[#526860]">
              {lang === 'bn' ? eligibilitySection.subtitleBn : eligibilitySection.subtitle}
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {eligibilitySection.items.map((el, idx) => (
              <RevealSection key={el.id} delay={idx * 0.05}>
                <Tilt3DCard className="h-full bg-white border border-slate-200 hover:border-[#006A4E]/40 rounded-2xl p-6 flex flex-col justify-between transition-colors group">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#006A4E]/10 text-[#006A4E] flex items-center justify-center mb-4">
                      <IconMapper name={el.icon} className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-[#526860] mb-1">
                      {lang === 'bn' ? el.titleBn : el.title}
                    </p>
                    <h3 className="font-display heading-glide text-base font-bold text-[#092A20] group-hover:text-[#006A4E] mb-2">
                      {lang === 'bn' ? el.requirementBn : el.requirement}
                    </h3>
                    <p className="text-xs text-[#526860] leading-relaxed">
                      {lang === 'bn' ? el.detailBn : el.detail}
                    </p>
                  </div>
                </Tilt3DCard>
              </RevealSection>
            ))}
          </div>

          <p className="mt-5 text-xs text-[#526860]">
            {lang === 'bn' ? eligibilitySection.disclaimerBn : eligibilitySection.disclaimer}
          </p>
        </div>
      </section>

      {/* SECTION I: TRAINING MODULES */}
      <section className="py-16 lg:py-24 bg-white border-y border-emerald-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <RevealSection className="max-w-2xl space-y-3">
              <p className="text-sm font-semibold text-[#006A4E]">
                <TextFadeSwitch textKey={`mod-eye-${lang}`}>
                  {lang === 'bn' ? modulesSection.eyebrowBn : modulesSection.eyebrow}
                </TextFadeSwitch>
              </p>
              <h2 className="font-display heading-glide text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#092A20] tracking-tight [text-wrap:balance]">
                <AnimatedHeadline text={lang === 'bn' ? modulesSection.headingBn : modulesSection.heading} />
              </h2>
              <p className="text-sm sm:text-base text-[#526860]">
                {lang === 'bn' ? modulesSection.subtitleBn : modulesSection.subtitle}
              </p>
            </RevealSection>
            <button
              type="button"
              onClick={() => navigate('/programs')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#006A4E] hover:text-[#092A20] whitespace-nowrap shrink-0 cursor-pointer"
            >
              {lang === 'bn' ? 'সকল কোর্স ও সিলেবাস' : 'View Full Curriculum'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod, idx) => (
              <RevealSection key={mod.id} delay={idx * 0.04}>
                <Tilt3DCard
                  onClick={() => navigate(`/course/${mod.courseId || 'course-basic-ai'}`)}
                  className="h-full bg-[#F4F8F6] hover:bg-white border border-slate-200 hover:border-[#006A4E]/50 rounded-2xl p-6 cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 text-[#006A4E] group-hover:bg-[#006A4E] group-hover:text-white transition-colors flex items-center justify-center">
                        <IconMapper name={mod.icon} className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-[#526860] tabular-nums">
                        {String(mod.order).padStart(2, '0')} · {mod.hours} {lang === 'bn' ? 'ঘণ্টা' : 'Hrs'}
                      </span>
                    </div>

                    <h3 className="font-display heading-glide text-lg font-bold text-[#092A20] group-hover:text-[#006A4E] mb-2">
                      {lang === 'bn' ? mod.titleBn : mod.title}
                    </h3>
                    <p className="text-sm text-[#526860] leading-relaxed">{mod.description}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs font-semibold text-[#006A4E]">
                    <span>{mod.title}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Tilt3DCard>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION J: TRAINING REGIONS & PACKAGES */}
      <section className="py-16 lg:py-24 bg-[#F4F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="max-w-2xl mb-12 space-y-3">
            <p className="text-sm font-semibold text-[#006A4E]">
              <TextFadeSwitch textKey={`reg-eye-${lang}`}>
                {lang === 'bn' ? regionsSection.eyebrowBn : regionsSection.eyebrow}
              </TextFadeSwitch>
            </p>
            <h2 className="font-display heading-glide text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#092A20] tracking-tight [text-wrap:balance]">
              <AnimatedHeadline text={lang === 'bn' ? regionsSection.headingBn : regionsSection.heading} />
            </h2>
            <p className="text-sm sm:text-base text-[#526860]">
              {lang === 'bn' ? regionsSection.subtitleBn : regionsSection.subtitle}
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg, idx) => (
              <RevealSection key={pkg.id} delay={idx * 0.05}>
                <Tilt3DCard className="h-full bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-[#006A4E] mb-2">
                      <span>{pkg.packageNumber}</span>
                      <span className="tabular-nums text-[#526860]">
                        {pkg.districtCount} {lang === 'bn' ? 'জেলা' : 'Districts'}
                      </span>
                    </div>

                    <h3 className="font-display heading-glide text-lg font-bold text-[#092A20] group-hover:text-[#006A4E] mb-4">
                      {pkg.regionName}
                    </h3>

                    <div className="space-y-2.5 text-xs text-[#3F574E] border-t border-slate-100 pt-4">
                      <div className="flex items-start gap-2">
                        <Building2 className="w-4 h-4 text-[#006A4E] shrink-0 mt-0.5" />
                        <span>{pkg.partnerOrg}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#006A4E] shrink-0" />
                        <span className="tabular-nums">{pkg.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#006A4E] shrink-0" />
                        <span className="tabular-nums">
                          {pkg.availableCenters} {lang === 'bn' ? 'সক্রিয় কেন্দ্র' : 'Active Centers'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPackageId(pkg.regionName);
                      navigate('/centers');
                    }}
                    className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#ECF3EF] hover:bg-[#006A4E] text-[#092A20] hover:text-white font-semibold text-xs transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {lang === 'bn' ? 'কেন্দ্রের বিস্তারিত' : 'Details'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Tilt3DCard>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION K: FINAL ADMISSION CTA */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#092A20] via-[#0B4F3B] to-[#006A4E] px-6 py-14 sm:px-12 lg:px-16 text-white shadow-[0_24px_60px_rgba(9,42,32,0.25)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full border border-emerald-300/20"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-10 -bottom-24 w-64 h-64 rounded-3xl rotate-12 border border-[#D92B2B]/30 bg-white/5"
            />

            <div className="relative z-10 max-w-2xl space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight [text-wrap:balance]">
                <AnimatedHeadline text={lang === 'bn' ? ctaSection.headingBn : ctaSection.heading} />
              </h2>
              <p className="text-sm sm:text-base text-emerald-50/90 leading-relaxed">
                <TextFadeSwitch textKey={`cta-desc-${lang}`}>
                  {lang === 'bn' ? ctaSection.descriptionBn : ctaSection.description}
                </TextFadeSwitch>
              </p>
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/apply')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#092A20] hover:bg-[#34D399] hover:text-[#092A20] font-bold text-sm sm:text-base transition-colors cursor-pointer"
                >
                  {lang === 'bn' ? ctaSection.primaryLabelBn : ctaSection.primaryLabel}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/about')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/30 hover:bg-white/10 text-white font-semibold text-sm sm:text-base transition-colors cursor-pointer"
                >
                  {lang === 'bn' ? ctaSection.secondaryLabelBn : ctaSection.secondaryLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
