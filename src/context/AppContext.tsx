import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import {
  DEFAULT_CENTERS,
  DEFAULT_CONTROLS,
  DEFAULT_COURSES,
  DEFAULT_MODULES,
  DEFAULT_NOTICES,
  DEFAULT_PACKAGES,
  DEFAULT_SITE_CONTENT,
} from '../data/defaultSiteData';
import { auth, testFirestoreConnection } from '../lib/firebase';
import type { Language, PublicBundle, StudentUser } from '../types/dyd';

interface AppContextValue {
  route: string;
  navigate: (to: string) => void;
  lang: Language;
  setLang: (l: Language) => void;
  toggleLang: () => void;
  bundle: PublicBundle;
  loadingBundle: boolean;
  refreshBundle: () => Promise<void>;
  studentToken: string | null;
  studentUser: StudentUser | null;
  setStudentSession: (token: string | null, user: StudentUser | null) => void;
  adminToken: string | null;
  adminUsername: string | null;
  adminMustChangePassword: boolean;
  setAdminSession: (token: string | null, username: string | null, mustChange?: boolean) => void;
  firebaseUser: FirebaseUser | null;
  selectedPackageId: string | null;
  setSelectedPackageId: (id: string | null) => void;
}

const INITIAL_BUNDLE: PublicBundle = {
  controls: DEFAULT_CONTROLS,
  siteContent: DEFAULT_SITE_CONTENT,
  courses: DEFAULT_COURSES,
  modules: DEFAULT_MODULES,
  centers: DEFAULT_CENTERS,
  packages: DEFAULT_PACKAGES,
  notices: DEFAULT_NOTICES,
  liveCounts: {
    students: 0,
    centers: DEFAULT_CENTERS.length,
    courses: DEFAULT_COURSES.length,
    applications: 0,
  },
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<string>(() => window.location.pathname || '/');
  const [lang, setLang] = useState<Language>('bn');
  const [bundle, setBundle] = useState<PublicBundle>(INITIAL_BUNDLE);
  const [loadingBundle, setLoadingBundle] = useState<boolean>(true);
  const [studentToken, setStudentToken] = useState<string | null>(null);
  const [studentUser, setStudentUser] = useState<StudentUser | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminUsername, setAdminUsername] = useState<string | null>(null);
  const [adminMustChangePassword, setAdminMustChangePassword] = useState<boolean>(false);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  const navigate = useCallback((to: string) => {
    if (to.startsWith('http://') || to.startsWith('https://')) {
      window.location.assign(to);
      return;
    }
    const [pathPart, hashPart] = to.split('#');
    const targetPath = pathPart || '/';
    window.history.pushState({}, '', to);
    setRoute(targetPath);
    if (hashPart) {
      window.setTimeout(() => {
        const el = document.getElementById(hashPart);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const refreshBundle = useCallback(async () => {
    try {
      const res = await fetch('/api/public/bundle');
      if (res.ok) {
        const data = (await res.json()) as PublicBundle;
        setBundle(data);
        if (data.siteContent?.brandName) {
          document.title = `${data.siteContent.brandName} — ${data.siteContent.tagline}`;
        }
        if (data.siteContent?.faviconUrl) {
          let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = data.siteContent.faviconUrl;
        }
      }
    } catch (err) {
      console.error('Failed to load public bundle:', err);
    } finally {
      setLoadingBundle(false);
    }
  }, []);

  useEffect(() => {
    refreshBundle();
    testFirestoreConnection();
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsub();
  }, [refreshBundle]);

  const setStudentSession = useCallback((token: string | null, user: StudentUser | null) => {
    setStudentToken(token);
    setStudentUser(user);
  }, []);

  const setAdminSession = useCallback(
    (token: string | null, username: string | null, mustChange = false) => {
      setAdminToken(token);
      setAdminUsername(username);
      setAdminMustChangePassword(mustChange);
    },
    [],
  );

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'bn' ? 'en' : 'bn'));
  }, []);

  return (
    <AppContext.Provider
      value={{
        route,
        navigate,
        lang,
        setLang,
        toggleLang,
        bundle,
        loadingBundle,
        refreshBundle,
        studentToken,
        studentUser,
        setStudentSession,
        adminToken,
        adminUsername,
        adminMustChangePassword,
        setAdminSession,
        firebaseUser,
        selectedPackageId,
        setSelectedPackageId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
