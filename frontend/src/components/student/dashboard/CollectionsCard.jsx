import React, { useState, useEffect } from 'react';
import { studentService } from '../../../services/studentService';
import CollectionDetailsModal from './CollectionDetailsModal';
import { Folder } from 'lucide-react';
import DashboardCard from '../../ui/DashboardCard';
import EmptyState from '../../ui/EmptyState';

const CollectionsCard = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await studentService.getCollections();
        setCollections(data);
      } catch (error) {
        console.error('Failed to load collections', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  const handleCollectionDeleted = (id) => {
    setCollections(collections.filter(c => c._id !== id));
    setSelectedCollection(null);
  };

  const handleCollectionRenamed = (id, newName) => {
    setCollections(collections.map(c => c._id === id ? { ...c, name: newName } : c));
  };

  return (
    <DashboardCard>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-zinc-100 flex items-center gap-2">
          <Folder size={16} className="text-zinc-500" />
          Collections
        </h3>
      </div>
      
      {loading ? (
        <div className="text-xs text-zinc-500 animate-pulse">Loading...</div>
      ) : collections.length === 0 ? (
        <EmptyState 
          icon={Folder}
          title="No collections"
          description="Group related resources together."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {collections.map(c => (
            <div 
              key={c._id}
              onClick={() => setSelectedCollection(c)}
              className="flex items-center gap-2 text-sm text-zinc-300 truncate bg-zinc-900 border border-zinc-800/60 p-3 rounded-lg hover:border-zinc-700 hover:bg-zinc-800/50 cursor-pointer transition-colors"
            >
              <Folder size={14} className="text-zinc-500 shrink-0" />
              <div className="font-medium truncate">{c.name}</div>
            </div>
          ))}
        </div>
      )}

      {selectedCollection && (
        <CollectionDetailsModal 
          collection={selectedCollection}
          onClose={() => setSelectedCollection(null)}
          onCollectionDeleted={handleCollectionDeleted}
          onCollectionRenamed={handleCollectionRenamed}
        />
      )}
    </DashboardCard>
  );
};

export default CollectionsCard;
