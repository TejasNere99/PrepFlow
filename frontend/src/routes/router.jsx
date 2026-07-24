import { createBrowserRouter } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard.jsx';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import NotFound from '../pages/NotFound.jsx';
import PlaceholderPage from '../pages/PlaceholderPage.jsx';
import Sheets from '../pages/Sheets.jsx';
import Subjects from '../pages/Subjects.jsx';
import Chapters from '../pages/Chapters.jsx';
import Resources from '../pages/Resources.jsx';
import ProtectedLayout from '../layouts/ProtectedLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import PublicLayout from '../layouts/PublicLayout.jsx';
import StudentLayout from '../layouts/StudentLayout.jsx';
import StudentHome from '../pages/student/StudentHome.jsx';
import StudentSheet from '../pages/student/StudentSheet.jsx';
import StudentResource from '../pages/student/StudentResource.jsx';
import RoleDashboardSwitcher from '../pages/student/RoleDashboardSwitcher.jsx';
import ProfilePlaceholder from '../pages/student/ProfilePlaceholder.jsx';
import RoleRoute from '../components/auth/RoleRoute.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <StudentLayout />,
    children: [
      {
        index: true,
        element: <StudentHome />,
      },
      {
        path: 'sheets/:sheetSlug',
        element: <StudentSheet />,
      },
      {
        path: 'resources/:resourceSlug',
        element: <StudentResource />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <RoleDashboardSwitcher />,
      },
      {
        element: <RoleRoute allowedRoles={['ADMIN']} layout={AdminLayout} />,
        children: [
          {
            path: 'sheets',
            element: <Sheets />,
          },
          {
            path: 'subjects',
            element: <Subjects />,
          },
          {
            path: 'chapters',
            element: <Chapters />,
          },
          {
            path: 'resources',
            element: <Resources />,
          },
          {
            path: 'settings',
            element: <PlaceholderPage title="Settings" />,
          },
        ],
      },
      {
        element: <RoleRoute allowedRoles={['STUDENT']} layout={StudentLayout} />,
        children: [
          {
            path: 'profile',
            element: <ProfilePlaceholder />,
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: '/signup',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Signup />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
