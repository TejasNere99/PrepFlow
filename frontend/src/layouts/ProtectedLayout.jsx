import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import MobileSidebar from '../components/layout/MobileSidebar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import Topbar from '../components/layout/Topbar.jsx';

function ProtectedLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="flex min-h-screen">
        <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed((value) => !value)} />
        <MobileSidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenSidebar={() => setIsMobileOpen(true)} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ProtectedLayout;
