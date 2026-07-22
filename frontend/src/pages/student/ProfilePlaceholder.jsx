import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Card from '../../components/ui/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import { User, LogOut } from 'lucide-react';

function ProfilePlaceholder() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <SectionHeader
        title="Your Profile"
        description="Manage your account settings and preferences."
      />

      <Card className="space-y-6">
        <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
          <div className="h-16 w-16 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
            <User size={24} className="text-zinc-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">{user?.name}</h2>
            <p className="text-sm text-zinc-400">{user?.email}</p>
            <span className="mt-1 inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
              Role: {user?.role}
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-zinc-300">Account Actions</h3>
          <Button variant="danger" onClick={logout} className="gap-2">
            <LogOut size={16} /> Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default ProfilePlaceholder;
