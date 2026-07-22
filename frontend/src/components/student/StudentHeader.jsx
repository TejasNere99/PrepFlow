import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { User, LogOut } from 'lucide-react';
import Dropdown from '../ui/Dropdown.jsx';

function StudentHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
            P
          </div>
          <span className="text-xl font-bold tracking-tight text-white">PrepFlow</span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-semibold text-zinc-300 hover:text-white">Dashboard</Link>
              <Dropdown
                label={<div className="flex items-center gap-2"><User size={16} /> <span className="max-w-[100px] truncate">{user.name}</span></div>}
                items={[
                  { label: 'Profile', value: 'profile', onClick: () => navigate('/dashboard/profile') },
                  { label: 'Logout', value: 'logout', onClick: () => { logout(); navigate('/'); } }
                ]}
              />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-zinc-300 hover:text-white"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-zinc-800 hover:bg-zinc-800"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default StudentHeader;
