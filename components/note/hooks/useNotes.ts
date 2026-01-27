"use client";

import { useState, useCallback } from "react";

export interface Note {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  userId: string;
  tags: string[];
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "draft" | "active" | "archived" | "deleted";
  color: string;
  icon: string;
  isPublic: boolean;
  passwordProtected: boolean;
  wordCount: number;
  readTime: number;
  readCount: number;
  editCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface NoteFilters {
  search: string;
  category: string;
  tag: string;
  priority: string;
  status: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  showShared: boolean;
  page: number;
  limit: number;
}

export interface NoteStats {
  totalNotes: number;
  totalWords: number;
  avgWords: number;
  categories: Array<{ _id: string; count: number }>;
  priorities: Array<{ _id: string; count: number }>;
  statuses: Array<{ _id: string; count: number }>;
  recentActivity: Array<{
    _id: string;
    title: string;
    category: string;
    priority: string;
    updatedAt: string;
    editCount: number;
    readCount: number;
  }>;
  dailyNotes: Array<{ _id: string; count: number }>;
  topTags: Array<{ tag: string; count: number }>;
}

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
        if (value !== undefined && value !== "" && value !== null) {
          queryParams.append(key, String(value));
        }
      });

      const response = await fetch(`/api/note?${queryParams}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setNotes(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch notes");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch notes";
      setError(errorMessage);
      console.error("Fetch notes error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

 const fetchNote = useCallback(async (id: string, password?: string) => {
  try {
    console.log(`🔍 useNotes.fetchNote - Starting for ID: ${id}`);
    console.log(`🔐 Password provided?: ${!!password}`);
    console.log(`🔐 Password value: ${password}`);
    
    setLoading(true);
    setError(null);
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (password) {
      headers['x-note-password'] = password;
      console.log(`🔐 Password set in x-note-password header:`, password);
    } else {
      console.log(`🔐 No password provided in request`);
    }

    console.log(`📤 Making request to: /api/note/${id}`);
    console.log(`📤 Headers:`, headers);
    
    const response = await fetch(`/api/note/${id}`, { 
      headers,
      credentials: 'include',
    });
    
    console.log(`📥 Response status: ${response.status}`);
    console.log(`📥 Response ok: ${response.ok}`);
    
    // Check if response is empty
    const responseText = await response.text();
    console.log(`📥 Raw response (first 500 chars):`, responseText.substring(0, 500));
    
    if (!responseText) {
      throw new Error('Empty response from server');
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError);
      console.error('❌ Raw response:', responseText);
      throw new Error('Invalid JSON response from server');
    }
    
    console.log(`📥 Parsed response data:`, data);
    
    if (!data.success) {
      // Check for password-related errors
      if (data.requiresPassword) {
        console.log('❌ API returned: Password required');
        throw new Error('Password required');
      } else if (data.message && data.message.includes('Invalid password')) {
        console.log('❌ API returned: Invalid password');
        throw new Error('Invalid password');
      } else if (data.message && data.message.includes('Note configuration error')) {
        // HANDLE THE SPECIFIC ERROR FROM THE API
        console.log('❌ API returned: Note configuration error');
        throw new Error(
          "This note has incorrect security settings. Please contact support.",
        );
      } else {
        console.log('❌ API returned generic error:', data.message);
        throw new Error(data.message || `Failed to fetch note (${response.status})`);
      }
    }
    
    console.log('✅ Successfully fetched note');
    return data.data;
  } catch (err: any) {
    console.error(`❌ useNotes.fetchNote error:`, err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch note';
    setError(errorMessage);
    throw err;
  } finally {
    setLoading(false);
  }
}, []);

  const createNote = useCallback(async (noteData: Partial<Note>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
        credentials: "include",
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to create note");
      }

      return data.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create note";
      setError(errorMessage);
      console.error("Create note error:", err);
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to update note");
      }

      return data.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update note";
      setError(errorMessage);
      console.error("Update note error:", err);
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
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to delete note");
      }

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete note";
      setError(errorMessage);
      console.error("Delete note error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/note/stats", {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch stats");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch stats";
      setError(errorMessage);
      console.error("Fetch stats error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchNotes = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/note/search?q=${encodeURIComponent(query)}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || "Failed to search notes");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to search notes";
      setError(errorMessage);
      console.error("Search notes error:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkAction = useCallback(
    async (noteIds: string[], action: string, data?: any) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/note/bulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ noteIds, action, data }),
          credentials: "include",
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || "Failed to perform bulk action");
        }

        return result.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to perform bulk action";
        setError(errorMessage);
        console.error("Bulk action error:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const shareNote = useCallback(
    async (noteId: string, userIds: string[], role: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/note/${noteId}/share`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userIds, role }),
          credentials: "include",
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || "Failed to share note");
        }

        return data.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to share note";
        setError(errorMessage);
        console.error("Share note error:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

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
