export type Language = 'bn' | 'en';

export interface WebsiteControls {
  maintenanceMode: boolean;
  studentRegistration: boolean;
  admissionApplications: boolean;
  courseEnrollment: boolean;
  noticeDisplay: boolean;
  studentLogin: boolean;
  certificateVerification: boolean;
}

export interface StatItem {
  id: string;
  label: string;
  labelBn: string;
  value: string;
  numericTarget: number;
  suffix: string;
  description: string;
  descriptionBn: string;
  sourceMode: 'manual' | 'live_centers' | 'live_students' | 'live_courses';
}

export interface BenefitItem {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  icon: string;
}

export interface WhyAiCard {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  metric: string;
  icon: string;
}

export interface AdmissionStep {
  id: string;
  stepNumber: number;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  dateLabel: string;
  status: 'active' | 'upcoming' | 'completed';
}

export interface EligibilityItem {
  id: string;
  title: string;
  titleBn: string;
  requirement: string;
  requirementBn: string;
  detail: string;
  detailBn: string;
  icon: string;
}

export interface NavLinkItem {
  id: string;
  label: string;
  labelBn: string;
  path: string;
}

export interface SiteContent {
  brandName: string;
  tagline: string;
  taglineBn: string;
  logoUrl: string;
  faviconUrl: string;
  announcement: {
    enabled: boolean;
    text: string;
    textBn: string;
    highlight: string;
    highlightBn: string;
    link: string;
  };
  navbar: {
    links: NavLinkItem[];
    loginLabel: string;
    loginLabelBn: string;
    applyLabel: string;
    applyLabelBn: string;
  };
  hero: {
    eyebrow: string;
    eyebrowBn: string;
    heading: string;
    headingBn: string;
    description: string;
    descriptionBn: string;
    primaryCta: string;
    primaryCtaBn: string;
    secondaryCta: string;
    secondaryCtaBn: string;
    imageUrl: string;
    floatingCards: {
      title: string;
      subtitle: string;
    }[];
  };
  stats: StatItem[];
  benefitsSection: {
    eyebrow: string;
    eyebrowBn: string;
    heading: string;
    headingBn: string;
    subtitle: string;
    subtitleBn: string;
    items: BenefitItem[];
  };
  whyAiSection: {
    eyebrow: string;
    eyebrowBn: string;
    heading: string;
    headingBn: string;
    description: string;
    descriptionBn: string;
    ctaLabel: string;
    ctaLabelBn: string;
    imageUrl: string;
    cards: WhyAiCard[];
  };
  admissionSection: {
    eyebrow: string;
    eyebrowBn: string;
    heading: string;
    headingBn: string;
    subtitle: string;
    subtitleBn: string;
    steps: AdmissionStep[];
  };
  eligibilitySection: {
    eyebrow: string;
    eyebrowBn: string;
    heading: string;
    headingBn: string;
    subtitle: string;
    subtitleBn: string;
    disclaimer: string;
    disclaimerBn: string;
    items: EligibilityItem[];
  };
  modulesSection: {
    eyebrow: string;
    eyebrowBn: string;
    heading: string;
    headingBn: string;
    subtitle: string;
    subtitleBn: string;
  };
  regionsSection: {
    eyebrow: string;
    eyebrowBn: string;
    heading: string;
    headingBn: string;
    subtitle: string;
    subtitleBn: string;
  };
  ctaSection: {
    heading: string;
    headingBn: string;
    description: string;
    descriptionBn: string;
    primaryLabel: string;
    primaryLabelBn: string;
    secondaryLabel: string;
    secondaryLabelBn: string;
  };
  footer: {
    aboutText: string;
    aboutTextBn: string;
    address: string;
    phone: string;
    email: string;
    officeHours: string;
    socialLinks: {
      facebook: string;
      youtube: string;
      linkedin: string;
      website: string;
    };
    copyright: string;
  };
}

export interface CourseItem {
  id: string;
  title: string;
  titleBn: string;
  summary: string;
  duration: string;
  level: string;
  active: boolean;
  updatedAt: string;
}

export interface CourseModuleItem {
  id: string;
  courseId?: string;
  title: string;
  titleBn: string;
  description: string;
  hours: number;
  order: number;
  icon: string;
}

export interface TrainingCenterItem {
  id: string;
  name: string;
  district: string;
  region: string;
  address: string;
  capacity: number;
  active: boolean;
}

export interface PackageRegionItem {
  id: string;
  packageNumber: string;
  regionName: string;
  districtCount: number;
  partnerOrg: string;
  duration: string;
  availableCenters: number;
  districts: string[];
}

export interface NoticeItem {
  id: string;
  title: string;
  body: string;
  category: string;
  publishedDate: string;
  pinned: boolean;
  active: boolean;
}

export interface StudentUser {
  id: string;
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  district: string;
  education: string;
  avatarUrl: string;
  role: 'student';
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionApplicationItem {
  id: string;
  userId: string;
  trackingCode: string;
  fullName: string;
  email: string;
  phone: string;
  nidOrBirthReg: string;
  dateOfBirth: string;
  educationLevel: string;
  district: string;
  centerId: string;
  courseId: string;
  status: 'pending' | 'shortlisted' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface AdmitCardItem {
  id: string;
  userId: string;
  trackingCode: string;
  rollNumber: string;
  studentName: string;
  examDate: string;
  examVenue: string;
  issuedAt: string;
}

export interface ExamResultItem {
  id: string;
  userId: string;
  rollNumber: string;
  studentName: string;
  courseTitle: string;
  score: number;
  grade: string;
  status: 'passed' | 'merit' | 'pending' | 'failed';
  publishedAt: string;
}

export interface CertificateItem {
  id: string;
  certificateCode: string;
  userId: string;
  studentName: string;
  courseTitle: string;
  centerName: string;
  issueDate: string;
  grade: string;
  revoked: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityLogItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
}

export interface AdminUserItem {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'editor' | 'reviewer';
  active: boolean;
  createdAt: string;
}

export interface ContactMessageItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'reviewed';
}

export interface PublicBundle {
  controls: WebsiteControls;
  siteContent: SiteContent;
  courses: CourseItem[];
  modules: CourseModuleItem[];
  centers: TrainingCenterItem[];
  packages: PackageRegionItem[];
  notices: NoticeItem[];
  liveCounts: {
    students: number;
    centers: number;
    courses: number;
    applications: number;
  };
}
