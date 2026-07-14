import React from 'react';
import { BookOpen, Edit2, Plus, Trash2 } from 'lucide-react';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Chip from '../components/ui/Chip.jsx';
import Input from '../components/ui/Input.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import * as sheetService from '../services/sheetService.js';

import DataTable from '../components/ui/DataTable.jsx';
import SearchToolbar from '../components/ui/SearchToolbar.jsx';
import StatusTabs from '../components/ui/StatusTabs.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx';
import ConfirmationDialog from '../components/ui/ConfirmationDialog.jsx';
import CrudFormModal from '../components/ui/CrudFormModal.jsx';
import { useCrud } from '../hooks/useCrud.js';

const getInitialFormData = () => ({
  title: '',
  description: '',
  order: '',
  status: 'DRAFT',
  tagsInput: '',
  metadataList: [],
});

const mapItemToFormData = (sheet) => ({
  title: sheet.title || '',
  description: sheet.description || '',
  order: sheet.order !== undefined ? String(sheet.order) : '',
  status: sheet.status || 'DRAFT',
  tagsInput: (sheet.tags || []).join(', '),
  metadataList: Object.entries(sheet.metadata || {}).map(([key, value]) => ({
    key,
    value: String(value),
  })),
});

export default function Sheets() {
  const crud = useCrud({
    fetchDataFn: sheetService.getSheets,
    createFn: sheetService.createSheet,
    updateFn: sheetService.updateSheet,
    archiveFn: sheetService.archiveSheet,
    getInitialFormData,
    mapItemToFormData,
  });

  // Fetch initial data
  React.useEffect(() => {
    crud.fetchItems();
  }, [crud.activeTab, crud.debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMetadataChange = (index, field, val) => {
    const updated = [...crud.formData.metadataList];
    updated[index] = { ...updated[index], [field]: val };
    crud.setFormData({ ...crud.formData, metadataList: updated });
  };

  const handleAddMetadataField = () => {
    crud.setFormData({
      ...crud.formData,
      metadataList: [...crud.formData.metadataList, { key: '', value: '' }],
    });
  };

  const handleRemoveMetadataField = (index) => {
    crud.setFormData({
      ...crud.formData,
      metadataList: crud.formData.metadataList.filter((_, i) => i !== index),
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!crud.formData.title.trim()) errors.title = 'Title is required';
    
    const keys = crud.formData.metadataList.map((m) => m.key.trim());
    crud.formData.metadataList.forEach((m, i) => {
      if (m.value.trim() && !m.key.trim()) {
        errors[`metadata_key_${i}`] = 'Key is required for this value';
      }
    });

    const uniqueKeys = new Set(keys.filter(Boolean));
    if (uniqueKeys.size !== keys.filter(Boolean).length) {
      errors.metadata = 'Metadata keys must be unique';
    }

    crud.setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const tags = crud.formData.tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const metadata = {};
    crud.formData.metadataList.forEach(({ key, value }) => {
      if (key.trim()) metadata[key.trim()] = value.trim();
    });

    const payload = {
      title: crud.formData.title.trim(),
      description: crud.formData.description.trim(),
      status: crud.formData.status,
      tags,
      metadata,
    };
    if (crud.formData.order.trim() !== '') {
      payload.order = Number(crud.formData.order);
    }
    crud.handleSubmit(payload);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE': return <Badge variant="success">Active</Badge>;
      case 'DRAFT': return <Badge variant="warning">Draft</Badge>;
      case 'HIDDEN': return <Badge variant="neutral">Hidden</Badge>;
      case 'ARCHIVED': return (
        <span className="inline-flex items-center rounded-full border border-red-700 bg-red-950/40 px-2 py-0.5 text-xs font-medium text-red-300">
          Archived
        </span>
      );
      default: return <Badge>{status}</Badge>;
    }
  };

  const columns = [
    { key: 'order', label: 'Order', className: 'text-center font-mono text-zinc-400 w-20' },
    { 
      key: 'details', 
      label: 'Sheet Details', 
      render: (sheet) => (
        <div>
          <div className="font-semibold text-zinc-100">{sheet.title}</div>
          {sheet.description && (
            <div className="mt-0.5 text-xs text-zinc-400 max-w-xs truncate">{sheet.description}</div>
          )}
        </div>
      )
    },
    { key: 'slug', label: 'Slug', className: 'font-mono text-xs text-zinc-500' },
    { 
      key: 'status', 
      label: 'Status', 
      className: 'w-28',
      render: (sheet) => getStatusBadge(sheet.status)
    },
    {
      key: 'tags',
      label: 'Tags & Metadata',
      render: (sheet) => (
        <div className="space-y-1.5">
          {sheet.tags && sheet.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {sheet.tags.map(tag => (
                <Chip key={tag} className="border-zinc-800 bg-zinc-900/50 py-0 px-1.5 text-[10px]">
                  {tag}
                </Chip>
              ))}
            </div>
          )}
          {sheet.metadata && Object.keys(sheet.metadata).length > 0 && (
            <div className="flex flex-wrap gap-1">
              {Object.entries(sheet.metadata).map(([k, v]) => (
                <span key={k} className="inline-flex items-center rounded border border-zinc-800 bg-zinc-950 px-1.5 py-0.5 text-[10px] text-zinc-400">
                  <span className="font-medium text-zinc-500 mr-1">{k}:</span>{v}
                </span>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right w-28',
      render: (sheet) => (
        <div className="flex justify-end gap-2">
          <Button onClick={() => crud.handleOpenEdit(sheet)} size="icon" variant="ghost" title="Edit Sheet">
            <Edit2 size={14} className="text-zinc-400 hover:text-white" />
          </Button>
          {sheet.status !== 'ARCHIVED' && (
            <Button onClick={() => crud.handleOpenArchive(sheet)} size="icon" variant="ghost" title="Archive Sheet">
              <Trash2 size={14} className="text-red-400 hover:text-red-300" />
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        actions={
          <Button onClick={() => crud.handleOpenCreate()} className="gap-2">
            <Plus size={16} /> Create Sheet
          </Button>
        }
        description="Manage study sheets and structure resources."
        title="Sheet Management"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchToolbar search={crud.search} onSearchChange={crud.setSearch} placeholder="Search sheets by title..." />
        <StatusTabs activeValue={crud.activeTab} onChange={crud.setActiveTab} />
      </div>

      <ErrorState error={crud.error} onRetry={crud.fetchItems} />

      {crud.loading && !crud.error && <LoadingSkeleton rows={5} />}

      {!crud.loading && !crud.error && (
        <DataTable
          columns={columns}
          data={crud.items}
          emptyState={
            <EmptyState
              icon={crud.activeTab === 'ARCHIVED' ? Trash2 : BookOpen}
              title={crud.activeTab === 'ARCHIVED' ? 'No archived sheets' : 'No sheets found'}
              description={crud.activeTab === 'all' 
                ? "Start by creating a learning sheet to organize subjects and chapters." 
                : `There are no sheets with status "${crud.activeTab}" matching your query.`
              }
              actionLabel={crud.activeTab === 'all' ? "Create your first sheet" : null}
              actionIcon={Plus}
              onAction={crud.activeTab === 'all' ? () => crud.handleOpenCreate() : null}
            />
          }
        />
      )}

      {/* Create/Edit Modal */}
      <CrudFormModal
        isOpen={crud.isFormModalOpen}
        onClose={() => crud.setIsFormModalOpen(false)}
        title={crud.selectedItem ? 'Edit Sheet' : 'Create Sheet'}
        onSubmit={onSubmit}
        isSubmitting={crud.isSubmitting}
        submitError={crud.formErrors.submit}
        isEditMode={!!crud.selectedItem}
      >
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Title *</label>
          <Input
            placeholder="e.g. MHT CET Class 12"
            value={crud.formData.title}
            onChange={(e) => crud.setFormData({ ...crud.formData, title: e.target.value })}
            required
          />
          {crud.formErrors.title && <p className="mt-1 text-xs text-red-400">{crud.formErrors.title}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Description</label>
          <Textarea
            placeholder="Provide a brief overview of this sheet..."
            value={crud.formData.description}
            onChange={(e) => crud.setFormData({ ...crud.formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Display Order</label>
            <Input
              type="number"
              placeholder="Auto-assigned if empty"
              value={crud.formData.order}
              onChange={(e) => crud.setFormData({ ...crud.formData, order: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Status</label>
            <select
              className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800"
              value={crud.formData.status}
              onChange={(e) => crud.setFormData({ ...crud.formData, status: e.target.value })}
            >
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="HIDDEN">Hidden</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Tags</label>
          <Input
            placeholder="e.g. Physics, Class 11, CET (comma-separated)"
            value={crud.formData.tagsInput}
            onChange={(e) => crud.setFormData({ ...crud.formData, tagsInput: e.target.value })}
          />
        </div>

        {/* Dynamic Metadata Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Custom Metadata Fields</label>
            <Button type="button" onClick={handleAddMetadataField} size="sm" variant="secondary" className="h-7 px-2.5 text-xs gap-1">
              <Plus size={12} /> Add Field
            </Button>
          </div>
          {crud.formErrors.metadata && <p className="text-xs text-red-400">{crud.formErrors.metadata}</p>}
          {crud.formData.metadataList.length === 0 ? (
            <p className="text-xs text-zinc-500 italic">No custom metadata. Add fields like "Difficulty".</p>
          ) : (
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {crud.formData.metadataList.map((m, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    placeholder="Key (e.g. Difficulty)"
                    value={m.key}
                    onChange={(e) => handleMetadataChange(idx, 'key', e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Input
                    placeholder="Value (e.g. Medium)"
                    value={m.value}
                    onChange={(e) => handleMetadataChange(idx, 'value', e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Button
                    type="button"
                    onClick={() => handleRemoveMetadataField(idx)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0 text-zinc-500 hover:text-zinc-300"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CrudFormModal>

      {/* Archive Confirmation */}
      <ConfirmationDialog
        isOpen={crud.isArchiveModalOpen}
        onClose={() => crud.setIsArchiveModalOpen(false)}
        onConfirm={crud.handleArchiveSubmit}
        title="Archive Sheet"
        message={
          <>
            Are you sure you want to archive sheet <strong className="text-white">"{crud.selectedItem?.title}"</strong>?
            This will perform a soft delete, updating its status to <span className="font-mono text-xs bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded text-zinc-400">ARCHIVED</span>.
          </>
        }
        confirmLabel="Archive Sheet"
        isSubmitting={crud.isSubmitting}
      />
    </div>
  );
}
