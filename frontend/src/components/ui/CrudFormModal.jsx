import React from 'react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';

/**
 * Reusable CrudFormModal component
 * Supports dynamic fields and validation messages.
 */
export default function CrudFormModal({
  isOpen,
  onClose,
  title,
  onSubmit,
  isSubmitting,
  submitError,
  isEditMode,
  children,
  submitLabel = 'Save',
  submitLabelCreating = 'Create',
  formId = 'crud-form'
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" form={formId} disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving...'
              : isEditMode
              ? submitLabel
              : submitLabelCreating}
          </Button>
        </div>
      }
    >
      <form id={formId} onSubmit={onSubmit} className="space-y-4">
        {submitError && (
          <div className="rounded border border-red-900 bg-red-950/20 p-2.5 text-xs text-red-300">
            {submitError}
          </div>
        )}
        {children}
      </form>
    </Modal>
  );
}
