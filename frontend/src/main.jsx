import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router.jsx';
import './styles/index.css';

import { AuthProvider } from './contexts/AuthContext.jsx';
import { ProgressProvider } from './contexts/ProgressContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ProgressProvider>
        <RouterProvider router={router} />
      </ProgressProvider>
    </AuthProvider>
  </React.StrictMode>,
);
