import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import { BookOpen, Play } from 'lucide-react';

function ContinueLearningCard({ continueLearning }) {
  const navigate = useNavigate();

  if (!continueLearning) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 text-center space-y-4 border border-zinc-800 bg-zinc-900/30">
        <BookOpen size={48} className="text-zinc-600" />
        <h2 className="text-xl font-semibold text-zinc-100">Start Your Journey</h2>
        <p className="text-sm text-zinc-400 max-w-sm">
          You haven't started any learning sheets yet. Browse our library to find the right sheet for you.
        </p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Browse Sheets
        </Button>
      </Card>
    );
  }

  const { sheet, chapter, resource } = continueLearning;

  return (
    <Card className="border border-indigo-500/30 bg-gradient-to-r from-zinc-900/80 to-indigo-950/20 space-y-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <BookOpen size={120} />
      </div>
      <div className="relative z-10">
        <h2 className="text-xl font-semibold text-zinc-100 mb-1">Continue Learning</h2>
        <p className="text-sm text-zinc-400 mb-6">Pick up exactly where you left off.</p>
        
        <div className="space-y-1 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Sheet</p>
          <p className="text-base text-zinc-200">{sheet.title}</p>
        </div>
        
        <div className="space-y-1 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Chapter & Resource</p>
          <p className="text-sm text-zinc-300">{chapter.title} <span className="mx-2 text-zinc-600">&bull;</span> {resource.title}</p>
        </div>

        <Button 
          onClick={() => navigate(`/sheets/${sheet.slug}`)} 
          className="w-full sm:w-auto gap-2 bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          <Play size={16} /> Resume Learning
        </Button>
      </div>
    </Card>
  );
}

export default ContinueLearningCard;
