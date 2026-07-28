import React, { useState, useEffect } from 'react';
import { studentService } from '../../../services/studentService';
import { X, FolderPlus } from 'lucide-react';

const CollectionModal = ({ resourceId, onClose }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const data = await studentService.getCollections();
      setCollections(data);
    } catch (error) {
      console.error('Failed to fetch collections', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    
    try {
      setCreating(true);
      await studentService.createCollection(newCollectionName);
      setNewCollectionName('');
      await fetchCollections();
    } catch (error) {
      console.error('Failed to create collection', error);
    } finally {
      setCreating(false);
    }
  };

  const handleAddToCollection = async (collectionId) => {
    try {
      await studentService.addResourceToCollection(collectionId, resourceId);
      // Optional: show a toast notification
      onClose();
    } catch (error) {
      console.error('Failed to add to collection', error);
    }
  };

  return (
    <div className="mt-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/60 animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-medium text-zinc-200">Save to Collection</h4>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleCreateCollection} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          placeholder="New collection name..."
          className="flex-1 bg-zinc-900 border border-zinc-800/60 rounded-lg px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
        />
        <button
          type="submit"
          disabled={creating || !newCollectionName.trim()}
          className="bg-zinc-100 hover:bg-white text-zinc-900 px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
        >
          Create
        </button>
      </form>

      {loading ? (
        <div className="text-sm text-zinc-500 text-center py-4">Loading collections...</div>
      ) : collections.length === 0 ? (
        <div className="text-sm text-zinc-500 text-center py-4">No collections yet. Create one above!</div>
      ) : (
        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
          {collections.map(c => (
            <button
              key={c._id}
              onClick={() => handleAddToCollection(c._id)}
              className="flex items-center gap-2 px-3 py-2 bg-transparent hover:bg-zinc-900/50 rounded-lg text-sm text-zinc-300 hover:text-zinc-100 transition-colors border border-transparent hover:border-zinc-800/60"
            >
              <FolderPlus size={14} className="text-zinc-500" />
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionModal;
