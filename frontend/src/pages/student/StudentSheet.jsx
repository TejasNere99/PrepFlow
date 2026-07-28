import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicApi } from '../../services/publicApi.js';
import { progressApi } from '../../services/progressApi.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useProgress } from '../../contexts/ProgressContext.jsx';
import { studentService } from '../../services/studentService.js';
import ChapterAccordion from '../../components/student/ChapterAccordion.jsx';
import ProgressBar from '../../components/ui/ProgressBar.jsx';

function StudentSheet() {
  const { user } = useAuth();
  const { lastUpdated } = useProgress();
  const { sheetSlug } = useParams();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [activeSubjectId, setActiveSubjectId] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [progress, setProgress] = useState(null);
  const [preferences, setPreferences] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        setLoading(true);
        // Fetch Sheet
        const sheetResponse = await publicApi.getSheetBySlug(sheetSlug);
        const sheetData = sheetResponse.data;
        setSheet(sheetData);

        // Fetch Subjects
        const subjectsResponse = await publicApi.getSubjects(sheetData._id, { limit: 100 });
        const subjectsData = subjectsResponse.data || [];
        setSubjects(subjectsData);

        if (subjectsData.length > 0) {
          setActiveSubjectId(subjectsData[0]._id);
        }

        if (user && user.role === 'STUDENT') {
          // progress is fetched separately
        }
      } catch (err) {
        setError('Failed to load sheet details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSheetData();
  }, [sheetSlug]);

  useEffect(() => {
    if (sheet && user && user.role === 'STUDENT') {
      const fetchProgress = async () => {
        try {
          const progressRes = await progressApi.getSheetProgress(sheet._id);
          setProgress(progressRes.data.data);
        } catch (e) {
          console.error('Failed to load progress', e);
        }
      };
      
      const fetchPreferences = async () => {
        try {
          const prefs = await studentService.getPreferences();
          setPreferences(prefs);
        } catch (e) {
          console.error('Failed to load preferences', e);
        }
      };

      fetchProgress();
      fetchPreferences();
    }
  }, [sheet, user, lastUpdated]);

  useEffect(() => {
    if (activeSubjectId) {
      const fetchChapters = async () => {
        try {
          const response = await publicApi.getChapters(activeSubjectId, { limit: 100 });
          setChapters(response.data || []);
        } catch (err) {
          console.error('Failed to load chapters:', err);
        }
      };
      fetchChapters();
    }
  }, [activeSubjectId]);

  if (loading) {
    return <div className="py-12 text-center text-zinc-400">Loading sheet details...</div>;
  }

  if (error || !sheet) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-red-500">{error || 'Sheet not found.'}</p>
        <button onClick={() => navigate('/')} className="text-indigo-400 hover:underline">
          &larr; Back to Home
        </button>
      </div>
    );
  }

  // Filter chapters based on search query
  const filteredChapters = chapters.filter(chapter => {
    if (!searchQuery) return true;
    const matchTitle = chapter.title.toLowerCase().includes(searchQuery.toLowerCase());
    // Also include chapter if resources inside might match (handled in accordion, but here we just show all chapters that might match or rely on accordion filtering)
    // For a deeper search, we would need to pre-fetch all resources. 
    // Since we fetch resources on demand, local search is restricted to chapter titles for now, 
    // OR we just pass the query down to the accordion and always show the accordion if query exists.
    return matchTitle || true; 
  });

  return (
    <div className="py-4">
      {/* Top Section */}
      <div className="mb-8">
        <button onClick={() => navigate('/')} className="mb-4 text-sm font-medium text-zinc-400 hover:text-white flex items-center">
          &larr; Back to Sheets
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{sheet.title}</h1>
            {sheet.description && (
              <p className="mt-3 text-lg text-zinc-400">{sheet.description}</p>
            )}
            {sheet.tags && sheet.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {sheet.tags.map((tag, i) => (
                  <span key={i} className="rounded-full bg-zinc-800 px-3 py-1 text-sm font-medium text-zinc-300">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          {sheet.metadata?.estimatedHours && (
            <div className="hidden sm:block shrink-0 text-right">
              <span className="inline-block rounded-full bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-400">
                ~ {sheet.metadata.estimatedHours} Hours
              </span>
            </div>
          )}
        </div>
        {progress?.sheetProgress && (
          <div className="mt-6 max-w-md">
            <ProgressBar value={progress.sheetProgress.percentage} label="Sheet Progress" />
          </div>
        )}
      </div>

      <hr className="my-8 border-zinc-800" />

      {/* Content Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Subject Tabs */}
          <div className="flex space-x-1 overflow-x-auto rounded-lg bg-zinc-900/50 p-1 shrink-0 max-w-full">
            {subjects.map((subject) => (
              <button
                key={subject._id}
                onClick={() => setActiveSubjectId(subject._id)}
                className={`flex-none rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeSubjectId === subject._id
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{subject.title}</span>
                  {progress?.subjectProgress && progress.subjectProgress[subject._id] && (
                    <span className="text-xs text-zinc-500 bg-zinc-900 px-1.5 rounded-full">
                      {progress.subjectProgress[subject._id].percentage}%
                    </span>
                  )}
                </div>
              </button>
            ))}
            {subjects.length === 0 && (
              <span className="px-4 py-2 text-sm text-zinc-500">No subjects found.</span>
            )}
          </div>

          {/* Local Search */}
          <div className="relative w-full sm:max-w-xs shrink-0">
            <input
              type="text"
              placeholder="Search chapters & resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border-0 bg-zinc-900 py-2 pl-10 pr-4 text-white shadow-sm ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        {activeSubjectId && (
          <div className="space-y-4">
            {filteredChapters.map((chapter) => (
              <ChapterAccordion 
                key={chapter._id} 
                chapter={chapter} 
                searchQuery={searchQuery} 
                chapterProgress={progress?.chapterProgress?.[chapter._id]}
                preferences={preferences}
                onPreferenceChange={(newPref) => {
                  setPreferences(prev => {
                    const idx = prev.findIndex(p => p.resourceId === newPref.resourceId);
                    if (idx >= 0) {
                      const newArr = [...prev];
                      newArr[idx] = { ...newArr[idx], ...newPref };
                      return newArr;
                    }
                    return [...prev, { resourceId: newPref.resourceId, ...newPref }];
                  });
                }}
              />
            ))}
            {chapters.length === 0 && (
              <div className="py-8 text-center text-zinc-500">
                No chapters available for this subject.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentSheet;
