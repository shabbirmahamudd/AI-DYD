import React, { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  Award,
  Bell,
  BookOpen,
  Building2,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  Globe,
  KeyRound,
  Layers,
  LayoutDashboard,
  LogOut,
  MapPin,
  Megaphone,
  Plus,
  Shield,
  Sliders,
  Trash2,
  Users,
} from 'lucide-react';
import { AdminCmsEditor } from '../components/admin/AdminCmsEditor';
import { useApp } from '../context/AppContext';
import { pushAdminSiteSettingsToFirestore, signInWithGoogleFirebase } from '../lib/firebase';
import type {
  ActivityLogItem,
  AdminUserItem,
  AdmissionApplicationItem,
  AdmitCardItem,
  CertificateItem,
  ContactMessageItem,
  CourseItem,
  CourseModuleItem,
  ExamResultItem,
  NoticeItem,
  NotificationItem,
  PackageRegionItem,
  SiteContent,
  StudentUser,
  TrainingCenterItem,
  WebsiteControls,
} from '../types/dyd';

interface AdminOverviewData {
  controls: WebsiteControls;
  siteContent: SiteContent;
  courses: CourseItem[];
  modules: CourseModuleItem[];
  centers: TrainingCenterItem[];
  packages: PackageRegionItem[];
  notices: NoticeItem[];
  students: StudentUser[];
  applications: AdmissionApplicationItem[];
  admitCards: AdmitCardItem[];
  results: ExamResultItem[];
  certificates: CertificateItem[];
  notifications: NotificationItem[];
  adminUsers: AdminUserItem[];
  activityLogs: ActivityLogItem[];
  contactMessages: ContactMessageItem[];
}

type AdminSection =
  | 'dashboard'
  | 'cms'
  | 'applications'
  | 'students'
  | 'courses'
  | 'modules'
  | 'centers'
  | 'packages'
  | 'notices'
  | 'admitCards'
  | 'results'
  | 'certificates'
  | 'notifications'
  | 'roles'
  | 'logs';

