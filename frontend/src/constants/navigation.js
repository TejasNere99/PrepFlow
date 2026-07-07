import { BookOpen, FileText, LayoutDashboard, Settings, Tags } from 'lucide-react';

export const appNavigation = [
  {
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Sheets',
    path: '/sheets',
    icon: BookOpen,
  },
  {
    label: 'Subjects',
    path: '/subjects',
    icon: Tags,
  },
  {
    label: 'Resources',
    path: '/resources',
    icon: FileText,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
  },
];
