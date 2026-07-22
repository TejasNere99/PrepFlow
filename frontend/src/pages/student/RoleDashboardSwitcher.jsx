import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import StudentLayout from '../../layouts/StudentLayout.jsx';
import AdminDashboard from '../AdminDashboard.jsx';
import StudentDashboard from './StudentDashboard.jsx';

export default function RoleDashboardSwitcher() {
  const { user } = useAuth();

  if (user?.role === 'ADMIN') {
    return (
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    );
  }

  return (
    <StudentLayout>
      <StudentDashboard />
    </StudentLayout>
  );
}
