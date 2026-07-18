import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { appNavigation } from '../../constants/navigation.js';
import { cn } from '../../utils/cn.js';
import Button from '../ui/Button.jsx';

function Sidebar({ isCollapsed, onToggle }) {
  return (
    <aside
      className={cn(
        'hidden border-r border-zinc-800 bg-zinc-950 transition-[width] duration-200 lg:flex lg:flex-col',
        isCollapsed ? 'lg:w-20' : 'lg:w-64',
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-4">
        <NavLink className="flex min-w-0 items-center gap-3" to="/dashboard">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-zinc-100 text-sm font-bold text-zinc-950">
            PF
          </span>
          {!isCollapsed && (
            <span className="truncate text-sm font-semibold text-zinc-50">PrepFlow</span>
          )}
        </NavLink>
        <Button
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggle}
          size="icon"
          variant="ghost"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
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
                  isCollapsed && 'justify-center px-0',
                )
              }
              key={item.path}
              title={isCollapsed ? item.label : undefined}
              to={item.path}
            >
              <Icon size={18} />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
