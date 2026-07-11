import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Edit2,
  FolderOpen,
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
import * as subjectService from '../services/subjectService.js';
import * as sheetService from '../services/sheetService.js';

function Subjects() {
  // State for listing subjects
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // State for sheets (selector)
  const [sheets, setSheets] = useState([]);
  const [selectedFilterSheetId, setSelectedFilterSheetId] = useState('');

  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    sheetId: '',
    title: '',
    description: '',
    order: 0,
    status: 'DRAFT',
    tagsInput: '',
    metadataList: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load sheets and subjects on mount
  useEffect(() => {
    fetchSheets();
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [activeTab, search, selectedFilterSheetId]);

  const fetchSheets = async () => {
    try {
      // Load only ACTIVE sheets for the selector
      const response = await sheetService.getSheets({
        page: 1,
        limit: 100,
        status: 'ACTIVE',
        sort: 'order',
      });
      setSheets(response.data || []);
    } catch (err) {
      console.error('Failed to fetch sheets', err);
    }
  };

  const fetchSubjects = async () => {
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
      if (selectedFilterSheetId) {
        params.sheetId = selectedFilterSheetId;
      }
      const response = await subjectService.getSubjects(params);
      setSubjects(response.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load subjects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Open create subject modal
  const handleOpenCreate = () => {
    setSelectedSubject(null);
    setFormData({
      sheetId: selectedFilterSheetId || (sheets.length > 0 ? sheets[0]._id : ''),
      title: '',
      description: '',
      order: 0,
      status: 'DRAFT',
      tagsInput: '',
      metadataList: [],
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open edit subject modal
  const handleOpenEdit = (subject) => {
    setSelectedSubject(subject);
    
    const tagsInput = (subject.tags || []).join(', ');
    
    const metadataList = Object.entries(subject.metadata || {}).map(([key, value]) => ({
      key,
      value: String(value),
    }));

    setFormData({
      sheetId: subject.sheetId?._id || subject.sheetId || '',
      title: subject.title || '',
      description: subject.description || '',
      order: subject.order !== undefined ? subject.order : 0,
      status: subject.status || 'DRAFT',
      tagsInput,
      metadataList,
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open archive confirmation modal
  const handleOpenArchive = (subject) => {
    setSelectedSubject(subject);
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
        sheetId: formData.sheetId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        order: Number(formData.order) || 0,
        status: formData.status,
        tags,
        metadata,
      };

      if (selectedSubject) {
        await subjectService.updateSubject(selectedSubject._id, payload);
      } else {
        await subjectService.createSubject(payload);
      }

      setIsFormModalOpen(false);
      fetchSubjects();
    } catch (err) {
      console.error(err);
      setFormErrors({
        submit: err.response?.data?.message || 'Failed to save subject.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle archive confirmation
  const handleArchiveSubmit = async () => {
    if (!selectedSubject) return;
    setIsSubmitting(true);
    try {
      await subjectService.archiveSubject(selectedSubject._id);
      setIsArchiveModalOpen(false);
      fetchSubjects();
    } catch (err) {
      console.error(err);
      alert('Failed to archive subject.');
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
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus size={16} />
            Create Subject
          </Button>
        }
        description="Manage study subjects under learning sheets."
        title="Subject Management"
      />

      {/* Controls: Search, Filter and Status Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              className="pl-9"
              placeholder="Search subjects..."
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
            <option value="">All Active Sheets</option>
            {sheets.map(sheet => (
              <option key={sheet._id} value={sheet._id}>
                {sheet.title}
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
            <Button size="sm" variant="secondary" onClick={fetchSubjects}>
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Loading state */}
      {loading && !error && (
        <div className="flex h-64 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/40">
          <Loader label="Loading subjects..." />
        </div>
      )}

      {/* Subjects Content Table */}
      {!loading && !error && (
        <>
          {subjects.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/20 py-16 text-center">
              <div className="rounded-full bg-zinc-900 p-4 border border-zinc-800 text-zinc-500 mb-4">
                {activeTab === 'ARCHIVED' ? (
                  <Trash2 size={32} />
                ) : (
                  <FolderOpen size={32} />
                )}
              </div>
              <h3 className="text-base font-semibold text-zinc-200">
                {activeTab === 'ARCHIVED'
                  ? 'No archived subjects'
                  : 'No subjects found'}
              </h3>
              <p className="mt-1 max-w-sm text-sm text-zinc-500">
                {activeTab === 'all'
                  ? "Start by creating a subject for your learning sheets."
                  : `There are no subjects with status "${activeTab}" matching your query.`}
              </p>
              {activeTab === 'all' && (
                <Button onClick={handleOpenCreate} className="mt-4 gap-2" size="sm">
                  <Plus size={14} />
                  Create your first subject
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
                      <th className="px-5 py-3">Subject Details</th>
                      <th className="px-5 py-3">Sheet</th>
                      <th className="px-5 py-3 w-28">Status</th>
                      <th className="px-5 py-3">Tags & Metadata</th>
                      <th className="px-5 py-3 w-28 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-950 bg-zinc-950/40 text-sm">
                    {subjects.map((subject) => (
                      <tr
                        key={subject._id}
                        className="transition-colors hover:bg-zinc-900/20"
                      >
                        <td className="px-5 py-4 text-center font-mono text-zinc-400">
                          {subject.order}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-zinc-100">
                            {subject.title}
                          </div>
                          <div className="mt-0.5 font-mono text-xs text-zinc-500">
                            {subject.slug}
                          </div>
                          {subject.description && (
                            <div className="mt-1 text-xs text-zinc-400 max-w-xs truncate">
                              {subject.description}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {subject.sheetId ? (
                            <div className="text-zinc-300">{subject.sheetId.title}</div>
                          ) : (
                            <div className="text-zinc-600 italic">No Sheet</div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {getStatusBadge(subject.status)}
                        </td>
                        <td className="px-5 py-4 space-y-1.5">
                          {subject.tags && subject.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {subject.tags.map((tag) => (
                                <Chip key={tag} className="border-zinc-800 bg-zinc-900/50 py-0 px-1.5 text-[10px]">
                                  {tag}
                                </Chip>
                              ))}
                            </div>
                          )}
                          {subject.metadata && Object.keys(subject.metadata).length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(subject.metadata).map(([k, v]) => (
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
                              onClick={() => handleOpenEdit(subject)}
                              size="icon"
                              variant="ghost"
                              title="Edit Subject"
                            >
                              <Edit2 size={14} className="text-zinc-400 hover:text-white" />
                            </Button>
                            {subject.status !== 'ARCHIVED' && (
                              <Button
                                onClick={() => handleOpenArchive(subject)}
                                size="icon"
                                variant="ghost"
                                title="Archive Subject"
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

      {/* Create/Edit Subject Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedSubject ? 'Edit Subject' : 'Create Subject'}
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
            <Button type="submit" form="subject-form" disabled={isSubmitting || !formData.sheetId}>
              {isSubmitting
                ? 'Saving...'
                : selectedSubject
                ? 'Save Changes'
                : 'Create Subject'}
            </Button>
          </div>
        }
      >
        <form id="subject-form" onSubmit={handleFormSubmit} className="space-y-4">
          {formErrors.submit && (
            <div className="rounded border border-red-900 bg-red-950/20 p-2.5 text-xs text-red-300">
              {formErrors.submit}
            </div>
          )}

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
              <option value="" disabled>Select a Sheet</option>
              {sheets.map(sheet => (
                <option key={sheet._id} value={sheet._id}>
                  {sheet.title}
                </option>
              ))}
            </select>
            {formErrors.sheetId && (
              <p className="mt-1 text-xs text-red-400">{formErrors.sheetId}</p>
            )}
            {sheets.length === 0 && (
              <p className="mt-1 text-xs text-amber-500">No active sheets available. Create a sheet first.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Title *
            </label>
            <Input
              placeholder="e.g. Physics"
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
              placeholder="Provide a brief overview of this subject..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Display Order
              </label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })
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
              placeholder="e.g. Mechanics, Optics (comma-separated)"
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
              <p className="text-xs text-zinc-500 italic">No custom metadata. Add fields like "Difficulty" or "Estimated Hours".</p>
            ) : (
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {formData.metadataList.map((m, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      placeholder="Key (e.g. Difficulty)"
                      value={m.key}
                      onChange={(e) =>
                        handleMetadataChange(idx, 'key', e.target.value)
                      }
                      className="h-8 text-xs"
                    />
                    <Input
                      placeholder="Value (e.g. Medium)"
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
        title="Archive Subject"
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
              {isSubmitting ? 'Archiving...' : 'Archive Subject'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex gap-3 text-sm text-zinc-300">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <div>
              Are you sure you want to archive subject{' '}
              <strong className="text-white">"{selectedSubject?.title}"</strong>?
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

export default Subjects;
