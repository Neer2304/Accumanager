import { Note, NoteFilters } from './useNotes';

export const useNoteUtils = () => {
  const getFilteredNotes = (notes: Note[], filters: NoteFilters): Note[] => {
    let filtered = [...notes];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower) ||
        note.summary?.toLowerCase().includes(searchLower) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(note => note.category === filters.category);
    }

    // Apply tag filter
    if (filters.tag) {
      filtered = filtered.filter(note => note.tags.includes(filters.tag));
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter(note => note.priority === filters.priority);
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(note => note.status === filters.status);
    }

    // Apply public/private filter
    if (filters.isPublic !== undefined) {
      filtered = filtered.filter(note => note.isPublic === filters.isPublic);
    }

    // Apply date range filter
    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom);
      filtered = filtered.filter(note => new Date(note.createdAt) >= dateFrom);
    }

    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      filtered = filtered.filter(note => new Date(note.createdAt) <= dateTo);
    }

    // Apply password filter
    if (filters.hasPassword !== undefined) {
      filtered = filtered.filter(note => note.passwordProtected === filters.hasPassword);
    }

    // Sort notes
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const order = filters.sortOrder === 'asc' ? 1 : -1;
        
        switch (filters.sortBy) {
          case 'title':
            return order * a.title.localeCompare(b.title);
          case 'createdAt':
            return order * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          case 'updatedAt':
            return order * (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
          case 'priority':
            const priorityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
            return order * (priorityOrder[a.priority] - priorityOrder[b.priority]);
          case 'wordCount':
            return order * (a.wordCount - b.wordCount);
          case 'readCount':
            return order * (a.readCount - b.readCount);
          default:
            return 0;
        }
      });
    }

    return filtered;
  };

  const getNoteStats = (notes: Note[]) => {
    const totalNotes = notes.length;
    const totalWords = notes.reduce((sum, note) => sum + note.wordCount, 0);
    const avgWords = totalNotes > 0 ? totalWords / totalNotes : 0;

    const categories: Record<string, number> = {};
    const priorities: Record<string, number> = {};
    const statuses: Record<string, number> = {};
    const tags: Record<string, number> = {};

    notes.forEach(note => {
      categories[note.category] = (categories[note.category] || 0) + 1;
      priorities[note.priority] = (priorities[note.priority] || 0) + 1;
      statuses[note.status] = (statuses[note.status] || 0) + 1;
      
      note.tags.forEach(tag => {
        tags[tag] = (tags[tag] || 0) + 1;
      });
    });

    const topTags = Object.entries(tags)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const recentActivity = notes
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map(note => ({
        _id: note._id,
        title: note.title,
        category: note.category,
        priority: note.priority,
        updatedAt: note.updatedAt,
        editCount: note.editCount,
        readCount: note.readCount,
      }));

    // Group by date (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyNotes: Record<string, number> = {};
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dailyNotes[dateString] = 0;
    }

    notes.forEach(note => {
      const noteDate = new Date(note.createdAt).toISOString().split('T')[0];
      if (dailyNotes[noteDate] !== undefined) {
        dailyNotes[noteDate]++;
      }
    });

    return {
      totalNotes,
      totalWords,
      avgWords,
      categories: Object.entries(categories).map(([_id, count]) => ({ _id, count })),
      priorities: Object.entries(priorities).map(([_id, count]) => ({ _id, count })),
      statuses: Object.entries(statuses).map(([_id, count]) => ({ _id, count })),
      topTags,
      recentActivity,
      dailyNotes: Object.entries(dailyNotes).map(([_id, count]) => ({ _id, count })),
    };
  };

  const generateNoteExport = (notes: Note[], format: 'json' | 'csv' | 'txt'): string => {
    switch (format) {
      case 'json':
        return JSON.stringify(notes, null, 2);
      
      case 'csv':
        const headers = ['Title', 'Content', 'Category', 'Priority', 'Tags', 'Created At', 'Updated At', 'Word Count'];
        const rows = notes.map(note => [
          `"${note.title.replace(/"/g, '""')}"`,
          `"${note.content.replace(/"/g, '""')}"`,
          `"${note.category}"`,
          `"${note.priority}"`,
          `"${note.tags.join(',')}"`,
          `"${note.createdAt}"`,
          `"${note.updatedAt}"`,
          `"${note.wordCount}"`,
        ]);
        return [headers.join(','), ...rows].join('\n');
      
      case 'txt':
        return notes.map(note => 
          `Title: ${note.title}\n` +
          `Category: ${note.category}\n` +
          `Priority: ${note.priority}\n` +
          `Tags: ${note.tags.join(', ')}\n` +
          `Created: ${new Date(note.createdAt).toLocaleDateString()}\n` +
          `Updated: ${new Date(note.updatedAt).toLocaleDateString()}\n` +
          `Words: ${note.wordCount}\n` +
          `Content:\n${note.content}\n` +
          `---\n\n`
        ).join('');
      
      default:
        return '';
    }
  };

  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const extractTagsFromContent = (content: string): string[] => {
    const tagRegex = /#(\w+)/g;
    const matches = content.match(tagRegex) || [];
    return [...new Set(matches.map(tag => tag.substring(1)))];
  };

  const validateNote = (note: Partial<Note>): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!note.title?.trim()) {
      errors.push('Title is required');
    }

    if (!note.content?.trim()) {
      errors.push('Content is required');
    }

    if (note.title && note.title.length > 200) {
      errors.push('Title must be less than 200 characters');
    }

    if (note.content && note.content.length > 10000) {
      errors.push('Content must be less than 10,000 characters');
    }

    if (note.tags && note.tags.some(tag => tag.length > 50)) {
      errors.push('Tags must be less than 50 characters each');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  };

  return {
    getFilteredNotes,
    getNoteStats,
    generateNoteExport,
    calculateReadTime,
    extractTagsFromContent,
    validateNote,
  };
};