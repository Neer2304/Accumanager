"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useNotes } from './hooks/useNotes';
import { useThemeColors } from '@/hooks/useThemeColors';
import { NoteHeader } from './components/NoteHeader';
import { NoteForm } from './components/NoteForm';
import { NoteFormData } from './types/note.types';

export default function NoteCreate() {
  const router = useRouter();
  const { noteColors } = useThemeColors();
  const { createNote } = useNotes();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    content: '',
    summary: '',
    category: 'general',
    priority: 'medium',
    tags: [],
    color: noteColors[8],
    icon: '📝',
    isPublic: false,
    password: '',
    removePassword: false,
  });

  const handleInputChange = (field: keyof NoteFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.content.trim()) {
        throw new Error('Content is required');
      }

      await createNote(formData);
      router.push('/notes');
    } catch (err: any) {
      setError(err.message || 'Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Add New Note">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <NoteHeader
          title="Add New Note"
          subTitle="Create a new note to organize your thoughts and ideas"
          mode="create"
          loading={loading}
          onSave={handleSubmit}
        />

        <NoteForm
          formData={formData}
          onChange={handleInputChange}
          error={error}
          onErrorClose={() => setError('')}
          mode="create"
          onSubmit={handleSubmit}
          loading={loading}
        />
      </Container>
    </MainLayout>
  );
}