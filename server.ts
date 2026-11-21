import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  DEFAULT_CENTERS,
  DEFAULT_CONTROLS,
  DEFAULT_COURSES,
  DEFAULT_MODULES,
  DEFAULT_NOTICES,
  DEFAULT_PACKAGES,
  DEFAULT_SITE_CONTENT,
} from './src/data/defaultSiteData.ts';
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
} from './src/types/dyd.ts';

dotenv.config();

const PORT = 3000;
const ROOT_DIR = process.cwd();
const DATA_DIR = path.resolve(ROOT_DIR, '.data');
const DB_FILE = path.resolve(DATA_DIR, 'dyd-db.json');
const UPLOAD_DIR = path.resolve(ROOT_DIR, 'public', 'uploads');

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.trim().length >= 16
    ? process.env.ADMIN_SESSION_SECRET.trim()
    : crypto.randomBytes(32).toString('hex');

interface StoredStudentAccount extends StudentUser {
  passwordHash: string;
  salt: string;
  resetToken?: string;
  resetExpiresAt?: number;
}

interface AdminCredentialState {
  username: string;
  passwordHash: string | null;
  salt: string | null;
  mustChangePassword: boolean;
  passwordChangedAt: string | null;
}

interface DatabaseSchema {
  adminAuth: AdminCredentialState;
  adminUsers: AdminUserItem[];
  controls: WebsiteControls;
  siteContent: SiteContent;
  courses: CourseItem[];
  modules: CourseModuleItem[];
  centers: TrainingCenterItem[];
  packages: PackageRegionItem[];
  notices: NoticeItem[];
  students: StoredStudentAccount[];
  applications: AdmissionApplicationItem[];
  admitCards: AdmitCardItem[];
  results: ExamResultItem[];
  certificates: CertificateItem[];
  notifications: NotificationItem[];
  activityLogs: ActivityLogItem[];
  contactMessages: ContactMessageItem[];
}

function createInitialDb(): DatabaseSchema {
  return {
    adminAuth: {
      username: 'shabbir2020',
      passwordHash: null,
      salt: null,
      mustChangePassword: Boolean(process.env.ADMIN_INITIAL_PASSWORD?.trim()),
      passwordChangedAt: null,
    },
    adminUsers: [
      {
        id: 'admin-shabbir2020',
        username: 'shabbir2020',
        email: 'admin@dydaiproject.org',
        role: 'super_admin',
        active: true,
        createdAt: new Date().toISOString(),
      },
    ],
    controls: structuredClone(DEFAULT_CONTROLS),
    siteContent: structuredClone(DEFAULT_SITE_CONTENT),
    courses: structuredClone(DEFAULT_COURSES),
    modules: structuredClone(DEFAULT_MODULES),
    centers: structuredClone(DEFAULT_CENTERS),
    packages: structuredClone(DEFAULT_PACKAGES),
    notices: structuredClone(DEFAULT_NOTICES),
    students: [],
    applications: [],
    admitCards: [],
    results: [],
    certificates: [],
    notifications: [],
    activityLogs: [],
    contactMessages: [],
  };
}

function loadDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw) as Partial<DatabaseSchema>;
      const base = createInitialDb();
      return {
        ...base,
        ...parsed,
        controls: { ...base.controls, ...(parsed.controls ?? {}) },
        siteContent: {
          ...base.siteContent,
          ...(parsed.siteContent ?? {}),
          logoUrl: parsed.siteContent?.logoUrl || base.siteContent.logoUrl,
          faviconUrl: parsed.siteContent?.faviconUrl || base.siteContent.faviconUrl,
        },
        adminAuth: { ...base.adminAuth, ...(parsed.adminAuth ?? {}) },
      };
    }
  } catch (err) {
    console.error('Failed to read DB file, initializing fresh store:', err);
  }
  const initial = createInitialDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
  return initial;
}

let db: DatabaseSchema = loadDb();

function saveDb() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

