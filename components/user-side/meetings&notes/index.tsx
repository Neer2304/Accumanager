// app/components/user-side/meetings&notes/index.tsx
"use client";

import React from 'react';
import { AuthCheck } from './components/AuthCheck';
import { MainMeetingsPage } from './MainMeetingsPage';

export default function MeetingsNotesPage() {
  return (
    <AuthCheck>
      <MainMeetingsPage />
    </AuthCheck>
  );
}