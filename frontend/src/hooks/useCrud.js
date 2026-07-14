import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';

/**
 * A generic hook for managing CRUD state and operations.
 * 
 * @param {Object} options 
 * @param {Function} options.fetchDataFn - API call to fetch items (returns a promise)
 * @param {Function} options.createFn - API call to create an item
 * @param {Function} options.updateFn - API call to update an item
 * @param {Function} options.archiveFn - API call to archive an item
 * @param {Function} options.getInitialFormData - Function returning initial form state
 * @param {Function} options.mapItemToFormData - Function mapping a selected item to form state
 */
export function useCrud({
  fetchDataFn,
  createFn,
  updateFn,
  archiveFn,
  getInitialFormData,
  mapItemToFormData,
}) {
  // List State
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Filters State
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [activeTab, setActiveTab] = useState('all');

  // Modals & Selection State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState(getInitialFormData ? getInitialFormData() : {});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Expose fetch function so it can be called explicitly (e.g. in useEffect in component)
  const fetchItems = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const defaultParams = {
        page: 1,
        limit: 100,
        status: activeTab,
        sort: 'order',
      };
      if (debouncedSearch.trim()) {
        defaultParams.search = debouncedSearch.trim();
      }
      const response = await fetchDataFn({ ...defaultParams, ...params });
      setItems(response.data || []);
    } catch (err) {
      console.error('Failed to load items:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [fetchDataFn, activeTab, debouncedSearch]);

  const handleOpenCreate = (overrides = {}) => {
    setSelectedItem(null);
    const initialData = getInitialFormData ? getInitialFormData() : {};
    setFormData({ ...initialData, ...overrides });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    if (mapItemToFormData) {
      setFormData(mapItemToFormData(item));
    } else {
      setFormData(item);
    }
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenArchive = (item) => {
    setSelectedItem(item);
    setIsArchiveModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setFormErrors({});
    try {
      if (selectedItem && updateFn) {
        await updateFn(selectedItem._id, payload);
      } else if (createFn) {
        await createFn(payload);
      }
      setIsFormModalOpen(false);
      await fetchItems();
    } catch (err) {
      console.error('Submit error:', err);
      setFormErrors({
        submit: err.response?.data?.message || err.message || 'Failed to save item.',
      });
      return false; // Indicates failure
    } finally {
      setIsSubmitting(false);
    }
    return true; // Indicates success
  };

  const handleArchiveSubmit = async () => {
    if (!selectedItem || !archiveFn) return;
    setIsSubmitting(true);
    try {
      await archiveFn(selectedItem._id);
      setIsArchiveModalOpen(false);
      await fetchItems();
    } catch (err) {
      console.error('Archive error:', err);
      alert('Failed to archive item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    items,
    loading,
    error,
    
    search,
    setSearch,
    debouncedSearch,
    activeTab,
    setActiveTab,

    isFormModalOpen,
    setIsFormModalOpen,
    isArchiveModalOpen,
    setIsArchiveModalOpen,
    selectedItem,

    formData,
    setFormData,
    formErrors,
    setFormErrors,
    isSubmitting,

    fetchItems,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenArchive,
    handleSubmit,
    handleArchiveSubmit,
  };
}
