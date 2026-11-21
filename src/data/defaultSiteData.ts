import type {
  CourseItem,
  CourseModuleItem,
  NoticeItem,
  PackageRegionItem,
  SiteContent,
  TrainingCenterItem,
  WebsiteControls,
} from '../types/dyd';

export const DEFAULT_CONTROLS: WebsiteControls = {
  maintenanceMode: false,
  studentRegistration: true,
  admissionApplications: true,
  courseEnrollment: true,
  noticeDisplay: true,
  studentLogin: true,
  certificateVerification: true,
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  brandName: 'DYD AI',
  tagline: 'Artificial Intelligence Skill Development Platform',
  taglineBn: 'কৃত্রিম বুদ্ধিমত্তা দক্ষতা উন্নয়ন প্ল্যাটফর্ম',
  logoUrl: '/assets/aistudio/image_fa46e441.png',
  faviconUrl: '/assets/aistudio/image_fa46e441.png',
  announcement: {
    enabled: true,
    text: 'New AI Skill Development Batch Admissions Open — Submit your online application and track your admit card directly from the student portal.',
    textBn: 'নতুন AI দক্ষতা উন্নয়ন ব্যাচে ভর্তি আবেদন চলছে — অনলাইনে আবেদন করুন এবং স্টুডেন্ট পোর্টাল থেকে অ্যাডমিট কার্ড সংগ্রহ করুন।',
    highlight: 'Admissions Open',
    highlightBn: 'ভর্তি চলছে',
    link: '/apply',
  },
  navbar: {
    links: [
      { id: 'nav-home', label: 'Home', labelBn: 'হোম', path: '/' },
      { id: 'nav-about', label: 'About', labelBn: 'প্রকল্প সম্পর্কে', path: '/about' },
      { id: 'nav-programs', label: 'Training Programs', labelBn: 'প্রশিক্ষণ প্রোগ্রাম', path: '/programs' },
      { id: 'nav-admission', label: 'Admission', labelBn: 'ভর্তি', path: '/apply' },
      { id: 'nav-notices', label: 'Notices', labelBn: 'নোটিশ', path: '/notices' },
      { id: 'nav-contact', label: 'Contact', labelBn: 'যোগাযোগ', path: '/contact' },
    ],
    loginLabel: 'Student Login',
    loginLabelBn: 'শিক্ষার্থী লগইন',
    applyLabel: 'Apply Now',
    applyLabelBn: 'আবেদন করুন',
  },
  hero: {
    eyebrow: 'DYD AI Training & Digital Skills Initiative',
    eyebrowBn: 'DYD AI প্রশিক্ষণ ও ডিজিটাল দক্ষতা উন্নয়ন প্ল্যাটফর্ম',
    heading: 'Skill Development through Artificial Intelligence (AI) Technology',
    headingBn: 'কৃত্রিম বুদ্ধিমত্তা (AI) প্রযুক্তির মাধ্যমে দক্ষতা উন্নয়ন',
    description:
      'Gain hands-on mastery in modern AI tools, prompt engineering, generative workflows, and data analysis to prepare for tomorrow’s technology careers.',
    descriptionBn:
      'আধুনিক AI প্রযুক্তির বাস্তবমুখী ব্যবহারে দক্ষতা অর্জন করুন এবং ভবিষ্যতের কর্মজগতের জন্য নিজেকে প্রস্তুত করুন।',
    primaryCta: 'Apply Now',
    primaryCtaBn: 'আবেদন করুন',
    secondaryCta: 'Project Details',
    secondaryCtaBn: 'বিস্তারিত দেখুন',
    imageUrl: '/src/assets/images/hero_ai_training_lab_1795239118441.jpg',
    floatingCards: [
      { title: '300 Hours Lab Training', subtitle: '50 Days Intensive Curriculum' },
      { title: '6 Core AI Modules', subtitle: 'Prompting, GenAI & Analytics' },
      { title: 'Digital Verification', subtitle: 'Admit Cards & Certificates' },
    ],
  },
  stats: [
    {
      id: 'stat-centers',
      label: 'Training Centers',
      labelBn: 'প্রশিক্ষণ কেন্দ্র',
      value: '6',
      numericTarget: 6,
      suffix: '+',
      description: 'Active labs across regional packages',
      descriptionBn: 'আঞ্চলিক প্যাকেজভুক্ত সক্রিয় ল্যাব',
      sourceMode: 'live_centers',
    },
    {
      id: 'stat-duration',
      label: 'Training Duration',
      labelBn: 'প্রশিক্ষণের মেয়াদ',
      value: '300',
      numericTarget: 300,
      suffix: ' Hrs',
      description: '50 days structured practical curriculum',
      descriptionBn: '৫০ দিনের ব্যবহারিক প্রশিক্ষণ কারিকুলাম',
      sourceMode: 'manual',
    },
    {
      id: 'stat-courses',
      label: 'Course Modules',
      labelBn: 'কোর্স ও মডিউল',
      value: '6',
      numericTarget: 6,
      suffix: ' Modules',
      description: 'Industry-aligned AI & productivity tracks',
      descriptionBn: 'বাস্তবমুখী AI ও প্রোডাক্টিভিটি ট্র্যাক',
      sourceMode: 'live_courses',
    },
    {
      id: 'stat-students',
      label: 'Registered Students',
      labelBn: 'নিবন্ধিত শিক্ষার্থী',
      value: '0',
      numericTarget: 0,
      suffix: '',
      description: 'Live portal student enrollments',
      descriptionBn: 'পোর্টালে নিবন্ধিত মোট শিক্ষার্থী',
      sourceMode: 'live_students',
    },
  ],
  benefitsSection: {
    eyebrow: 'Program Advantages',
    eyebrowBn: 'প্রশিক্ষণের সুবিধাসমূহ',
    heading: 'Structured Practical Learning Designed for Career Readiness',
    headingBn: 'ক্যারিয়ার গঠনে আধুনিক ও বাস্তবমুখী AI প্রশিক্ষণ কাঠামো',
    subtitle:
      'Every component of the DYD AI curriculum combines instructor-led lab sessions, guided projects, and verifiable assessments.',
    subtitleBn:
      'তাত্ত্বিক ধারণার পাশাপাশি প্রতিটি সেশনে সরাসরি ল্যাব প্র্যাকটিস, প্রজেক্ট ও মূল্যায়নের সুযোগ।',
    items: [
      {
        id: 'ben-1',
        title: 'AI Skills Development',
        titleBn: 'AI দক্ষতা উন্নয়ন',
        description:
          'Build foundational fluency in neural workflows, structured prompting, and applied artificial intelligence.',
        descriptionBn:
          'আর্টিফিশিয়াল ইন্টেলিজেন্স ও আধুনিক প্রম্পট ইঞ্জিনিয়ারিংয়ের মৌলিক ও উন্নত কৌশল অর্জন।',
        icon: 'BrainCircuit',
      },
      {
        id: 'ben-2',
        title: 'Practical AI Training',
        titleBn: 'বাস্তবমুখী ল্যাব প্রশিক্ষণ',
        description:
          'Hands-on lab assignments simulating real workplace automation, content pipelines, and data tasks.',
        descriptionBn:
          'প্রজেক্ট-ভিত্তিক ওয়ার্কশপের মাধ্যমে অফিস অটোমেশন ও বাস্তব কাজের সরাসরি অনুশীলন।',
        icon: 'Cpu',
      },
      {
        id: 'ben-3',
        title: 'Professional Learning',
        titleBn: 'পেশাদার মেন্টরশিপ',
        description:
          'Guided instruction from experienced AI trainers following standardized module benchmarks.',
        descriptionBn:
          'অভিজ্ঞ প্রশিক্ষকদের তত্ত্বাবধানে মানসম্মত পাঠদান ও নিয়মিত ফিডব্যাক ব্যবস্থা।',
        icon: 'GraduationCap',
      },
      {
        id: 'ben-4',
        title: 'Learning Support',
        titleBn: 'নিরবচ্ছিন্ন সহায়তা',
        description:
          'Dedicated lab assistance, structured study guides, and digital portal notifications throughout the batch.',
        descriptionBn:
          'প্রশিক্ষণ চলাকালীন ল্যাব সাপোর্ট, ডিজিটাল রিসোর্স ও পোর্টাল নোটিফিকেশন সুবিধা।',
        icon: 'LifeBuoy',
      },
      {
        id: 'ben-5',
        title: 'Admission Process',
        titleBn: 'স্বচ্ছ ভর্তি প্রক্রিয়া',
        description:
          'End-to-end online application tracking, digital admit card download, and transparent result publication.',
        descriptionBn:
          'অনলাইন আবেদন ট্র্যাকিং, ডিজিটাল অ্যাডমিট কার্ড ডাউনলোড এবং স্বচ্ছ ফলাফল প্রকাশ।',
        icon: 'ClipboardCheck',
      },
      {
        id: 'ben-6',
        title: 'Nationwide Training Centers',
        titleBn: 'দেশব্যাপী প্রশিক্ষণ কেন্দ্র',
        description:
          'Accessible regional centers equipped with high-speed connectivity and modern computing labs.',
        descriptionBn:
          'বিভিন্ন অঞ্চলের আধুনিক কম্পিউটার ল্যাবসমৃদ্ধ প্রশিক্ষণ কেন্দ্রে অংশগ্রহণের সুযোগ।',
        icon: 'MapPin',
      },
    ],
  },
  whyAiSection: {
    eyebrow: 'Why AI Learning Matters',
    eyebrowBn: 'কেন AI শিক্ষা অপরিহার্য',
    heading: 'Prepare Today for an AI-Augmented Global Economy',
    headingBn: 'ভবিষ্যতের প্রযুক্তি-নির্ভর কর্মবাজারে নিজেকে এগিয়ে রাখুন',
    description:
      'Artificial intelligence is reshaping every modern sector—from software engineering and analytics to digital media and freelance services. Mastering practical AI tools multiplies individual output and creates global remote opportunities.',
    descriptionBn:
      'বর্তমান বিশ্বে প্রতিটি পেশায় AI-এর ব্যবহার দ্রুত বাড়ছে। সঠিক প্রশিক্ষণের মাধ্যমে তরুণরা কাজের গতি বাড়ানোর পাশাপাশি দেশি-বিদেশি ফ্রিল্যান্সিং মার্কেটপ্লেসে শক্ত অবস্থান গড়তে পারে।',
    ctaLabel: 'Explore Career Preparation',
    ctaLabelBn: 'ভর্তি নির্দেশিকা দেখুন',
    imageUrl: '/src/assets/images/about_youth_innovation_1795239118248.jpg',
    cards: [
      {
        id: 'why-1',
        title: 'Increased Productivity',
        titleBn: 'কর্মদক্ষতা বৃদ্ধি',
        description:
          'Automate repetitive documentation, research synthesis, and workflow reporting in minutes rather than hours.',
        descriptionBn:
          'দৈনন্দিন অফিসিয়াল কাজ, রিপোর্টিং ও রিসার্চ দ্রুত এবং নির্ভুলভাবে সম্পন্ন করার সক্ষমতা।',
        metric: '3x Faster Workflows',
        icon: 'Zap',
      },
      {
        id: 'why-2',
        title: 'Freelancing Opportunities',
        titleBn: 'ফ্রিল্যান্সিং ও রিমোট ক্যারিয়ার',
        description:
          'Deliver in-demand AI prompt systems, visual assets, and data insights to international clients.',
        descriptionBn:
          'আন্তর্জাতিক মার্কেটপ্লেসে AI-ভিত্তিক সার্ভিস ও ডিজিটাল কনটেন্ট তৈরির মাধ্যমে আয়ের সুযোগ।',
        metric: 'Global Market Ready',
        icon: 'Globe',
      },
      {
        id: 'why-3',
        title: 'Creativity and Innovation',
        titleBn: 'সৃজনশীলতা ও উদ্ভাবন',
        description:
          'Combine human critical thinking with generative AI models to prototype products, media, and solutions.',
        descriptionBn:
          'নিজস্ব সৃজনশীল চিন্তার সাথে জেনারেটিভ AI যুক্ত করে নতুন ডিজিটাল সমাধান উদ্ভাবন।',
        metric: 'Applied GenAI',
        icon: 'Layers',
      },
    ],
  },
  admissionSection: {
    eyebrow: 'Admission Timeline',
    eyebrowBn: 'ভর্তি প্রক্রিয়ার ধাপসমূহ',
    heading: 'Five-Step Selection & Enrollment Journey',
    headingBn: 'ভর্তি ও চূড়ান্ত নির্বাচনের ৫টি ধাপ',
    subtitle:
      'Applicants move smoothly from online submission to batch orientation through a clear, trackable workflow.',
    subtitleBn:
      'অনলাইন আবেদন থেকে শুরু করে প্রশিক্ষণ শুরু পর্যন্ত প্রতিটি ধাপ আপনার স্টুডেন্ট পোর্টাল থেকে ট্র্যাক করা যাবে।',
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Online Application',
        titleBn: 'অনলাইন আবেদন',
        description:
          'Complete the digital registration form with academic details, preferred center, and valid contact information.',
        descriptionBn:
          'প্রয়োজনীয় তথ্য ও পছন্দের প্রশিক্ষণ কেন্দ্র নির্বাচন করে অনলাইনে আবেদন ফরম পূরণ করুন।',
        dateLabel: 'Phase 01 · Open Now',
        status: 'active',
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: 'Written Examination',
        titleBn: 'লিখিত পরীক্ষা',
        description:
          'Shortlisted applicants download their digital Admit Card and appear for the foundational aptitude and IT screening test.',
        descriptionBn:
          'পোর্টাল থেকে অ্যাডমিট কার্ড ডাউনলোড করে নির্ধারিত কেন্দ্রে প্রাথমিক আইটি ও সাধারণ জ্ঞান পরীক্ষায় অংশগ্রহণ।',
        dateLabel: 'Phase 02 · Scheduled per Batch',
        status: 'upcoming',
      },
      {
        id: 'step-3',
        stepNumber: 3,
        title: 'Viva / Interview',
        titleBn: 'মৌখিক পরীক্ষা / ভাইভা',
        description:
          'Interactive assessment evaluating motivation, basic English comprehension, and readiness for full-time lab attendance.',
        descriptionBn:
          'প্রার্থীর আগ্রহ, মৌলিক ইংরেজি ও কম্পিউটার দক্ষতা যাচাইয়ের জন্য সংক্ষিপ্ত সাক্ষাৎকার।',
        dateLabel: 'Phase 03 · Post Written Exam',
        status: 'upcoming',
      },
      {
        id: 'step-4',
        stepNumber: 4,
        title: 'Final Selection',
        titleBn: 'চূড়ান্ত নির্বাচন',
        description:
          'Merit list publication on the portal with batch allocation and center reporting instructions.',
        descriptionBn:
          'মেধাতালিকার ভিত্তিতে চূড়ান্ত নির্বাচিত প্রার্থীদের তালিকা ও কেন্দ্রের নির্দেশনা প্রকাশ।',
        dateLabel: 'Phase 04 · Portal Result',
        status: 'upcoming',
      },
      {
        id: 'step-5',
        stepNumber: 5,
        title: 'Training Starts',
        titleBn: 'প্রশিক্ষণ শুরু',
        description:
          'Orientation session and commencement of the 300-hour structured AI curriculum at your assigned center.',
        descriptionBn:
          'নির্ধারিত প্রশিক্ষণ কেন্দ্রে ওরিয়েন্টেশনের মাধ্যমে ৩০০ ঘণ্টার মূল AI প্রশিক্ষণ কার্যক্রম শুরু।',
        dateLabel: 'Phase 05 · Batch Kickoff',
        status: 'upcoming',
      },
    ],
  },
  eligibilitySection: {
    eyebrow: 'Eligibility Guidelines',
    eyebrowBn: 'আবেদনের যোগ্যতা ও শর্তাবলি',
    heading: 'Who Should Apply for DYD AI Training',
    headingBn: 'প্রশিক্ষণে অংশগ্রহণের প্রাথমিক যোগ্যতা',
    subtitle:
      'Review the baseline academic and technical readiness guidelines configured for the current intake.',
    subtitleBn:
      'চলমান ব্যাচে ভর্তির জন্য নির্ধারিত শিক্ষাগত ও কারিগরি যোগ্যতার নির্দেশিকা।',
    disclaimer:
      'Note: Program eligibility criteria are configured by DYD AI administration for training intake management.',
    disclaimerBn:
      'দ্রষ্টব্য: প্রশিক্ষণ সংক্রান্ত যোগ্যতার মানদণ্ড DYD AI প্রশাসন কর্তৃক নির্ধারিত ও পরিবর্তনযোগ্য।',
    items: [
      {
        id: 'elig-1',
        title: 'Minimum Education',
        titleBn: 'ন্যূনতম শিক্ষাগত যোগ্যতা',
        requirement: 'HSC or Equivalent Completed',
        requirementBn: 'ন্যূনতম এইচএসসি (HSC) বা সমমান পাস',
        detail: 'Candidates with HSC, Diploma, or Undergraduate backgrounds may apply.',
        detailBn: 'এইচএসসি, ডিপ্লোমা বা স্নাতক পর্যায়ের শিক্ষার্থীরা আবেদন করতে পারবেন।',
        icon: 'BookOpen',
      },
      {
        id: 'elig-2',
        title: 'Age Requirement',
        titleBn: 'বয়সসীমা',
        requirement: '18 – 35 Years',
        requirementBn: '১৮ থেকে ৩৫ বছর',
        detail: 'Verified via National ID (NID) or Birth Registration Certificate.',
        detailBn: 'জাতীয় পরিচয়পত্র (NID) অথবা জন্ম নিবন্ধন সনদ অনুযায়ী বয়স যাচাই করা হবে।',
        icon: 'UserCheck',
      },
      {
        id: 'elig-3',
        title: 'Basic Computer Knowledge',
        titleBn: 'মৌলিক কম্পিউটার জ্ঞান',
        requirement: 'OS, Browser & Office Tools',
        requirementBn: 'কম্পিউটার ও ইন্টারনেট ব্যবহারে প্রাথমিক দক্ষতা',
        detail: 'Comfortable navigating files, web browsers, email, and basic typing.',
        detailBn: 'ফাইল ব্যবস্থাপনা, ব্রাউজিং, ইমেইল ও বেসিক টাইপিংয়ে প্রাথমিক ধারণা থাকতে হবে।',
        icon: 'Monitor',
      },
      {
        id: 'elig-4',
        title: 'Language Requirements',
        titleBn: 'ভাষাগত দক্ষতা',
        requirement: 'Bangla & Functional English',
        requirementBn: 'বাংলা ও মৌলিক ইংরেজি বোঝার সক্ষমতা',
        detail: 'Ability to read technical prompts and follow bilingual lab materials.',
        detailBn: 'ইংরেজিতে সাধারণ নির্দেশনা ও প্রম্পট পড়ে বোঝার মতো প্রাথমিক দক্ষতা।',
        icon: 'Languages',
      },
    ],
  },
  modulesSection: {
    eyebrow: 'Curriculum Structure',
    eyebrowBn: 'প্রশিক্ষণ মডিউলসমূহ',
    heading: 'Core AI Training Modules',
    headingBn: 'কোর্সের মূল প্রশিক্ষণ মডিউল',
    subtitle:
      'Six progressive modules bridging prompt engineering, generative media, analytics, and freelancing execution.',
    subtitleBn:
      'মৌলিক ধারণা থেকে প্রফেশনাল প্রয়োগ পর্যন্ত সাজানো ৬টি আধুনিক AI প্রশিক্ষণ মডিউল।',
  },
  regionsSection: {
    eyebrow: 'Regional Packages',
    eyebrowBn: 'প্রশিক্ষণ অঞ্চল ও প্যাকেজ',
    heading: 'Training Regions & Center Packages',
    headingBn: 'অঞ্চলভিত্তিক প্রশিক্ষণ প্যাকেজ ও কেন্দ্র',
    subtitle:
      'Explore the four regional package clusters, district coverage, and active training centers managed within DYD AI.',
    subtitleBn:
      'দেশব্যাপী ৪টি আঞ্চলিক প্যাকেজের আওতায় জেলার সংখ্যা, প্রশিক্ষণ কেন্দ্র এবং সময়কাল দেখুন।',
  },
  ctaSection: {
    heading: 'Ready to Build Your Future with Practical AI Skills?',
    headingBn: 'আধুনিক AI দক্ষতায় আপনার ভবিষ্যৎ গড়তে প্রস্তুত?',
    description:
      'Submit your application online, track your selection stages in real time, and join a structured DYD AI training cohort.',
    descriptionBn:
      'আজই অনলাইনে আবেদন সম্পন্ন করুন এবং আপনার পছন্দের আঞ্চলিক প্রশিক্ষণ কেন্দ্রে AI দক্ষতা অর্জনের যাত্রা শুরু করুন।',
    primaryLabel: 'Apply Now',
    primaryLabelBn: 'এখনই আবেদন করুন',
    secondaryLabel: 'Learn More',
    secondaryLabelBn: 'বিস্তারিত জানুন',
  },
  footer: {
    aboutText:
      'DYD AI is an artificial intelligence skill development, digital training, and student management platform committed to equipping youth with practical future-ready capabilities.',
    aboutTextBn:
      'DYD AI একটি আধুনিক কৃত্রিম বুদ্ধিমত্তা প্রশিক্ষণ, ডিজিটাল দক্ষতা উন্নয়ন ও শিক্ষার্থী ব্যবস্থাপনা প্ল্যাটফর্ম, যা তরুণদের প্রযুক্তিনির্ভর কর্মসংস্থানের জন্য প্রস্তুত করে।',
    address: 'Thana Para, College Road, Gaibandha, Gaibandha Sadar, Bangladesh.',
    phone: '+880 1700-000000',
    email: 'info@dydaiproject.org',
    officeHours: 'Sunday – Thursday · 9:00 AM – 5:00 PM',
    socialLinks: {
      facebook: 'https://facebook.com',
      youtube: 'https://youtube.com',
      linkedin: 'https://linkedin.com',
      website: '/',
    },
    copyright: 'DYD AI — Artificial Intelligence Skill Development Platform.',
  },
};

