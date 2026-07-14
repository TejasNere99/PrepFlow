import React from 'react';
import { FolderOpen, Edit2, Plus, Trash2 } from 'lucide-react';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Chip from '../components/ui/Chip.jsx';
import Input from '../components/ui/Input.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import Textarea from '../components/ui/Textarea.jsx';

import * as subjectService from '../services/subjectService.js';

import DataTable from '../components/ui/DataTable.jsx';
import SearchToolbar from '../components/ui/SearchToolbar.jsx';
import StatusTabs from '../components/ui/StatusTabs.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx';
import ConfirmationDialog from '../components/ui/ConfirmationDialog.jsx';
import CrudFormModal from '../components/ui/CrudFormModal.jsx';

import { useCrud } from '../hooks/useCrud.js';
import { useFilters } from '../hooks/useFilters.js';

const getInitialFormData = () => ({
  sheetId: '',
  title: '',
  description: '',
  order: '',
  status: 'DRAFT',
  tagsInput: '',
  metadataList: [],
});

const mapItemToFormData = (subject) => ({
  sheetId: subject.sheetId?._id || subject.sheetId || '',
  title: subject.title || '',
  description: subject.description || '',
  order: subject.order !== undefined ? String(subject.order) : '',
  status: subject.status || 'DRAFT',
  tagsInput: (subject.tags || []).join(', '),
  metadataList: Object.entries(subject.metadata || {}).map(([key, value]) => ({
    key,
    value: String(value),
  })),
});

