import { BookOpen, FileText, FolderOpen, LayoutDashboard, Settings, Tags } from 'lucide-react';

export const appNavigation = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Sheets',
    path: '/dashboard/sheets',
    icon: BookOpen,
  },
  {
    label: 'Subjects',
    path: '/dashboard/subjects',
    icon: Tags,
  },
  {
    label: 'Chapters',
    path: '/dashboard/chapters',
    icon: FolderOpen,
  },
  {
    label: 'Resources',
    path: '/dashboard/resources',
    icon: FileText,
  },
  {
    label: 'Settings',
    path: '/dashboard/settings',
    icon: Settings,
  },
];
