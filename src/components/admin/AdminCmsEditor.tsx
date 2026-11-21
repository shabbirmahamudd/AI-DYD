import React, { useState } from 'react';
import { CheckCircle2, Eye, Power, Save, Upload } from 'lucide-react';
import type { SiteContent, WebsiteControls } from '../../types/dyd';

interface AdminCmsEditorProps {
  adminToken: string;
  siteContent: SiteContent;
  controls: WebsiteControls;
  onSaved: () => Promise<void>;
  onControlsChange: (next: WebsiteControls) => Promise<void>;
}

export function AdminCmsEditor({
  adminToken,
  siteContent,
  controls,
  onSaved,
  onControlsChange,
}: AdminCmsEditorProps) {
  const [draft, setDraft] = useState<SiteContent>(() => structuredClone(siteContent));
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [sectionTab, setSectionTab] = useState<
    'branding' | 'hero' | 'stats' | 'admission' | 'eligibility' | 'cta' | 'footer' | 'controls'
  >('controls');
  const [previewLang, setPreviewLang] = useState<'bn' | 'en'>('bn');

  const uploadImage = async (file: File, onUrl: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result || '');
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ dataUrl, fileName: file.name }),
      });
      if (res.ok) {
        const data = await res.json();
        onUrl(data.url);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveContent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setStatusMsg('');
    try {
      const res = await fetch('/api/admin/site-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(draft),
      });
      if (res.ok) {
        await onSaved();
        setStatusMsg('Website content saved and published.');
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleSwitch = async (key: keyof WebsiteControls) => {
    const next = { ...controls, [key]: !controls[key] };
    await onControlsChange(next);
  };

  const controlItems: { key: keyof WebsiteControls; title: string; desc: string; danger?: boolean }[] = [
    {
      key: 'maintenanceMode',
      title: 'Website Maintenance Mode',
      desc: 'Blocks public portals and shows maintenance notice while keeping /admin active.',
      danger: true,
    },
    {
      key: 'studentRegistration',
      title: 'Student Registration',
      desc: 'Enforces /api/student/auth/register availability on backend and portal.',
    },
    {
      key: 'admissionApplications',
      title: 'Admission Applications',
      desc: 'Controls POST /api/applications and admission form intake.',
    },
    {
      key: 'courseEnrollment',
      title: 'Course Enrollment',
      desc: 'Allows or pauses new course enrollment in admission workflows.',
    },
    {
      key: 'noticeDisplay',
      title: 'Notice Display',
      desc: 'Controls /api/public/notices and public Notice Board visibility.',
    },
    {
      key: 'studentLogin',
      title: 'Student Login',
      desc: 'Controls /api/student/auth/login and Google student authentication.',
    },
    {
      key: 'certificateVerification',
      title: 'Certificate Verification',
      desc: 'Controls /api/public/verify-certificate/:code verification endpoint.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'controls', label: 'Website ON/OFF Controls' },
            { id: 'branding', label: 'Branding & Announcement' },
            { id: 'hero', label: 'Hero Section' },
            { id: 'stats', label: 'Statistics' },
            { id: 'admission', label: 'Admission Steps' },
            { id: 'eligibility', label: 'Eligibility' },
            { id: 'cta', label: 'Final CTA' },
            { id: 'footer', label: 'Footer & Social' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSectionTab(t.id as typeof sectionTab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                sectionTab === t.id
                  ? 'bg-[#006A4E] text-white'
                  : 'bg-[#F4F8F6] text-[#475569] hover:text-[#092A20]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {sectionTab !== 'controls' && (
          <button
            type="button"
            onClick={() => handleSaveContent()}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-[#092A20] hover:bg-[#006A4E] text-white text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Publish Changes'}
          </button>
        )}
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {statusMsg}
        </div>
      )}

      {sectionTab === 'controls' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-[#092A20]">
              Backend-Enforced Website Control System
            </h3>
            <p className="text-xs text-[#526860]">
              Every toggle below is immediately enforced on Node.js backend endpoints as well as UI routes.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {controlItems.map((item) => {
              const isOn = controls[item.key];
              return (
                <div key={item.key} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-sm text-[#092A20]">{item.title}</p>
                    <p className="text-xs text-[#526860]">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSwitch(item.key)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors shrink-0 ${
                      isOn
                        ? item.danger
                          ? 'bg-red-600 text-white'
                          : 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    {isOn ? 'ON' : 'OFF'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {sectionTab === 'branding' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-[#092A20]">Logo, Favicon & Announcement Bar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#092A20] mb-1">Brand Name</label>
                <input
                  type="text"
                  value={draft.brandName}
                  onChange={(e) => setDraft({ ...draft, brandName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#092A20] mb-1">Upload Logo</label>
                <label className="cursor-pointer flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-[#006A4E] hover:bg-slate-50">
                  <Upload className="w-3.5 h-3.5" />
                  Choose Logo File
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadImage(f, (url) => setDraft({ ...draft, logoUrl: url }));
                    }}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#092A20] mb-1">Upload Custom Favicon</label>
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-[#006A4E] hover:bg-slate-50">
                <Upload className="w-3.5 h-3.5" />
                Upload Favicon (PNG/SVG)
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadImage(f, (url) => setDraft({ ...draft, faviconUrl: url }));
                  }}
                />
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#092A20]">Top Announcement Bar</span>
                <button
                  type="button"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      announcement: { ...draft.announcement, enabled: !draft.announcement.enabled },
                    })
                  }
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    draft.announcement.enabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {draft.announcement.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              <input
                type="text"
                placeholder="Announcement Bangla Text"
                value={draft.announcement.textBn}
                onChange={(e) =>
                  setDraft({ ...draft, announcement: { ...draft.announcement, textBn: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
              <input
                type="text"
                placeholder="Announcement English Text"
                value={draft.announcement.text}
                onChange={(e) =>
                  setDraft({ ...draft, announcement: { ...draft.announcement, text: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Highlight Badge (BN)"
                  value={draft.announcement.highlightBn}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      announcement: { ...draft.announcement, highlightBn: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
                <input
                  type="text"
                  placeholder="Target Route (/apply)"
                  value={draft.announcement.link}
                  onChange={(e) =>
                    setDraft({ ...draft, announcement: { ...draft.announcement, link: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006A4E]">
                <Eye className="w-4 h-4" /> Live Header Preview
              </span>
              <button
                type="button"
                onClick={() => setPreviewLang((l) => (l === 'bn' ? 'en' : 'bn'))}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100"
              >
                {previewLang === 'bn' ? 'BN' : 'EN'}
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200">
              {draft.announcement.enabled && (
                <div className="bg-[#092A20] text-white text-xs px-3 py-2 flex items-center gap-2">
                  <span className="bg-[#006A4E] px-2 py-0.5 rounded font-semibold shrink-0">
                    {previewLang === 'bn' ? draft.announcement.highlightBn : draft.announcement.highlight}
                  </span>
                  <span className="truncate">
                    {previewLang === 'bn' ? draft.announcement.textBn : draft.announcement.text}
                  </span>
                </div>
              )}
              <div className="bg-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-extrabold text-[#092A20]">
                  {draft.logoUrl && (
                    <img
                      src={draft.logoUrl}
                      alt="Logo Preview"
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-lg object-contain"
                    />
                  )}
                  <span>{draft.brandName}</span>
                </div>
                <span className="text-xs px-3 py-1 rounded-lg bg-[#006A4E] text-white font-semibold">
                  {previewLang === 'bn' ? draft.navbar.applyLabelBn : draft.navbar.applyLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {sectionTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-[#092A20]">Hero Content & Image</h3>
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#092A20]">Hero Heading (Bangla)</label>
              <input
                type="text"
                value={draft.hero.headingBn}
                onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, headingBn: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
              <label className="block text-xs font-semibold text-[#092A20]">Hero Heading (English)</label>
              <input
                type="text"
                value={draft.hero.heading}
                onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, heading: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
              <label className="block text-xs font-semibold text-[#092A20]">Hero Description (Bangla)</label>
              <textarea
                rows={2}
                value={draft.hero.descriptionBn}
                onChange={(e) =>
                  setDraft({ ...draft, hero: { ...draft.hero, descriptionBn: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
              <label className="block text-xs font-semibold text-[#092A20]">Hero Description (English)</label>
              <textarea
                rows={2}
                value={draft.hero.description}
                onChange={(e) =>
                  setDraft({ ...draft, hero: { ...draft.hero, description: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
              <div>
                <label className="block text-xs font-semibold text-[#092A20] mb-1">Hero Lab Photo</label>
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-[#006A4E]">
                  <Upload className="w-3.5 h-3.5" />
                  Upload New Hero Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadImage(f, (url) => setDraft({ ...draft, hero: { ...draft.hero, imageUrl: url } }));
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006A4E]">
              <Eye className="w-4 h-4" /> Live Hero Preview
            </span>
            <div className="rounded-2xl bg-[#F4F8F6] border border-slate-200 p-5 space-y-3">
              <p className="text-xs font-semibold text-[#006A4E]">
                {previewLang === 'bn' ? draft.hero.eyebrowBn : draft.hero.eyebrow}
              </p>
              <h4 className="font-display text-xl font-extrabold text-[#092A20]">
                {previewLang === 'bn' ? draft.hero.headingBn : draft.hero.heading}
              </h4>
              <p className="text-xs text-[#475569]">
                {previewLang === 'bn' ? draft.hero.descriptionBn : draft.hero.description}
              </p>
              {draft.hero.imageUrl && (
                <img
                  src={draft.hero.imageUrl}
                  alt="Hero Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover rounded-xl border border-slate-200"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {sectionTab === 'stats' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-[#092A20]">Homepage Statistics Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {draft.stats.map((s, idx) => (
              <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-[#F4F8F6] space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={s.labelBn}
                    onChange={(e) => {
                      const next = [...draft.stats];
                      next[idx] = { ...s, labelBn: e.target.value };
                      setDraft({ ...draft, stats: next });
                    }}
                    placeholder="Label (BN)"
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                  />
                  <input
                    type="text"
                    value={s.label}
                    onChange={(e) => {
                      const next = [...draft.stats];
                      next[idx] = { ...s, label: e.target.value };
                      setDraft({ ...draft, stats: next });
                    }}
                    placeholder="Label (EN)"
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={s.numericTarget}
                    onChange={(e) => {
                      const next = [...draft.stats];
                      next[idx] = { ...s, numericTarget: Number(e.target.value) || 0 };
                      setDraft({ ...draft, stats: next });
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                  />
                  <input
                    type="text"
                    value={s.suffix}
                    onChange={(e) => {
                      const next = [...draft.stats];
                      next[idx] = { ...s, suffix: e.target.value };
                      setDraft({ ...draft, stats: next });
                    }}
                    placeholder="Suffix"
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                  />
                  <select
                    value={s.sourceMode}
                    onChange={(e) => {
                      const next = [...draft.stats];
                      next[idx] = { ...s, sourceMode: e.target.value as typeof s.sourceMode };
                      setDraft({ ...draft, stats: next });
                    }}
                    className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                  >
                    <option value="manual">Manual Number</option>
                    <option value="live_centers">Live Centers</option>
                    <option value="live_courses">Live Modules</option>
                    <option value="live_students">Live Students</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sectionTab === 'admission' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-[#092A20]">Admission Timeline Steps (Dates & Status)</h3>
          <div className="space-y-3">
            {draft.admissionSection.steps.map((step, idx) => (
              <div key={step.id} className="p-4 rounded-xl border border-slate-200 bg-[#F4F8F6] grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={step.titleBn}
                  onChange={(e) => {
                    const next = [...draft.admissionSection.steps];
                    next[idx] = { ...step, titleBn: e.target.value };
                    setDraft({ ...draft, admissionSection: { ...draft.admissionSection, steps: next } });
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                />
                <input
                  type="text"
                  value={step.dateLabel}
                  onChange={(e) => {
                    const next = [...draft.admissionSection.steps];
                    next[idx] = { ...step, dateLabel: e.target.value };
                    setDraft({ ...draft, admissionSection: { ...draft.admissionSection, steps: next } });
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                />
                <select
                  value={step.status}
                  onChange={(e) => {
                    const next = [...draft.admissionSection.steps];
                    next[idx] = { ...step, status: e.target.value as typeof step.status };
                    setDraft({ ...draft, admissionSection: { ...draft.admissionSection, steps: next } });
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                >
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
                <input
                  type="text"
                  value={step.descriptionBn}
                  onChange={(e) => {
                    const next = [...draft.admissionSection.steps];
                    next[idx] = { ...step, descriptionBn: e.target.value };
                    setDraft({ ...draft, admissionSection: { ...draft.admissionSection, steps: next } });
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {sectionTab === 'eligibility' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-[#092A20]">Eligibility Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {draft.eligibilitySection.items.map((item, idx) => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-[#F4F8F6] space-y-2">
                <input
                  type="text"
                  value={item.titleBn}
                  onChange={(e) => {
                    const next = [...draft.eligibilitySection.items];
                    next[idx] = { ...item, titleBn: e.target.value };
                    setDraft({ ...draft, eligibilitySection: { ...draft.eligibilitySection, items: next } });
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                />
                <input
                  type="text"
                  value={item.requirementBn}
                  onChange={(e) => {
                    const next = [...draft.eligibilitySection.items];
                    next[idx] = { ...item, requirementBn: e.target.value };
                    setDraft({ ...draft, eligibilitySection: { ...draft.eligibilitySection, items: next } });
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {sectionTab === 'cta' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
          <h3 className="font-bold text-[#092A20]">Final Admission CTA Section</h3>
          <input
            type="text"
            value={draft.ctaSection.headingBn}
            onChange={(e) => setDraft({ ...draft, ctaSection: { ...draft.ctaSection, headingBn: e.target.value } })}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
          />
          <input
            type="text"
            value={draft.ctaSection.heading}
            onChange={(e) => setDraft({ ...draft, ctaSection: { ...draft.ctaSection, heading: e.target.value } })}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
          />
          <textarea
            rows={2}
            value={draft.ctaSection.descriptionBn}
            onChange={(e) =>
              setDraft({ ...draft, ctaSection: { ...draft.ctaSection, descriptionBn: e.target.value } })
            }
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
          />
        </div>
      )}

      {sectionTab === 'footer' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-[#092A20]">Contact & Social Media Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Address</label>
              <input
                type="text"
                value={draft.footer.address}
                onChange={(e) => setDraft({ ...draft, footer: { ...draft.footer, address: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Phone</label>
              <input
                type="text"
                value={draft.footer.phone}
                onChange={(e) => setDraft({ ...draft, footer: { ...draft.footer, phone: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Email</label>
              <input
                type="text"
                value={draft.footer.email}
                onChange={(e) => setDraft({ ...draft, footer: { ...draft.footer, email: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Facebook URL</label>
              <input
                type="text"
                value={draft.footer.socialLinks.facebook}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    footer: {
                      ...draft.footer,
                      socialLinks: { ...draft.footer.socialLinks, facebook: e.target.value },
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
