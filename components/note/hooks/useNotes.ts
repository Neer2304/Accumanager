import { useState, useCallback } from 'react';
import { Note, NoteStats, NoteFilters } from '../types';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<NoteStats | null>(null);

  const fetchNotes = useCallback(async (filters: Partial<NoteFilters> = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      });

      const response = await fetch(`/api/note?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch notes');
      
      const data = await response.json();
      if (data.success) {
        setNotes(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNote = useCallback(async (id: string, password?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const headers: HeadersInit = {};
      if (password) {
        headers['x-note-password'] = password;
      }

      const response = await fetch(`/api/note/${id}`, { headers });
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }
      
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(async (noteData: Partial<Note>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });
      
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/note/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/note/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/note/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchNotes = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/note/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search notes');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkAction = useCallback(async (noteIds: string[], action: string, data?: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/note/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteIds, action, data }),
      });
      
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform bulk action');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const shareNote = useCallback(async (noteId: string, userIds: string[], role: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/note/${noteId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds, role }),
      });
      
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    notes,
    loading,
    error,
    stats,
    fetchNotes,
    fetchNote,
    createNote,
    updateNote,
    deleteNote,
    fetchStats,
    searchNotes,
    bulkAction,
    shareNote,
    setError,
  };
};