import { X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { appNavigation } from '../../constants/navigation.js';
import { cn } from '../../utils/cn.js';
import Button from '../ui/Button.jsx';

function MobileSidebar({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        aria-label="Close navigation overlay"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        type="button"
      />
      <aside className="relative flex h-full w-72 flex-col border-r border-zinc-800 bg-zinc-950">
        <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-100 text-sm font-bold text-zinc-950">
              PF
            </span>
            <span className="text-sm font-semibold text-zinc-50">PrepFlow</span>
          </div>
          <Button aria-label="Close navigation" onClick={onClose} size="icon" variant="ghost">
            <X size={18} />
          </Button>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {appNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                className={({ isActive }) =>
                  cn(
                    'flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors',
                    isActive
                      ? 'bg-zinc-900 text-zinc-50'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100',
                  )
                }
                key={item.path}
                onClick={onClose}
                to={item.path}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}

export default MobileSidebar;
