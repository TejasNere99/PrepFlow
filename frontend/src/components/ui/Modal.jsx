import { X } from 'lucide-react';
import Button from './Button.jsx';

function Modal({ children, footer, isOpen, onClose, title }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-6">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-5 py-4 shrink-0 z-10">
          <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
          <Button aria-label="Close modal" onClick={onClose} size="icon" variant="ghost">
            <X size={18} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {children}
        </div>
        {footer && (
          <div className="border-t border-zinc-800 bg-zinc-950 px-5 py-4 shrink-0 z-10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
