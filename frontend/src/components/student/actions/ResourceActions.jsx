import React, { useState } from 'react';
import ActionButtons from './ActionButtons';
import NotesEditor from './NotesEditor';
import CollectionModal from './CollectionModal';
import RevisionPlannerModal from './RevisionPlannerModal';
import { FileText, FolderPlus, CalendarClock } from 'lucide-react';
import IconButton from '../../ui/IconButton';

const ResourceActions = ({ resourceId, preferences, onPreferenceChange }) => {
  const [activeAction, setActiveAction] = useState(null);

  const toggleAction = (action) => {
    setActiveAction((prev) => (prev === action ? null : action));
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex items-center gap-2">
        <ActionButtons 
          resourceId={resourceId} 
          preferences={preferences} 
          onChange={onPreferenceChange}
        />
        <div className="h-4 w-px bg-zinc-800 mx-1 hidden sm:block"></div>
        <div className="flex items-center gap-1">
          <IconButton
            icon={FileText}
            active={activeAction === 'notes'}
            activeColorClass="text-zinc-100 bg-zinc-800/80 border-zinc-700"
            label="Personal Notes"
            onClick={() => toggleAction('notes')}
          />
          <IconButton
            icon={FolderPlus}
            active={activeAction === 'collection'}
            activeColorClass="text-zinc-100 bg-zinc-800/80 border-zinc-700"
            label="Add to Collection"
            onClick={() => toggleAction('collection')}
          />
          <IconButton
            icon={CalendarClock}
            active={activeAction === 'revision'}
            activeColorClass="text-zinc-100 bg-zinc-800/80 border-zinc-700"
            label="Schedule Revision"
            onClick={() => toggleAction('revision')}
          />
        </div>
      </div>

      {activeAction && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-150">
          {activeAction === 'notes' && <NotesEditor resourceId={resourceId} />}
          {activeAction === 'collection' && <CollectionModal resourceId={resourceId} onClose={() => setActiveAction(null)} />}
          {activeAction === 'revision' && <RevisionPlannerModal resourceId={resourceId} onClose={() => setActiveAction(null)} />}
        </div>
      )}
    </div>
  );
};

export default ResourceActions;
