import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Tag } from 'lucide-react';

export default function BulkTagsDialog({ isOpen, onClose, onConfirm, isSubmitting, selectedCount }) {
  const [tagsInput, setTagsInput] = useState('');
  const [mode, setMode] = useState('append');

  const handleSubmit = () => {
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    onConfirm({ tags, mode });
    setTagsInput('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Update Tags"
      footer={
        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="secondary" disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !tagsInput.trim()} className="flex items-center gap-2">
            <Tag size={16} /> {isSubmitting ? 'Updating...' : `Update ${selectedCount} Items`}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-zinc-300">
          Add or replace tags for the <strong>{selectedCount}</strong> selected items.
        </p>
        
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Tags</label>
          <Input
            placeholder="e.g. Mechanics, Important (comma-separated)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Update Mode</label>
          <select
            className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="append">Append (Add to existing tags)</option>
            <option value="replace">Replace (Overwrite all existing tags)</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}
