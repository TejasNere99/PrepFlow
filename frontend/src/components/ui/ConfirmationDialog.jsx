import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';

/**
 * Reusable ConfirmationDialog component
 */
export default function ConfirmationDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message, 
  confirmLabel = "Confirm", 
  cancelLabel = "Cancel",
  isSubmitting = false,
  variant = "danger" // danger, primary
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            variant="secondary"
            disabled={isSubmitting}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            variant={variant}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex gap-3 text-sm text-zinc-300">
          <AlertTriangle className={`${variant === 'danger' ? 'text-red-500' : 'text-amber-500'} shrink-0 mt-0.5`} size={18} />
          <div>{message}</div>
        </div>
      </div>
    </Modal>
  );
}
