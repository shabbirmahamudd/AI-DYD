import { useEffect, useState } from 'react';
import { Menu, X, Megaphone, ArrowRight, User, ShieldCheck, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { TextFadeSwitch } from './motion/MotionPrimitives';

export function Navbar() {
  const { route, navigate, lang, toggleLang, bundle, studentUser, adminToken } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { siteContent } = bundle;
  const { announcement, navbar } = siteContent;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (path: string) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <div className="sticky top-0 z-50 no-print">
      {/* SECTION A: Announcement Bar */}
      {announcement.enabled && (
        <button
          type="button"
          onClick={() => handleNav(announcement.link || '/apply')}
          className="w-full bg-[#092A20] text-white text-xs sm:text-sm py-2 px-4 overflow-hidden flex items-center gap-3 border-b border-white/10 hover:bg-[#0C382B] transition-colors text-left cursor-pointer"
        >
          <span className="inline-flex items-center gap-1.5 bg-[#D92B2B] text-white px-2.5 py-0.5 rounded-md font-semibold text-xs whitespace-nowrap shrink-0 shadow-xs">
            <Megaphone className="w-3.5 h-3.5 text-white" />
            <TextFadeSwitch textKey={`ann-hl-${lang}`}>
              {lang === 'bn' ? announcement.highlightBn : announcement.highlight}
            </TextFadeSwitch>
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="animate-dyd-marquee whitespace-nowrap">
              <span className="mr-12 font-medium text-emerald-50">
                {lang === 'bn' ? announcement.textBn : announcement.text}
              </span>
              <span className="mr-12 font-medium text-emerald-50" aria-hidden="true">
                {lang === 'bn' ? announcement.textBn : announcement.text}
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#34D399] shrink-0 hidden sm:block" />
        </button>
      )}

      {/* SECTION B: Main Navigation Bar */}
      <header
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/94 backdrop-blur-md shadow-[0_8px_30px_rgba(9,42,32,0.08)] border-b border-emerald-900/10'
            : 'bg-white/85 backdrop-blur-sm border-b border-emerald-900/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => handleNav('/')}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006A4E] rounded-lg"
          >
            <BrandLogo brandName={siteContent.brandName} logoUrl={siteContent.logoUrl} />
          </button>

          <nav className="hidden xl:flex items-center gap-6" aria-label="Primary navigation">
            {navbar.links.map((item) => {
              const active = route === item.path;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.path)}
                  className={`relative py-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                    active ? 'text-[#006A4E]' : 'text-[#0F241D] hover:text-[#006A4E]'
                  }`}
                >
                  <TextFadeSwitch textKey={`nav-${item.id}-${lang}`}>
                    {lang === 'bn' ? item.labelBn : item.label}
                  </TextFadeSwitch>
                  {active && (
                    <motion.span
                      layoutId="navActiveUnderline"
                      className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-[#006A4E] to-[#D92B2B] rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={toggleLang}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#092A20] bg-[#ECF3EF] hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#006A4E]" />
              {lang === 'bn' ? 'EN' : 'বাংলা'}
            </button>

            <button
              type="button"
              onClick={() => handleNav(studentUser ? '/student/dashboard' : '/student/login')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-[#092A20] border border-slate-200 hover:border-[#006A4E] hover:text-[#006A4E] bg-white rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <TextFadeSwitch textKey={`login-${lang}-${Boolean(studentUser)}`}>
                {studentUser
                  ? lang === 'bn'
                    ? 'ড্যাশবোর্ড'
                    : 'Dashboard'
                  : lang === 'bn'
                  ? navbar.loginLabelBn
                  : navbar.loginLabel}
              </TextFadeSwitch>
            </button>

            <button
              type="button"
              onClick={() => handleNav('/apply')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#006A4E] to-[#0E805F] hover:from-[#092A20] hover:to-[#006A4E] rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <TextFadeSwitch textKey={`apply-${lang}`}>
                {lang === 'bn' ? navbar.applyLabelBn : navbar.applyLabel}
              </TextFadeSwitch>
              <ArrowRight className="w-4 h-4" />
            </button>

            {adminToken && (
              <button
                type="button"
                onClick={() => handleNav('/admin')}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-xl whitespace-nowrap shrink-0"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#006A4E]" />
                Admin
              </button>
            )}
          </div>

          <div className="flex xl:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleLang}
              className="md:hidden px-2.5 py-1.5 text-xs font-semibold bg-[#ECF3EF] text-[#092A20] rounded-lg"
            >
              {lang === 'bn' ? 'EN' : 'বাংলা'}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle Menu"
              className="p-2.5 rounded-xl border border-slate-200 text-[#092A20] hover:bg-[#ECF3EF]"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="xl:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-2 shadow-lg">
            <div className="grid grid-cols-1 gap-1">
              {navbar.links.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.path)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                    route === item.path
                      ? 'bg-[#006A4E]/10 text-[#006A4E]'
                      : 'text-[#0F241D] hover:bg-[#F4F8F6]'
                  }`}
                >
                  {lang === 'bn' ? item.labelBn : item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleNav('/admit-card')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#0F241D] hover:bg-[#F4F8F6]"
              >
                {lang === 'bn' ? 'অ্যাডমিট কার্ড ডাউনলোড' : 'Admit Card Download'}
              </button>
              <button
                type="button"
                onClick={() => handleNav('/verify-certificate')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#0F241D] hover:bg-[#F4F8F6]"
              >
                {lang === 'bn' ? 'সার্টিফিকেট যাচাই' : 'Certificate Verification'}
              </button>
            </div>
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => handleNav(studentUser ? '/student/dashboard' : '/student/login')}
                className="flex-1 py-2.5 px-4 text-sm font-semibold border border-slate-200 rounded-xl text-[#092A20]"
              >
                {studentUser
                  ? lang === 'bn'
                    ? 'স্টুডেন্ট ড্যাশবোর্ড'
                    : 'Student Dashboard'
                  : lang === 'bn'
                  ? navbar.loginLabelBn
                  : navbar.loginLabel}
              </button>
              <button
                type="button"
                onClick={() => handleNav('/apply')}
                className="flex-1 py-2.5 px-4 text-sm font-semibold bg-[#006A4E] text-white rounded-xl"
              >
                {lang === 'bn' ? navbar.applyLabelBn : navbar.applyLabel}
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
