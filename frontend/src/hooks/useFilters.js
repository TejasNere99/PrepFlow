import { useState, useEffect } from 'react';
import * as sheetService from '../services/sheetService';
import * as subjectService from '../services/subjectService';
import * as chapterService from '../services/chapterService';

/**
 * Manages cascading filters for Sheets -> Subjects -> Chapters
 * @param {boolean} fetchInitialSheets - Whether to fetch sheets on mount
 */
export function useFilters(fetchInitialSheets = true) {
  const [sheets, setSheets] = useState([]);
  const [selectedSheetId, setSelectedSheetId] = useState('');
  
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  
  const [chapters, setChapters] = useState([]);
  const [selectedChapterId, setSelectedChapterId] = useState('');

  // Initial Fetch
  useEffect(() => {
    if (fetchInitialSheets) {
      loadSheets();
    }
  }, [fetchInitialSheets]);

  // Sheets -> Subjects
  useEffect(() => {
    if (selectedSheetId) {
      loadSubjects(selectedSheetId);
    } else {
      setSubjects([]);
      setSelectedSubjectId('');
      setChapters([]);
      setSelectedChapterId('');
    }
  }, [selectedSheetId]);

  // Subjects -> Chapters
  useEffect(() => {
    if (selectedSubjectId) {
      loadChapters(selectedSubjectId);
    } else {
      setChapters([]);
      setSelectedChapterId('');
    }
  }, [selectedSubjectId]);

  const loadSheets = async () => {
    try {
      const response = await sheetService.getSheets({ page: 1, limit: 100, status: 'ACTIVE', sort: 'order' });
      setSheets(response.data || []);
    } catch (err) {
      console.error('Failed to load filter sheets:', err);
    }
  };

  const loadSubjects = async (sheetId) => {
    try {
      const response = await subjectService.getSubjects({ page: 1, limit: 100, status: 'ACTIVE', sheetId, sort: 'order' });
      const data = response.data || [];
      setSubjects(data);
      if (data.length > 0) {
        setSelectedSubjectId(data[0]._id);
      } else {
        setSelectedSubjectId('');
      }
    } catch (err) {
      console.error('Failed to load filter subjects:', err);
    }
  };

  const loadChapters = async (subjectId) => {
    try {
      const response = await chapterService.getChapters({ page: 1, limit: 100, status: 'ACTIVE', subjectId, sort: 'order' });
      const data = response.data || [];
      setChapters(data);
      if (data.length > 0) {
        setSelectedChapterId(data[0]._id);
      } else {
        setSelectedChapterId('');
      }
    } catch (err) {
      console.error('Failed to load filter chapters:', err);
    }
  };

  return {
    sheets,
    selectedSheetId,
    setSelectedSheetId,
    
    subjects,
    selectedSubjectId,
    setSelectedSubjectId,
    
    chapters,
    selectedChapterId,
    setSelectedChapterId,

    // Expose load functions in case a manual trigger is needed
    loadSheets,
    loadSubjects,
    loadChapters,
  };
}
