import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { FolderInput } from 'lucide-react';

export default function BulkMoveDialog({ isOpen, onClose, onConfirm, isSubmitting, selectedCount, parentOptions, parentLabel }) {
  const [parentId, setParentId] = useState('');

  const handleSubmit = () => {
    if (parentId) {
      onConfirm({ parentId });
      setParentId('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Move ${selectedCount} Items`}
      footer={
        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="secondary" disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !parentId} className="flex items-center gap-2">
            <FolderInput size={16} /> {isSubmitting ? 'Moving...' : 'Confirm Move'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-zinc-300">
          Select a new <strong>{parentLabel}</strong> for the {selectedCount} selected items.
        </p>
        
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Destination {parentLabel}</label>
          <select
            className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
          >
            <option value="" disabled>Select a destination...</option>
            {parentOptions.map(opt => (
              <option key={opt._id} value={opt._id}>{opt.title}</option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}
