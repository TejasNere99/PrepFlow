import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentService } from '../../../services/studentService';
import { Edit2, Trash2, X, Folder, FileText } from 'lucide-react';
import ListItem from '../../ui/ListItem';
import IconButton from '../../ui/IconButton';
import EmptyState from '../../ui/EmptyState';

const CollectionDetailsModal = ({ collection, onClose, onCollectionDeleted, onCollectionRenamed }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(collection.name);

  useEffect(() => {
    fetchItems();
  }, [collection._id]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await studentService.getCollectionItems(collection._id);
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch items', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (e) => {
    e.preventDefault();
    if (!editName.trim() || editName === collection.name) {
      setIsEditing(false);
      return;
    }
    try {
      await studentService.renameCollection(collection._id, editName);
      onCollectionRenamed(collection._id, editName);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to rename collection', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this collection?')) return;
    try {
      await studentService.deleteCollection(collection._id);
      onCollectionDeleted(collection._id);
    } catch (error) {
      console.error('Failed to delete collection', error);
    }
  };

  const handleRemoveItem = async (resourceId) => {
    try {
      await studentService.removeResourceFromCollection(collection._id, resourceId);
      setItems(items.filter(item => item.resourceId._id !== resourceId));
    } catch (error) {
      console.error('Failed to remove item', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800/60 rounded-xl shadow-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center p-5 border-b border-zinc-800/60">
          {isEditing ? (
            <form onSubmit={handleRename} className="flex gap-2 flex-1 mr-4">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                autoFocus
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-zinc-100 focus:outline-none text-sm font-medium"
              />
              <button type="submit" className="px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-lg text-sm font-medium transition-colors">
                Save
              </button>
              <button type="button" onClick={() => { setIsEditing(false); setEditName(collection.name); }} className="px-3 py-1.5 bg-transparent border border-zinc-700 hover:bg-zinc-900 text-zinc-300 rounded-lg text-sm transition-colors">
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-3">
              <h3 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                <Folder size={18} className="text-zinc-500" />
                {collection.name}
              </h3>
              <div className="flex items-center ml-2 gap-1">
                <IconButton 
                  icon={Edit2} 
                  onClick={() => setIsEditing(true)} 
                  label="Rename Collection"
                  className="w-8 h-8"
                />
                <IconButton 
                  icon={Trash2} 
                  onClick={handleDelete} 
                  label="Delete Collection"
                  className="w-8 h-8 text-zinc-500 hover:text-rose-400"
                />
              </div>
            </div>
          )}
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors p-1.5 hover:bg-zinc-900 rounded-md">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="px-5 pt-4 pb-2">
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Resources ({items.length})
            </h4>
          </div>
          
          {loading ? (
            <div className="text-sm text-zinc-500 animate-pulse text-center py-8">Loading resources...</div>
          ) : items.length === 0 ? (
            <div className="py-4">
              <EmptyState 
                icon={FileText}
                title="Collection is empty"
                description="Add resources to this collection from the dashboard or resource page."
              />
            </div>
          ) : (
            <div className="flex flex-col border-t border-zinc-800/40">
              {items.map((item) => (
                <ListItem 
                  key={item._id}
                  title={item.resourceId.title}
                  subtitle={item.resourceId.resourceType}
                  icon={FileText}
                  className="px-5 hover:bg-zinc-900/50"
                  action={
                    <IconButton 
                      icon={Trash2} 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item.resourceId._id);
                      }}
                      label="Remove from collection"
                      className="w-8 h-8 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800"
                    />
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionDetailsModal;
