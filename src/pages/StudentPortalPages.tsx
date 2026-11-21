import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  Award,
  Bell,
  BookOpen,
  Camera,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  KeyRound,
  Lock,
  LogOut,
  Printer,
  User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  signInWithGoogleFirebase,
  signOutFirebase,
  syncStudentProfileToFirestore,
} from '../lib/firebase';
import type {
  AdmissionApplicationItem,
  AdmitCardItem,
  CertificateItem,
  CourseItem,
  ExamResultItem,
  NoticeItem,
  NotificationItem,
  StudentUser,
} from '../types/dyd';

export function StudentLoginPage() {
  const { lang, bundle, navigate, setStudentSession } = useApp();
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [generatedResetCode, setGeneratedResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  if (!bundle.controls.studentLogin) {
    return (
      <div className="bg-[#F4F8F6] py-20 px-4">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3">
          <Lock className="w-10 h-10 text-amber-600 mx-auto" />
          <h1 className="font-display text-xl font-bold text-[#092A20]">
            {lang === 'bn' ? 'শিক্ষার্থী লগইন বন্ধ রয়েছে' : 'Student Login Disabled'}
          </h1>
          <p className="text-sm text-[#526860]">
            {lang === 'bn'
              ? 'প্রশাসনিক নির্দেশনায় শিক্ষার্থী লগইন সাময়িকভাবে বন্ধ রাখা হয়েছে।'
              : 'Student login is currently disabled by the administrator.'}
          </p>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/student/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setStudentSession(data.token, data.user);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const fbUser = await signInWithGoogleFirebase();
      const res = await fetch('/api/student/auth/google-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: fbUser.uid,
          email: fbUser.email,
          fullName: fbUser.displayName || 'Student',
          avatarUrl: fbUser.photoURL || '',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google sign-in sync failed');
      await syncStudentProfileToFirestore({
        uid: fbUser.uid,
        fullName: data.user.fullName,
        email: data.user.email,
        phone: data.user.phone,
        district: data.user.district,
        education: data.user.education,
        avatarUrl: data.user.avatarUrl,
      }).catch(() => {});
      setStudentSession(data.token, data.user);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const res = await fetch('/api/student/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate reset code');
      setGeneratedResetCode(data.resetCode || '');
      setInfo(data.message);
      setMode('reset');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request reset');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const res = await fetch('/api/student/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetCode, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Password reset failed');
      setInfo(data.message);
      setMode('login');
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F4F8F6] py-14 px-4">
      <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-7 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#006A4E]">DYD AI Student Portal</p>
          <h1 className="font-display text-2xl font-extrabold text-[#092A20]">
            {mode === 'login'
              ? lang === 'bn'
                ? 'শিক্ষার্থী লগইন'
                : 'Student Sign In'
              : mode === 'forgot'
              ? lang === 'bn'
                ? 'পাসওয়ার্ড পুনরুদ্ধার'
                : 'Forgot Password'
              : lang === 'bn'
              ? 'নতুন পাসওয়ার্ড সেট করুন'
              : 'Reset Password'}
          </h1>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {info && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium space-y-1">
            <p>{info}</p>
            {generatedResetCode && (
              <p className="font-mono-num font-bold">Verification Code: {generatedResetCode}</p>
            )}
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#092A20] mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#092A20] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-[#006A4E] font-semibold hover:underline"
              >
                {lang === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot password?'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/student/register')}
                className="text-[#092A20] font-semibold hover:underline"
              >
                {lang === 'bn' ? 'নতুন অ্যাকাউন্ট খুলুন' : 'Create account'}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#006A4E] hover:bg-[#092A20] text-white font-semibold text-sm transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in...' : lang === 'bn' ? 'লগইন করুন' : 'Sign In'}
            </button>

            <div className="relative py-2 text-center text-xs text-[#526860]">
              <span className="bg-white px-2 relative z-10">OR</span>
              <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-[#006A4E] bg-white text-[#092A20] text-sm font-semibold transition-colors"
            >
              Continue with Google (Firebase Auth)
            </button>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#092A20] mb-1">Registered Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#006A4E] text-white font-semibold text-sm"
            >
              {loading ? 'Sending...' : 'Request Reset Code'}
            </button>
            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-xs font-semibold text-[#526860]"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#092A20] mb-1">Verification Code</label>
              <input
                type="text"
                required
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono-num"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#092A20] mb-1">New Password (min 6 chars)</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#006A4E] text-white font-semibold text-sm"
            >
              {loading ? 'Updating...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function StudentRegisterPage() {
  const { lang, bundle, navigate, setStudentSession, refreshBundle } = useApp();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    district: 'Gaibandha',
    education: 'HSC / Equivalent',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!bundle.controls.studentRegistration) {
    return (
      <div className="bg-[#F4F8F6] py-20 px-4">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3">
          <Lock className="w-10 h-10 text-amber-600 mx-auto" />
          <h1 className="font-display text-xl font-bold text-[#092A20]">
            {lang === 'bn' ? 'শিক্ষার্থী নিবন্ধন বন্ধ রয়েছে' : 'Registration Closed'}
          </h1>
          <p className="text-sm text-[#526860]">
            {lang === 'bn'
              ? 'প্রশাসক কর্তৃক নতুন শিক্ষার্থী নিবন্ধন বর্তমানে বন্ধ রয়েছে।'
              : 'New student registration is currently closed by administrator.'}
          </p>
        </div>
      </div>
    );
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/student/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setStudentSession(data.token, data.user);
      refreshBundle();
      navigate('/student/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F4F8F6] py-14 px-4">
      <div className="max-w-lg mx-auto bg-white border border-slate-200 rounded-3xl p-7 sm:p-8 shadow-sm space-y-6">
        <div>
          <p className="text-xs font-semibold text-[#006A4E]">DYD AI Student Portal</p>
          <h1 className="font-display text-2xl font-extrabold text-[#092A20]">
            {lang === 'bn' ? 'শিক্ষার্থী নিবন্ধন' : 'Student Registration'}
          </h1>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#092A20] mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#092A20] mb-1">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#092A20] mb-1">Password * (min 6 chars)</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#092A20] mb-1">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#092A20] mb-1">District</label>
              <input
                type="text"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#006A4E] hover:bg-[#092A20] text-white font-semibold text-sm transition-colors"
          >
            {loading ? 'Creating account...' : lang === 'bn' ? 'নিবন্ধন সম্পন্ন করুন' : 'Create Student Account'}
          </button>

          <p className="text-center text-xs text-[#526860]">
            Already registered?{' '}
            <button
              type="button"
              onClick={() => navigate('/student/login')}
              className="text-[#006A4E] font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

interface PortalPayload {
  profile: StudentUser;
  applications: AdmissionApplicationItem[];
  admitCards: AdmitCardItem[];
  results: ExamResultItem[];
  certificates: CertificateItem[];
  notifications: NotificationItem[];
  courses: CourseItem[];
  notices: NoticeItem[];
}

export function StudentDashboardPage() {
  const { studentToken, studentUser, setStudentSession, navigate, lang, firebaseUser } = useApp();
  const [tab, setTab] = useState<'overview' | 'profile' | 'applications' | 'admit' | 'results' | 'notifications'>('overview');
  const [portal, setPortal] = useState<PortalPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: '',
    district: '',
    education: '',
  });
  const [saveMsg, setSaveMsg] = useState('');

  const loadPortal = useCallback(async () => {
    if (!studentToken) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/student/portal', {
        headers: { Authorization: `Bearer ${studentToken}` },
      });
      if (res.ok) {
        const data = (await res.json()) as PortalPayload;
        setPortal(data);
        setProfileForm({
          fullName: data.profile.fullName || '',
          phone: data.profile.phone || '',
          district: data.profile.district || '',
          education: data.profile.education || '',
        });
      }
    } catch (err) {
      console.error('Failed to load student portal:', err);
    } finally {
      setLoading(false);
    }
  }, [studentToken]);

  useEffect(() => {
    loadPortal();
  }, [loadPortal]);

  if (!studentToken || !studentUser) {
    return (
      <div className="bg-[#F4F8F6] py-20 px-4">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4">
          <KeyRound className="w-10 h-10 text-[#006A4E] mx-auto" />
          <h1 className="font-display text-xl font-bold text-[#092A20]">
            {lang === 'bn' ? 'শিক্ষার্থী লগইন প্রয়োজন' : 'Student Sign-In Required'}
          </h1>
          <p className="text-sm text-[#526860]">
            {lang === 'bn'
              ? 'আপনার আবেদন, অ্যাডমিট কার্ড, ফলাফল ও সার্টিফিকেট দেখতে লগইন করুন।'
              : 'Please sign in to access your Student Portal dashboard.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/student/login')}
            className="px-6 py-2.5 rounded-xl bg-[#006A4E] text-white text-sm font-semibold"
          >
            {lang === 'bn' ? 'লগইন পৃষ্ঠায় যান' : 'Go to Login'}
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMsg('');
    const res = await fetch('/api/student/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify(profileForm),
    });
    if (res.ok) {
      const data = await res.json();
      setStudentSession(studentToken, data.profile);
      if (firebaseUser) {
        await syncStudentProfileToFirestore({
          uid: firebaseUser.uid,
          ...profileForm,
          email: data.profile.email,
          avatarUrl: data.profile.avatarUrl,
        }).catch(() => {});
      }
      setSaveMsg('Profile updated successfully.');
      loadPortal();
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result || '');
      const res = await fetch('/api/student/upload-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ dataUrl, fileName: file.name }),
      });
      if (res.ok) {
        const data = await res.json();
        setStudentSession(studentToken, data.profile);
        loadPortal();
      }
    };
    reader.readAsDataURL(file);
  };

  const markNotifRead = async (id: string) => {
    await fetch(`/api/student/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    loadPortal();
  };

  const handleLogout = async () => {
    setStudentSession(null, null);
    await signOutFirebase().catch(() => {});
    navigate('/');
  };

  const unreadCount = portal?.notifications.filter((n) => !n.read).length || 0;

  return (
    <div className="bg-[#F4F8F6] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Student Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#092A20] text-white flex items-center justify-center overflow-hidden font-bold text-lg shrink-0">
              {studentUser.avatarUrl ? (
                <img
                  src={studentUser.avatarUrl}
                  alt={studentUser.fullName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                studentUser.fullName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h1 className="font-display text-xl font-extrabold text-[#092A20]">{studentUser.fullName}</h1>
              <p className="text-xs text-[#526860]">{studentUser.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/apply')}
              className="px-4 py-2 rounded-xl bg-[#006A4E] text-white text-xs font-semibold"
            >
              + New Application
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-white border border-slate-200 p-1.5 rounded-2xl">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'profile', label: 'Profile & Photo', icon: User },
            { id: 'applications', label: 'Applications', icon: ClipboardList },
            { id: 'admit', label: 'Admit Cards', icon: FileCheck2 },
            { id: 'results', label: 'Results & Certificates', icon: Award },
            { id: 'notifications', label: `Notifications (${unreadCount})`, icon: Bell },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id as typeof tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                  tab === t.id ? 'bg-[#006A4E] text-white' : 'text-[#475569] hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {loading || !portal ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-sm text-[#526860]">
            Loading your student portal...
          </div>
        ) : (
          <>
            {tab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <p className="text-xs text-[#526860]">Applications</p>
                    <p className="text-2xl font-extrabold text-[#092A20] tabular-nums mt-1">
                      {portal.applications.length}
                    </p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <p className="text-xs text-[#526860]">Admit Cards</p>
                    <p className="text-2xl font-extrabold text-[#092A20] tabular-nums mt-1">
                      {portal.admitCards.length}
                    </p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <p className="text-xs text-[#526860]">Exam Results</p>
                    <p className="text-2xl font-extrabold text-[#092A20] tabular-nums mt-1">
                      {portal.results.length}
                    </p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <p className="text-xs text-[#526860]">Certificates</p>
                    <p className="text-2xl font-extrabold text-[#092A20] tabular-nums mt-1">
                      {portal.certificates.length}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                    <h2 className="font-bold text-[#092A20]">Available Courses</h2>
                    {portal.courses.map((c) => (
                      <div key={c.id} className="p-4 rounded-xl bg-[#F4F8F6] border border-slate-200/70 space-y-1">
                        <p className="font-semibold text-sm text-[#092A20]">{c.title}</p>
                        <p className="text-xs text-[#526860]">{c.duration} · {c.level}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                    <h2 className="font-bold text-[#092A20]">Recent Notices</h2>
                    {portal.notices.length === 0 ? (
                      <p className="text-xs text-[#526860]">No active notices.</p>
                    ) : (
                      portal.notices.slice(0, 3).map((n) => (
                        <div key={n.id} className="p-4 rounded-xl bg-[#F4F8F6] border border-slate-200/70 space-y-1">
                          <p className="font-semibold text-sm text-[#092A20]">{n.title}</p>
                          <p className="text-xs text-[#526860]">{n.publishedDate}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {tab === 'profile' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#092A20] text-white flex items-center justify-center overflow-hidden font-bold text-xl">
                    {portal.profile.avatarUrl ? (
                      <img
                        src={portal.profile.avatarUrl}
                        alt={portal.profile.fullName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      portal.profile.fullName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-[#092A20] hover:bg-slate-50">
                    <Camera className="w-4 h-4 text-[#006A4E]" />
                    Upload Profile Picture
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>

                {saveMsg && (
                  <p className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {saveMsg}
                  </p>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#092A20] mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#092A20] mb-1">Phone</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#092A20] mb-1">District</label>
                      <input
                        type="text"
                        value={profileForm.district}
                        onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#092A20] mb-1">Education</label>
                      <input
                        type="text"
                        value={profileForm.education}
                        onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#006A4E] text-white text-sm font-semibold hover:bg-[#092A20]"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {tab === 'applications' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-[#092A20]">Submitted Applications</h2>
                  <button
                    type="button"
                    onClick={() => navigate('/apply')}
                    className="px-3.5 py-2 rounded-xl bg-[#006A4E] text-white text-xs font-semibold"
                  >
                    + Submit Application
                  </button>
                </div>
                {portal.applications.length === 0 ? (
                  <p className="text-sm text-[#526860] py-6">No applications submitted yet.</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {portal.applications.map((a) => (
                      <div key={a.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-mono-num text-sm font-bold text-[#006A4E]">{a.trackingCode}</p>
                          <p className="text-xs text-[#475569]">
                            {a.district} · Submitted {new Date(a.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-xs font-bold uppercase text-[#092A20]">{a.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'admit' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
                <h2 className="font-bold text-[#092A20]">Issued Admit Cards</h2>
                {portal.admitCards.length === 0 ? (
                  <p className="text-sm text-[#526860] py-6">
                    No admit cards issued to your account yet. Check back after application shortlisting.
                  </p>
                ) : (
                  portal.admitCards.map((c) => (
                    <div key={c.id} className="p-5 rounded-2xl border border-slate-200 bg-[#F4F8F6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-mono-num text-sm font-bold text-[#006A4E]">Roll: {c.rollNumber}</p>
                        <p className="text-sm font-semibold text-[#092A20]">{c.examVenue}</p>
                        <p className="text-xs text-[#526860]">Exam Date: {c.examDate}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-4 py-2 rounded-xl bg-[#006A4E] text-white text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <Printer className="w-4 h-4" />
                        Print Card
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'results' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
                  <h2 className="font-bold text-[#092A20]">Examination Results</h2>
                  {portal.results.length === 0 ? (
                    <p className="text-sm text-[#526860]">No published examination results yet.</p>
                  ) : (
                    portal.results.map((r) => (
                      <div key={r.id} className="p-4 rounded-xl bg-[#F4F8F6] border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm text-[#092A20]">{r.courseTitle}</p>
                          <p className="text-xs text-[#526860] font-mono-num">Roll: {r.rollNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#006A4E] tabular-nums">{r.score}% ({r.grade})</p>
                          <p className="text-xs uppercase font-semibold text-emerald-700">{r.status}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
                  <h2 className="font-bold text-[#092A20]">Earned Certificates</h2>
                  {portal.certificates.length === 0 ? (
                    <p className="text-sm text-[#526860]">No certificates issued yet.</p>
                  ) : (
                    portal.certificates.map((cert) => (
                      <div key={cert.id} className="p-4 rounded-xl bg-[#F4F8F6] border border-slate-200 space-y-1">
                        <p className="font-mono-num text-sm font-bold text-[#006A4E]">{cert.certificateCode}</p>
                        <p className="text-sm font-semibold text-[#092A20]">{cert.courseTitle}</p>
                        <p className="text-xs text-[#526860]">Issued: {cert.issueDate} · Grade: {cert.grade}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {tab === 'notifications' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3">
                <h2 className="font-bold text-[#092A20]">Notifications</h2>
                {portal.notifications.length === 0 ? (
                  <p className="text-sm text-[#526860]">You have no notifications.</p>
                ) : (
                  portal.notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 rounded-2xl border flex items-start justify-between gap-4 ${
                        n.read ? 'bg-white border-slate-200' : 'bg-emerald-50/50 border-[#006A4E]/30'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-sm text-[#092A20]">{n.title}</p>
                        <p className="text-xs text-[#475569] mt-1">{n.message}</p>
                      </div>
                      {!n.read && (
                        <button
                          type="button"
                          onClick={() => markNotifRead(n.id)}
                          className="text-xs font-semibold text-[#006A4E] whitespace-nowrap"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