function logActivity(actor: string, action: string, target: string) {
  const entry: ActivityLogItem = {
    id: `log-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    actor,
    action,
    target,
    createdAt: new Date().toISOString(),
  };
  db.activityLogs.unshift(entry);
  if (db.activityLogs.length > 250) {
    db.activityLogs = db.activityLogs.slice(0, 250);
  }
}

function hashPassword(password: string, existingSalt?: string): { hash: string; salt: string } {
  const salt = existingSalt ?? crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

function verifyPasswordHash(password: string, hash: string, salt: string): boolean {
  const derived = crypto.scryptSync(password, salt, 64);
  const stored = Buffer.from(hash, 'hex');
  if (derived.length !== stored.length) return false;
  return crypto.timingSafeEqual(derived, stored);
}

function timingSafeTextMatch(a: string, b: string): boolean {
  const digestA = crypto.createHash('sha256').update(a).digest();
  const digestB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(digestA, digestB);
}

interface SessionPayload {
  sub: string;
  role: 'admin' | 'student';
  username?: string;
  email?: string;
  exp: number;
}

function signToken(payload: Omit<SessionPayload, 'exp'>, ttlSeconds = 60 * 60 * 12): string {
  const full: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const encoded = Buffer.from(JSON.stringify(full)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

function verifyToken(token: string): SessionPayload | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encoded, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
  if (!timingSafeTextMatch(sig, expectedSig)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (!parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function extractBearer(req: express.Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice(7).trim();
}

function sanitizeStudent(s: StoredStudentAccount): StudentUser {
  const { passwordHash: _ph, salt: _s, resetToken: _rt, resetExpiresAt: _re, ...rest } = s;
  return rest;
}

function requireAdmin(req: express.Request, res: express.Response, allowDuringPasswordChange = false): SessionPayload | null {
  const token = extractBearer(req);
  if (!token) {
    res.status(401).json({ error: 'Admin authentication required.' });
    return null;
  }
  const session = verifyToken(token);
  if (!session || session.role !== 'admin') {
    res.status(401).json({ error: 'Invalid or expired admin session.' });
    return null;
  }
  if (!allowDuringPasswordChange && db.adminAuth.mustChangePassword) {
    res.status(403).json({
      error: 'Password change required after initial login.',
      mustChangePassword: true,
    });
    return null;
  }
  return session;
}

function requireStudent(req: express.Request, res: express.Response): StoredStudentAccount | null {
  if (db.controls.maintenanceMode) {
    res.status(503).json({ error: 'Platform is currently in maintenance mode.' });
    return null;
  }
  const token = extractBearer(req);
  if (!token) {
    res.status(401).json({ error: 'Student sign-in required.' });
    return null;
  }
  const session = verifyToken(token);
  if (!session || session.role !== 'student') {
    res.status(401).json({ error: 'Invalid or expired student session.' });
    return null;
  }
  const student = db.students.find((s) => s.id === session.sub || s.uid === session.sub);
  if (!student) {
    res.status(401).json({ error: 'Student account not found.' });
    return null;
  }
  return student;
}

function safeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
}

function parseImageUpload(dataUrl: string, rawName: string): { buffer: Buffer; ext: string; safeName: string } | null {
  const match = dataUrl.match(/^data:(image\/(?:png|jpeg|jpg|webp|svg\+xml));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) return null;
  const mime = match[1];
  const base64 = match[2];
  const buffer = Buffer.from(base64, 'base64');
  if (buffer.length === 0 || buffer.length > 2 * 1024 * 1024) return null;
  const extMap: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
  };
  const ext = extMap[mime];
  if (!ext) return null;
  const cleanedBase = rawName.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40) || 'asset';
  const safeName = `${cleanedBase}-${Date.now()}-${crypto.randomBytes(3).toString('hex')}.${ext}`;
  return { buffer, ext, safeName };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '4mb' }));

  app.use('/uploads', express.static(UPLOAD_DIR));

  // --- Public Bundle & Controls ---
  app.get('/api/public/controls', (_req, res) => {
    res.json({ controls: db.controls });
  });

  app.get('/api/public/bundle', (_req, res) => {
    const activeNotices = db.controls.noticeDisplay
      ? db.notices.filter((n) => n.active)
      : [];
    res.json({
      controls: db.controls,
      siteContent: db.siteContent,
      courses: db.courses.filter((c) => c.active),
      modules: [...db.modules].sort((a, b) => a.order - b.order),
      centers: db.centers.filter((c) => c.active),
      packages: db.packages,
      notices: activeNotices,
      liveCounts: {
        students: db.students.length,
        centers: db.centers.filter((c) => c.active).length,
        courses: db.courses.filter((c) => c.active).length,
        applications: db.applications.length,
      },
    });
  });

  app.get('/api/public/notices', (_req, res) => {
    if (db.controls.maintenanceMode) {
      return res.status(503).json({ error: 'Website is currently under scheduled maintenance.' });
    }
    if (!db.controls.noticeDisplay) {
      return res.status(403).json({ error: 'Notices display is currently disabled by administrator.' });
    }
    res.json({ notices: db.notices.filter((n) => n.active) });
  });

  app.get('/api/public/verify-certificate/:code', (req, res) => {
    if (db.controls.maintenanceMode) {
      return res.status(503).json({ error: 'Website is currently under scheduled maintenance.' });
    }
    if (!db.controls.certificateVerification) {
      return res.status(403).json({ error: 'Certificate verification is currently disabled by administrator.' });
    }
    const code = String(req.params.code || '').trim();
    if (!code || code.length > 64) {
      return res.status(400).json({ error: 'Valid certificate ID is required.' });
    }
    const cert = db.certificates.find(
      (c) => c.certificateCode.toLowerCase() === code.toLowerCase() || c.id.toLowerCase() === code.toLowerCase(),
    );
    if (!cert) {
      return res.status(404).json({ error: 'No matching certificate found in the DYD AI registry.' });
    }
    res.json({ certificate: cert });
  });

  app.get('/api/public/admit-card/lookup', (req, res) => {
    if (db.controls.maintenanceMode) {
      return res.status(503).json({ error: 'Website is currently under scheduled maintenance.' });
    }
    const code = String(req.query.code || '').trim();
    if (!code || code.length > 64) {
      return res.status(400).json({ error: 'Please provide an Application Tracking Code or Roll Number.' });
    }
    const card = db.admitCards.find(
      (a) =>
        a.trackingCode.toLowerCase() === code.toLowerCase() ||
        a.rollNumber.toLowerCase() === code.toLowerCase(),
    );
    if (!card) {
      return res.status(404).json({ error: 'No admit card issued yet for the provided tracking code or roll number.' });
    }
    res.json({ admitCard: card });
  });

  app.post('/api/public/contact', (req, res) => {
    if (db.controls.maintenanceMode) {
      return res.status(503).json({ error: 'Website is currently under scheduled maintenance.' });
    }
    const { name, email, phone, subject, message } = req.body ?? {};
    if (
      typeof name !== 'string' ||
      name.trim().length < 2 ||
      typeof email !== 'string' ||
      !email.includes('@') ||
      typeof message !== 'string' ||
      message.trim().length < 5
    ) {
      return res.status(400).json({ error: 'Please provide your valid name, email, and message.' });
    }
    const msg: ContactMessageItem = {
      id: safeId('msg'),
      name: name.trim().slice(0, 120),
      email: email.trim().slice(0, 160),
      phone: typeof phone === 'string' ? phone.trim().slice(0, 30) : '',
      subject: typeof subject === 'string' && subject.trim() ? subject.trim().slice(0, 140) : 'General Inquiry',
      message: message.trim().slice(0, 2000),
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    db.contactMessages.unshift(msg);
    saveDb();
    res.status(201).json({ message: 'Inquiry submitted successfully.', id: msg.id });
  });

  // --- Server-Side Gemini AI Assistant Chatbot ---
  app.post('/api/ai/chat', async (req, res) => {
    if (db.controls.maintenanceMode) {
      return res.status(503).json({ error: 'Website is currently under scheduled maintenance.' });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in Secrets yet. Please add a valid Gemini API key.',
      });
    }

    const rawMessages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const lang: 'bn' | 'en' = req.body?.lang === 'en' ? 'en' : 'bn';

    const sanitized = rawMessages
      .slice(-14)
      .filter(
        (m: unknown): m is { role: 'user' | 'model'; text: string } =>
          Boolean(m) &&
          typeof m === 'object' &&
          ((m as { role?: string }).role === 'user' || (m as { role?: string }).role === 'model') &&
          typeof (m as { text?: string }).text === 'string' &&
          (m as { text: string }).text.trim().length > 0,
      )
      .map((m: { role: 'user' | 'model'; text: string }) => ({
        role: m.role,
        parts: [{ text: m.text.trim().slice(0, 1200) }],
      }));

    if (sanitized.length === 0 || sanitized[sanitized.length - 1].role !== 'user') {
      return res.status(400).json({ error: 'Please enter a valid message.' });
    }

    const activeCourses = db.courses
      .filter((c) => c.active)
      .map((c) => `- ${c.title} / ${c.titleBn} (${c.duration}, Level: ${c.level}): ${c.summary}`)
      .join('\n');

    const sortedModules = [...db.modules]
      .sort((a, b) => a.order - b.order)
      .map((m) => `- Module ${m.order}: ${m.title} / ${m.titleBn} (${m.hours} Hours) — ${m.description}`)
      .join('\n');

    const activeCenters = db.centers
      .filter((c) => c.active)
      .map((c) => `- ${c.name} (${c.district}, ${c.region}) | Address: ${c.address} | Capacity: ${c.capacity} seats`)
      .join('\n');

    const activePackages = db.packages
      .map((p) => `- ${p.packageNumber}: ${p.regionName} (${p.districtCount} districts, ${p.availableCenters} centers, ${p.duration}, Partner: ${p.partnerOrg})`)
      .join('\n');

    const admissionSteps = db.siteContent.admissionSection.steps
      .map((s) => `${s.stepNumber}. ${s.title} / ${s.titleBn} (${s.dateLabel}, status: ${s.status}) — ${s.description}`)
      .join('\n');

    const eligibilityList = db.siteContent.eligibilitySection.items
      .map((e) => `- ${e.title} / ${e.titleBn}: ${e.requirement} / ${e.requirementBn} (${e.detail})`)
      .join('\n');

    const activeNotices = db.controls.noticeDisplay
      ? db.notices
          .filter((n) => n.active)
          .slice(0, 5)
          .map((n) => `- [${n.publishedDate}] ${n.title}: ${n.body}`)
          .join('\n')
      : 'Notices are currently hidden by administration.';

    const systemInstruction = `You are the official ${db.siteContent.brandName} AI Assistant on the ${db.siteContent.brandName} skill development & student portal platform.
Your role:
- Answer questions clearly, concisely, and helpfully about DYD AI training courses, curriculum modules, admission steps, eligibility criteria, training centers, regional packages, admit card downloads (/admit-card), certificate verification (/verify-certificate), online admission (/apply), and the Student Portal (/student/login).
- Default UI language preference is ${lang === 'bn' ? 'Bangla (বাংলা)' : 'English'}, but always reply in the same language the user writes in (Bangla if they ask in Bangla/Banglish, English if they ask in English).
- Never claim official government agency endorsement unless explicitly listed; represent ${db.siteContent.brandName} accurately.
- Never invent fake dates, phone numbers, fees, or certificate codes. If something is not in the live portal data below, kindly guide them to contact the office or check the Notice Board (/notices).

Live Platform Data:
Office Address: ${db.siteContent.footer.address}
Phone: ${db.siteContent.footer.phone}
Email: ${db.siteContent.footer.email}
Office Hours: ${db.siteContent.footer.officeHours}
Announcement: ${db.siteContent.announcement.enabled ? `${db.siteContent.announcement.text} / ${db.siteContent.announcement.textBn}` : 'None'}

Portal Features & Controls:
- Online Admission Applications: ${db.controls.admissionApplications ? 'Open (/apply)' : 'Currently Paused'}
- Student Registration: ${db.controls.studentRegistration ? 'Open (/student/register)' : 'Currently Closed'}
- Student Login: ${db.controls.studentLogin ? 'Enabled (/student/login)' : 'Disabled'}
- Certificate Verification: ${db.controls.certificateVerification ? 'Active (/verify-certificate)' : 'Disabled'}

Active Courses:
${activeCourses || 'None listed'}

Training Modules:
${sortedModules || 'None listed'}

Admission Process Timeline:
${admissionSteps}

Eligibility Requirements:
${eligibilityList}

Training Centers:
${activeCenters || 'None listed'}

Regional Packages:
${activePackages || 'None listed'}

Recent Notices:
${activeNotices}`;

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: sanitized,
        config: {
          systemInstruction,
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        return res.status(502).json({ error: 'AI assistant returned an empty response. Please try again.' });
      }
      return res.json({ reply });
    } catch (err) {
      console.error('Gemini AI chat error:', err);
      let status = 502;
      let message = err instanceof Error ? err.message : 'Unable to generate AI response right now.';
      try {
        const parsed = JSON.parse(message);
        if (parsed?.error?.message) {
          message = String(parsed.error.message);
        }
        if (parsed?.error?.code === 503 || parsed?.error?.status === 'UNAVAILABLE') {
          status = 503;
        }
      } catch {
        // Keep original message if not JSON
      }
      return res.status(status).json({ error: message });
    }
  });

  // --- Backend Enforcement Gateways for Student Flows ---
  app.post('/api/student/auth/register', (req, res) => {
    if (db.controls.maintenanceMode) {
      return res.status(503).json({ error: 'Platform is currently under maintenance.' });
    }
    if (!db.controls.studentRegistration) {
      return res.status(403).json({ error: 'Student registration is currently closed by administrator.' });
    }
    const { fullName, email, password, phone, district, education } = req.body ?? {};
    if (
      typeof fullName !== 'string' ||
      fullName.trim().length < 2 ||
      typeof email !== 'string' ||
      !email.includes('@') ||
      typeof password !== 'string' ||
      password.length < 6
    ) {
      return res.status(400).json({ error: 'Full name, valid email, and password (min 6 characters) are required.' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (db.students.some((s) => s.email.toLowerCase() === normalizedEmail)) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    const { hash, salt } = hashPassword(password);
    const now = new Date().toISOString();
    const uid = safeId('stu');
    const student: StoredStudentAccount = {
      id: uid,
      uid,
      fullName: fullName.trim().slice(0, 120),
      email: normalizedEmail.slice(0, 160),
      phone: typeof phone === 'string' ? phone.trim().slice(0, 30) : '',
      district: typeof district === 'string' ? district.trim().slice(0, 80) : '',
      education: typeof education === 'string' ? education.trim().slice(0, 120) : '',
      avatarUrl: '',
      role: 'student',
      passwordHash: hash,
      salt,
      createdAt: now,
      updatedAt: now,
    };
    db.students.push(student);
    db.notifications.unshift({
      id: safeId('notif'),
      userId: uid,
      title: 'Welcome to DYD AI Student Portal',
      message: 'Your student account is active. You can submit an admission application or track your status anytime.',
      read: false,
      createdAt: now,
    });
    logActivity('system', 'STUDENT_REGISTERED', normalizedEmail);
    saveDb();

    const token = signToken({ sub: uid, role: 'student', email: normalizedEmail });
    res.status(201).json({ token, user: sanitizeStudent(student) });
  });

  app.post('/api/student/auth/login', (req, res) => {
    if (db.controls.maintenanceMode) {
      return res.status(503).json({ error: 'Platform is currently under maintenance.' });
    }
    if (!db.controls.studentLogin) {
      return res.status(403).json({ error: 'Student login is currently disabled by administrator.' });
    }
    const { email, password } = req.body ?? {};
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const student = db.students.find((s) => s.email.toLowerCase() === normalizedEmail);
    if (!student || !verifyPasswordHash(password, student.passwordHash, student.salt)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const token = signToken({ sub: student.uid, role: 'student', email: student.email });
    res.json({ token, user: sanitizeStudent(student) });
  });

  app.post('/api/student/auth/google-sync', (req, res) => {
    if (db.controls.maintenanceMode) {
      return res.status(503).json({ error: 'Platform is currently under maintenance.' });
    }
    if (!db.controls.studentLogin) {
      return res.status(403).json({ error: 'Student login is currently disabled by administrator.' });
    }
    const { uid, email, fullName, avatarUrl } = req.body ?? {};
    if (typeof uid !== 'string' || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid Google profile is required.' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    let student = db.students.find((s) => s.uid === uid || s.email.toLowerCase() === normalizedEmail);
    const now = new Date().toISOString();
    if (!student) {
      if (!db.controls.studentRegistration) {
        return res.status(403).json({ error: 'New student registration is currently closed.' });
      }
      const { hash, salt } = hashPassword(crypto.randomBytes(24).toString('hex'));
      student = {
        id: uid,
        uid,
        fullName: typeof fullName === 'string' && fullName.trim() ? fullName.trim().slice(0, 120) : normalizedEmail.split('@')[0],
        email: normalizedEmail,
        phone: '',
        district: '',
        education: '',
        avatarUrl: typeof avatarUrl === 'string' ? avatarUrl.slice(0, 500) : '',
        role: 'student',
        passwordHash: hash,
        salt,
        createdAt: now,
        updatedAt: now,
      };
      db.students.push(student);
      saveDb();
    }
    const token = signToken({ sub: student.uid, role: 'student', email: student.email });
    res.json({ token, user: sanitizeStudent(student) });
  });

  app.post('/api/student/auth/forgot-password', (req, res) => {
    const { email } = req.body ?? {};
    if (typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const student = db.students.find((s) => s.email.toLowerCase() === normalizedEmail);
    if (!student) {
      return res.status(404).json({ error: 'No student account found with that email.' });
    }
    const resetCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    student.resetToken = resetCode;
    student.resetExpiresAt = Date.now() + 15 * 60 * 1000;
    saveDb();
    res.json({
      message: 'Password reset verification code generated. Enter this code to reset your password.',
      resetCode,
    });
  });

  app.post('/api/student/auth/reset-password', (req, res) => {
    const { email, resetCode, newPassword } = req.body ?? {};
    if (
      typeof email !== 'string' ||
      typeof resetCode !== 'string' ||
      typeof newPassword !== 'string' ||
      newPassword.length < 6
    ) {
      return res.status(400).json({ error: 'Email, reset code, and new password (min 6 chars) are required.' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const student = db.students.find((s) => s.email.toLowerCase() === normalizedEmail);
    if (
      !student ||
      !student.resetToken ||
      !student.resetExpiresAt ||
      student.resetExpiresAt < Date.now() ||
      !timingSafeTextMatch(student.resetToken, resetCode.trim().toUpperCase())
    ) {
      return res.status(400).json({ error: 'Invalid or expired reset code.' });
    }
    const { hash, salt } = hashPassword(newPassword);
    student.passwordHash = hash;
    student.salt = salt;
    student.resetToken = undefined;
    student.resetExpiresAt = undefined;
    student.updatedAt = new Date().toISOString();
    saveDb();
    res.json({ message: 'Password has been reset successfully. You can now log in.' });
  });

  // --- Protected Student Portal Routes ---
  app.get('/api/student/portal', (req, res) => {
    const student = requireStudent(req, res);
    if (!student) return;
    res.json({
      profile: sanitizeStudent(student),
      applications: db.applications.filter((a) => a.userId === student.uid),
      admitCards: db.admitCards.filter((c) => c.userId === student.uid),
      results: db.results.filter((r) => r.userId === student.uid),
      certificates: db.certificates.filter((c) => c.userId === student.uid),
      notifications: db.notifications.filter((n) => n.userId === student.uid),
      courses: db.courses.filter((c) => c.active),
      notices: db.controls.noticeDisplay ? db.notices.filter((n) => n.active) : [],
    });
  });

  app.put('/api/student/profile', (req, res) => {
    const student = requireStudent(req, res);
    if (!student) return;
    const { fullName, phone, district, education, avatarUrl } = req.body ?? {};
    if (typeof fullName === 'string' && fullName.trim().length >= 2) {
      student.fullName = fullName.trim().slice(0, 120);
    }
    if (typeof phone === 'string') student.phone = phone.trim().slice(0, 30);
    if (typeof district === 'string') student.district = district.trim().slice(0, 80);
    if (typeof education === 'string') student.education = education.trim().slice(0, 120);
    if (typeof avatarUrl === 'string' && !avatarUrl.startsWith('javascript:')) {
      student.avatarUrl = avatarUrl.slice(0, 500);
    }
    student.updatedAt = new Date().toISOString();
    saveDb();
    res.json({ profile: sanitizeStudent(student) });
  });

  app.post('/api/student/upload-avatar', (req, res) => {
    const student = requireStudent(req, res);
    if (!student) return;
    const { dataUrl, fileName } = req.body ?? {};
    if (typeof dataUrl !== 'string') {
      return res.status(400).json({ error: 'Image payload required.' });
    }
    const parsed = parseImageUpload(dataUrl, typeof fileName === 'string' ? fileName : 'avatar');
    if (!parsed) {
      return res.status(400).json({ error: 'Invalid image format or file exceeds 2MB.' });
    }
    const targetPath = path.resolve(UPLOAD_DIR, parsed.safeName);
    if (!targetPath.startsWith(UPLOAD_DIR + path.sep)) {
      return res.status(400).json({ error: 'Invalid file path.' });
    }
    fs.writeFileSync(targetPath, parsed.buffer);
    const url = `/uploads/${parsed.safeName}`;
    student.avatarUrl = url;
    student.updatedAt = new Date().toISOString();
    saveDb();
    res.json({ url, profile: sanitizeStudent(student) });
  });

  app.patch('/api/student/notifications/:id/read', (req, res) => {
    const student = requireStudent(req, res);
    if (!student) return;
    const notif = db.notifications.find((n) => n.id === req.params.id && n.userId === student.uid);
    if (!notif) return res.status(404).json({ error: 'Notification not found.' });
    notif.read = true;
    saveDb();
    res.json({ notification: notif });
  });

  app.post('/api/applications', (req, res) => {
    if (db.controls.maintenanceMode) {
      return res.status(503).json({ error: 'Platform is currently in maintenance mode.' });
    }
    if (!db.controls.admissionApplications) {
      return res.status(403).json({ error: 'Admission applications are currently closed by administrator.' });
    }
    if (!db.controls.courseEnrollment) {
      return res.status(403).json({ error: 'Course enrollment is currently paused by administrator.' });
    }

    const token = extractBearer(req);
    const session = token ? verifyToken(token) : null;
    const body = req.body ?? {};
    const {
      fullName,
      email,
      phone,
      nidOrBirthReg,
      dateOfBirth,
      educationLevel,
      district,
      centerId,
      courseId,
    } = body;

    if (
      typeof fullName !== 'string' ||
      fullName.trim().length < 2 ||
      typeof email !== 'string' ||
      !email.includes('@') ||
      typeof phone !== 'string' ||
      phone.trim().length < 6 ||
      typeof district !== 'string' ||
      district.trim().length < 2 ||
      typeof courseId !== 'string' ||
      !courseId.trim()
    ) {
      return res.status(400).json({ error: 'Please complete all required application fields.' });
    }

    const courseExists = db.courses.some((c) => c.id === courseId && c.active);
    if (!courseExists) {
      return res.status(400).json({ error: 'Selected course is not active.' });
    }

    const now = new Date().toISOString();
    const userId = session?.role === 'student' ? session.sub : `guest-${crypto.randomBytes(4).toString('hex')}`;
    const trackingCode = `DYD-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const application: AdmissionApplicationItem = {
      id: safeId('app'),
      userId,
      trackingCode,
      fullName: fullName.trim().slice(0, 120),
      email: email.trim().toLowerCase().slice(0, 160),
      phone: phone.trim().slice(0, 30),
      nidOrBirthReg: typeof nidOrBirthReg === 'string' ? nidOrBirthReg.trim().slice(0, 40) : '',
      dateOfBirth: typeof dateOfBirth === 'string' ? dateOfBirth.trim().slice(0, 30) : '',
      educationLevel: typeof educationLevel === 'string' ? educationLevel.trim().slice(0, 80) : 'HSC / Equivalent',
      district: district.trim().slice(0, 80),
      centerId: typeof centerId === 'string' ? centerId.trim().slice(0, 128) : '',
      courseId: courseId.trim().slice(0, 128),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    db.applications.unshift(application);
    if (session?.role === 'student') {
      db.notifications.unshift({
        id: safeId('notif'),
        userId: session.sub,
        title: 'Admission Application Received',
        message: `Your application (${trackingCode}) has been received and is pending review.`,
        read: false,
        createdAt: now,
      });
    }
    logActivity(application.email, 'APPLICATION_SUBMITTED', trackingCode);
    saveDb();
    res.status(201).json({ application });
  });

  app.get('/api/applications/track/:trackingCode', (req, res) => {
    const code = String(req.params.trackingCode || '').trim().toUpperCase();
    const appItem = db.applications.find((a) => a.trackingCode.toUpperCase() === code);
    if (!appItem) {
      return res.status(404).json({ error: 'No application found with that tracking code.' });
    }
    res.json({
      trackingCode: appItem.trackingCode,
      fullName: appItem.fullName,
      district: appItem.district,
      courseId: appItem.courseId,
      status: appItem.status,
      createdAt: appItem.createdAt,
      updatedAt: appItem.updatedAt,
    });
  });

  // --- Admin Auth & First-Run Setup ---
  app.get('/api/admin/auth/status', (_req, res) => {
    const hasEnvPassword = Boolean(process.env.ADMIN_INITIAL_PASSWORD && process.env.ADMIN_INITIAL_PASSWORD.trim().length > 0);
    const hasStoredHash = Boolean(db.adminAuth.passwordHash && db.adminAuth.salt);
    res.json({
      username: db.adminAuth.username,
      needsInitialSetup: !hasEnvPassword && !hasStoredHash,
      mustChangePassword: db.adminAuth.mustChangePassword,
    });
  });

  app.post('/api/admin/auth/bootstrap', (req, res) => {
    const hasEnvPassword = Boolean(process.env.ADMIN_INITIAL_PASSWORD && process.env.ADMIN_INITIAL_PASSWORD.trim().length > 0);
    const hasStoredHash = Boolean(db.adminAuth.passwordHash && db.adminAuth.salt);
    if (hasEnvPassword || hasStoredHash) {
      return res.status(409).json({ error: 'Admin password is already configured.' });
    }
    const { username, password } = req.body ?? {};
    if (username !== 'shabbir2020') {
      return res.status(400).json({ error: 'Initial admin username must be shabbir2020.' });
    }
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Please choose a strong password (minimum 8 characters).' });
    }
    const { hash, salt } = hashPassword(password);
    db.adminAuth.passwordHash = hash;
    db.adminAuth.salt = salt;
    db.adminAuth.mustChangePassword = false;
    db.adminAuth.passwordChangedAt = new Date().toISOString();
    logActivity('shabbir2020', 'ADMIN_INITIAL_SETUP', 'shabbir2020');
    saveDb();

    const token = signToken({ sub: 'admin-shabbir2020', role: 'admin', username: 'shabbir2020' });
    res.status(201).json({ token, username: 'shabbir2020', mustChangePassword: false });
  });

  app.post('/api/admin/auth/login', (req, res) => {
    const { username, password } = req.body ?? {};
    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Username and password are required.' });
    }
    const cleanUser = username.trim();
    const adminUser = db.adminUsers.find((a) => a.username === cleanUser && a.active);
    if (!adminUser && cleanUser !== db.adminAuth.username) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    const envInit = process.env.ADMIN_INITIAL_PASSWORD?.trim();
    const hasStoredHash = Boolean(db.adminAuth.passwordHash && db.adminAuth.salt);

    let authenticated = false;
    let mustChange = db.adminAuth.mustChangePassword;

    if (hasStoredHash && db.adminAuth.passwordHash && db.adminAuth.salt) {
      authenticated = verifyPasswordHash(password, db.adminAuth.passwordHash, db.adminAuth.salt);
    } else if (envInit) {
      authenticated = timingSafeTextMatch(password, envInit);
      mustChange = true;
    }

    if (!authenticated) {
      return res.status(401).json({ error: 'Invalid admin username or password.' });
    }

    logActivity(cleanUser, 'ADMIN_LOGIN', cleanUser);
    saveDb();
    const token = signToken({ sub: adminUser?.id || 'admin-shabbir2020', role: 'admin', username: cleanUser });
    res.json({
      token,
      username: cleanUser,
      mustChangePassword: mustChange,
    });
  });

  app.post('/api/admin/auth/change-password', (req, res) => {
    const session = requireAdmin(req, res, true);
    if (!session) return;
    const { currentPassword, newPassword } = req.body ?? {};
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters.' });
    }

    const envInit = process.env.ADMIN_INITIAL_PASSWORD?.trim();
    const hasStoredHash = Boolean(db.adminAuth.passwordHash && db.adminAuth.salt);

    if (hasStoredHash && db.adminAuth.passwordHash && db.adminAuth.salt) {
      if (typeof currentPassword !== 'string' || !verifyPasswordHash(currentPassword, db.adminAuth.passwordHash, db.adminAuth.salt)) {
        return res.status(401).json({ error: 'Current password is incorrect.' });
      }
    } else if (envInit) {
      if (typeof currentPassword !== 'string' || !timingSafeTextMatch(currentPassword, envInit)) {
        return res.status(401).json({ error: 'Initial password does not match.' });
      }
    }

    const { hash, salt } = hashPassword(newPassword);
    db.adminAuth.passwordHash = hash;
    db.adminAuth.salt = salt;
    db.adminAuth.mustChangePassword = false;
    db.adminAuth.passwordChangedAt = new Date().toISOString();
    logActivity(session.username || 'shabbir2020', 'ADMIN_PASSWORD_CHANGED', 'shabbir2020');
    saveDb();
    res.json({ message: 'Admin password updated successfully.', mustChangePassword: false });
  });

  // --- Admin Dashboard Full Overview & Management Endpoints ---
  app.get('/api/admin/overview', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    res.json({
      controls: db.controls,
      siteContent: db.siteContent,
      courses: db.courses,
      modules: db.modules,
      centers: db.centers,
      packages: db.packages,
      notices: db.notices,
      students: db.students.map(sanitizeStudent),
      applications: db.applications,
      admitCards: db.admitCards,
      results: db.results,
      certificates: db.certificates,
      notifications: db.notifications,
      adminUsers: db.adminUsers,
      activityLogs: db.activityLogs,
      contactMessages: db.contactMessages,
    });
  });

  app.put('/api/admin/controls', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    const incoming = req.body ?? {};
    const keys: (keyof WebsiteControls)[] = [
      'maintenanceMode',
      'studentRegistration',
      'admissionApplications',
      'courseEnrollment',
      'noticeDisplay',
      'studentLogin',
      'certificateVerification',
    ];
    for (const k of keys) {
      if (typeof incoming[k] === 'boolean') {
        db.controls[k] = incoming[k];
      }
    }
    logActivity(session.username || 'admin', 'UPDATE_WEBSITE_CONTROLS', JSON.stringify(db.controls));
    saveDb();
    res.json({ controls: db.controls });
  });

  app.put('/api/admin/site-content', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    const incoming = req.body ?? {};
    db.siteContent = { ...db.siteContent, ...incoming };
    logActivity(session.username || 'admin', 'UPDATE_SITE_CONTENT', 'Homepage & Branding');
    saveDb();
    res.json({ siteContent: db.siteContent });
  });

  app.post('/api/admin/upload', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    const { dataUrl, fileName } = req.body ?? {};
    if (typeof dataUrl !== 'string') {
      return res.status(400).json({ error: 'Image payload required.' });
    }
    const parsed = parseImageUpload(dataUrl, typeof fileName === 'string' ? fileName : 'cms');
    if (!parsed) {
      return res.status(400).json({ error: 'Invalid image format or exceeds 2MB.' });
    }
    const targetPath = path.resolve(UPLOAD_DIR, parsed.safeName);
    if (!targetPath.startsWith(UPLOAD_DIR + path.sep)) {
      return res.status(400).json({ error: 'Invalid file path.' });
    }
    fs.writeFileSync(targetPath, parsed.buffer);
    const url = `/uploads/${parsed.safeName}`;
    logActivity(session.username || 'admin', 'UPLOAD_ASSET', url);
    saveDb();
    res.json({ url });
  });

  // Generic CRUD helpers for Admin modules
  app.post('/api/admin/courses', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    const item: CourseItem = {
      id: req.body?.id || safeId('course'),
      title: String(req.body?.title || '').slice(0, 160),
      titleBn: String(req.body?.titleBn || '').slice(0, 180),
      summary: String(req.body?.summary || '').slice(0, 800),
      duration: String(req.body?.duration || '300 Hours').slice(0, 80),
      level: String(req.body?.level || 'Applied').slice(0, 60),
      active: req.body?.active !== false,
      updatedAt: new Date().toISOString(),
    };
    const idx = db.courses.findIndex((c) => c.id === item.id);
    if (idx >= 0) db.courses[idx] = item;
    else db.courses.push(item);
    logActivity(session.username || 'admin', 'UPSERT_COURSE', item.title);
    saveDb();
    res.json({ course: item, courses: db.courses });
  });

  app.delete('/api/admin/courses/:id', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    db.courses = db.courses.filter((c) => c.id !== req.params.id);
    logActivity(session.username || 'admin', 'DELETE_COURSE', req.params.id);
    saveDb();
    res.json({ courses: db.courses });
  });

  app.post('/api/admin/modules', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    const item: CourseModuleItem = {
      id: req.body?.id || safeId('mod'),
      courseId: req.body?.courseId || 'course-basic-ai',
      title: String(req.body?.title || '').slice(0, 140),
      titleBn: String(req.body?.titleBn || '').slice(0, 160),
      description: String(req.body?.description || '').slice(0, 600),
      hours: Number(req.body?.hours) || 40,
      order: Number(req.body?.order) || db.modules.length + 1,
      icon: String(req.body?.icon || 'Cpu').slice(0, 40),
    };
    const idx = db.modules.findIndex((m) => m.id === item.id);
    if (idx >= 0) db.modules[idx] = item;
    else db.modules.push(item);
    logActivity(session.username || 'admin', 'UPSERT_MODULE', item.title);
    saveDb();
    res.json({ module: item, modules: db.modules });
  });

  app.delete('/api/admin/modules/:id', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    db.modules = db.modules.filter((m) => m.id !== req.params.id);
    logActivity(session.username || 'admin', 'DELETE_MODULE', req.params.id);
    saveDb();
    res.json({ modules: db.modules });
  });

  app.post('/api/admin/centers', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    const item: TrainingCenterItem = {
      id: req.body?.id || safeId('center'),
      name: String(req.body?.name || '').slice(0, 160),
      district: String(req.body?.district || '').slice(0, 80),
      region: String(req.body?.region || '').slice(0, 80),
      address: String(req.body?.address || '').slice(0, 240),
      capacity: Number(req.body?.capacity) || 30,
      active: req.body?.active !== false,
    };
    const idx = db.centers.findIndex((c) => c.id === item.id);
    if (idx >= 0) db.centers[idx] = item;
    else db.centers.push(item);
    logActivity(session.username || 'admin', 'UPSERT_CENTER', item.name);
    saveDb();
    res.json({ center: item, centers: db.centers });
  });

  app.delete('/api/admin/centers/:id', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    db.centers = db.centers.filter((c) => c.id !== req.params.id);
    logActivity(session.username || 'admin', 'DELETE_CENTER', req.params.id);
    saveDb();
    res.json({ centers: db.centers });
  });

  app.post('/api/admin/packages', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    const item: PackageRegionItem = {
      id: req.body?.id || safeId('pkg'),
      packageNumber: String(req.body?.packageNumber || 'Package').slice(0, 40),
      regionName: String(req.body?.regionName || '').slice(0, 120),
      districtCount: Number(req.body?.districtCount) || 0,
      partnerOrg: String(req.body?.partnerOrg || '').slice(0, 160),
      duration: String(req.body?.duration || '50 Days').slice(0, 80),
      availableCenters: Number(req.body?.availableCenters) || 0,
      districts: Array.isArray(req.body?.districts) ? req.body.districts.slice(0, 30) : [],
    };
    const idx = db.packages.findIndex((p) => p.id === item.id);
    if (idx >= 0) db.packages[idx] = item;
    else db.packages.push(item);
    logActivity(session.username || 'admin', 'UPSERT_PACKAGE', item.regionName);
    saveDb();
    res.json({ pkg: item, packages: db.packages });
  });

  app.delete('/api/admin/packages/:id', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    db.packages = db.packages.filter((p) => p.id !== req.params.id);
    logActivity(session.username || 'admin', 'DELETE_PACKAGE', req.params.id);
    saveDb();
    res.json({ packages: db.packages });
  });

  app.post('/api/admin/notices', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    const item: NoticeItem = {
      id: req.body?.id || safeId('notice'),
      title: String(req.body?.title || '').slice(0, 200),
      body: String(req.body?.body || '').slice(0, 2000),
      category: String(req.body?.category || 'General').slice(0, 60),
      publishedDate: String(req.body?.publishedDate || new Date().toISOString().slice(0, 10)).slice(0, 40),
      pinned: Boolean(req.body?.pinned),
      active: req.body?.active !== false,
    };
    const idx = db.notices.findIndex((n) => n.id === item.id);
    if (idx >= 0) db.notices[idx] = item;
    else db.notices.unshift(item);
    logActivity(session.username || 'admin', 'UPSERT_NOTICE', item.title);
    saveDb();
    res.json({ notice: item, notices: db.notices });
  });

  app.delete('/api/admin/notices/:id', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    db.notices = db.notices.filter((n) => n.id !== req.params.id);
    logActivity(session.username || 'admin', 'DELETE_NOTICE', req.params.id);
    saveDb();
    res.json({ notices: db.notices });
  });

  app.patch('/api/admin/applications/:id/status', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    const status = req.body?.status;
    if (!['pending', 'shortlisted', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }
    const appItem = db.applications.find((a) => a.id === req.params.id);
    if (!appItem) return res.status(404).json({ error: 'Application not found.' });
    appItem.status = status;
    appItem.updatedAt = new Date().toISOString();

    db.notifications.unshift({
      id: safeId('notif'),
      userId: appItem.userId,
      title: `Application Status Updated: ${status.toUpperCase()}`,
      message: `Your admission application (${appItem.trackingCode}) status is now ${status}.`,
      read: false,
      createdAt: appItem.updatedAt,
    });
    logActivity(session.username || 'admin', `APPLICATION_${status.toUpperCase()}`, appItem.trackingCode);
    saveDb();
    res.json({ application: appItem });
  });

  app.delete('/api/admin/applications/:id', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    db.applications = db.applications.filter((a) => a.id !== req.params.id);
    logActivity(session.username || 'admin', 'DELETE_APPLICATION', req.params.id);
    saveDb();
    res.json({ applications: db.applications });
  });

  app.post('/api/admin/admit-cards', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    const item: AdmitCardItem = {
      id: req.body?.id || safeId('admit'),
      userId: String(req.body?.userId || '').slice(0, 128),
      trackingCode: String(req.body?.trackingCode || '').slice(0, 40),
      rollNumber: String(req.body?.rollNumber || `DYD-${Math.floor(100000 + Math.random() * 900000)}`).slice(0, 40),
      studentName: String(req.body?.studentName || '').slice(0, 120),
      examDate: String(req.body?.examDate || '').slice(0, 60),
      examVenue: String(req.body?.examVenue || '').slice(0, 200),
      issuedAt: new Date().toISOString(),
    };
    const idx = db.admitCards.findIndex((c) => c.id === item.id);
    if (idx >= 0) db.admitCards[idx] = item;
    else db.admitCards.unshift(item);

    if (item.userId) {
      db.notifications.unshift({
        id: safeId('notif'),
        userId: item.userId,
        title: 'Admit Card Issued',
        message: `Your Admit Card (Roll: ${item.rollNumber}) is ready to download.`,
        read: false,
        createdAt: item.issuedAt,
      });
    }
    logActivity(session.username || 'admin', 'ISSUE_ADMIT_CARD', item.rollNumber);
    saveDb();
    res.json({ admitCard: item, admitCards: db.admitCards });
  });

  app.post('/api/admin/results', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    const item: ExamResultItem = {
      id: req.body?.id || safeId('res'),
      userId: String(req.body?.userId || '').slice(0, 128),
      rollNumber: String(req.body?.rollNumber || '').slice(0, 40),
      studentName: String(req.body?.studentName || '').slice(0, 120),
      courseTitle: String(req.body?.courseTitle || 'Applied AI').slice(0, 160),
      score: Math.min(100, Math.max(0, Number(req.body?.score) || 0)),
      grade: String(req.body?.grade || 'A').slice(0, 16),
      status: ['passed', 'merit', 'pending', 'failed'].includes(req.body?.status) ? req.body.status : 'passed',
      publishedAt: new Date().toISOString(),
    };
    const idx = db.results.findIndex((r) => r.id === item.id);
    if (idx >= 0) db.results[idx] = item;
    else db.results.unshift(item);
    logActivity(session.username || 'admin', 'PUBLISH_RESULT', item.rollNumber);
    saveDb();
    res.json({ result: item, results: db.results });
  });

  app.post('/api/admin/certificates', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    const code = String(req.body?.certificateCode || `DYD-CERT-${crypto.randomBytes(3).toString('hex').toUpperCase()}`).slice(0, 64);
    const item: CertificateItem = {
      id: req.body?.id || code,
      certificateCode: code,
      userId: String(req.body?.userId || 'external').slice(0, 128),
      studentName: String(req.body?.studentName || '').slice(0, 120),
      courseTitle: String(req.body?.courseTitle || 'Applied Artificial Intelligence').slice(0, 160),
      centerName: String(req.body?.centerName || 'DYD AI Gaibandha Sadar Lab (HQ)').slice(0, 160),
      issueDate: String(req.body?.issueDate || new Date().toISOString().slice(0, 10)).slice(0, 40),
      grade: String(req.body?.grade || 'A+').slice(0, 20),
      revoked: Boolean(req.body?.revoked),
    };
    const idx = db.certificates.findIndex((c) => c.id === item.id);
    if (idx >= 0) db.certificates[idx] = item;
    else db.certificates.unshift(item);
    logActivity(session.username || 'admin', 'ISSUE_CERTIFICATE', item.certificateCode);
    saveDb();
    res.json({ certificate: item, certificates: db.certificates });
  });

  app.post('/api/admin/notifications', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    const { userId, title, message } = req.body ?? {};
    const now = new Date().toISOString();
    const targets = userId === 'ALL' ? db.students.map((s) => s.uid) : [String(userId || '')];
    for (const uid of targets) {
      if (!uid) continue;
      db.notifications.unshift({
        id: safeId('notif'),
        userId: uid,
        title: String(title || 'Announcement').slice(0, 160),
        message: String(message || '').slice(0, 600),
        read: false,
        createdAt: now,
      });
    }
    logActivity(session.username || 'admin', 'SEND_NOTIFICATION', String(userId));
    saveDb();
    res.json({ notifications: db.notifications });
  });

  app.post('/api/admin/roles', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    const item: AdminUserItem = {
      id: req.body?.id || safeId('adm'),
      username: String(req.body?.username || '').slice(0, 64),
      email: String(req.body?.email || '').slice(0, 160),
      role: ['super_admin', 'editor', 'reviewer'].includes(req.body?.role) ? req.body.role : 'editor',
      active: req.body?.active !== false,
      createdAt: new Date().toISOString(),
    };
    const idx = db.adminUsers.findIndex((u) => u.id === item.id);
    if (idx >= 0) db.adminUsers[idx] = item;
    else db.adminUsers.push(item);
    logActivity(session.username || 'admin', 'UPSERT_ADMIN_ROLE', `${item.username} (${item.role})`);
    saveDb();
    res.json({ adminUsers: db.adminUsers });
  });

  app.put('/api/admin/students/:uid', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    const stu = db.students.find((s) => s.uid === req.params.uid);
    if (!stu) return res.status(404).json({ error: 'Student not found.' });
    const { fullName, phone, district, education } = req.body ?? {};
    if (typeof fullName === 'string') stu.fullName = fullName.trim().slice(0, 120);
    if (typeof phone === 'string') stu.phone = phone.trim().slice(0, 30);
    if (typeof district === 'string') stu.district = district.trim().slice(0, 80);
    if (typeof education === 'string') stu.education = education.trim().slice(0, 120);
    stu.updatedAt = new Date().toISOString();
    logActivity(session.username || 'admin', 'UPDATE_STUDENT', stu.email);
    saveDb();
    res.json({ students: db.students.map(sanitizeStudent) });
  });

  app.delete('/api/admin/students/:uid', (req, res) => {
    const session = requireAdmin(req, res);
    if (!session) return;
    db.students = db.students.filter((s) => s.uid !== req.params.uid);
    logActivity(session.username || 'admin', 'DELETE_STUDENT', req.params.uid);
    saveDb();
    res.json({ students: db.students.map(sanitizeStudent) });
  });

  // --- Vite / Static SPA Serving ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(ROOT_DIR, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DYD AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start DYD AI server:', err);
  process.exit(1);
});
