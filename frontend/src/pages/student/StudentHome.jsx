import { useState, useEffect } from 'react';
import { publicApi } from '../../services/publicApi.js';
import SheetCard from '../../components/student/SheetCard.jsx';

function StudentHome() {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const response = await publicApi.getSheets({ limit: 100 });
        setSheets(response.data || []);
      } catch (err) {
        setError('Failed to load learning sheets.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg font-medium text-zinc-400">Loading sheets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg font-medium text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Stop Searching. Start Studying.
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-400">
          Select a learning sheet below to access organized study resources, hand-picked for your preparation.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sheets.map((sheet) => (
          <SheetCard key={sheet._id} sheet={sheet} />
        ))}
        {sheets.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500">
            No active sheets available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentHome;
