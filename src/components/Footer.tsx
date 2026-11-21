import { MapPin, Phone, Mail, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { TextFadeSwitch } from './motion/MotionPrimitives';

export function Footer() {
  const { navigate, lang, bundle } = useApp();
  const { siteContent } = bundle;
  const { footer } = siteContent;

  return (
    <footer className="bg-[#092A20] text-emerald-50/90 pt-16 pb-10 border-t border-emerald-800/40 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand & About */}
          <div className="space-y-4">
            <BrandLogo brandName={siteContent.brandName} logoUrl={siteContent.logoUrl} light />
            <p className="text-sm leading-relaxed text-emerald-100/80">
              <TextFadeSwitch textKey={`ft-about-${lang}`}>
                {lang === 'bn' ? footer.aboutTextBn : footer.aboutText}
              </TextFadeSwitch>
            </p>
            <div className="flex items-center gap-3 pt-1">
              {footer.socialLinks.facebook && (
                <a
                  href={footer.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#006A4E] text-xs font-medium transition-colors"
                >
                  Facebook
                </a>
              )}
              {footer.socialLinks.youtube && (
                <a
                  href={footer.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#D92B2B] text-xs font-medium transition-colors"
                >
                  YouTube
                </a>
              )}
              {footer.socialLinks.linkedin && (
                <a
                  href={footer.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#006A4E] text-xs font-medium transition-colors"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide mb-4">
              {lang === 'bn' ? 'দ্রুত লিংক' : 'Quick Links'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: lang === 'bn' ? 'হোম' : 'Home', path: '/' },
                { label: lang === 'bn' ? 'প্রকল্প সম্পর্কে' : 'About DYD AI', path: '/about' },
                { label: lang === 'bn' ? 'প্রশিক্ষণ প্রোগ্রাম' : 'Training Programs', path: '/programs' },
                { label: lang === 'bn' ? 'প্রশিক্ষণ কেন্দ্র' : 'Training Centers', path: '/centers' },
                { label: lang === 'bn' ? 'নোটিশ বোর্ড' : 'Notices', path: '/notices' },
                { label: lang === 'bn' ? 'যোগাযোগ' : 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <button
                    type="button"
                    onClick={() => navigate(link.path)}
                    className="text-emerald-100/80 hover:text-[#34D399] transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Student Portal & Verification */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide mb-4">
              {lang === 'bn' ? 'শিক্ষার্থী সেবা' : 'Student Portal & Verification'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: lang === 'bn' ? 'অনলাইন ভর্তি আবেদন' : 'Admission Application', path: '/apply' },
                { label: lang === 'bn' ? 'শিক্ষার্থী নিবন্ধন' : 'Student Registration', path: '/student/register' },
                { label: lang === 'bn' ? 'শিক্ষার্থী লগইন' : 'Student Login', path: '/student/login' },
                { label: lang === 'bn' ? 'স্টুডেন্ট ড্যাশবোর্ড' : 'Student Dashboard', path: '/student/dashboard' },
                { label: lang === 'bn' ? 'অ্যাডমিট কার্ড ডাউনলোড' : 'Admit Card Download', path: '/admit-card' },
                { label: lang === 'bn' ? 'সার্টিফিকেট যাচাই' : 'Certificate Verification', path: '/verify-certificate' },
              ].map((link) => (
                <li key={link.path}>
                  <button
                    type="button"
                    onClick={() => navigate(link.path)}
                    className="text-emerald-100/80 hover:text-[#34D399] transition-colors text-left inline-flex items-center gap-1.5"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3 text-sm">
            <h3 className="text-sm font-bold text-white tracking-wide mb-4">
              {lang === 'bn' ? 'যোগাযোগের ঠিকানা' : 'Contact Information'}
            </h3>
            <div className="flex items-start gap-2.5 text-emerald-100/80">
              <MapPin className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
              <span>{footer.address}</span>
            </div>
            <div className="flex items-center gap-2.5 text-emerald-100/80">
              <Phone className="w-4 h-4 text-[#34D399] shrink-0" />
              <span className="tabular-nums">{footer.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-emerald-100/80">
              <Mail className="w-4 h-4 text-[#34D399] shrink-0" />
              <span>{footer.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-emerald-100/80">
              <Clock className="w-4 h-4 text-[#34D399] shrink-0" />
              <span>{footer.officeHours}</span>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-white transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Console
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/70">
          <p>© {new Date().getFullYear()} {footer.copyright}</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => navigate('/privacy-policy')}
              className="hover:text-white transition-colors"
            >
              {lang === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/terms')}
              className="hover:text-white transition-colors"
            >
              {lang === 'bn' ? 'শর্তাবলি' : 'Terms & Conditions'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
