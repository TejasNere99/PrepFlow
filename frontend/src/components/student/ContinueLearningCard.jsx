import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../ui/DashboardCard';
import Button from '../ui/Button.jsx';
import { BookOpen, Play } from 'lucide-react';

function ContinueLearningCard({ continueLearning }) {
  const navigate = useNavigate();

  if (!continueLearning) {
    return (
      <DashboardCard className="flex flex-col items-center justify-center py-10 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 mb-3">
          <BookOpen size={18} className="text-zinc-500" strokeWidth={1.5} />
        </div>
        <h2 className="text-sm font-medium text-zinc-200">Start Your Journey</h2>
        <p className="text-xs text-zinc-500 max-w-[250px] mt-1 mb-4">
          You haven't started any learning sheets yet.
        </p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-zinc-100 hover:bg-white text-zinc-900 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
          Browse Sheets
        </button>
      </DashboardCard>
    );
  }

  const { sheet, chapter, resource } = continueLearning;

  return (
    <DashboardCard className="relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
            <BookOpen size={20} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-sm font-medium text-zinc-200">Continue Learning</h2>
            <p className="text-xs text-zinc-500">Pick up where you left off</p>
          </div>
        </div>
        
        <div className="space-y-3 mb-5 pl-11">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-0.5">Sheet</p>
            <p className="text-sm text-zinc-200 truncate">{sheet.title}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-0.5">Chapter & Resource</p>
            <p className="text-sm text-zinc-400 truncate">{chapter.title} <span className="mx-1 text-zinc-700">&bull;</span> {resource.title}</p>
          </div>
        </div>

        <div className="pl-11">
          <button 
            onClick={() => navigate(`/sheets/${sheet.slug}`)} 
            className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Play size={16} fill="currentColor" strokeWidth={1.5} /> 
            Resume
          </button>
        </div>
      </div>
    </DashboardCard>
  );
}

export default ContinueLearningCard;
