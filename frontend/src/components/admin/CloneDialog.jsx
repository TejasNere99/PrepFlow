import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Copy } from 'lucide-react';

export default function CloneDialog({ isOpen, onClose, onConfirm, entityName, isSubmitting }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Clone Content"
      footer={
        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="secondary" disabled={isSubmitting}>Cancel</Button>
          <Button onClick={onConfirm} disabled={isSubmitting} className="flex items-center gap-2">
            <Copy size={16} /> {isSubmitting ? 'Cloning...' : 'Confirm Clone'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-zinc-300">
          Are you sure you want to duplicate <strong>{entityName}</strong>?
        </p>
        <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
          <ul className="text-sm text-zinc-400 list-disc list-inside space-y-2">
            <li>All metadata and relationships will be deep copied.</li>
            <li>Student progress and analytics will be excluded.</li>
            <li>The title will be appended with "(Copy)".</li>
            <li>All clones will be set to DRAFT status initially.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
