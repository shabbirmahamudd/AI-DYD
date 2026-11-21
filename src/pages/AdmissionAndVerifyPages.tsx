import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSearch,
  Lock,
  Printer,
  Search,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { syncApplicationToFirestore, verifyCertificateInFirestore } from '../lib/firebase';
import type { AdmissionApplicationItem, AdmitCardItem, CertificateItem } from '../types/dyd';

export function AdmissionPage() {
  const { lang, bundle, studentToken, studentUser, firebaseUser, navigate, refreshBundle } = useApp();
  const [tab, setTab] = useState<'apply' | 'track'>('apply');
  const [form, setForm] = useState({
    fullName: studentUser?.fullName || '',
    email: studentUser?.email || '',
    phone: studentUser?.phone || '',
    nidOrBirthReg: '',
    dateOfBirth: '',
    educationLevel: 'HSC / Equivalent',
    district: studentUser?.district || 'Gaibandha',
    centerId: bundle.centers[0]?.id || '',
    courseId: bundle.courses[0]?.id || '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<AdmissionApplicationItem | null>(null);
  const [error, setError] = useState('');

  const [trackCode, setTrackCode] = useState('');
  const [trackResult, setTrackResult] = useState<Partial<AdmissionApplicationItem> | null>(null);
  const [trackError, setTrackError] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);

  const applicationsEnabled = bundle.controls.admissionApplications && bundle.controls.courseEnrollment;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (studentToken) headers.Authorization = `Bearer ${studentToken}`;
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers,
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit application');
      const created = data.application as AdmissionApplicationItem;
      if (firebaseUser) {
        try {
          await syncApplicationToFirestore({
            id: created.id,
            trackingCode: created.trackingCode,
            fullName: created.fullName,
            email: created.email,
            phone: created.phone,
            nidOrBirthReg: created.nidOrBirthReg,
            dateOfBirth: created.dateOfBirth,
            educationLevel: created.educationLevel,
            district: created.district,
            centerId: created.centerId,
            courseId: created.courseId,
          });
        } catch (fsErr) {
          console.warn('Firestore application sync skipped/failed:', fsErr);
        }
      }
      setSubmittedApp(created);
      refreshBundle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    setTrackResult(null);
    setTrackingLoading(true);
    try {
      const res = await fetch(`/api/applications/track/${encodeURIComponent(trackCode.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Application not found');
      setTrackResult(data);
    } catch (err) {
      setTrackError(err instanceof Error ? err.message : 'Unable to track application');
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="bg-[#F4F8F6] py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#006A4E]">
              {lang === 'bn' ? 'ভর্তি পোর্টাল' : 'Admission Portal'}
            </p>
            <h1 className="font-display text-3xl font-extrabold text-[#092A20]">
              {lang === 'bn' ? 'অনলাইন ভর্তি আবেদন ও ট্র্যাকিং' : 'Online Admission Application'}
            </h1>
          </div>

          <div className="inline-flex bg-white border border-slate-200 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setTab('apply')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'apply' ? 'bg-[#006A4E] text-white' : 'text-[#475569] hover:text-[#092A20]'
              }`}
            >
              {lang === 'bn' ? 'নতুন আবেদন' : 'Submit Application'}
            </button>
            <button
              type="button"
              onClick={() => setTab('track')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'track' ? 'bg-[#006A4E] text-white' : 'text-[#475569] hover:text-[#092A20]'
              }`}
            >
              {lang === 'bn' ? 'আবেদন ট্র্যাক করুন' : 'Track Status'}
            </button>
          </div>
        </div>

        {tab === 'apply' ? (
          !applicationsEnabled ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="font-display text-xl font-bold text-[#092A20]">
                {lang === 'bn' ? 'অনলাইন আবেদন বর্তমানে বন্ধ রয়েছে' : 'Applications Currently Closed'}
              </h2>
              <p className="text-sm text-[#526860]">
                {lang === 'bn'
                  ? 'প্রশাসন কর্তৃক ভর্তি আবেদন বা কোর্স এনরোলমেন্ট সাময়িকভাবে বন্ধ রাখা হয়েছে। অনুগ্রহ করে নোটিশ বোর্ড দেখুন।'
                  : 'Admission applications or course enrollment is currently paused by the administrator.'}
              </p>
            </div>
          ) : submittedApp ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 text-center space-y-5 shadow-sm">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
              <h2 className="font-display text-2xl font-bold text-[#092A20]">
                {lang === 'bn' ? 'আপনার আবেদন সফলভাবে গৃহীত হয়েছে!' : 'Application Submitted Successfully'}
              </h2>
              <p className="text-sm text-[#475569]">
                {lang === 'bn'
                  ? 'নিচের ট্র্যাকিং কোডটি সংরক্ষণ করুন। অ্যাডমিট কার্ড ও স্ট্যাটাস জানতে এটি প্রয়োজন হবে।'
                  : 'Save your tracking code below to monitor approval status and download your admit card.'}
              </p>
              <div className="max-w-sm mx-auto bg-[#F4F8F6] border border-slate-200 rounded-2xl p-4">
                <p className="text-xs text-[#526860]">Tracking Code</p>
                <p className="text-xl font-bold text-[#006A4E] font-mono-num mt-1">
                  {submittedApp.trackingCode}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTrackCode(submittedApp.trackingCode);
                    setTab('track');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#006A4E] text-white text-sm font-semibold"
                >
                  {lang === 'bn' ? 'স্ট্যাটাস ট্র্যাক করুন' : 'Track Application'}
                </button>
                <button
                  type="button"
                  onClick={() => setSubmittedApp(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-[#092A20] text-sm font-semibold"
                >
                  {lang === 'bn' ? 'আরেকটি আবেদন' : 'Submit Another'}
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm"
            >
              {!studentUser && (
                <div className="bg-[#F4F8F6] border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs text-[#475569]">
                    {lang === 'bn'
                      ? 'স্টুডেন্ট অ্যাকাউন্টে লগইন করে আবেদন করলে ড্যাশবোর্ডে সব তথ্য স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকবে।'
                      : 'Sign in as a student to automatically link this application to your Student Dashboard.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/student/login')}
                    className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-[#092A20] hover:border-[#006A4E] whitespace-nowrap shrink-0"
                  >
                    {lang === 'bn' ? 'লগইন করুন' : 'Student Login'}
                  </button>
                </div>
              )}

              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#092A20] mb-1">
                    {lang === 'bn' ? 'আবেদনকারীর পূর্ণ নাম *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#092A20] mb-1">
                    {lang === 'bn' ? 'ইমেইল ঠিকানা *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#092A20] mb-1">
                    {lang === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#092A20] mb-1">
                    {lang === 'bn' ? 'জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নম্বর' : 'NID / Birth Registration No.'}
                  </label>
                  <input
                    type="text"
                    value={form.nidOrBirthReg}
                    onChange={(e) => setForm({ ...form, nidOrBirthReg: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#092A20] mb-1">
                    {lang === 'bn' ? 'জন্ম তারিখ' : 'Date of Birth'}
                  </label>
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#092A20] mb-1">
                    {lang === 'bn' ? 'শিক্ষাগত যোগ্যতা *' : 'Education Level *'}
                  </label>
                  <select
                    value={form.educationLevel}
                    onChange={(e) => setForm({ ...form, educationLevel: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                  >
                    <option value="HSC / Equivalent">HSC / Equivalent</option>
                    <option value="Diploma in Engineering">Diploma in Engineering</option>
                    <option value="Honours / B.Sc / BBA">Honours / B.Sc / BBA</option>
                    <option value="Masters / Postgraduate">Masters / Postgraduate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#092A20] mb-1">
                    {lang === 'bn' ? 'জেলা *' : 'District *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#092A20] mb-1">
                    {lang === 'bn' ? 'পছন্দের প্রশিক্ষণ কেন্দ্র' : 'Preferred Training Center'}
                  </label>
                  <select
                    value={form.centerId}
                    onChange={(e) => setForm({ ...form, centerId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                  >
                    {bundle.centers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.district})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#092A20] mb-1">
                  {lang === 'bn' ? 'কোর্স নির্বাচন করুন *' : 'Select Training Course *'}
                </label>
                <select
                  required
                  value={form.courseId}
                  onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                >
                  {bundle.courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {lang === 'bn' ? c.titleBn : c.title} ({c.duration})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#006A4E] to-[#0E805F] hover:from-[#092A20] hover:to-[#006A4E] text-white font-semibold text-sm transition-all disabled:opacity-60"
              >
                {submitting
                  ? lang === 'bn'
                    ? 'জমা দেওয়া হচ্ছে...'
                    : 'Submitting...'
                  : lang === 'bn'
                  ? 'আবেদন জমা দিন'
                  : 'Submit Application'}
              </button>
            </form>
          )
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={trackCode}
                  onChange={(e) => setTrackCode(e.target.value)}
                  placeholder="Enter Tracking Code (e.g. DYD-2026-XXXXXX)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-mono-num focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>
              <button
                type="submit"
                disabled={trackingLoading}
                className="px-6 py-3 rounded-xl bg-[#006A4E] text-white text-sm font-semibold hover:bg-[#092A20] transition-colors"
              >
                {trackingLoading ? 'Checking...' : lang === 'bn' ? 'তথ্য দেখুন' : 'Check Status'}
              </button>
            </form>

            {trackError && (
              <p className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-medium">{trackError}</p>
            )}

            {trackResult && (
              <div className="border border-slate-200 rounded-2xl p-6 bg-[#F4F8F6] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono-num font-bold text-[#006A4E]">{trackResult.trackingCode}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#092A20]">
                    Status: {trackResult.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#092A20]">{trackResult.fullName}</p>
                <p className="text-xs text-[#526860]">District: {trackResult.district}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function AdmitCardPage() {
  const { lang, bundle } = useApp();
  const [code, setCode] = useState('');
  const [card, setCard] = useState<AdmitCardItem | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCard(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/public/admit-card/lookup?code=${encodeURIComponent(code.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Admit card not found');
      setCard(data.admitCard);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to locate admit card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F4F8F6] py-12 lg:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2 no-print">
          <p className="text-sm font-semibold text-[#006A4E]">
            {lang === 'bn' ? 'পরীক্ষার প্রবেশপত্র' : 'Examination Admit Card'}
          </p>
          <h1 className="font-display text-3xl font-extrabold text-[#092A20]">
            {lang === 'bn' ? 'অ্যাডমিট কার্ড ডাউনলোড' : 'Admit Card Download'}
          </h1>
          <p className="text-sm text-[#526860]">
            {lang === 'bn'
              ? 'আপনার আবেদন ট্র্যাকিং কোড অথবা রোল নম্বর দিয়ে প্রবেশপত্র সংগ্রহ ও প্রিন্ট করুন।'
              : 'Enter your Application Tracking Code or Roll Number to view and print your Admit Card.'}
          </p>
        </div>

        <form onSubmit={handleLookup} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-3 no-print">
          <div className="relative flex-1">
            <FileSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Tracking Code or Roll Number"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono-num focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#006A4E] hover:bg-[#092A20] text-white text-sm font-semibold transition-colors"
          >
            {loading ? 'Searching...' : lang === 'bn' ? 'অ্যাডমিট কার্ড খুঁজুন' : 'Find Admit Card'}
          </button>
        </form>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm no-print">
            {error}
          </div>
        )}

        {card && (
          <div className="bg-white border-2 border-[#092A20] rounded-3xl p-8 space-y-6 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="font-display text-xl font-extrabold text-[#092A20]">
                  {bundle.siteContent.brandName} — Examination Admit Card
                </h2>
                <p className="text-xs text-[#526860]">{bundle.siteContent.footer.address}</p>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="no-print inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#006A4E] text-white text-xs font-semibold"
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-[#526860]">Candidate Name</p>
                <p className="font-bold text-[#092A20]">{card.studentName}</p>
              </div>
              <div>
                <p className="text-xs text-[#526860]">Roll Number</p>
                <p className="font-bold font-mono-num text-[#006A4E]">{card.rollNumber}</p>
              </div>
              <div>
                <p className="text-xs text-[#526860]">Tracking Code</p>
                <p className="font-mono-num text-[#092A20]">{card.trackingCode}</p>
              </div>
              <div>
                <p className="text-xs text-[#526860]">Exam Date & Time</p>
                <p className="font-semibold text-[#092A20]">{card.examDate}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-[#526860]">Examination Venue</p>
                <p className="font-semibold text-[#092A20]">{card.examVenue}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 text-xs text-[#526860] flex items-center justify-between">
              <span>Bring valid NID / Birth Registration & printed Admit Card to the exam center.</span>
              <span className="inline-flex items-center gap-1 text-[#006A4E] font-semibold no-print">
                <Download className="w-3.5 h-3.5" /> Verified Slip
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function VerifyCertificatePage() {
  const { lang, bundle } = useApp();
  const [code, setCode] = useState('');
  const [cert, setCert] = useState<CertificateItem | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!bundle.controls.certificateVerification) {
    return (
      <div className="bg-[#F4F8F6] py-20 px-4">
        <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3">
          <Lock className="w-10 h-10 text-amber-600 mx-auto" />
          <h1 className="font-display text-xl font-bold text-[#092A20]">
            {lang === 'bn' ? 'সার্টিফিকেট যাচাইকরণ সাময়িকভাবে বন্ধ' : 'Certificate Verification Disabled'}
          </h1>
          <p className="text-sm text-[#526860]">
            {lang === 'bn'
              ? 'প্রশাসক কর্তৃক সার্টিফিকেট যাচাই সেবা সাময়িকভাবে বন্ধ রাখা হয়েছে।'
              : 'Public certificate verification is currently disabled by the administrator.'}
          </p>
        </div>
      </div>
    );
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCert(null);
    setLoading(true);
    try {
      const clean = code.trim();
      const res = await fetch(`/api/public/verify-certificate/${encodeURIComponent(clean)}`);
      if (res.ok) {
        const data = await res.json();
        setCert(data.certificate);
        setLoading(false);
        return;
      }
      // Also check direct Firestore certificate record by exact ID
      const fsCert = await verifyCertificateInFirestore(clean);
      if (fsCert) {
        setCert(fsCert as CertificateItem);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'No certificate matched that verification ID.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F4F8F6] py-12 lg:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[#006A4E]">
            {lang === 'bn' ? 'ডিজিটাল রেজিস্ট্রি' : 'Digital Credential Registry'}
          </p>
          <h1 className="font-display text-3xl font-extrabold text-[#092A20]">
            {lang === 'bn' ? 'সার্টিফিকেট যাচাইকরণ' : 'Certificate Verification'}
          </h1>
          <p className="text-sm text-[#526860]">
            {lang === 'bn'
              ? 'সার্টিফিকেট আইডি প্রবেশ করিয়ে সনদের সত্যতা যাচাই করুন।'
              : 'Enter the unique Certificate ID to verify authenticity in the DYD AI registry.'}
          </p>
        </div>

        <form onSubmit={handleVerify} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-3 shadow-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter Certificate Code (e.g. DYD-CERT-XXXXXX)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono-num focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#006A4E] hover:bg-[#092A20] text-white text-sm font-semibold transition-colors"
          >
            {loading ? 'Verifying...' : lang === 'bn' ? 'যাচাই করুন' : 'Verify Certificate'}
          </button>
        </form>

        {error && (
          <div className="bg-white border border-red-200 rounded-2xl p-6 flex items-start gap-3 text-red-700">
            <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Verification Failed</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
          </div>
        )}

        {cert && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-5 shadow-sm">
            <div className="flex items-center gap-3">
              {cert.revoked ? (
                <XCircle className="w-8 h-8 text-red-600" />
              ) : (
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              )}
              <div>
                <h2 className="font-display text-xl font-bold text-[#092A20]">
                  {cert.revoked ? 'Certificate Revoked' : 'Authentic DYD AI Certificate'}
                </h2>
                <p className="text-xs font-mono-num text-[#526860]">{cert.certificateCode}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-sm">
              <div>
                <p className="text-xs text-[#526860]">Recipient Name</p>
                <p className="font-bold text-[#092A20]">{cert.studentName}</p>
              </div>
              <div>
                <p className="text-xs text-[#526860]">Course Completed</p>
                <p className="font-semibold text-[#092A20]">{cert.courseTitle}</p>
              </div>
              <div>
                <p className="text-xs text-[#526860]">Training Center</p>
                <p className="text-[#475569]">{cert.centerName}</p>
              </div>
              <div>
                <p className="text-xs text-[#526860]">Issue Date · Grade</p>
                <p className="font-semibold text-[#092A20] tabular-nums">
                  {cert.issueDate} · Grade {cert.grade}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