export const DEFAULT_COURSES: CourseItem[] = [
  {
    id: 'course-basic-ai',
    title: 'Applied Artificial Intelligence & Digital Productivity',
    titleBn: 'ব্যবহারিক কৃত্রিম বুদ্ধিমত্তা (AI) ও ডিজিটাল দক্ষতা উন্নয়ন',
    summary:
      'Comprehensive 300-hour foundational and applied AI program covering prompt engineering, generative workflows, data analysis, and freelance readiness.',
    duration: '300 Hours (50 Days)',
    level: 'Foundational to Applied',
    active: true,
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
  {
    id: 'course-genai-freelancing',
    title: 'Generative AI Content & Freelance Automation Track',
    titleBn: 'জেনারেটিভ AI কনটেন্ট ও ফ্রিল্যান্স অটোমেশন ট্র্যাক',
    summary:
      'Focused practical cohort emphasizing multimodal content systems, client workflow automation, and digital portfolio building.',
    duration: '180 Hours (30 Days)',
    level: 'Intermediate',
    active: true,
    updatedAt: '2026-11-01T00:00:00.000Z',
  },
];

export const DEFAULT_MODULES: CourseModuleItem[] = [
  {
    id: 'mod-prompt-eng',
    courseId: 'course-basic-ai',
    title: 'Prompt Engineering',
    titleBn: 'প্রম্পট ইঞ্জিনিয়ারিং',
    description:
      'Structured prompting patterns, role-based instructions, chain-of-thought reasoning, and reusable prompt templates for accurate AI outputs.',
    hours: 50,
    order: 1,
    icon: 'Terminal',
  },
  {
    id: 'mod-generative-ai',
    courseId: 'course-basic-ai',
    title: 'Generative AI',
    titleBn: 'জেনারেটিভ AI',
    description:
      'Understanding large language models, multimodal synthesis, ethical AI usage, and workspace integration techniques.',
    hours: 50,
    order: 2,
    icon: 'Sparkles',
  },
  {
    id: 'mod-ai-content',
    courseId: 'course-basic-ai',
    title: 'AI Content Creation',
    titleBn: 'AI কনটেন্ট ক্রিয়েশন',
    description:
      'Crafting bilingual editorial copy, visual design briefs, presentation decks, and educational media using modern AI studios.',
    hours: 50,
    order: 3,
    icon: 'PenTool',
  },
  {
    id: 'mod-productivity',
    courseId: 'course-basic-ai',
    title: 'AI Productivity Tools',
    titleBn: 'AI প্রোডাক্টিভিটি টুলস',
    description:
      'Automating spreadsheets, meeting summaries, document workflows, and research organization for high-efficiency teams.',
    hours: 50,
    order: 4,
    icon: 'Workflow',
  },
  {
    id: 'mod-data-analysis',
    courseId: 'course-basic-ai',
    title: 'Data Analysis',
    titleBn: 'ডাটা অ্যানালাইসিস',
    description:
      'Cleaning datasets, generating statistical summaries, visualizing trends, and building AI-assisted analytical reports.',
    hours: 50,
    order: 5,
    icon: 'BarChart3',
  },
  {
    id: 'mod-ai-freelancing',
    courseId: 'course-basic-ai',
    title: 'AI Freelancing',
    titleBn: 'AI ফ্রিল্যান্সিং',
    description:
      'Packaging AI services, building client-ready portfolios, communicating proposals, and managing remote freelance projects.',
    hours: 50,
    order: 6,
    icon: 'Briefcase',
  },
];

export const DEFAULT_PACKAGES: PackageRegionItem[] = [
  {
    id: 'pkg-01',
    packageNumber: 'Package 01',
    regionName: 'Rajshahi & Rangpur Division',
    districtCount: 16,
    partnerOrg: 'DYD AI North-West Regional Hub',
    duration: '50 Days (300 Hours)',
    availableCenters: 2,
    districts: ['Gaibandha', 'Rangpur', 'Bogura', 'Rajshahi', 'Dinajpur', 'Sirajganj'],
  },
  {
    id: 'pkg-02',
    packageNumber: 'Package 02',
    regionName: 'Dhaka & Mymensingh Division',
    districtCount: 17,
    partnerOrg: 'DYD AI Central Regional Hub',
    duration: '50 Days (300 Hours)',
    availableCenters: 2,
    districts: ['Dhaka', 'Gazipur', 'Tangail', 'Mymensingh', 'Narayanganj', 'Jamalpur'],
  },
  {
    id: 'pkg-03',
    packageNumber: 'Package 03',
    regionName: 'Chattogram & Sylhet Division',
    districtCount: 15,
    partnerOrg: 'DYD AI South-East Regional Hub',
    duration: '50 Days (300 Hours)',
    availableCenters: 1,
    districts: ['Chattogram', 'Cumilla', 'Sylhet', 'Coxs Bazar', 'Noakhali', 'Moulvibazar'],
  },
  {
    id: 'pkg-04',
    packageNumber: 'Package 04',
    regionName: 'Khulna & Barishal Division',
    districtCount: 16,
    partnerOrg: 'DYD AI South-West Regional Hub',
    duration: '50 Days (300 Hours)',
    availableCenters: 1,
    districts: ['Khulna', 'Jashore', 'Barishal', 'Kushtia', 'Patuakhali', 'Satkhira'],
  },
];

export const DEFAULT_CENTERS: TrainingCenterItem[] = [
  {
    id: 'center-gaibandha-hq',
    name: 'DYD AI Gaibandha Sadar Lab (HQ)',
    district: 'Gaibandha',
    region: 'Rajshahi & Rangpur Division',
    address: 'Thana Para, College Road, Gaibandha Sadar, Bangladesh',
    capacity: 40,
    active: true,
  },
  {
    id: 'center-rangpur-01',
    name: 'DYD AI Rangpur Digital Skills Lab',
    district: 'Rangpur',
    region: 'Rajshahi & Rangpur Division',
    address: 'Station Road, Rangpur Sadar, Rangpur',
    capacity: 35,
    active: true,
  },
  {
    id: 'center-dhaka-01',
    name: 'DYD AI Dhaka Mirpur Innovation Center',
    district: 'Dhaka',
    region: 'Dhaka & Mymensingh Division',
    address: 'Begum Rokeya Sarani, Mirpur-10, Dhaka',
    capacity: 50,
    active: true,
  },
  {
    id: 'center-mymensingh-01',
    name: 'DYD AI Mymensingh Tech Lab',
    district: 'Mymensingh',
    region: 'Dhaka & Mymensingh Division',
    address: 'Ganginar Par, Mymensingh Sadar',
    capacity: 30,
    active: true,
  },
  {
    id: 'center-ctg-01',
    name: 'DYD AI Chattogram Agrabad Lab',
    district: 'Chattogram',
    region: 'Chattogram & Sylhet Division',
    address: 'Agrabad Commercial Area, Chattogram',
    capacity: 40,
    active: true,
  },
  {
    id: 'center-khulna-01',
    name: 'DYD AI Khulna Shib Bari Center',
    district: 'Khulna',
    region: 'Khulna & Barishal Division',
    address: 'KDA Avenue, Shib Bari More, Khulna',
    capacity: 35,
    active: true,
  },
];

export const DEFAULT_NOTICES: NoticeItem[] = [
  {
    id: 'notice-admission-open',
    title: 'নতুন ব্যাচের অনলাইন ভর্তি আবেদন শুরু সংক্রান্ত বিজ্ঞপ্তি',
    body: 'কৃত্রিম বুদ্ধিমত্তা (AI) প্রযুক্তির মাধ্যমে দক্ষতা উন্নয়ন কোর্সের আসন্ন ব্যাচের জন্য অনলাইন আবেদন গ্রহণ শুরু হয়েছে। আগ্রহী শিক্ষার্থীরা আবেদন পৃষ্ঠা থেকে ফরম পূরণ করে ট্র্যাকিং নম্বর সংরক্ষণ করুন।',
    category: 'Admission',
    publishedDate: '2026-11-18',
    pinned: true,
    active: true,
  },
  {
    id: 'notice-admit-card',
    title: 'লিখিত পরীক্ষার অ্যাডমিট কার্ড ডাউনলোড নির্দেশিকা',
    body: 'আবেদন যাচাইয়ের পর অনুমোদিত প্রার্থীরা স্টুডেন্ট ড্যাশবোর্ড অথবা অ্যাডমিট কার্ড পেজ থেকে ট্র্যাকিং কোড ব্যবহার করে প্রবেশপত্র সংগ্রহ করতে পারবেন।',
    category: 'Examination',
    publishedDate: '2026-11-15',
    pinned: false,
    active: true,
  },
  {
    id: 'notice-lab-schedule',
    title: 'গাইবান্ধা ও আঞ্চলিক ল্যাবগুলোর প্র্যাকটিক্যাল সেশন সময়সূচি',
    body: 'সব সক্রিয় প্রশিক্ষণ কেন্দ্রে সকাল ৯:০০টা থেকে বিকাল ৩:০০টা পর্যন্ত ল্যাব সেশন পরিচালিত হবে। অংশগ্রহণকারীদের নিজ নিজ পরিচয়পত্র ও অ্যাডমিট কার্ড সাথে আনার জন্য অনুরোধ করা হলো।',
    category: 'Academic',
    publishedDate: '2026-11-10',
    pinned: false,
    active: true,
  },
];
