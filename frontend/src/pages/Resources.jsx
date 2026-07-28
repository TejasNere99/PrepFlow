import React, { useEffect, useState } from 'react';
import { FileText, Edit2, Plus, Trash2, ExternalLink } from 'lucide-react';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Chip from '../components/ui/Chip.jsx';
import Input from '../components/ui/Input.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import Textarea from '../components/ui/Textarea.jsx';

import * as resourceService from '../services/resourceService.js';
import * as chapterService from '../services/chapterService.js';
import * as subjectService from '../services/subjectService.js';

import DataTable from '../components/ui/DataTable.jsx';
import StatusTabs from '../components/ui/StatusTabs.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx';
import ConfirmationDialog from '../components/ui/ConfirmationDialog.jsx';
import CrudFormModal from '../components/ui/CrudFormModal.jsx';
import CreatableSelect from '../components/ui/CreatableSelect.jsx';

import { useCrud } from '../hooks/useCrud.js';
import { useFilters } from '../hooks/useFilters.js';

import ReusableTableToolbar from '../components/admin/ReusableTableToolbar.jsx';
import BulkActionToolbar from '../components/admin/BulkActionToolbar.jsx';
import CSVImportModal from '../components/admin/CSVImportModal.jsx';
import CloneDialog from '../components/admin/CloneDialog.jsx';
import BulkTagsDialog from '../components/admin/BulkTagsDialog.jsx';
import BulkMoveDialog from '../components/admin/BulkMoveDialog.jsx';
import AdvancedFilterPanel from '../components/admin/AdvancedFilterPanel.jsx';
import { adminService } from '../services/adminService.js';
import { Copy } from 'lucide-react';

const RESOURCE_TYPE_SUGGESTIONS = [
  'Playlist', 'Notes', 'Formula Sheet', 'PYQs', 'Reference Book', 'Cheat Sheet', 'Revision Notes'
];

const getInitialFormData = () => ({
  sheetId: '',
  subjectId: '',
  chapterId: '',
  title: '',
  description: '',
  resourceType: '',
  url: '',
  storageUrl: '',
  order: '',
  status: 'DRAFT',
  tagsInput: '',
  metadataList: [],
});

const mapItemToFormData = (res) => {
  const chapterId = res.chapterId?._id || res.chapterId || '';
  const subjectId = res.chapterId?.subjectId?._id || res.chapterId?.subjectId || '';
  const sheetId = res.chapterId?.subjectId?.sheetId?._id || res.chapterId?.subjectId?.sheetId || '';

  return {
    sheetId,
    subjectId,
    chapterId,
    title: res.title || '',
    description: res.description || '',
    resourceType: res.resourceType || '',
    url: res.url || '',
    storageUrl: res.storageUrl || '',
    order: res.order !== undefined ? String(res.order) : '',
    status: res.status || 'DRAFT',
    tagsInput: (res.tags || []).join(', '),
    metadataList: Object.entries(res.metadata || {}).map(([key, value]) => ({
      key,
      value: String(value),
    })),
  };
};

