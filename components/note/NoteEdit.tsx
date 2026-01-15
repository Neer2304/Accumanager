"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, CircularProgress, Box } from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useNotes } from './hooks/useNotes';
import { useThemeColors } from '@/hooks/useThemeColors';
import { NoteHeader } from './components/NoteHeader';
import { NoteForm } from './components/NoteForm';
import { NoteFormData } from './types/note.types';

export default function NoteEdit() {
  const { id } = useParams();
  const router = useRouter();
  const { noteColors } = useThemeColors();
  const { fetchNote, updateNote } = useNotes();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    content: '',
    summary: '',
    category: 'general',
    priority: 'medium',
    tags: [],
    color: noteColors[0],
    icon: '📝',
    isPublic: false,
    password: '',
    removePassword: false,
  });

  useEffect(() => {
    loadNote();
  }, [id]);

  const loadNote = async () => {
    try {
      setLoading(true);
      setError('');
      const note = await fetchNote(id as string);
      setFormData({
        title: note.title || '',
        content: note.content || '',
        summary: note.summary || '',
        category: note.category || 'general',
        priority: note.priority || 'medium',
        tags: note.tags || [],
        color: note.color || noteColors[0],
        icon: note.icon || '📝',
        isPublic: note.isPublic || false,
        password: '',
        removePassword: false,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof NoteFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError('');
      
      const updateData: any = {
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
        category: formData.category,
        priority: formData.priority,
        tags: formData.tags,
        color: formData.color,
        icon: formData.icon,
        isPublic: formData.isPublic,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }
      if (formData.removePassword) {
        updateData.removePassword = true;
      }

      await updateNote(id as string, updateData);
      router.push(`/note/${id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to update note');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title="Loading...">
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Edit Note">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <NoteHeader
          title="Edit Note"
          noteId={id as string}
          mode="edit"
          loading={saving}
          onSave={handleSubmit}
        />

        <NoteForm
          formData={formData}
          onChange={handleInputChange}
          error={error}
          onErrorClose={() => setError('')}
          mode="edit"
          onSubmit={handleSubmit}
          loading={saving}
        />
      </Container>
    </MainLayout>
  );
}