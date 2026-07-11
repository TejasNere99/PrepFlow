import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Edit2,
  FileText,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Chip from '../components/ui/Chip.jsx';
import Input from '../components/ui/Input.jsx';
import Loader from '../components/ui/Loader.jsx';
import Modal from '../components/ui/Modal.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import Tabs from '../components/ui/Tabs.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import * as chapterService from '../services/chapterService.js';
import * as subjectService from '../services/subjectService.js';
import * as sheetService from '../services/sheetService.js';

function Chapters() {
  // Main data state
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Cascading Dropdowns State (Filters)
  const [sheets, setSheets] = useState([]);
  const [selectedFilterSheetId, setSelectedFilterSheetId] = useState('');
  const [subjectsForFilter, setSubjectsForFilter] = useState([]);
  const [selectedFilterSubjectId, setSelectedFilterSubjectId] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);

  // Form state
  // We manage separate sheet/subject state for the modal form if needed,
  // but we can reuse the cascading logic inside the form.
  const [formSheets, setFormSheets] = useState([]);
  const [formSubjects, setFormSubjects] = useState([]);

  const [formData, setFormData] = useState({
    sheetId: '',
    subjectId: '',
    title: '',
    description: '',
    order: '', // Make it string to allow empty value
    status: 'DRAFT',
    tagsInput: '',
    metadataList: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial load
  useEffect(() => {
    fetchInitialSheets();
  }, []);

  // Fetch subjects when filter sheet changes
  useEffect(() => {
    if (selectedFilterSheetId) {
      fetchFilterSubjects(selectedFilterSheetId);
    } else {
      setSubjectsForFilter([]);
      setSelectedFilterSubjectId('');
    }
  }, [selectedFilterSheetId]);

  // Fetch chapters when dependencies change
  useEffect(() => {
    fetchChapters();
  }, [activeTab, search, selectedFilterSubjectId]);

  // Handle Form Sheet Change
  useEffect(() => {
    if (formData.sheetId && isFormModalOpen) {
      fetchFormSubjects(formData.sheetId);
    } else if (isFormModalOpen && !formData.sheetId) {
      setFormSubjects([]);
    }
  }, [formData.sheetId, isFormModalOpen]);

  const fetchInitialSheets = async () => {
    try {
      const response = await sheetService.getSheets({
        page: 1,
        limit: 100,
        status: 'ACTIVE',
        sort: 'order',
      });
      const activeSheets = response.data || [];
      setSheets(activeSheets);
      setFormSheets(activeSheets);
    } catch (err) {
      console.error('Failed to fetch sheets', err);
    }
  };

  const fetchFilterSubjects = async (sheetId) => {
    try {
      const response = await subjectService.getSubjects({
        page: 1,
        limit: 100,
        status: 'ACTIVE',
        sheetId: sheetId,
        sort: 'order',
      });
      setSubjectsForFilter(response.data || []);
      // Auto-select first subject if exists and none is selected
      if (response.data?.length > 0) {
        setSelectedFilterSubjectId(response.data[0]._id);
      } else {
        setSelectedFilterSubjectId('');
      }
    } catch (err) {
      console.error('Failed to fetch filter subjects', err);
    }
  };

  const fetchFormSubjects = async (sheetId) => {
    try {
      const response = await subjectService.getSubjects({
        page: 1,
        limit: 100,
        status: 'ACTIVE',
        sheetId: sheetId,
        sort: 'order',
      });
      setFormSubjects(response.data || []);
      // If the currently selected subject in form isn't in this list, clear it
      setFormData(prev => {
        if (!response.data.some(s => s._id === prev.subjectId)) {
          return { ...prev, subjectId: '' };
        }
        return prev;
      });
    } catch (err) {
      console.error('Failed to fetch form subjects', err);
    }
  };

  const fetchChapters = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: 1,
        limit: 100,
        status: activeTab,
        sort: 'order',
      };
      if (search.trim()) {
        params.search = search.trim();
      }
      if (selectedFilterSubjectId) {
        params.subjectId = selectedFilterSubjectId;
      }
      const response = await chapterService.getChapters(params);
      setChapters(response.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load chapters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Open create chapter modal
  const handleOpenCreate = () => {
    setSelectedChapter(null);
    setFormData({
      sheetId: selectedFilterSheetId, // default to currently filtered
      subjectId: selectedFilterSubjectId,
      title: '',
      description: '',
      order: '',
      status: 'DRAFT',
      tagsInput: '',
      metadataList: [],
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open edit chapter modal
  const handleOpenEdit = (chapter) => {
    setSelectedChapter(chapter);
    
    const tagsInput = (chapter.tags || []).join(', ');
    
    const metadataList = Object.entries(chapter.metadata || {}).map(([key, value]) => ({
      key,
      value: String(value),
    }));

    const subjectId = chapter.subjectId?._id || chapter.subjectId || '';
    const sheetId = chapter.subjectId?.sheetId?._id || chapter.subjectId?.sheetId || '';

    setFormData({
      sheetId: sheetId,
      subjectId: subjectId,
      title: chapter.title || '',
      description: chapter.description || '',
      order: chapter.order !== undefined ? String(chapter.order) : '',
      status: chapter.status || 'DRAFT',
      tagsInput,
      metadataList,
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open archive confirmation modal
  const handleOpenArchive = (chapter) => {
    setSelectedChapter(chapter);
    setIsArchiveModalOpen(true);
  };

  // Metadata dynamic input handlers
  const handleAddMetadataField = () => {
    setFormData((prev) => ({
      ...prev,
      metadataList: [...prev.metadataList, { key: '', value: '' }],
    }));
  };

  const handleMetadataChange = (index, field, val) => {
    setFormData((prev) => {
      const updated = [...prev.metadataList];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, metadataList: updated };
    });
  };

  const handleRemoveMetadataField = (index) => {
    setFormData((prev) => ({
      ...prev,
      metadataList: prev.metadataList.filter((_, i) => i !== index),
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.sheetId) {
      errors.sheetId = 'Sheet is required';
    }
    if (!formData.subjectId) {
      errors.subjectId = 'Subject is required';
    }
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    const keys = formData.metadataList.map((m) => m.key.trim());
    formData.metadataList.forEach((m, i) => {
      if (m.value.trim() && !m.key.trim()) {
        errors[`metadata_key_${i}`] = 'Key is required for this value';
      }
    });

    const uniqueKeys = new Set(keys.filter(Boolean));
    if (uniqueKeys.size !== keys.filter(Boolean).length) {
      errors.metadata = 'Metadata keys must be unique';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const tags = formData.tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const metadata = {};
      formData.metadataList.forEach(({ key, value }) => {
        const trimmedKey = key.trim();
        const trimmedVal = value.trim();
        if (trimmedKey) {
          metadata[trimmedKey] = trimmedVal;
        }
      });

      const payload = {
        subjectId: formData.subjectId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        tags,
        metadata,
      };

      // Order is optional
      if (formData.order.trim() !== '') {
        payload.order = Number(formData.order);
      }

      if (selectedChapter) {
        await chapterService.updateChapter(selectedChapter._id, payload);
      } else {
        await chapterService.createChapter(payload);
      }

      setIsFormModalOpen(false);
      fetchChapters();
    } catch (err) {
      console.error(err);
      setFormErrors({
        submit: err.response?.data?.message || 'Failed to save chapter.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle archive confirmation
  const handleArchiveSubmit = async () => {
    if (!selectedChapter) return;
    setIsSubmitting(true);
    try {
      await chapterService.archiveChapter(selectedChapter._id);
      setIsArchiveModalOpen(false);
      fetchChapters();
    } catch (err) {
      console.error(err);
      alert('Failed to archive chapter.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success">Active</Badge>;
      case 'DRAFT':
        return <Badge variant="warning">Draft</Badge>;
      case 'HIDDEN':
        return <Badge variant="neutral">Hidden</Badge>;
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center rounded-full border border-red-700 bg-red-950/40 px-2 py-0.5 text-xs font-medium text-red-300">
            Archived
          </span>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        actions={
          <Button onClick={handleOpenCreate} className="gap-2" disabled={!selectedFilterSubjectId}>
            <Plus size={16} />
            Create Chapter
          </Button>
        }
        description="Manage study chapters under subjects."
        title="Chapter Management"
      />

      {/* Controls: Search, Cascading Filters and Status Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              className="pl-9"
              placeholder="Search chapters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X size={14} />
              </button>
            )}
          </div>
          
          <select
            className="h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none transition-colors focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800"
            value={selectedFilterSheetId}
            onChange={(e) => setSelectedFilterSheetId(e.target.value)}
          >
            <option value="">Select Sheet (All)</option>
            {sheets.map(sheet => (
              <option key={sheet._id} value={sheet._id}>
                {sheet.title}
              </option>
            ))}
          </select>
          
          <select
            className="h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none transition-colors focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800 disabled:opacity-50"
            value={selectedFilterSubjectId}
            onChange={(e) => setSelectedFilterSubjectId(e.target.value)}
            disabled={!selectedFilterSheetId}
          >
            <option value="">
              {!selectedFilterSheetId ? 'Select Sheet First' : 'All Subjects'}
            </option>
            {subjectsForFilter.map(subject => (
              <option key={subject._id} value={subject._id}>
                {subject.title}
              </option>
            ))}
          </select>
        </div>

        <Tabs
          activeValue={activeTab}
          onChange={setActiveTab}
          tabs={[
            { label: 'All', value: 'all' },
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Draft', value: 'DRAFT' },
            { label: 'Hidden', value: 'HIDDEN' },
            { label: 'Archived', value: 'ARCHIVED' },
          ]}
        />
      </div>

      {/* Error state */}
      {error && (
        <Card className="border-red-900 bg-red-950/20 text-red-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-400" />
            <div className="flex-1 text-sm">{error}</div>
            <Button size="sm" variant="secondary" onClick={fetchChapters}>
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Loading state */}
      {loading && !error && (
        <div className="flex h-64 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/40">
          <Loader label="Loading chapters..." />
        </div>
      )}

      {/* Chapters Content Table */}
      {!loading && !error && (
        <>
          {chapters.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/20 py-16 text-center">
              <div className="rounded-full bg-zinc-900 p-4 border border-zinc-800 text-zinc-500 mb-4">
                {activeTab === 'ARCHIVED' ? (
                  <Trash2 size={32} />
                ) : (
                  <FileText size={32} />
                )}
              </div>
              <h3 className="text-base font-semibold text-zinc-200">
                {activeTab === 'ARCHIVED'
                  ? 'No archived chapters'
                  : 'No chapters found'}
              </h3>
              <p className="mt-1 max-w-sm text-sm text-zinc-500">
                {activeTab === 'all'
                  ? "Start by creating a chapter for your subjects."
                  : `There are no chapters with status "${activeTab}" matching your query.`}
              </p>
              {activeTab === 'all' && (
                <Button onClick={handleOpenCreate} className="mt-4 gap-2" size="sm" disabled={!selectedFilterSubjectId}>
                  <Plus size={14} />
                  Create your first chapter
                </Button>
              )}
            </div>
          ) : (
            /* Table list */
            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/40 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      <th className="px-5 py-3 w-20 text-center">Order</th>
                      <th className="px-5 py-3">Chapter Details</th>
                      <th className="px-5 py-3">Subject & Sheet</th>
                      <th className="px-5 py-3 w-28">Status</th>
                      <th className="px-5 py-3">Tags & Metadata</th>
                      <th className="px-5 py-3 w-28 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-950 bg-zinc-950/40 text-sm">
                    {chapters.map((chapter) => (
                      <tr
                        key={chapter._id}
                        className="transition-colors hover:bg-zinc-900/20"
                      >
                        <td className="px-5 py-4 text-center font-mono text-zinc-400">
                          {chapter.order}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-zinc-100">
                            {chapter.title}
                          </div>
                          <div className="mt-0.5 font-mono text-xs text-zinc-500">
                            {chapter.slug}
                          </div>
                          {chapter.description && (
                            <div className="mt-1 text-xs text-zinc-400 max-w-xs truncate">
                              {chapter.description}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {chapter.subjectId ? (
                            <div>
                              <div className="text-zinc-300 font-medium">{chapter.subjectId.title}</div>
                              {chapter.subjectId.sheetId && (
                                <div className="text-zinc-500 text-xs mt-0.5">{chapter.subjectId.sheetId.title}</div>
                              )}
                            </div>
                          ) : (
                            <div className="text-zinc-600 italic">No Subject</div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {getStatusBadge(chapter.status)}
                        </td>
                        <td className="px-5 py-4 space-y-1.5">
                          {chapter.tags && chapter.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {chapter.tags.map((tag) => (
                                <Chip key={tag} className="border-zinc-800 bg-zinc-900/50 py-0 px-1.5 text-[10px]">
                                  {tag}
                                </Chip>
                              ))}
                            </div>
                          )}
                          {chapter.metadata && Object.keys(chapter.metadata).length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(chapter.metadata).map(([k, v]) => (
                                <span
                                  key={k}
                                  className="inline-flex items-center rounded border border-zinc-800 bg-zinc-950 px-1.5 py-0.5 text-[10px] text-zinc-400"
                                >
                                  <span className="font-medium text-zinc-500 mr-1">{k}:</span>
                                  {v}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => handleOpenEdit(chapter)}
                              size="icon"
                              variant="ghost"
                              title="Edit Chapter"
                            >
                              <Edit2 size={14} className="text-zinc-400 hover:text-white" />
                            </Button>
                            {chapter.status !== 'ARCHIVED' && (
                              <Button
                                onClick={() => handleOpenArchive(chapter)}
                                size="icon"
                                variant="ghost"
                                title="Archive Chapter"
                              >
                                <Trash2 size={14} className="text-red-400 hover:text-red-300" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Chapter Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedChapter ? 'Edit Chapter' : 'Create Chapter'}
        footer={
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              variant="secondary"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" form="chapter-form" disabled={isSubmitting || !formData.subjectId}>
              {isSubmitting
                ? 'Saving...'
                : selectedChapter
                ? 'Save Changes'
                : 'Create Chapter'}
            </Button>
          </div>
        }
      >
        <form id="chapter-form" onSubmit={handleFormSubmit} className="space-y-4">
          {formErrors.submit && (
            <div className="rounded border border-red-900 bg-red-950/20 p-2.5 text-xs text-red-300">
              {formErrors.submit}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Sheet *
              </label>
              <select
                className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none transition-colors focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800"
                value={formData.sheetId}
                onChange={(e) =>
                  setFormData({ ...formData, sheetId: e.target.value })
                }
                required
              >
                <option value="" disabled>Select Sheet</option>
                {formSheets.map(sheet => (
                  <option key={sheet._id} value={sheet._id}>
                    {sheet.title}
                  </option>
                ))}
              </select>
              {formErrors.sheetId && (
                <p className="mt-1 text-xs text-red-400">{formErrors.sheetId}</p>
              )}
            </div>
            
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Subject *
              </label>
              <select
                className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none transition-colors focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800 disabled:opacity-50"
                value={formData.subjectId}
                onChange={(e) =>
                  setFormData({ ...formData, subjectId: e.target.value })
                }
                disabled={!formData.sheetId}
                required
              >
                <option value="" disabled>
                  {!formData.sheetId ? 'Select Sheet First' : 'Select Subject'}
                </option>
                {formSubjects.map(subject => (
                  <option key={subject._id} value={subject._id}>
                    {subject.title}
                  </option>
                ))}
              </select>
              {formErrors.subjectId && (
                <p className="mt-1 text-xs text-red-400">{formErrors.subjectId}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Title *
            </label>
            <Input
              placeholder="e.g. Current Electricity"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            {formErrors.title && (
              <p className="mt-1 text-xs text-red-400">{formErrors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Description
            </label>
            <Textarea
              placeholder="Provide a brief overview of this chapter..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Display Order (Optional)
              </label>
              <Input
                type="number"
                placeholder="Auto-assigned if empty"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Status
              </label>
              <select
                className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none transition-colors focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="HIDDEN">Hidden</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Tags
            </label>
            <Input
              placeholder="e.g. Circuit, Resistors (comma-separated)"
              value={formData.tagsInput}
              onChange={(e) =>
                setFormData({ ...formData, tagsInput: e.target.value })
              }
            />
          </div>

          {/* Dynamic Metadata Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Custom Metadata Fields
              </label>
              <Button
                type="button"
                onClick={handleAddMetadataField}
                size="sm"
                variant="secondary"
                className="h-7 px-2.5 text-xs gap-1"
              >
                <Plus size={12} />
                Add Field
              </Button>
            </div>

            {formErrors.metadata && (
              <p className="text-xs text-red-400">{formErrors.metadata}</p>
            )}

            {formData.metadataList.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">No custom metadata.</p>
            ) : (
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {formData.metadataList.map((m, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      placeholder="Key"
                      value={m.key}
                      onChange={(e) =>
                        handleMetadataChange(idx, 'key', e.target.value)
                      }
                      className="h-8 text-xs"
                    />
                    <Input
                      placeholder="Value"
                      value={m.value}
                      onChange={(e) =>
                        handleMetadataChange(idx, 'value', e.target.value)
                      }
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
        </form>
      </Modal>

      {/* Archive Confirmation Dialog */}
      <Modal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        title="Archive Chapter"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setIsArchiveModalOpen(false)}
              variant="secondary"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleArchiveSubmit}
              variant="danger"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Archiving...' : 'Archive Chapter'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex gap-3 text-sm text-zinc-300">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <div>
              Are you sure you want to archive chapter{' '}
              <strong className="text-white">"{selectedChapter?.title}"</strong>?
              This will perform a soft delete, updating its status to{' '}
              <span className="font-mono text-xs bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded text-zinc-400">
                ARCHIVED
              </span>
              .
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Chapters;