export default function Resources() {
  const filters = useFilters(true); // Cascades Sheets -> Subjects -> Chapters
  
  // Separate Subjects/Chapters for Form to decouple from Main Filter
  const [formSubjects, setFormSubjects] = useState([]);
  const [formChapters, setFormChapters] = useState([]);

  const crud = useCrud({
    fetchDataFn: resourceService.getResources,
    createFn: resourceService.createResource,
    updateFn: resourceService.updateResource,
    archiveFn: resourceService.archiveResource,
    getInitialFormData,
    mapItemToFormData,
  });

  // Admin CMS State
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [isCloneOpen, setIsCloneOpen] = React.useState(false);
  const [bulkActionType, setBulkActionType] = React.useState(null); // 'TAGS', 'MOVE'
  const [itemToClone, setItemToClone] = React.useState(null);
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const [advFilters, setAdvFilters] = React.useState({ status: '', tags: '' });

  // Fetch items whenever dependencies change
  useEffect(() => {
    crud.fetchItems({ chapterId: filters.selectedChapterId });
  }, [crud.activeTab, crud.debouncedSearch, filters.selectedChapterId, advFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBulkAction = async (action) => {
    if (action === 'BULK_UPDATE_TAGS') return setBulkActionType('TAGS');
    if (action === 'BULK_MOVE') return setBulkActionType('MOVE');

    try {
      await adminService.bulkAction('Resource', action, selectedIds);
      setSelectedIds([]);
      crud.fetchItems({ chapterId: filters.selectedChapterId });
    } catch (err) {
      console.error(err);
    }
  };

  const executeComplexBulkAction = async (payload) => {
    try {
      crud.setIsSubmitting(true);
      const action = bulkActionType === 'TAGS' ? 'BULK_UPDATE_TAGS' : 'BULK_MOVE';
      await adminService.bulkAction('Resource', action, selectedIds, payload);
      setSelectedIds([]);
      setBulkActionType(null);
      crud.fetchItems({ chapterId: filters.selectedChapterId });
    } catch (err) {
      console.error(err);
    } finally {
      crud.setIsSubmitting(false);
    }
  };

  const handleImport = async (validatedRows) => {
    try {
      await adminService.executeImport('Resource', validatedRows, filters.selectedChapterId);
      setIsImportOpen(false);
      crud.fetchItems({ chapterId: filters.selectedChapterId });
    } catch (err) {
      console.error(err);
    }
  };

  const handleClone = async () => {
    if (!itemToClone) return;
    try {
      crud.setIsSubmitting(true);
      await adminService.clone('Resource', itemToClone._id);
      setIsCloneOpen(false);
      setItemToClone(null);
      crud.fetchItems({ chapterId: filters.selectedChapterId });
    } catch (err) {
      console.error(err);
    } finally {
      crud.setIsSubmitting(false);
    }
  };

  const handleReorder = async (sourceIndex, destinationIndex) => {
    const newFiltered = Array.from(filteredItems);
    const [movedItem] = newFiltered.splice(sourceIndex, 1);
    newFiltered.splice(destinationIndex, 0, movedItem);

    const updates = newFiltered.map((item, index) => ({
      id: item._id,
      displayOrder: index + 1
    }));

    const oldItems = [...crud.items];
    const newItems = oldItems.map(item => {
      const update = updates.find(u => u.id === item._id);
      return update ? { ...item, displayOrder: update.displayOrder } : item;
    });
    
    newItems.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    crud.setItems(newItems);

    try {
      await adminService.reorder('Resource', updates);
    } catch (err) {
      console.error('Reorder failed:', err);
      crud.setItems(oldItems);
    }
  };

  const openClone = (item) => {
    setItemToClone(item);
    setIsCloneOpen(true);
  };

  // Form Cascading
  useEffect(() => {
    if (crud.formData.sheetId && crud.isFormModalOpen) {
      loadFormSubjects(crud.formData.sheetId);
    } else if (crud.isFormModalOpen && !crud.formData.sheetId) {
      setFormSubjects([]);
    }
  }, [crud.formData.sheetId, crud.isFormModalOpen]);

  useEffect(() => {
    if (crud.formData.subjectId && crud.isFormModalOpen) {
      loadFormChapters(crud.formData.subjectId);
    } else if (crud.isFormModalOpen && !crud.formData.subjectId) {
      setFormChapters([]);
    }
  }, [crud.formData.subjectId, crud.isFormModalOpen]);

  const loadFormSubjects = async (sheetId) => {
    try {
      const response = await subjectService.getSubjects({ page: 1, limit: 100, status: 'ACTIVE', sheetId, sort: 'order' });
      const data = response.data || [];
      setFormSubjects(data);
      crud.setFormData(prev => {
        if (!data.some(s => s._id === prev.subjectId)) return { ...prev, subjectId: '', chapterId: '' };
        return prev;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const loadFormChapters = async (subjectId) => {
    try {
      const response = await chapterService.getChapters({ page: 1, limit: 100, status: 'ACTIVE', subjectId, sort: 'order' });
      const data = response.data || [];
      setFormChapters(data);
      crud.setFormData(prev => {
        if (!data.some(c => c._id === prev.chapterId)) return { ...prev, chapterId: '' };
        return prev;
      });
    } catch (err) {
      console.error(err);
    }
  };

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

  const isValidUrl = (urlStr) => {
    try {
      const parsed = new URL(urlStr);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (e) {
      return false;
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!crud.formData.sheetId) errors.sheetId = 'Sheet is required';
    if (!crud.formData.subjectId) errors.subjectId = 'Subject is required';
    if (!crud.formData.chapterId) errors.chapterId = 'Chapter is required';
    if (!crud.formData.title.trim()) errors.title = 'Title is required';
    if (!crud.formData.resourceType.trim()) errors.resourceType = 'Resource Type is required';
    
    const hasExternal = crud.formData.url.trim().length > 0;
    const hasStorage = crud.formData.storageUrl.trim().length > 0;

    if (!hasExternal && !hasStorage) {
      errors.urls = 'At least one valid URL (External or Storage) is required';
    }

    if (hasExternal && !isValidUrl(crud.formData.url.trim())) {
      errors.url = 'External URL is invalid';
    }
    
    if (hasStorage && !isValidUrl(crud.formData.storageUrl.trim())) {
      errors.storageUrl = 'Storage URL is invalid';
    }

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
      chapterId: crud.formData.chapterId,
      title: crud.formData.title.trim(),
      description: crud.formData.description.trim(),
      resourceType: crud.formData.resourceType.trim(),
      url: crud.formData.url.trim(),
      storageUrl: crud.formData.storageUrl.trim(),
      status: crud.formData.status,
      tags,
      metadata,
    };
    if (crud.formData.order.trim() !== '') {
      payload.order = Number(crud.formData.order);
    }
    crud.handleSubmit(payload);
  };

  const handlePreview = (res) => {
    const link = res.url || res.storageUrl;
    if (link) {
      window.open(link, '_blank');
    }
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
    { key: 'displayOrder', label: 'Order', className: 'text-center font-mono text-zinc-400 w-16' },
    { 
      key: 'details', 
      label: 'Title & Details', 
      render: (res) => (
        <div>
          <div className="font-semibold text-zinc-100">{res.title}</div>
          {res.description && (
            <div className="mt-1 text-xs text-zinc-400 max-w-xs truncate">{res.description}</div>
          )}
        </div>
      )
    },
    { 
      key: 'type', 
      label: 'Resource Type', 
      className: 'w-32',
      render: (res) => (
        <span className="inline-flex items-center rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
          {res.resourceType}
        </span>
      )
    },
    {
      key: 'url',
      label: 'URL',
      className: 'max-w-xs',
      render: (res) => (
        <div className="truncate">
          {res.url ? (
            <div className="text-xs text-zinc-500 truncate" title={res.url}>Ext: {res.url}</div>
          ) : null}
          {res.storageUrl ? (
            <div className="text-xs text-zinc-500 truncate" title={res.storageUrl}>Stor: {res.storageUrl}</div>
          ) : null}
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      className: 'w-24',
      render: (res) => getStatusBadge(res.status)
    },
    {
      key: 'tags',
      label: 'Tags',
      className: 'min-w-[120px]',
      render: (res) => (
        <div className="space-y-1.5">
          {res.tags && res.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {res.tags.map(tag => (
                <Chip key={tag} className="border-zinc-800 bg-zinc-900/50 py-0 px-1.5 text-[10px]">
                  {tag}
                </Chip>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right w-40',
      render: (res) => (
        <div className="flex justify-end gap-1">
          <Button onClick={() => handlePreview(res)} size="icon" variant="ghost" title="Preview Resource">
            <ExternalLink size={14} className="text-blue-400 hover:text-blue-300" />
          </Button>
          <Button onClick={() => crud.handleOpenEdit(res)} size="icon" variant="ghost" title="Edit Resource">
            <Edit2 size={14} className="text-zinc-400 hover:text-white" />
          </Button>
          <Button onClick={() => openClone(res)} size="icon" variant="ghost" title="Clone Resource">
            <Copy size={14} className="text-zinc-400 hover:text-white" />
          </Button>
          {res.status !== 'ARCHIVED' && (
            <Button onClick={() => crud.handleOpenArchive(res)} size="icon" variant="ghost" title="Archive Resource">
              <Trash2 size={14} className="text-red-400 hover:text-red-300" />
            </Button>
          )}
        </div>
      )
    }
  ];

  const filteredItems = crud.items.filter(item => {
    if (advFilters.status && item.status !== advFilters.status) return false;
    if (advFilters.tags) {
      const searchTags = advFilters.tags.toLowerCase().split(',').map(t => t.trim());
      const itemTags = (item.tags || []).map(t => t.toLowerCase());
      if (!searchTags.some(t => itemTags.includes(t))) return false;
    }
    return true;
  });

  const canReorder = !crud.search && crud.activeTab === 'all' && !advFilters.status && !advFilters.tags && filters.selectedChapterId;

  return (
    <div className="space-y-6">
      <SectionHeader
        description="Manage all learning resources."
        title="Resource Management"
      />

      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full max-w-3xl">
          <label className="text-sm text-zinc-400 whitespace-nowrap">Context:</label>
          <select
            className="h-10 w-full sm:w-auto min-w-[140px] rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-200 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            value={filters.selectedSheetId}
            onChange={(e) => filters.setSelectedSheetId(e.target.value)}
          >
            <option value="">Select Sheet</option>
            {filters.sheets.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
          </select>
          <select
            className="h-10 w-full sm:w-auto min-w-[140px] rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-200 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
            value={filters.selectedSubjectId}
            onChange={(e) => filters.setSelectedSubjectId(e.target.value)}
            disabled={!filters.selectedSheetId}
          >
            <option value="">{filters.selectedSheetId ? 'Select Subject' : 'Waiting on Sheet...'}</option>
            {filters.subjects.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
          </select>
          <select
            className="h-10 w-full sm:w-auto min-w-[140px] rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-200 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
            value={filters.selectedChapterId}
            onChange={(e) => filters.setSelectedChapterId(e.target.value)}
            disabled={!filters.selectedSubjectId}
          >
            <option value="">{filters.selectedSubjectId ? 'Select Chapter' : 'Waiting on Subject...'}</option>
            {filters.chapters.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
          </select>
        </div>

        <ReusableTableToolbar 
          searchQuery={crud.search} 
          onSearchChange={crud.setSearch}
          onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
          onAdd={() => crud.handleOpenCreate({
            sheetId: filters.selectedSheetId,
            subjectId: filters.selectedSubjectId,
            chapterId: filters.selectedChapterId
          })}
          onImport={() => setIsImportOpen(true)}
          addLabel="Create Resource"
          importLabel="Import Resources"
          isFiltersOpen={isFiltersOpen}
          addDisabled={!filters.selectedChapterId}
        />

        <AdvancedFilterPanel 
          isOpen={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}
          filters={advFilters}
          onFilterChange={(k, v) => setAdvFilters({...advFilters, [k]: v})}
          onClear={() => setAdvFilters({status: '', tags: ''})}
        />

        <StatusTabs activeValue={crud.activeTab} onChange={crud.setActiveTab} />
      </div>

      <ErrorState error={crud.error} onRetry={() => crud.fetchItems({ chapterId: filters.selectedChapterId })} />

      {crud.loading && !crud.error && <LoadingSkeleton rows={5} />}

      {!crud.loading && !crud.error && (
        <>
          <DataTable
            columns={columns}
            data={filteredItems}
            selectedIds={selectedIds}
            onSelect={setSelectedIds}
            onReorder={canReorder ? handleReorder : undefined}
            emptyState={
              <EmptyState
                icon={crud.activeTab === 'ARCHIVED' ? Trash2 : FileText}
                title={crud.activeTab === 'ARCHIVED' ? 'No archived resources' : 'No resources found'}
                description={crud.activeTab === 'all' 
                  ? "Start by creating resources within your selected chapter." 
                  : `There are no resources with status "${crud.activeTab}" matching your query.`
                }
                actionLabel={crud.activeTab === 'all' ? "Create your first resource" : null}
                actionIcon={Plus}
                actionDisabled={!filters.selectedChapterId}
                onAction={crud.activeTab === 'all' ? () => crud.handleOpenCreate({
                  sheetId: filters.selectedSheetId,
                  subjectId: filters.selectedSubjectId,
                  chapterId: filters.selectedChapterId
                }) : null}
              />
            }
          />
          <BulkActionToolbar selectedCount={selectedIds.length} onAction={handleBulkAction} />
        </>
      )}

      {/* Create/Edit Modal */}
      <CrudFormModal
        isOpen={crud.isFormModalOpen}
        onClose={() => crud.setIsFormModalOpen(false)}
        title={crud.selectedItem ? 'Edit Resource' : 'Create Resource'}
        onSubmit={onSubmit}
        isSubmitting={crud.isSubmitting}
        submitError={crud.formErrors.submit}
        isEditMode={!!crud.selectedItem}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Sheet *</label>
            <select
              className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800"
              value={crud.formData.sheetId}
              onChange={(e) => crud.setFormData({ ...crud.formData, sheetId: e.target.value })}
              required
            >
              <option value="" disabled>Select</option>
              {filters.sheets.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
            </select>
            {crud.formErrors.sheetId && <p className="mt-1 text-xs text-red-400">{crud.formErrors.sheetId}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Subject *</label>
            <select
              className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800 disabled:opacity-50"
              value={crud.formData.subjectId}
              onChange={(e) => crud.setFormData({ ...crud.formData, subjectId: e.target.value })}
              disabled={!crud.formData.sheetId}
              required
            >
              <option value="" disabled>Select</option>
              {formSubjects.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
            </select>
            {crud.formErrors.subjectId && <p className="mt-1 text-xs text-red-400">{crud.formErrors.subjectId}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Chapter *</label>
            <select
              className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800 disabled:opacity-50"
              value={crud.formData.chapterId}
              onChange={(e) => crud.setFormData({ ...crud.formData, chapterId: e.target.value })}
              disabled={!crud.formData.subjectId}
              required
            >
              <option value="" disabled>Select</option>
              {formChapters.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
            {crud.formErrors.chapterId && <p className="mt-1 text-xs text-red-400">{crud.formErrors.chapterId}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Title *</label>
            <Input
              placeholder="e.g. Intro to Logic Gates"
              value={crud.formData.title}
              onChange={(e) => crud.setFormData({ ...crud.formData, title: e.target.value })}
              required
            />
            {crud.formErrors.title && <p className="mt-1 text-xs text-red-400">{crud.formErrors.title}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Resource Type *</label>
            <CreatableSelect
              placeholder="Select or type custom..."
              value={crud.formData.resourceType}
              onChange={(val) => crud.setFormData({ ...crud.formData, resourceType: val })}
              suggestions={RESOURCE_TYPE_SUGGESTIONS}
              required
            />
            {crud.formErrors.resourceType && <p className="mt-1 text-xs text-red-400">{crud.formErrors.resourceType}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Description</label>
          <Textarea
            placeholder="Brief description of the resource..."
            value={crud.formData.description}
            onChange={(e) => crud.setFormData({ ...crud.formData, description: e.target.value })}
          />
        </div>

        <div className="rounded border border-zinc-800 p-3 bg-zinc-900/20 space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">External URL</label>
            <Input
              placeholder="https://youtube.com/..."
              value={crud.formData.url}
              onChange={(e) => crud.setFormData({ ...crud.formData, url: e.target.value })}
            />
            {crud.formErrors.url && <p className="mt-1 text-xs text-red-400">{crud.formErrors.url}</p>}
          </div>
          
          <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <span className="h-px bg-zinc-800 flex-1 mr-3" /> OR <span className="h-px bg-zinc-800 flex-1 ml-3" />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Storage URL</label>
            <Input
              placeholder="https://storage.supabase.com/..."
              value={crud.formData.storageUrl}
              onChange={(e) => crud.setFormData({ ...crud.formData, storageUrl: e.target.value })}
            />
            {crud.formErrors.storageUrl && <p className="mt-1 text-xs text-red-400">{crud.formErrors.storageUrl}</p>}
          </div>
          {crud.formErrors.urls && <p className="mt-1 text-xs text-red-400 text-center font-medium">{crud.formErrors.urls}</p>}
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
            placeholder="e.g. Video, Revision (comma-separated)"
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
            <p className="text-xs text-zinc-500 italic">No custom metadata.</p>
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
        title="Archive Resource"
        message={
          <>
            Are you sure you want to archive resource <strong className="text-white">"{crud.selectedItem?.title}"</strong>?
            This will perform a soft delete.
          </>
        }
        confirmLabel="Archive Resource"
        isSubmitting={crud.isSubmitting}
      />

      <CSVImportModal 
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImport}
        entityType="Resource"
      />

      <CloneDialog
        isOpen={isCloneOpen}
        onClose={() => {setIsCloneOpen(false); setItemToClone(null);}}
        onConfirm={handleClone}
        entityName={itemToClone?.title}
        isSubmitting={crud.isSubmitting}
      />

      <BulkTagsDialog
        isOpen={bulkActionType === 'TAGS'}
        onClose={() => setBulkActionType(null)}
        onConfirm={executeComplexBulkAction}
        isSubmitting={crud.isSubmitting}
        selectedCount={selectedIds.length}
      />

      <BulkMoveDialog
        isOpen={bulkActionType === 'MOVE'}
        onClose={() => setBulkActionType(null)}
        onConfirm={executeComplexBulkAction}
        isSubmitting={crud.isSubmitting}
        selectedCount={selectedIds.length}
        parentOptions={formChapters}
        parentLabel="Chapter (Filtered by Subject)"
      />
    </div>
  );
}
