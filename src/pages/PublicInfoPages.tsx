import React, { useState } from 'react';
import {
  ArrowRight,
  BellOff,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Pin,
  Search,
  Send,
  Users,
} from 'lucide-react';
import { IconMapper } from '../components/IconMapper';
import { RevealSection, Tilt3DCard } from '../components/motion/MotionPrimitives';
import { useApp } from '../context/AppContext';

export function AboutPage() {
  const { navigate, lang, bundle } = useApp();
  const { siteContent, courses, modules, centers } = bundle;

  return (
    <div className="bg-[#F4F8F6] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <RevealSection className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-sm font-semibold text-[#006A4E]">
              {lang === 'bn' ? 'DYD AI সম্পর্কে' : 'About DYD AI'}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#092A20] tracking-tight [text-wrap:balance]">
              {lang === 'bn'
                ? 'তরুণদের জন্য আধুনিক কৃত্রিম বুদ্ধিমত্তা (AI) ও ডিজিটাল দক্ষতা উন্নয়ন প্ল্যাটফর্ম'
                : 'Practical Artificial Intelligence & Digital Skills Platform for Youth'}
            </h1>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              {lang === 'bn' ? siteContent.footer.aboutTextBn : siteContent.footer.aboutText}
            </p>
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <div>
                <p className="text-2xl font-extrabold text-[#092A20] tabular-nums">{courses.length}</p>
                <p className="text-xs text-[#526860]">{lang === 'bn' ? 'সক্রিয় কোর্স' : 'Active Courses'}</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#092A20] tabular-nums">{modules.length}</p>
                <p className="text-xs text-[#526860]">{lang === 'bn' ? 'কোর মডিউল' : 'Core Modules'}</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#092A20] tabular-nums">{centers.length}</p>
                <p className="text-xs text-[#526860]">{lang === 'bn' ? 'প্রশিক্ষণ কেন্দ্র' : 'Labs & Centers'}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/apply')}
                className="px-5 py-3 rounded-xl bg-[#006A4E] hover:bg-[#092A20] text-white font-semibold text-sm inline-flex items-center gap-2 transition-colors"
              >
                {lang === 'bn' ? 'আবেদন করুন' : 'Apply Now'}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/programs')}
                className="px-5 py-3 rounded-xl border border-slate-300 text-[#092A20] hover:border-[#006A4E] font-semibold text-sm transition-colors"
              >
                {lang === 'bn' ? 'প্রোগ্রাম দেখুন' : 'Explore Programs'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-100 sm:col-span-2">
              <img
                src="/src/assets/images/hero_ai_training_lab_1795239118441.jpg"
                alt="DYD AI Training Lab"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-100">
              <img
                src="/src/assets/images/about_youth_innovation_1795239118248.jpg"
                alt="Mentorship Session"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-100">
              <img
                src="/src/assets/images/campus_training_center_1795239118736.jpg"
                alt="Campus Training Center"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {siteContent.benefitsSection.items.map((item) => (
            <Tilt3DCard key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-[#006A4E]/10 text-[#006A4E] flex items-center justify-center mb-4">
                <IconMapper name={item.icon} className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#092A20] mb-2">
                {lang === 'bn' ? item.titleBn : item.title}
              </h3>
              <p className="text-sm text-[#526860] leading-relaxed">
                {lang === 'bn' ? item.descriptionBn : item.description}
              </p>
            </Tilt3DCard>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProgramsPage() {
  const { navigate, lang, bundle } = useApp();
  const { courses, modules } = bundle;

  return (
    <div className="bg-[#F4F8F6] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold text-[#006A4E]">
            {lang === 'bn' ? 'প্রশিক্ষণ প্রোগ্রাম' : 'Training Programs'}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#092A20] tracking-tight">
            {lang === 'bn' ? 'DYD AI কোর্স ও কারিকুলাম' : 'DYD AI Courses & Curriculum'}
          </h1>
          <p className="text-sm sm:text-base text-[#526860]">
            {lang === 'bn'
              ? 'প্রম্পট ইঞ্জিনিয়ারিং থেকে ডাটা অ্যানালাইসিস ও ফ্রিল্যান্সিং—প্রতিটি প্রোগ্রাম হাতে-কলমে অনুশীলনের জন্য তৈরি।'
              : 'Explore active training programs and structured modules engineered for applied AI proficiency.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Tilt3DCard
              key={course.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#006A4E]">
                  <span>{course.level}</span>
                  <span className="tabular-nums text-[#526860] inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration}
                  </span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#092A20]">
                  {lang === 'bn' ? course.titleBn : course.title}
                </h2>
                <p className="text-sm text-[#475569] leading-relaxed">{course.summary}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="px-4 py-2.5 rounded-xl bg-[#F4F8F6] hover:bg-slate-200 text-[#092A20] text-xs font-semibold transition-colors"
                >
                  {lang === 'bn' ? 'কোর্স বিস্তারিত' : 'Course Details'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/apply')}
                  className="px-4 py-2.5 rounded-xl bg-[#006A4E] hover:bg-[#092A20] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  {lang === 'bn' ? 'ভর্তি আবেদন করুন' : 'Apply for Cohort'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Tilt3DCard>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-[#092A20]">
            {lang === 'bn' ? 'মডিউলভিত্তিক সিলেবাস' : 'Included Training Modules'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((mod) => (
              <div key={mod.id} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#006A4E]/10 text-[#006A4E] flex items-center justify-center">
                    <IconMapper name={mod.icon} className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-[#526860] tabular-nums">
                    Module {String(mod.order).padStart(2, '0')} · {mod.hours} Hrs
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#092A20]">
                  {lang === 'bn' ? mod.titleBn : mod.title}
                </h3>
                <p className="text-sm text-[#526860] leading-relaxed">{mod.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CourseDetailsPage({ courseId }: { courseId: string }) {
  const { navigate, lang, bundle } = useApp();
  const course = bundle.courses.find((c) => c.id === courseId) || bundle.courses[0];
  const relatedModules = bundle.modules.filter((m) => !m.courseId || m.courseId === course?.id);

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#092A20]">Course Not Found</h1>
        <button
          type="button"
          onClick={() => navigate('/programs')}
          className="px-5 py-2.5 bg-[#006A4E] text-white rounded-xl text-sm font-semibold"
        >
          Back to Programs
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F8F6] py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="bg-gradient-to-br from-[#092A20] to-[#006A4E] text-white rounded-3xl p-8 sm:p-10 space-y-4 shadow-lg">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-emerald-200">
            <span>{course.level}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{course.duration}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold">
            {lang === 'bn' ? course.titleBn : course.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed">{course.summary}</p>
          <div className="pt-3 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/apply')}
              className="px-6 py-3 rounded-xl bg-white text-[#092A20] hover:bg-[#34D399] font-bold text-sm inline-flex items-center gap-2 transition-colors"
            >
              {lang === 'bn' ? 'এই কোর্সে আবেদন করুন' : 'Apply for This Course'}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/programs')}
              className="px-5 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 font-semibold text-sm transition-colors"
            >
              {lang === 'bn' ? 'সকল প্রোগ্রাম' : 'All Programs'}
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="font-display text-xl font-bold text-[#092A20]">
            {lang === 'bn' ? 'সিলেবাস ও প্রশিক্ষণ মডিউলসমূহ' : 'Syllabus & Module Breakdown'}
          </h2>
          <div className="divide-y divide-slate-100">
            {relatedModules.map((mod) => (
              <div key={mod.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F8F6] border border-slate-200 text-[#006A4E] flex items-center justify-center shrink-0">
                    <IconMapper name={mod.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#092A20]">
                      {String(mod.order).padStart(2, '0')}. {lang === 'bn' ? mod.titleBn : mod.title}
                    </h3>
                    <p className="text-sm text-[#526860] mt-1">{mod.description}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#006A4E] tabular-nums whitespace-nowrap shrink-0">
                  {mod.hours} {lang === 'bn' ? 'ঘণ্টা' : 'Hours'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CentersPage() {
  const { lang, bundle, selectedPackageId, setSelectedPackageId, navigate } = useApp();
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>(selectedPackageId || 'ALL');

  const regions = ['ALL', ...bundle.packages.map((p) => p.regionName)];
  const filtered = bundle.centers.filter((c) => {
    const matchesRegion = regionFilter === 'ALL' || c.region === regionFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q);
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="bg-[#F4F8F6] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-sm font-semibold text-[#006A4E]">
              {lang === 'bn' ? 'প্রশিক্ষণ কেন্দ্র ও আঞ্চলিক প্যাকেজ' : 'Training Centers & Regional Hubs'}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#092A20]">
              {lang === 'bn' ? 'দেশব্যাপী DYD AI প্রশিক্ষণ কেন্দ্র' : 'DYD AI Training Centers'}
            </h1>
            <p className="text-sm sm:text-base text-[#526860]">
              {lang === 'bn'
                ? 'আপনার বিভাগ ও জেলা অনুযায়ী সক্রিয় ল্যাব এবং আঞ্চলিক প্যাকেজ খুঁজে নিন।'
                : 'Search active digital training labs by region, district, or center name.'}
            </p>
          </div>
          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 aspect-[16/9] bg-slate-100">
            <img
              src="/src/assets/images/campus_training_center_1795239118736.jpg"
              alt="DYD AI Training Center Lab"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'bn' ? 'জেলা বা কেন্দ্রের নাম লিখুন...' : 'Search by district or center...'}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200">
            {regions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRegionFilter(r);
                  setSelectedPackageId(r === 'ALL' ? null : r);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  regionFilter === r
                    ? 'bg-[#006A4E] text-white'
                    : 'text-[#475569] hover:bg-slate-100'
                }`}
              >
                {r === 'ALL' ? (lang === 'bn' ? 'সকল অঞ্চল' : 'All Regions') : r}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <p className="font-semibold text-[#092A20]">
              {lang === 'bn' ? 'কোনো প্রশিক্ষণ কেন্দ্র পাওয়া যায়নি' : 'No matching centers found'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setRegionFilter('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-[#006A4E] text-white text-xs font-semibold"
            >
              {lang === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filter'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((center) => (
              <Tilt3DCard
                key={center.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#006A4E]">
                    <span>{center.district}</span>
                    <span className="text-[#526860] tabular-nums inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {center.capacity} Seats
                    </span>
                  </div>
                  <h2 className="font-display text-lg font-bold text-[#092A20]">{center.name}</h2>
                  <p className="text-xs font-medium text-[#526860] inline-flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#006A4E]" />
                    {center.region}
                  </p>
                  <p className="text-sm text-[#475569] flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#006A4E] shrink-0 mt-0.5" />
                    <span>{center.address}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/apply')}
                  className="w-full py-2.5 rounded-xl bg-[#F4F8F6] hover:bg-[#006A4E] text-[#092A20] hover:text-white text-xs font-semibold transition-colors"
                >
                  {lang === 'bn' ? 'এই কেন্দ্রে আবেদন করুন' : 'Apply to This Center'}
                </button>
              </Tilt3DCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function NoticesPage() {
  const { lang, bundle } = useApp();
  const [search, setSearch] = useState('');

  if (!bundle.controls.noticeDisplay) {
    return (
      <div className="bg-[#F4F8F6] py-20 px-4">
        <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <BellOff className="w-6 h-6" />
          </div>
          <h1 className="font-display text-xl font-bold text-[#092A20]">
            {lang === 'bn' ? 'নোটিশ বোর্ড সাময়িকভাবে বন্ধ রয়েছে' : 'Notices Temporarily Unavailable'}
          </h1>
          <p className="text-sm text-[#526860]">
            {lang === 'bn'
              ? 'প্রশাসনিক নির্দেশনায় নোটিশ প্রদর্শন বর্তমানে নিষ্ক্রিয় করা আছে।'
              : 'Public notice display is currently disabled by the site administrator.'}
          </p>
        </div>
      </div>
    );
  }

  const filtered = bundle.notices.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.body.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-[#F4F8F6] py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#006A4E]">
              {lang === 'bn' ? 'সর্বশেষ বিজ্ঞপ্তি' : 'Official Announcements'}
            </p>
            <h1 className="font-display text-3xl font-extrabold text-[#092A20]">
              {lang === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board'}
            </h1>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'bn' ? 'নোটিশ খুঁজুন...' : 'Search notices...'}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((notice) => (
            <div
              key={notice.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2.5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#526860]">
                <span className="font-semibold text-[#006A4E] inline-flex items-center gap-1.5">
                  {notice.pinned && <Pin className="w-3.5 h-3.5" />}
                  {notice.category}
                </span>
                <span className="inline-flex items-center gap-1.5 tabular-nums">
                  <Calendar className="w-3.5 h-3.5" />
                  {notice.publishedDate}
                </span>
              </div>
              <h2 className="font-display text-lg font-bold text-[#092A20]">{notice.title}</h2>
              <p className="text-sm text-[#475569] leading-relaxed">{notice.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  const { lang, bundle } = useApp();
  const { footer } = bundle.siteContent;
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit message');
      setSent(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F4F8F6] py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#006A4E]">
                {lang === 'bn' ? 'যোগাযোগ' : 'Get in Touch'}
              </p>
              <h1 className="font-display text-3xl font-extrabold text-[#092A20]">
                {lang === 'bn' ? 'DYD AI সহায়তা ডেস্ক' : 'Contact DYD AI Support'}
              </h1>
              <p className="text-sm text-[#526860] leading-relaxed">
                {lang === 'bn'
                  ? 'ভর্তি, প্রশিক্ষণ কেন্দ্র বা সার্টিফিকেট সম্পর্কিত যেকোনো প্রশ্নের জন্য আমাদের সাথে যোগাযোগ করুন।'
                  : 'Reach out to our Gaibandha coordination office for admissions, training labs, or portal inquiries.'}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#006A4E] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#092A20]">{lang === 'bn' ? 'ঠিকানা' : 'Office Address'}</p>
                  <p className="text-[#475569]">{footer.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#006A4E] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#092A20]">{lang === 'bn' ? 'ফোন' : 'Phone'}</p>
                  <p className="text-[#475569] tabular-nums">{footer.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#006A4E] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#092A20]">{lang === 'bn' ? 'ইমেইল' : 'Email'}</p>
                  <p className="text-[#475569]">{footer.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#006A4E] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#092A20]">{lang === 'bn' ? 'অফিস সময়' : 'Office Hours'}</p>
                  <p className="text-[#475569]">{footer.officeHours}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            {sent ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h2 className="font-display text-xl font-bold text-[#092A20]">
                  {lang === 'bn' ? 'আপনার বার্তা পাঠানো হয়েছে' : 'Message Received'}
                </h2>
                <p className="text-sm text-[#526860]">
                  {lang === 'bn'
                    ? 'আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।'
                    : 'Thank you for contacting DYD AI. Our team will review your inquiry shortly.'}
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="px-4 py-2 rounded-xl bg-[#006A4E] text-white text-xs font-semibold"
                >
                  {lang === 'bn' ? 'আরেকটি বার্তা পাঠান' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-display text-xl font-bold text-[#092A20]">
                  {lang === 'bn' ? 'বার্তা পাঠান' : 'Send an Inquiry'}
                </h2>
                {error && (
                  <p className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium">{error}</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#092A20] mb-1">
                      {lang === 'bn' ? 'পূর্ণ নাম *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#092A20] mb-1">
                      {lang === 'bn' ? 'ইমেইল *' : 'Email *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#092A20] mb-1">
                      {lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                    </label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#092A20] mb-1">
                      {lang === 'bn' ? 'বিষয়' : 'Subject'}
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#092A20] mb-1">
                    {lang === 'bn' ? 'বিস্তারিত বার্তা *' : 'Message *'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl bg-[#006A4E] hover:bg-[#092A20] disabled:opacity-60 text-white font-semibold text-sm inline-flex items-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {submitting
                    ? lang === 'bn'
                      ? 'পাঠানো হচ্ছে...'
                      : 'Sending...'
                    : lang === 'bn'
                    ? 'বার্তা পাঠান'
                    : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const { lang, bundle } = useApp();
  const isPrivacy = type === 'privacy';
  return (
    <div className="bg-[#F4F8F6] py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 space-y-5">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#092A20]">
          {isPrivacy
            ? lang === 'bn'
              ? 'গোপনীয়তা নীতি (Privacy Policy)'
              : 'Privacy Policy'
            : lang === 'bn'
            ? 'ব্যবহারের শর্তাবলি (Terms & Conditions)'
            : 'Terms & Conditions'}
        </h1>
        <p className="text-sm text-[#475569] leading-relaxed">
          {isPrivacy
            ? `${bundle.siteContent.brandName} collects applicant and student information solely for training admission, admit card issuance, academic assessment, and verifiable digital certification. Personal data is protected under strict access controls and never sold to third parties.`
            : `By registering on the ${bundle.siteContent.brandName} portal or submitting a training application, applicants agree to provide accurate identification details, adhere to lab attendance policies, and abide by academic integrity standards.`}
        </p>
        <p className="text-sm text-[#475569] leading-relaxed">
          Contact Office: {bundle.siteContent.footer.address} · Email: {bundle.siteContent.footer.email}
        </p>
      </div>
    </div>
  );
}
