import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicApi } from '../../services/publicApi.js';
import { progressApi } from '../../services/progressApi.js';
import { studentService } from '../../services/studentService.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Breadcrumb from '../../components/ui/Breadcrumb.jsx';
import ResourceActions from '../../components/student/actions/ResourceActions.jsx';
import { ExternalLink, PlayCircle } from 'lucide-react';

function StudentResource() {
  const { resourceSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resource, setResource] = useState(null);
  const [related, setRelated] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        const res = await publicApi.getResourceBySlug(resourceSlug);
        const resourceData = res.data;
        setResource(resourceData);

        // Fetch Related
        if (resourceData._id) {
          const relRes = await publicApi.getRelatedResources(resourceData._id);
          setRelated(relRes.data || []);
          
          // Log Activity (fire and forget)
          try {
            await progressApi.upsertProgress(resourceData._id, {});
          } catch (e) {
            console.error('Failed to log activity', e);
          }
        }
        // Fetch Preferences if user is logged in
        if (user && resourceData._id) {
          try {
            const prefs = await studentService.getPreferences();
            const myPref = prefs.find(p => p.resourceId === resourceData._id);
            if (myPref) setPreferences(myPref);
          } catch (e) {
            console.error('Failed to fetch preferences', e);
          }
        }
      } catch (err) {
        console.error('Failed to fetch resource', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [resourceSlug, user]);

  if (loading) return <div className="py-20 text-center text-zinc-500">Loading resource...</div>;
  if (!resource) return <div className="py-20 text-center text-zinc-500">Resource not found</div>;

  const breadcrumbItems = [
    { label: resource.chapterId?.subjectId?.sheetId?.title, href: `/sheets/${resource.chapterId?.subjectId?.sheetId?.slug}` },
    { label: resource.chapterId?.subjectId?.title },
    { label: resource.chapterId?.title },
    { label: resource.title }
  ];

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div>
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-3xl font-bold text-white mt-4">{resource.title}</h1>
        {resource.description && (
          <p className="mt-2 text-zinc-400">{resource.description}</p>
        )}
        
        {user && resource && (
          <ResourceActions 
            resourceId={resource._id}
            preferences={preferences}
            onPreferenceChange={(newPrefs) => setPreferences(prev => ({...prev, ...newPrefs}))}
          />
        )}
      </div>

      {/* Resource Viewer Container */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl min-h-[50vh] flex flex-col items-center justify-center relative p-8">
        
        {/* Dynamic Viewer Based on Type */}
        <div className="text-center space-y-6 max-w-lg">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
            <PlayCircle size={32} />
          </div>
          <h2 className="text-xl font-semibold text-zinc-100">Ready to learn?</h2>
          <p className="text-zinc-400 text-sm">
            This resource is hosted externally. Click below to open it in a new tab.
          </p>
          <div className="flex justify-center gap-4">
            {resource.url && (
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
              >
                <span>Open Resource</span>
                <ExternalLink size={18} />
              </a>
            )}
            {resource.storageUrl && (
              <a 
                href={resource.storageUrl} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
              >
                <span>Download File</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Related Resources */}
      {related.length > 0 && (
        <div className="pt-8">
          <h3 className="text-lg font-semibold text-zinc-100 mb-6">Related Resources</h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {related.map(rel => (
              <button 
                key={rel._id}
                onClick={() => navigate(`/resources/${rel.slug}`)}
                className="text-left p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-zinc-200 group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                </div>
                <div className="mt-3 text-xs uppercase tracking-wider font-semibold text-zinc-500">
                  {rel.type}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentResource;
