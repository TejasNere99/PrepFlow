import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button.jsx';

function Modal({ children, footer, isOpen, onClose, title }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Prevent body scroll when modal is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // Handle ESC key to close
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }

      // Basic Focus Trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Auto focus the modal itself to start trap
    if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => {
      document.body.style.overflow = originalStyle;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  // Handle click outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-6 transition-opacity"
      onMouseDown={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-2xl outline-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-5 py-4 shrink-0 z-10">
          <h2 id="modal-title" className="text-base font-semibold text-zinc-100">{title}</h2>
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
