"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, alpha, useTheme } from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useNotes } from '@/components/note/hooks/useNotes';
import { useThemeColors } from '@/hooks/useThemeColors';
import { NoteHeader } from './NoteHeader';
import { NoteForm } from './NoteForm';
import { NoteFormData } from '@/components/note/types/note.types';

// Import Google-themed components
import { Card } from '@/components/ui/Card';

export default function NoteCreate() {
  const router = useRouter();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
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
      <Box sx={{ 
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        color: darkMode ? '#e8eaed' : '#202124',
        minHeight: '100vh',
      }}>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <NoteHeader
            title="Add New Note"
            subTitle="Create a new note to organize your thoughts and ideas"
            mode="create"
            loading={loading}
            onSave={handleSubmit}
            darkMode={darkMode}
          />

          <NoteForm
            formData={formData}
            onChange={handleInputChange}
            error={error}
            onErrorClose={() => setError('')}
            mode="create"
            onSubmit={handleSubmit}
            loading={loading}
            darkMode={darkMode}
          />
        </Container>
      </Box>
    </MainLayout>
  );
}