import { Menu, Search } from 'lucide-react';
import Button from '../ui/Button.jsx';

function Topbar({ onOpenSidebar }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/95 px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          aria-label="Open navigation"
          className="lg:hidden"
          onClick={onOpenSidebar}
          size="icon"
          variant="ghost"
        >
          <Menu size={18} />
        </Button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-50">PrepFlow</p>
          <p className="hidden text-xs text-zinc-500 sm:block">Stop Searching. Start Studying.</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <div className="hidden h-10 w-full max-w-md items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-500 md:flex">
          <Search size={16} />
          <span>Search placeholder</span>
        </div>
        <div className="grid h-9 w-9 place-items-center rounded-full border border-zinc-800 bg-zinc-900 text-xs font-semibold text-zinc-300">
          A
        </div>
      </div>
    </header>
  );
}

export default Topbar;
