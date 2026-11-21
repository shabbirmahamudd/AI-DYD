import { Wrench } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AiChatbot } from './components/AiChatbot';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { AppProvider, useApp } from './context/AppContext';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import {
  AdmissionPage,
  AdmitCardPage,
  VerifyCertificatePage,
} from './pages/AdmissionAndVerifyPages';
import { HomePage } from './pages/HomePage';
import {
  AboutPage,
  CentersPage,
  ContactPage,
  CourseDetailsPage,
  LegalPage,
  NoticesPage,
  ProgramsPage,
} from './pages/PublicInfoPages';
import {
  StudentDashboardPage,
  StudentLoginPage,
  StudentRegisterPage,
} from './pages/StudentPortalPages';

function AppShell() {
  const { route, navigate, bundle, lang } = useApp();
  const prefersReduced = useReducedMotion();

  const isMaintenance = bundle.controls.maintenanceMode && route !== '/admin';

  const renderPage = () => {
    if (route === '/admin') return <AdminDashboardPage />;
    if (isMaintenance) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
          <div className="max-w-lg w-full bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Wrench className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-extrabold text-[#092A20]">
              {lang === 'bn' ? 'সাইটটি রক্ষণাবেক্ষণের অধীনে রয়েছে' : 'Scheduled Maintenance'}
            </h1>
            <p className="text-sm text-[#526860] leading-relaxed">
              {lang === 'bn'
                ? 'সিস্টম আপডেটের জন্য ওয়েবসাইটটি সাময়িকভাবে বন্ধ রাখা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।'
                : 'The DYD AI portal is currently undergoing scheduled maintenance. Please check back shortly.'}
            </p>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="text-xs font-semibold text-[#006A4E] hover:underline"
            >
              Administrator Sign In
            </button>
          </div>
        </div>
      );
    }

    if (route === '/' || route === '') return <HomePage />;
    if (route === '/about') return <AboutPage />;
    if (route === '/programs') return <ProgramsPage />;
    if (route.startsWith('/course/')) {
      const id = route.replace('/course/', '').trim();
      return <CourseDetailsPage courseId={id} />;
    }
    if (route === '/apply') return <AdmissionPage />;
    if (route === '/centers') return <CentersPage />;
    if (route === '/notices') return <NoticesPage />;
    if (route === '/contact') return <ContactPage />;
    if (route === '/student/login') return <StudentLoginPage />;
    if (route === '/student/register') return <StudentRegisterPage />;
    if (route === '/student/dashboard') return <StudentDashboardPage />;
    if (route === '/admit-card') return <AdmitCardPage />;
    if (route === '/verify-certificate') return <VerifyCertificatePage />;
    if (route === '/privacy-policy') return <LegalPage type="privacy" />;
    if (route === '/terms') return <LegalPage type="terms" />;
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F8F6]">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={route}
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReduced ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1"
        >
          {renderPage()}
        </motion.main>
      </AnimatePresence>
      <Footer />
      {!isMaintenance && route !== '/admin' && <AiChatbot />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </ErrorBoundary>
  );
}
