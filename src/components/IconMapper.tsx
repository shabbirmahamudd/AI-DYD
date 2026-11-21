import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  Briefcase,
  ClipboardCheck,
  Cpu,
  Globe,
  GraduationCap,
  Languages,
  Layers,
  LifeBuoy,
  MapPin,
  Monitor,
  PenTool,
  Sparkles,
  Terminal,
  UserCheck,
  Workflow,
  Zap,
} from 'lucide-react';

const ICONS = {
  BarChart3,
  BookOpen,
  BrainCircuit,
  Briefcase,
  ClipboardCheck,
  Cpu,
  Globe,
  GraduationCap,
  Languages,
  Layers,
  LifeBuoy,
  MapPin,
  Monitor,
  PenTool,
  Sparkles,
  Terminal,
  UserCheck,
  Workflow,
  Zap,
};

export function IconMapper({
  name,
  className = 'w-5 h-5',
}: {
  name: string;
  className?: string;
}) {
  const IconComp = ICONS[name as keyof typeof ICONS] || Cpu;
  return <IconComp className={className} />;
}
