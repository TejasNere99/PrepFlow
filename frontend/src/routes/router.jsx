import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard.jsx';
import Login from '../pages/Login.jsx';
import NotFound from '../pages/NotFound.jsx';
import PlaceholderPage from '../pages/PlaceholderPage.jsx';
import ProtectedLayout from '../layouts/ProtectedLayout.jsx';
import PublicLayout from '../layouts/PublicLayout.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'sheets',
        element: <PlaceholderPage title="Sheets" />,
      },
      {
        path: 'subjects',
        element: <PlaceholderPage title="Subjects" />,
      },
      {
        path: 'resources',
        element: <PlaceholderPage title="Resources" />,
      },
      {
        path: 'settings',
        element: <PlaceholderPage title="Settings" />,
      },
      {
        path: '*',
        element: <NotFound />,
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
]);