export default function Subjects() {
  const filters = useFilters(true); // Fetch initial sheets
  
  const crud = useCrud({
    fetchDataFn: subjectService.getSubjects,
    createFn: subjectService.createSubject,
    updateFn: subjectService.updateSubject,
    archiveFn: subjectService.archiveSubject,
    getInitialFormData,
    mapItemToFormData,
  });

  React.useEffect(() => {
    crud.fetchItems({ sheetId: filters.selectedSheetId });
  }, [crud.activeTab, crud.debouncedSearch, filters.selectedSheetId]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (!crud.formData.sheetId) errors.sheetId = 'Sheet is required';
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
      sheetId: crud.formData.sheetId,
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
      label: 'Subject Details', 
      render: (subject) => (
        <div>
          <div className="font-semibold text-zinc-100">{subject.title}</div>
          <div className="mt-0.5 font-mono text-xs text-zinc-500">{subject.slug}</div>
          {subject.description && (
            <div className="mt-1 text-xs text-zinc-400 max-w-xs truncate">{subject.description}</div>
          )}
        </div>
      )
    },
    { 
      key: 'sheet', 
      label: 'Sheet', 
      render: (subject) => (
        subject.sheetId ? (
          <div className="text-zinc-300">{subject.sheetId.title}</div>
        ) : (
          <div className="text-zinc-600 italic">No Sheet</div>
        )
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      className: 'w-28',
      render: (subject) => getStatusBadge(subject.status)
    },
    {
      key: 'tags',
      label: 'Tags & Metadata',
      render: (subject) => (
        <div className="space-y-1.5">
          {subject.tags && subject.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {subject.tags.map(tag => (
                <Chip key={tag} className="border-zinc-800 bg-zinc-900/50 py-0 px-1.5 text-[10px]">
                  {tag}
                </Chip>
              ))}
            </div>
          )}
          {subject.metadata && Object.keys(subject.metadata).length > 0 && (
            <div className="flex flex-wrap gap-1">
              {Object.entries(subject.metadata).map(([k, v]) => (
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
      render: (subject) => (
        <div className="flex justify-end gap-2">
          <Button onClick={() => crud.handleOpenEdit(subject)} size="icon" variant="ghost" title="Edit Subject">
            <Edit2 size={14} className="text-zinc-400 hover:text-white" />
          </Button>
          {subject.status !== 'ARCHIVED' && (
            <Button onClick={() => crud.handleOpenArchive(subject)} size="icon" variant="ghost" title="Archive Subject">
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
          <Button 
            onClick={() => crud.handleOpenCreate({ 
              sheetId: filters.selectedSheetId || (filters.sheets.length > 0 ? filters.sheets[0]._id : '')
            })} 
            className="gap-2"
          >
            <Plus size={16} /> Create Subject
          </Button>
        }
        description="Manage study subjects under learning sheets."
        title="Subject Management"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchToolbar search={crud.search} onSearchChange={crud.setSearch} placeholder="Search subjects...">
          <select
            className="h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800"
            value={filters.selectedSheetId}
            onChange={(e) => filters.setSelectedSheetId(e.target.value)}
          >
            <option value="">All Active Sheets</option>
            {filters.sheets.map(sheet => (
              <option key={sheet._id} value={sheet._id}>{sheet.title}</option>
            ))}
          </select>
        </SearchToolbar>
        <StatusTabs activeValue={crud.activeTab} onChange={crud.setActiveTab} />
      </div>

      <ErrorState error={crud.error} onRetry={() => crud.fetchItems({ sheetId: filters.selectedSheetId })} />

      {crud.loading && !crud.error && <LoadingSkeleton rows={5} />}

      {!crud.loading && !crud.error && (
        <DataTable
          columns={columns}
          data={crud.items}
          emptyState={
            <EmptyState
              icon={crud.activeTab === 'ARCHIVED' ? Trash2 : FolderOpen}
              title={crud.activeTab === 'ARCHIVED' ? 'No archived subjects' : 'No subjects found'}
              description={crud.activeTab === 'all' 
                ? "Start by creating a subject for your learning sheets." 
                : `There are no subjects with status "${crud.activeTab}" matching your query.`
              }
              actionLabel={crud.activeTab === 'all' ? "Create your first subject" : null}
              actionIcon={Plus}
              onAction={crud.activeTab === 'all' ? () => crud.handleOpenCreate({
                sheetId: filters.selectedSheetId || (filters.sheets.length > 0 ? filters.sheets[0]._id : '')
              }) : null}
            />
          }
        />
      )}

      {/* Create/Edit Modal */}
      <CrudFormModal
        isOpen={crud.isFormModalOpen}
        onClose={() => crud.setIsFormModalOpen(false)}
        title={crud.selectedItem ? 'Edit Subject' : 'Create Subject'}
        onSubmit={onSubmit}
        isSubmitting={crud.isSubmitting}
        submitError={crud.formErrors.submit}
        isEditMode={!!crud.selectedItem}
      >
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Sheet *</label>
          <select
            className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800"
            value={crud.formData.sheetId}
            onChange={(e) => crud.setFormData({ ...crud.formData, sheetId: e.target.value })}
            required
          >
            <option value="" disabled>Select a Sheet</option>
            {filters.sheets.map(sheet => (
              <option key={sheet._id} value={sheet._id}>{sheet.title}</option>
            ))}
          </select>
          {crud.formErrors.sheetId && <p className="mt-1 text-xs text-red-400">{crud.formErrors.sheetId}</p>}
          {filters.sheets.length === 0 && (
            <p className="mt-1 text-xs text-amber-500">No active sheets available. Create a sheet first.</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Title *</label>
          <Input
            placeholder="e.g. Physics"
            value={crud.formData.title}
            onChange={(e) => crud.setFormData({ ...crud.formData, title: e.target.value })}
            required
          />
          {crud.formErrors.title && <p className="mt-1 text-xs text-red-400">{crud.formErrors.title}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Description</label>
          <Textarea
            placeholder="Provide a brief overview of this subject..."
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
            placeholder="e.g. Mechanics, Optics (comma-separated)"
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
                    placeholder="Key"
                    value={m.key}
                    onChange={(e) => handleMetadataChange(idx, 'key', e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Input
                    placeholder="Value"
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
        title="Archive Subject"
        message={
          <>
            Are you sure you want to archive subject <strong className="text-white">"{crud.selectedItem?.title}"</strong>?
            This will perform a soft delete, updating its status to <span className="font-mono text-xs bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded text-zinc-400">ARCHIVED</span>.
          </>
        }
        confirmLabel="Archive Subject"
        isSubmitting={crud.isSubmitting}
      />
    </div>
  );
}
