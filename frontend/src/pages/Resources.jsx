import { useEffect, useState, useRef } from 'react';
import {
  AlertTriangle,
  Edit2,
  FileText,
  Plus,
  Search,
  Trash2,
  X,
  ExternalLink,
  ChevronDown,
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
import { cn } from '../utils/cn.js';
import * as resourceService from '../services/resourceService.js';
import * as chapterService from '../services/chapterService.js';
import * as subjectService from '../services/subjectService.js';
import * as sheetService from '../services/sheetService.js';

const RESOURCE_TYPE_SUGGESTIONS = [
  'Playlist',
  'Notes',
  'Formula Sheet',
  'PYQs',
  'Reference Book',
  'Cheat Sheet',
  'Revision Notes'
];

function CreatableSelect({ value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredSuggestions = RESOURCE_TYPE_SUGGESTIONS.filter((s) =>
    s.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pr-8"
          required
        />
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-500 hover:text-zinc-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown size={16} />
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-zinc-800 bg-zinc-950 p-1 shadow-lg">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion}
                className="cursor-pointer rounded px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
                onClick={() => {
                  onChange(suggestion);
                  setIsOpen(false);
                }}
              >
                {suggestion}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-zinc-500">
              Press enter to use "{value}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Cascading Filters State
  const [sheets, setSheets] = useState([]);
  const [selectedFilterSheetId, setSelectedFilterSheetId] = useState('');
  
  const [subjectsForFilter, setSubjectsForFilter] = useState([]);
  const [selectedFilterSubjectId, setSelectedFilterSubjectId] = useState('');
  
  const [chaptersForFilter, setChaptersForFilter] = useState([]);
  const [selectedFilterChapterId, setSelectedFilterChapterId] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  // Form Cascading State
  const [formSheets, setFormSheets] = useState([]);
  const [formSubjects, setFormSubjects] = useState([]);
  const [formChapters, setFormChapters] = useState([]);

  const [formData, setFormData] = useState({
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
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial Load (Sheets)
  useEffect(() => {
    fetchInitialSheets();
  }, []);

  // Filter Cascade
  useEffect(() => {
    if (selectedFilterSheetId) {
      fetchFilterSubjects(selectedFilterSheetId);
    } else {
      setSubjectsForFilter([]);
      setSelectedFilterSubjectId('');
      setChaptersForFilter([]);
      setSelectedFilterChapterId('');
    }
  }, [selectedFilterSheetId]);

  useEffect(() => {
    if (selectedFilterSubjectId) {
      fetchFilterChapters(selectedFilterSubjectId);
    } else {
      setChaptersForFilter([]);
      setSelectedFilterChapterId('');
    }
  }, [selectedFilterSubjectId]);

  // Fetch Resources Trigger
  useEffect(() => {
    fetchResources();
  }, [activeTab, search, selectedFilterChapterId]);

  // Form Cascade
  useEffect(() => {
    if (formData.sheetId && isFormModalOpen) {
      fetchFormSubjects(formData.sheetId);
    } else if (isFormModalOpen && !formData.sheetId) {
      setFormSubjects([]);
    }
  }, [formData.sheetId, isFormModalOpen]);

  useEffect(() => {
    if (formData.subjectId && isFormModalOpen) {
      fetchFormChapters(formData.subjectId);
    } else if (isFormModalOpen && !formData.subjectId) {
      setFormChapters([]);
    }
  }, [formData.subjectId, isFormModalOpen]);

  // Data Fetchers
  const fetchInitialSheets = async () => {
    try {
      const response = await sheetService.getSheets({ page: 1, limit: 100, status: 'ACTIVE', sort: 'order' });
      setSheets(response.data || []);
      setFormSheets(response.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFilterSubjects = async (sheetId) => {
    try {
      const response = await subjectService.getSubjects({ page: 1, limit: 100, status: 'ACTIVE', sheetId, sort: 'order' });
      const data = response.data || [];
      setSubjectsForFilter(data);
      if (data.length > 0) setSelectedFilterSubjectId(data[0]._id);
      else setSelectedFilterSubjectId('');
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFilterChapters = async (subjectId) => {
    try {
      const response = await chapterService.getChapters({ page: 1, limit: 100, status: 'ACTIVE', subjectId, sort: 'order' });
      const data = response.data || [];
      setChaptersForFilter(data);
      if (data.length > 0) setSelectedFilterChapterId(data[0]._id);
      else setSelectedFilterChapterId('');
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFormSubjects = async (sheetId) => {
    try {
      const response = await subjectService.getSubjects({ page: 1, limit: 100, status: 'ACTIVE', sheetId, sort: 'order' });
      const data = response.data || [];
      setFormSubjects(data);
      setFormData(prev => {
        if (!data.some(s => s._id === prev.subjectId)) return { ...prev, subjectId: '', chapterId: '' };
        return prev;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFormChapters = async (subjectId) => {
    try {
      const response = await chapterService.getChapters({ page: 1, limit: 100, status: 'ACTIVE', subjectId, sort: 'order' });
      const data = response.data || [];
      setFormChapters(data);
      setFormData(prev => {
        if (!data.some(c => c._id === prev.chapterId)) return { ...prev, chapterId: '' };
        return prev;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: 1, limit: 100, status: activeTab, sort: 'order' };
      if (search.trim()) params.search = search.trim();
      if (selectedFilterChapterId) params.chapterId = selectedFilterChapterId;
      
      const response = await resourceService.getResources(params);
      setResources(response.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load resources. Please try again.');
    } finally {
      setLoading(false);
    }
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
    if (!formData.sheetId) errors.sheetId = 'Sheet is required';
    if (!formData.subjectId) errors.subjectId = 'Subject is required';
    if (!formData.chapterId) errors.chapterId = 'Chapter is required';
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.resourceType.trim()) errors.resourceType = 'Resource Type is required';
    
    const hasExternal = formData.url.trim().length > 0;
    const hasStorage = formData.storageUrl.trim().length > 0;

    if (!hasExternal && !hasStorage) {
      errors.urls = 'At least one valid URL (External or Storage) is required';
    }

    if (hasExternal && !isValidUrl(formData.url.trim())) {
      errors.url = 'External URL is invalid';
    }
    
    if (hasStorage && !isValidUrl(formData.storageUrl.trim())) {
      errors.storageUrl = 'Storage URL is invalid';
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
        if (key.trim()) metadata[key.trim()] = value.trim();
      });

      const payload = {
        chapterId: formData.chapterId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        resourceType: formData.resourceType.trim(),
        url: formData.url.trim(),
        storageUrl: formData.storageUrl.trim(),
        status: formData.status,
        tags,
        metadata,
      };

      if (formData.order.trim() !== '') {
        payload.order = Number(formData.order);
      }

      if (selectedResource) {
        await resourceService.updateResource(selectedResource._id, payload);
      } else {
        await resourceService.createResource(payload);
      }

      setIsFormModalOpen(false);
      fetchResources();
    } catch (err) {
      console.error(err);
      setFormErrors({ submit: err.response?.data?.message || 'Failed to save resource.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenCreate = () => {
    setSelectedResource(null);
    setFormData({
      sheetId: selectedFilterSheetId,
      subjectId: selectedFilterSubjectId,
      chapterId: selectedFilterChapterId,
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
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (res) => {
    setSelectedResource(res);
    const tagsInput = (res.tags || []).join(', ');
    const metadataList = Object.entries(res.metadata || {}).map(([key, value]) => ({ key, value: String(value) }));
    
    const chapterId = res.chapterId?._id || res.chapterId || '';
    const subjectId = res.chapterId?.subjectId?._id || res.chapterId?.subjectId || '';
    const sheetId = res.chapterId?.subjectId?.sheetId?._id || res.chapterId?.subjectId?.sheetId || '';

    setFormData({
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
      tagsInput,
      metadataList,
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenArchive = (res) => {
    setSelectedResource(res);
    setIsArchiveModalOpen(true);
  };

  const handleArchiveSubmit = async () => {
    if (!selectedResource) return;
    setIsSubmitting(true);
    try {
      await resourceService.archiveResource(selectedResource._id);
      setIsArchiveModalOpen(false);
      fetchResources();
    } catch (err) {
      console.error(err);
      alert('Failed to archive resource.');
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className="space-y-6">
      <SectionHeader
        actions={
          <Button onClick={handleOpenCreate} className="gap-2" disabled={!selectedFilterChapterId}>
            <Plus size={16} />
            Create Resource
          </Button>
        }
        description="Manage study resources like playlists, notes, and pyqs."
        title="Resource Management"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              className="pl-9"
              placeholder="Search resources..."
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
          
          <div className="flex items-center gap-2">
            <select
              className="h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none transition-colors focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800"
              value={selectedFilterSheetId}
              onChange={(e) => setSelectedFilterSheetId(e.target.value)}
            >
              <option value="">Select Sheet</option>
              {sheets.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
            </select>
            
            <select
              className="h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none transition-colors focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800 disabled:opacity-50"
              value={selectedFilterSubjectId}
              onChange={(e) => setSelectedFilterSubjectId(e.target.value)}
              disabled={!selectedFilterSheetId}
            >
              <option value="">{selectedFilterSheetId ? 'Select Subject' : 'Waiting on Sheet...'}</option>
              {subjectsForFilter.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
            </select>

            <select
              className="h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none transition-colors focus:border-zinc-600 focus:ring-2 focus:ring-zinc-800 disabled:opacity-50"
              value={selectedFilterChapterId}
              onChange={(e) => setSelectedFilterChapterId(e.target.value)}
              disabled={!selectedFilterSubjectId}
            >
              <option value="">{selectedFilterSubjectId ? 'Select Chapter' : 'Waiting on Subject...'}</option>
              {chaptersForFilter.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>
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

      {error && (
        <Card className="border-red-900 bg-red-950/20 text-red-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-400" />
            <div className="flex-1 text-sm">{error}</div>
            <Button size="sm" variant="secondary" onClick={fetchResources}>Retry</Button>
          </div>
        </Card>
      )}

      {loading && !error && (
        <div className="flex h-64 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/40">
          <Loader label="Loading resources..." />
        </div>
      )}

      {!loading && !error && (
        <>
          {resources.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/20 py-16 text-center">
              <div className="rounded-full bg-zinc-900 p-4 border border-zinc-800 text-zinc-500 mb-4">
                {activeTab === 'ARCHIVED' ? <Trash2 size={32} /> : <FileText size={32} />}
              </div>
              <h3 className="text-base font-semibold text-zinc-200">No resources found</h3>
              <p className="mt-1 max-w-sm text-sm text-zinc-500">
                Start by creating resources within your selected chapter.
              </p>
              {activeTab === 'all' && (
                <Button onClick={handleOpenCreate} className="mt-4 gap-2" size="sm" disabled={!selectedFilterChapterId}>
                  <Plus size={14} />
                  Create your first resource
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/40 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      <th className="px-4 py-3 w-16 text-center">Order</th>
                      <th className="px-4 py-3">Title & Details</th>
                      <th className="px-4 py-3 w-32">Resource Type</th>
                      <th className="px-4 py-3 max-w-xs">URL</th>
                      <th className="px-4 py-3 w-24">Status</th>
                      <th className="px-4 py-3 min-w-[120px]">Tags</th>
                      <th className="px-4 py-3 w-32 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-950 bg-zinc-950/40 text-sm">
                    {resources.map((res) => (
                      <tr key={res._id} className="transition-colors hover:bg-zinc-900/20">
                        <td className="px-4 py-4 text-center font-mono text-zinc-400">{res.order}</td>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-zinc-100">{res.title}</div>
                          {res.description && (
                            <div className="mt-1 text-xs text-zinc-400 max-w-xs truncate">{res.description}</div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
                            {res.resourceType}
                          </span>
                        </td>
                        <td className="px-4 py-4 max-w-xs truncate">
                          {res.url ? (
                            <div className="text-xs text-zinc-500 truncate" title={res.url}>Ext: {res.url}</div>
                          ) : null}
                          {res.storageUrl ? (
                            <div className="text-xs text-zinc-500 truncate" title={res.storageUrl}>Stor: {res.storageUrl}</div>
                          ) : null}
                        </td>
                        <td className="px-4 py-4">{getStatusBadge(res.status)}</td>
                        <td className="px-4 py-4">
                          {res.tags && res.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {res.tags.map((tag) => (
                                <Chip key={tag} className="border-zinc-800 bg-zinc-900/50 py-0 px-1.5 text-[10px]">
                                  {tag}
                                </Chip>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => handlePreview(res)}
                              size="icon"
                              variant="ghost"
                              title="Preview Resource"
                            >
                              <ExternalLink size={14} className="text-blue-400 hover:text-blue-300" />
                            </Button>
                            <Button
                              onClick={() => handleOpenEdit(res)}
                              size="icon"
                              variant="ghost"
                              title="Edit Resource"
                            >
                              <Edit2 size={14} className="text-zinc-400 hover:text-white" />
                            </Button>
                            {res.status !== 'ARCHIVED' && (
                              <Button
                                onClick={() => handleOpenArchive(res)}
                                size="icon"
                                variant="ghost"
                                title="Archive Resource"
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

      {/* Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedResource ? 'Edit Resource' : 'Create Resource'}
        footer={
          <div className="flex justify-end gap-3">
            <Button type="button" onClick={() => setIsFormModalOpen(false)} variant="secondary" disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" form="resource-form" disabled={isSubmitting || !formData.chapterId}>
              {isSubmitting ? 'Saving...' : selectedResource ? 'Save Changes' : 'Create Resource'}
            </Button>
          </div>
        }
      >
        <form id="resource-form" onSubmit={handleFormSubmit} className="space-y-4">
          {formErrors.submit && (
            <div className="rounded border border-red-900 bg-red-950/20 p-2.5 text-xs text-red-300">{formErrors.submit}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Sheet *</label>
              <select
                className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none"
                value={formData.sheetId}
                onChange={(e) => setFormData({ ...formData, sheetId: e.target.value })}
                required
              >
                <option value="" disabled>Select</option>
                {formSheets.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
              </select>
              {formErrors.sheetId && <p className="mt-1 text-xs text-red-400">{formErrors.sheetId}</p>}
            </div>
            
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Subject *</label>
              <select
                className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none disabled:opacity-50"
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                disabled={!formData.sheetId}
                required
              >
                <option value="" disabled>Select</option>
                {formSubjects.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
              </select>
              {formErrors.subjectId && <p className="mt-1 text-xs text-red-400">{formErrors.subjectId}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Chapter *</label>
              <select
                className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none disabled:opacity-50"
                value={formData.chapterId}
                onChange={(e) => setFormData({ ...formData, chapterId: e.target.value })}
                disabled={!formData.subjectId}
                required
              >
                <option value="" disabled>Select</option>
                {formChapters.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
              {formErrors.chapterId && <p className="mt-1 text-xs text-red-400">{formErrors.chapterId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Title *</label>
              <Input
                placeholder="e.g. Intro to Logic Gates"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              {formErrors.title && <p className="mt-1 text-xs text-red-400">{formErrors.title}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Resource Type *</label>
              <CreatableSelect
                placeholder="Select or type custom..."
                value={formData.resourceType}
                onChange={(val) => setFormData({ ...formData, resourceType: val })}
              />
              {formErrors.resourceType && <p className="mt-1 text-xs text-red-400">{formErrors.resourceType}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Description</label>
            <Textarea
              placeholder="Brief description of the resource..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="rounded border border-zinc-800 p-3 bg-zinc-900/20 space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">External URL</label>
              <Input
                placeholder="https://youtube.com/..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
              {formErrors.url && <p className="mt-1 text-xs text-red-400">{formErrors.url}</p>}
            </div>
            
            <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <span className="h-px bg-zinc-800 flex-1 mr-3" /> OR <span className="h-px bg-zinc-800 flex-1 ml-3" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Storage URL</label>
              <Input
                placeholder="https://storage.supabase.com/..."
                value={formData.storageUrl}
                onChange={(e) => setFormData({ ...formData, storageUrl: e.target.value })}
              />
              {formErrors.storageUrl && <p className="mt-1 text-xs text-red-400">{formErrors.storageUrl}</p>}
            </div>
            {formErrors.urls && <p className="mt-1 text-xs text-red-400 text-center font-medium">{formErrors.urls}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Display Order</label>
              <Input
                type="number"
                placeholder="Auto-assigned if empty"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Status</label>
              <select
                className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
              placeholder="e.g. Video, Theory (comma-separated)"
              value={formData.tagsInput}
              onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
            />
          </div>

          <div className="space-y-2 border-t border-zinc-800 pt-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Dynamic Metadata</label>
              <Button type="button" onClick={() => setFormData(prev => ({...prev, metadataList: [...prev.metadataList, {key: '', value: ''}]}))} size="sm" variant="secondary" className="h-7 px-2.5 text-xs gap-1">
                <Plus size={12} /> Add Field
              </Button>
            </div>
            {formErrors.metadata && <p className="text-xs text-red-400">{formErrors.metadata}</p>}
            
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
              {formData.metadataList.map((m, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input placeholder="Key" value={m.key} onChange={(e) => {
                    const u = [...formData.metadataList];
                    u[idx].key = e.target.value;
                    setFormData({...formData, metadataList: u});
                  }} className="h-8 text-xs" />
                  <Input placeholder="Value" value={m.value} onChange={(e) => {
                    const u = [...formData.metadataList];
                    u[idx].value = e.target.value;
                    setFormData({...formData, metadataList: u});
                  }} className="h-8 text-xs" />
                  <Button type="button" onClick={() => {
                    setFormData(prev => ({...prev, metadataList: prev.metadataList.filter((_, i) => i !== idx)}))
                  }} size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-zinc-300">
                    <Trash2 size={12} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        title="Archive Resource"
        footer={
          <div className="flex justify-end gap-3">
            <Button onClick={() => setIsArchiveModalOpen(false)} variant="secondary" disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleArchiveSubmit} variant="danger" disabled={isSubmitting}>Archive</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex gap-3 text-sm text-zinc-300">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <div>
              Are you sure you want to archive <strong>"{selectedResource?.title}"</strong>?
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Resources;