export function AdminDashboardPage() {
  const {
    adminToken,
    adminUsername,
    adminMustChangePassword,
    setAdminSession,
    refreshBundle,
    firebaseUser,
  } = useApp();

  const [authStatus, setAuthStatus] = useState<{
    username: string;
    needsInitialSetup: boolean;
    mustChangePassword: boolean;
  } | null>(null);

  const [loginUser, setLoginUser] = useState('shabbir2020');
  const [loginPass, setLoginPass] = useState('');
  const [setupPass, setSetupPass] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [currPass, setCurrPass] = useState('');
  const [nextPass, setNextPass] = useState('');

  const [section, setSection] = useState<AdminSection>('dashboard');
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Quick add states
  const [newCourse, setNewCourse] = useState({ title: '', titleBn: '', summary: '', duration: '300 Hours', level: 'Applied' });
  const [newModule, setNewModule] = useState({ title: '', titleBn: '', description: '', hours: 40, order: 7, icon: 'Cpu' });
  const [newCenter, setNewCenter] = useState({ name: '', district: '', region: 'Rajshahi & Rangpur Division', address: '', capacity: 40 });
  const [newPkg, setNewPkg] = useState({ packageNumber: '', regionName: '', districtCount: 8, partnerOrg: '', duration: '50 Days', availableCenters: 2 });
  const [newNotice, setNewNotice] = useState({ title: '', body: '', category: 'Admission', pinned: false });
  const [newAdmit, setNewAdmit] = useState({ userId: '', trackingCode: '', studentName: '', examDate: '2026-12-10 10:00 AM', examVenue: 'DYD AI Gaibandha Sadar Lab (HQ)' });
  const [newResult, setNewResult] = useState({ userId: '', rollNumber: '', studentName: '', courseTitle: 'Applied AI', score: 85, grade: 'A+', status: 'passed' });
  const [newCert, setNewCert] = useState({ userId: '', studentName: '', courseTitle: 'Applied Artificial Intelligence', centerName: 'DYD AI Gaibandha Sadar Lab (HQ)', grade: 'A+' });
  const [newNotif, setNewNotif] = useState({ userId: 'ALL', title: '', message: '' });
  const [newAdminRole, setNewAdminRole] = useState({ username: '', email: '', role: 'editor' });

  useEffect(() => {
    fetch('/api/admin/auth/status')
      .then((r) => r.json())
      .then((d) => setAuthStatus(d))
      .catch(() => {});
  }, []);

  const loadOverview = useCallback(async () => {
    if (!adminToken || adminMustChangePassword) return;
    setLoadingData(true);
    try {
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = (await res.json()) as AdminOverviewData;
        setOverview(data);
      }
    } finally {
      setLoadingData(false);
    }
  }, [adminToken, adminMustChangePassword]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const handleBootstrap = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await fetch('/api/admin/auth/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'shabbir2020', password: setupPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Setup failed');
      setAdminSession(data.token, data.username, false);
      setAuthStatus({ username: 'shabbir2020', needsInitialSetup: false, mustChangePassword: false });
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Setup failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setAdminSession(data.token, data.username, Boolean(data.mustChangePassword));
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ currentPassword: currPass, newPassword: nextPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Password change failed');
      setAdminSession(adminToken, adminUsername, false);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Password change error');
    } finally {
      setAuthLoading(false);
    }
  };

  const adminPost = async (url: string, body: unknown, msg: string) => {
    if (!adminToken) return;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setFeedback(msg);
      await loadOverview();
      await refreshBundle();
    }
  };

  const adminDelete = async (url: string, msg: string) => {
    if (!adminToken) return;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (res.ok) {
      setFeedback(msg);
      await loadOverview();
      await refreshBundle();
    }
  };

  const handleSyncFirestore = async () => {
    try {
      if (!firebaseUser) {
        await signInWithGoogleFirebase();
      }
      if (overview) {
        await pushAdminSiteSettingsToFirestore({
          controls: overview.controls,
          brandName: overview.siteContent.brandName,
        });
        setFeedback('Synchronized settings with Cloud Firestore.');
      }
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Firestore sync failed');
    }
  };

  // --- First-Run Setup or Login Gate ---
  if (!adminToken) {
    return (
      <div className="min-h-[80vh] bg-[#F4F8F6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#006A4E]">DYD AI Administration</p>
            <h1 className="font-display text-2xl font-extrabold text-[#092A20]">
              {authStatus?.needsInitialSetup ? 'Initial Admin Setup' : 'Admin Console Sign In'}
            </h1>
            <p className="text-xs text-[#526860]">
              {authStatus?.needsInitialSetup
                ? 'Set the initial server-hashed password for administrator shabbir2020.'
                : 'Sign in with your administrator credentials.'}
            </p>
          </div>

          {authError && (
            <p className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {authError}
            </p>
          )}

          {authStatus?.needsInitialSetup ? (
            <form onSubmit={handleBootstrap} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#092A20] mb-1">Admin Username</label>
                <input
                  type="text"
                  readOnly
                  value="shabbir2020"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono-num"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#092A20] mb-1">
                  Create Admin Password (min 8 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={setupPass}
                  onChange={(e) => setSetupPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-[#092A20] hover:bg-[#006A4E] text-white font-semibold text-sm transition-colors"
              >
                {authLoading ? 'Configuring...' : 'Complete Initial Setup'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#092A20] mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono-num"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#092A20] mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-[#092A20] hover:bg-[#006A4E] text-white font-semibold text-sm transition-colors"
              >
                {authLoading ? 'Signing in...' : 'Sign In to Admin Panel'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- Mandatory Password Change Gate after initial login ---
  if (adminMustChangePassword) {
    return (
      <div className="min-h-[80vh] bg-[#F4F8F6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-5">
          <div className="space-y-1">
            <KeyRound className="w-8 h-8 text-[#006A4E]" />
            <h1 className="font-display text-xl font-extrabold text-[#092A20]">
              Password Change Required
            </h1>
            <p className="text-xs text-[#526860]">
              For security, please replace your initial environment password before accessing admin controls.
            </p>
          </div>
          {authError && (
            <p className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium">{authError}</p>
          )}
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Initial Password</label>
              <input
                type="password"
                required
                value={currPass}
                onChange={(e) => setCurrPass(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">New Password (min 8 chars)</label>
              <input
                type="password"
                required
                minLength={8}
                value={nextPass}
                onChange={(e) => setNextPass(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl bg-[#006A4E] text-white font-semibold text-sm"
            >
              {authLoading ? 'Updating...' : 'Update Password & Enter Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navItems: { id: AdminSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Analytics Overview', icon: LayoutDashboard },
    { id: 'cms', label: 'Website Editor & Controls', icon: Sliders },
    { id: 'applications', label: 'Applications', icon: ClipboardList },
    { id: 'students', label: 'Students & Users', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'modules', label: 'Course Modules', icon: Layers },
    { id: 'centers', label: 'Training Centers', icon: MapPin },
    { id: 'packages', label: 'Regional Packages', icon: Building2 },
    { id: 'notices', label: 'Notices', icon: Megaphone },
    { id: 'admitCards', label: 'Admit Cards', icon: FileCheck2 },
    { id: 'results', label: 'Results', icon: Award },
    { id: 'certificates', label: 'Certificates', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'roles', label: 'Admin Roles', icon: KeyRound },
    { id: 'logs', label: 'Activity Logs & Inbox', icon: Activity },
  ];

  const pendingApps = overview?.applications.filter((a) => a.status === 'pending').length || 0;
  const approvedApps = overview?.applications.filter((a) => a.status === 'approved').length || 0;
  const shortlistedApps = overview?.applications.filter((a) => a.status === 'shortlisted').length || 0;
  const rejectedApps = overview?.applications.filter((a) => a.status === 'rejected').length || 0;
  const totalApps = overview?.applications.length || 0;

  return (
    <div className="bg-[#F4F8F6] min-h-[85vh] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Admin Sidebar */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-[#092A20] text-white rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-emerald-300 font-semibold">Super Admin</p>
                  <p className="font-mono-num font-bold text-base">{adminUsername}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminSession(null, null, false)}
                  title="Sign Out"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleSyncFirestore}
                className="w-full py-2 px-3 rounded-xl bg-[#006A4E] hover:bg-[#0E805F] text-xs font-semibold inline-flex items-center justify-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                {firebaseUser ? 'Sync Cloud Firestore' : 'Connect Google Firestore'}
              </button>
            </div>

            <nav className="bg-white border border-slate-200 rounded-2xl p-2 space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSection(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                      section === item.id
                        ? 'bg-[#006A4E] text-white'
                        : 'text-[#475569] hover:bg-[#F4F8F6] hover:text-[#092A20]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Admin Workspace */}
          <main className="lg:col-span-9 space-y-6">
            {feedback && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {feedback}
                </span>
                <button type="button" onClick={() => setFeedback('')} className="underline">
                  Dismiss
                </button>
              </div>
            )}

            {loadingData || !overview ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-sm text-[#526860]">
                Loading admin workspace...
              </div>
            ) : (
              <>
                {section === 'dashboard' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: 'Total Students', val: overview.students.length },
                        { label: 'Applications', val: totalApps },
                        { label: 'Pending Review', val: pendingApps },
                        { label: 'Approved', val: approvedApps },
                        { label: 'Active Courses', val: overview.courses.length },
                        { label: 'Training Centers', val: overview.centers.length },
                        { label: 'Admit Cards', val: overview.admitCards.length },
                        { label: 'Certificates', val: overview.certificates.length },
                      ].map((kpi) => (
                        <div key={kpi.label} className="bg-white border border-slate-200 rounded-2xl p-5">
                          <p className="text-xs text-[#526860]">{kpi.label}</p>
                          <p className="text-2xl font-extrabold text-[#092A20] tabular-nums mt-1">{kpi.val}</p>
                        </div>
                      ))}
                    </div>

                    {/* SVG Analytics Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                        <h3 className="font-bold text-sm text-[#092A20]">Application Pipeline Breakdown</h3>
                        <div className="space-y-3">
                          {[
                            { label: 'Pending', count: pendingApps, color: '#D97706' },
                            { label: 'Shortlisted', count: shortlistedApps, color: '#0E805F' },
                            { label: 'Approved', count: approvedApps, color: '#16A34A' },
                            { label: 'Rejected', count: rejectedApps, color: '#DC2626' },
                          ].map((bar) => {
                            const pct = totalApps > 0 ? Math.round((bar.count / totalApps) * 100) : 0;
                            return (
                              <div key={bar.label} className="space-y-1">
                                <div className="flex justify-between text-xs font-medium">
                                  <span>{bar.label}</span>
                                  <span className="tabular-nums font-mono-num">
                                    {bar.count} ({pct}%)
                                  </span>
                                </div>
                                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    style={{ width: `${pct}%`, backgroundColor: bar.color }}
                                    className="h-full rounded-full transition-all"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                        <h3 className="font-bold text-sm text-[#092A20]">Center Seat Capacity by Location</h3>
                        <svg viewBox="0 0 360 170" className="w-full h-44">
                          {overview.centers.slice(0, 6).map((c, idx) => {
                            const barHeight = Math.min(115, Math.max(18, (c.capacity / 60) * 115));
                            const x = 16 + idx * 56;
                            const y = 135 - barHeight;
                            return (
                              <g key={c.id}>
                                <rect x={x} y={y} width={34} height={barHeight} rx={6} fill="#006A4E" />
                                <text x={x + 17} y={y - 6} textAnchor="middle" fontSize="10" fill="#092A20" fontWeight="700">
                                  {c.capacity}
                                </text>
                                <text x={x + 17} y={154} textAnchor="middle" fontSize="9" fill="#526860">
                                  {c.district.slice(0, 7)}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {section === 'cms' && (
                  <AdminCmsEditor
                    adminToken={adminToken}
                    siteContent={overview.siteContent}
                    controls={overview.controls}
                    onSaved={async () => {
                      await loadOverview();
                      await refreshBundle();
                    }}
                    onControlsChange={async (next) => {
                      const res = await fetch('/api/admin/controls', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${adminToken}`,
                        },
                        body: JSON.stringify(next),
                      });
                      if (res.ok) {
                        setFeedback('Website control switches updated.');
                        await loadOverview();
                        await refreshBundle();
                      }
                    }}
                  />
                )}

                {section === 'applications' && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                    <h2 className="font-bold text-[#092A20]">Admission Applications ({overview.applications.length})</h2>
                    {overview.applications.length === 0 ? (
                      <p className="text-sm text-[#526860]">No applications submitted yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="border-b border-slate-200 text-[#526860]">
                            <tr>
                              <th className="py-2 pr-3">Tracking</th>
                              <th className="py-2 pr-3">Applicant</th>
                              <th className="py-2 pr-3">District</th>
                              <th className="py-2 pr-3">Status</th>
                              <th className="py-2 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {overview.applications.map((a) => (
                              <tr key={a.id}>
                                <td className="py-3 pr-3 font-mono-num font-semibold text-[#006A4E]">{a.trackingCode}</td>
                                <td className="py-3 pr-3">
                                  <p className="font-semibold text-[#092A20]">{a.fullName}</p>
                                  <p className="text-[#526860]">{a.phone} · {a.email}</p>
                                </td>
                                <td className="py-3 pr-3">{a.district}</td>
                                <td className="py-3 pr-3 uppercase font-bold">{a.status}</td>
                                <td className="py-3 text-right space-x-1.5 whitespace-nowrap">
                                  {(['pending', 'shortlisted', 'approved', 'rejected'] as const).map((st) => (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={async () => {
                                        await fetch(`/api/admin/applications/${a.id}/status`, {
                                          method: 'PATCH',
                                          headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: `Bearer ${adminToken}`,
                                          },
                                          body: JSON.stringify({ status: st }),
                                        });
                                        setFeedback(`Application ${a.trackingCode} marked ${st}.`);
                                        loadOverview();
                                      }}
                                      className={`px-2 py-1 rounded text-[11px] font-semibold capitalize ${
                                        a.status === st ? 'bg-[#006A4E] text-white' : 'bg-slate-100 text-slate-700'
                                      }`}
                                    >
                                      {st}
                                    </button>
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => adminDelete(`/api/admin/applications/${a.id}`, 'Application deleted.')}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 inline" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {section === 'students' && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                    <h2 className="font-bold text-[#092A20]">Registered Students ({overview.students.length})</h2>
                    {overview.students.length === 0 ? (
                      <p className="text-sm text-[#526860]">No registered student accounts yet.</p>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {overview.students.map((stu) => (
                          <div key={stu.uid} className="py-3 flex items-center justify-between gap-4 text-xs">
                            <div>
                              <p className="font-bold text-[#092A20]">{stu.fullName}</p>
                              <p className="text-[#526860]">{stu.email} · {stu.district || 'N/A'}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => adminDelete(`/api/admin/students/${stu.uid}`, 'Student removed.')}
                              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {section === 'courses' && (
                  <div className="space-y-6">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        adminPost('/api/admin/courses', newCourse, 'Course saved.');
                        setNewCourse({ title: '', titleBn: '', summary: '', duration: '300 Hours', level: 'Applied' });
                      }}
                      className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3"
                    >
                      <h3 className="font-bold text-sm text-[#092A20]">Add / Update Course</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          required
                          placeholder="Course Title (EN)"
                          value={newCourse.title}
                          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                          className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                        />
                        <input
                          required
                          placeholder="Course Title (BN)"
                          value={newCourse.titleBn}
                          onChange={(e) => setNewCourse({ ...newCourse, titleBn: e.target.value })}
                          className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                        />
                        <input
                          placeholder="Duration"
                          value={newCourse.duration}
                          onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                          className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                        />
                        <input
                          placeholder="Level"
                          value={newCourse.level}
                          onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                          className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                        />
                      </div>
                      <textarea
                        rows={2}
                        required
                        placeholder="Course Summary"
                        value={newCourse.summary}
                        onChange={(e) => setNewCourse({ ...newCourse, summary: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                      <button type="submit" className="px-4 py-2 rounded-xl bg-[#006A4E] text-white text-xs font-semibold inline-flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" /> Save Course
                      </button>
                    </form>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                      {overview.courses.map((c) => (
                        <div key={c.id} className="p-3 rounded-xl bg-[#F4F8F6] flex items-center justify-between gap-3 text-xs">
                          <div>
                            <p className="font-bold text-[#092A20]">{c.title}</p>
                            <p className="text-[#526860]">{c.duration} · {c.level}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => adminDelete(`/api/admin/courses/${c.id}`, 'Course deleted.')}
                            className="p-2 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section === 'modules' && (
                  <div className="space-y-6">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        adminPost('/api/admin/modules', newModule, 'Module added.');
                        setNewModule({ title: '', titleBn: '', description: '', hours: 40, order: overview.modules.length + 2, icon: 'Cpu' });
                      }}
                      className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3"
                    >
                      <h3 className="font-bold text-sm text-[#092A20]">Add Training Module</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input required placeholder="Module Title (EN)" value={newModule.title} onChange={(e) => setNewModule({ ...newModule, title: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                        <input required placeholder="Module Title (BN)" value={newModule.titleBn} onChange={(e) => setNewModule({ ...newModule, titleBn: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                        <input type="number" placeholder="Hours" value={newModule.hours} onChange={(e) => setNewModule({ ...newModule, hours: Number(e.target.value) })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                      </div>
                      <input required placeholder="Module Description" value={newModule.description} onChange={(e) => setNewModule({ ...newModule, description: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                      <button type="submit" className="px-4 py-2 rounded-xl bg-[#006A4E] text-white text-xs font-semibold">+ Add Module</button>
                    </form>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
                      {overview.modules.map((m) => (
                        <div key={m.id} className="p-3 rounded-xl bg-[#F4F8F6] flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-[#092A20]">{m.order}. {m.title} ({m.titleBn})</p>
                            <p className="text-[#526860]">{m.hours} Hours</p>
                          </div>
                          <button type="button" onClick={() => adminDelete(`/api/admin/modules/${m.id}`, 'Module deleted.')} className="p-1.5 text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section === 'centers' && (
                  <div className="space-y-6">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        adminPost('/api/admin/centers', newCenter, 'Training center added.');
                        setNewCenter({ name: '', district: '', region: 'Rajshahi & Rangpur Division', address: '', capacity: 40 });
                      }}
                      className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3"
                    >
                      <h3 className="font-bold text-sm text-[#092A20]">Add Training Center</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input required placeholder="Center Name" value={newCenter.name} onChange={(e) => setNewCenter({ ...newCenter, name: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                        <input required placeholder="District" value={newCenter.district} onChange={(e) => setNewCenter({ ...newCenter, district: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                        <input required placeholder="Region" value={newCenter.region} onChange={(e) => setNewCenter({ ...newCenter, region: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                        <input type="number" placeholder="Seat Capacity" value={newCenter.capacity} onChange={(e) => setNewCenter({ ...newCenter, capacity: Number(e.target.value) })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                      </div>
                      <input required placeholder="Full Address" value={newCenter.address} onChange={(e) => setNewCenter({ ...newCenter, address: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                      <button type="submit" className="px-4 py-2 rounded-xl bg-[#006A4E] text-white text-xs font-semibold">+ Add Center</button>
                    </form>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
                      {overview.centers.map((c) => (
                        <div key={c.id} className="p-3 rounded-xl bg-[#F4F8F6] flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-[#092A20]">{c.name}</p>
                            <p className="text-[#526860]">{c.district} · {c.address}</p>
                          </div>
                          <button type="button" onClick={() => adminDelete(`/api/admin/centers/${c.id}`, 'Center deleted.')} className="p-1.5 text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section === 'packages' && (
                  <div className="space-y-6">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        adminPost('/api/admin/packages', newPkg, 'Regional package saved.');
                        setNewPkg({ packageNumber: '', regionName: '', districtCount: 8, partnerOrg: '', duration: '50 Days', availableCenters: 2 });
                      }}
                      className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3"
                    >
                      <h3 className="font-bold text-sm text-[#092A20]">Add Regional Package</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input required placeholder="Package No (e.g. Package 05)" value={newPkg.packageNumber} onChange={(e) => setNewPkg({ ...newPkg, packageNumber: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                        <input required placeholder="Region Name" value={newPkg.regionName} onChange={(e) => setNewPkg({ ...newPkg, regionName: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                        <input required placeholder="Partner Organization" value={newPkg.partnerOrg} onChange={(e) => setNewPkg({ ...newPkg, partnerOrg: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                      </div>
                      <button type="submit" className="px-4 py-2 rounded-xl bg-[#006A4E] text-white text-xs font-semibold">+ Save Package</button>
                    </form>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
                      {overview.packages.map((p) => (
                        <div key={p.id} className="p-3 rounded-xl bg-[#F4F8F6] flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-[#092A20]">{p.packageNumber} — {p.regionName}</p>
                            <p className="text-[#526860]">{p.partnerOrg} · {p.districtCount} Districts</p>
                          </div>
                          <button type="button" onClick={() => adminDelete(`/api/admin/packages/${p.id}`, 'Package deleted.')} className="p-1.5 text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section === 'notices' && (
                  <div className="space-y-6">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        adminPost('/api/admin/notices', newNotice, 'Notice published.');
                        setNewNotice({ title: '', body: '', category: 'Admission', pinned: false });
                      }}
                      className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3"
                    >
                      <h3 className="font-bold text-sm text-[#092A20]">Publish Notice</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input required placeholder="Notice Title" value={newNotice.title} onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                        <input placeholder="Category" value={newNotice.category} onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                      </div>
                      <textarea required rows={3} placeholder="Notice Body" value={newNotice.body} onChange={(e) => setNewNotice({ ...newNotice, body: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                      <button type="submit" className="px-4 py-2 rounded-xl bg-[#006A4E] text-white text-xs font-semibold">Publish Notice</button>
                    </form>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
                      {overview.notices.map((n) => (
                        <div key={n.id} className="p-3 rounded-xl bg-[#F4F8F6] flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-[#092A20]">{n.title}</p>
                            <p className="text-[#526860]">{n.category} · {n.publishedDate}</p>
                          </div>
                          <button type="button" onClick={() => adminDelete(`/api/admin/notices/${n.id}`, 'Notice deleted.')} className="p-1.5 text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section === 'admitCards' && (
                  <div className="space-y-6">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        adminPost('/api/admin/admit-cards', newAdmit, 'Admit card issued.');
                      }}
                      className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3"
                    >
                      <h3 className="font-bold text-sm text-[#092A20]">Issue Admit Card</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input placeholder="Student UID (from Students tab)" value={newAdmit.userId} onChange={(e) => setNewAdmit({ ...newAdmit, userId: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono-num" />
                        <input required placeholder="Tracking Code" value={newAdmit.trackingCode} onChange={(e) => setNewAdmit({ ...newAdmit, trackingCode: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono-num" />
                        <input required placeholder="Student Full Name" value={newAdmit.studentName} onChange={(e) => setNewAdmit({ ...newAdmit, studentName: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                        <input required placeholder="Exam Date & Time" value={newAdmit.examDate} onChange={(e) => setNewAdmit({ ...newAdmit, examDate: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                      </div>
                      <input required placeholder="Exam Venue" value={newAdmit.examVenue} onChange={(e) => setNewAdmit({ ...newAdmit, examVenue: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                      <button type="submit" className="px-4 py-2 rounded-xl bg-[#006A4E] text-white text-xs font-semibold">Issue Admit Card</button>
                    </form>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
                      {overview.admitCards.map((c) => (
                        <div key={c.id} className="p-3 rounded-xl bg-[#F4F8F6] text-xs flex justify-between">
                          <div>
                            <p className="font-bold font-mono-num text-[#006A4E]">{c.rollNumber} · {c.trackingCode}</p>
                            <p className="text-[#092A20]">{c.studentName} — {c.examVenue}</p>
                          </div>
                          <span className="text-[#526860]">{c.examDate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section === 'results' && (
                  <div className="space-y-6">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        adminPost('/api/admin/results', newResult, 'Result published.');
                      }}
                      className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3"
                    >
                      <h3 className="font-bold text-sm text-[#092A20]">Publish Examination Result</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input required placeholder="Student UID" value={newResult.userId} onChange={(e) => setNewResult({ ...newResult, userId: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono-num" />
                        <input required placeholder="Roll Number" value={newResult.rollNumber} onChange={(e) => setNewResult({ ...newResult, rollNumber: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono-num" />
                        <input required placeholder="Student Name" value={newResult.studentName} onChange={(e) => setNewResult({ ...newResult, studentName: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                        <input type="number" placeholder="Score (0-100)" value={newResult.score} onChange={(e) => setNewResult({ ...newResult, score: Number(e.target.value) })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                        <input placeholder="Grade" value={newResult.grade} onChange={(e) => setNewResult({ ...newResult, grade: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                        <select value={newResult.status} onChange={(e) => setNewResult({ ...newResult, status: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs">
                          <option value="passed">Passed</option>
                          <option value="merit">Merit</option>
                          <option value="pending">Pending</option>
                          <option value="failed">Failed</option>
                        </select>
                      </div>
                      <button type="submit" className="px-4 py-2 rounded-xl bg-[#006A4E] text-white text-xs font-semibold">Publish Result</button>
                    </form>
                  </div>
                )}

                {section === 'certificates' && (
                  <div className="space-y-6">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        adminPost('/api/admin/certificates', newCert, 'Certificate issued and verifiable.');
                      }}
                      className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3"
                    >
                      <h3 className="font-bold text-sm text-[#092A20]">Issue Verifiable Certificate</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input required placeholder="Student Full Name" value={newCert.studentName} onChange={(e) => setNewCert({ ...newCert, studentName: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                        <input placeholder="Student UID (optional)" value={newCert.userId} onChange={(e) => setNewCert({ ...newCert, userId: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono-num" />
                        <input required placeholder="Course Title" value={newCert.courseTitle} onChange={(e) => setNewCert({ ...newCert, courseTitle: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                        <input placeholder="Grade" value={newCert.grade} onChange={(e) => setNewCert({ ...newCert, grade: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                      </div>
                      <button type="submit" className="px-4 py-2 rounded-xl bg-[#006A4E] text-white text-xs font-semibold">Issue Certificate</button>
                    </form>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
                      {overview.certificates.map((cert) => (
                        <div key={cert.id} className="p-3 rounded-xl bg-[#F4F8F6] text-xs flex items-center justify-between">
                          <div>
                            <p className="font-bold font-mono-num text-[#006A4E]">{cert.certificateCode}</p>
                            <p className="text-[#092A20]">{cert.studentName} · {cert.courseTitle}</p>
                          </div>
                          <span className={cert.revoked ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>
                            {cert.revoked ? 'REVOKED' : 'ACTIVE'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section === 'notifications' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      adminPost('/api/admin/notifications', newNotif, 'Notification dispatched.');
                      setNewNotif({ userId: 'ALL', title: '', message: '' });
                    }}
                    className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3"
                  >
                    <h3 className="font-bold text-sm text-[#092A20]">Send Student Notification</h3>
                    <input placeholder="Target Student UID or ALL" value={newNotif.userId} onChange={(e) => setNewNotif({ ...newNotif, userId: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono-num" />
                    <input required placeholder="Notification Title" value={newNotif.title} onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                    <textarea required rows={3} placeholder="Message" value={newNotif.message} onChange={(e) => setNewNotif({ ...newNotif, message: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                    <button type="submit" className="px-4 py-2 rounded-xl bg-[#006A4E] text-white text-xs font-semibold">Send Notification</button>
                  </form>
                )}

                {section === 'roles' && (
                  <div className="space-y-6">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        adminPost('/api/admin/roles', newAdminRole, 'Admin role updated.');
                        setNewAdminRole({ username: '', email: '', role: 'editor' });
                      }}
                      className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3"
                    >
                      <h3 className="font-bold text-sm text-[#092A20]">Manage Admin Roles</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input required placeholder="Username" value={newAdminRole.username} onChange={(e) => setNewAdminRole({ ...newAdminRole, username: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                        <input required type="email" placeholder="Email" value={newAdminRole.email} onChange={(e) => setNewAdminRole({ ...newAdminRole, email: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                        <select value={newAdminRole.role} onChange={(e) => setNewAdminRole({ ...newAdminRole, role: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 text-xs">
                          <option value="super_admin">Super Admin</option>
                          <option value="editor">Content Editor</option>
                          <option value="reviewer">Application Reviewer</option>
                        </select>
                      </div>
                      <button type="submit" className="px-4 py-2 rounded-xl bg-[#006A4E] text-white text-xs font-semibold">Save Role</button>
                    </form>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
                      {overview.adminUsers.map((au) => (
                        <div key={au.id} className="p-3 rounded-xl bg-[#F4F8F6] flex justify-between text-xs">
                          <span className="font-bold font-mono-num text-[#092A20]">{au.username} ({au.email})</span>
                          <span className="uppercase font-semibold text-[#006A4E]">{au.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section === 'logs' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                      <h3 className="font-bold text-sm text-[#092A20]">Activity Logs</h3>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {overview.activityLogs.map((l) => (
                          <div key={l.id} className="p-2.5 rounded-xl bg-[#F4F8F6] text-xs">
                            <p className="font-semibold text-[#092A20]">{l.action} · {l.target}</p>
                            <p className="text-[#526860]">{l.actor} · {new Date(l.createdAt).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                      <h3 className="font-bold text-sm text-[#092A20]">Contact Inquiries</h3>
                      {overview.contactMessages.length === 0 ? (
                        <p className="text-xs text-[#526860]">No contact inquiries yet.</p>
                      ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {overview.contactMessages.map((m) => (
                            <div key={m.id} className="p-3 rounded-xl bg-[#F4F8F6] text-xs space-y-1">
                              <p className="font-bold text-[#092A20]">{m.subject} — {m.name}</p>
                              <p className="text-[#526860]">{m.email} · {m.phone}</p>
                              <p className="text-[#475569]">{m.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
