// components/admin/blog/RichTextEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import { Box, useTheme } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Title,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from '@mui/icons-material';
import { TextStyle } from '@tiptap/extension-text-style';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  darkMode: boolean;
}

export default function RichTextEditor({ content, onChange, darkMode }: RichTextEditorProps) {
  const theme = useTheme();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'editor-link' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'editor-image' },
      }),
      TextStyle,
      Color,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        style: 'min-height: 400px; padding: 1.25rem 1.5rem;',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  // ── Design tokens ──────────────────────────────────────────────────────────
  const border   = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const toolBg   = darkMode ? '#1e2027' : '#f8f9fb'
  const editorBg = darkMode ? '#16181d' : '#ffffff'
  const activeBg = darkMode ? 'rgba(26,115,232,0.18)' : 'rgba(26,115,232,0.10)'
  const activeColor = '#1a73e8'
  const btnBase  = {
    width: 32, height: 32,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 6,
    border: 'none',
    background: 'transparent',
    color: darkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontSize: 15,
  } as React.CSSProperties

  // ── Toolbar button component ───────────────────────────────────────────────
  const Btn = ({
    onClick, active, title, children,
  }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
    <button
      onMouseDown={e => { e.preventDefault(); onClick() }}
      title={title}
      style={{
        ...btnBase,
        background: active ? activeBg : 'transparent',
        color: active ? activeColor : btnBase.color,
        boxShadow: active ? `inset 0 0 0 1px ${activeColor}44` : 'none',
      }}
      onMouseEnter={e => {
        if (!active) (e.currentTarget as HTMLButtonElement).style.background = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'
      }}
      onMouseLeave={e => {
        if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
      }}
    >
      {children}
    </button>
  )

  // ── Divider ────────────────────────────────────────────────────────────────
  const Sep = () => (
    <div style={{
      width: 1, height: 20, margin: '0 4px',
      background: border, flexShrink: 0,
    }} />
  )

  // ── Heading button with number badge ──────────────────────────────────────
  const HBtn = ({ level }: { level: 1 | 2 | 3 }) => (
    <Btn
      title={`Heading ${level}`}
      active={editor.isActive('heading', { level })}
      onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Title style={{ fontSize: 14 }} />
        <span style={{ fontSize: 10, fontWeight: 700, lineHeight: 1, marginTop: 1 }}>{level}</span>
      </span>
    </Btn>
  )

  return (
    <Box sx={{
      border: `1px solid ${border}`,
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundColor: editorBg,
      boxShadow: darkMode
        ? '0 2px 12px rgba(0,0,0,0.3)'
        : '0 1px 6px rgba(0,0,0,0.06)',
    }}>

      {/* ── Toolbar ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        padding: '8px 12px',
        background: toolBg,
        borderBottom: `1px solid ${border}`,
      }}>

        {/* Text format group */}
        <Btn title="Bold (Ctrl+B)" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <FormatBold style={{ fontSize: 16 }} />
        </Btn>
        <Btn title="Italic (Ctrl+I)" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FormatItalic style={{ fontSize: 16 }} />
        </Btn>
        <Btn title="Underline (Ctrl+U)" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <FormatUnderlined style={{ fontSize: 16 }} />
        </Btn>

        <Sep />

        {/* List group */}
        <Btn title="Bullet List" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <FormatListBulleted style={{ fontSize: 16 }} />
        </Btn>
        <Btn title="Numbered List" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <FormatListNumbered style={{ fontSize: 16 }} />
        </Btn>

        <Sep />

        {/* Heading group */}
        <HBtn level={1} />
        <HBtn level={2} />
        <HBtn level={3} />

        <Sep />

        {/* Insert group */}
        <Btn title="Add Link" onClick={addLink}>
          <LinkIcon style={{ fontSize: 15 }} />
        </Btn>
        <Btn title="Add Image" onClick={addImage}>
          <ImageIcon style={{ fontSize: 15 }} />
        </Btn>
        <Btn title="Code Block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <Code style={{ fontSize: 15 }} />
        </Btn>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* History group */}
        <Btn title="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()}>
          <Undo style={{ fontSize: 16 }} />
        </Btn>
        <Btn title="Redo (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()}>
          <Redo style={{ fontSize: 16 }} />
        </Btn>
      </div>

      {/* ── Editor content ── */}
      <Box sx={{
        '& .ProseMirror': {
          outline: 'none',
          color: darkMode ? 'rgba(255,255,255,0.87)' : '#202124',
          lineHeight: 1.75,
          fontSize: '15px',
          '& h1': { fontSize: '2em', fontWeight: 700, lineHeight: 1.25, margin: '1em 0 0.5em', color: darkMode ? '#e8eaed' : '#202124' },
          '& h2': { fontSize: '1.5em', fontWeight: 700, lineHeight: 1.3, margin: '1em 0 0.4em', color: darkMode ? '#e8eaed' : '#202124' },
          '& h3': { fontSize: '1.2em', fontWeight: 600, margin: '1em 0 0.35em', color: darkMode ? '#e8eaed' : '#202124' },
          '& p':  { margin: '0 0 1em', color: darkMode ? 'rgba(255,255,255,0.75)' : '#3c4043' },
          '& a.editor-link': { color: '#1a73e8', textDecoration: 'underline' },
          '& code': { background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', borderRadius: 4, padding: '2px 6px', fontFamily: 'monospace', fontSize: '0.9em' },
          '& pre': { background: darkMode ? '#1e2027' : '#f1f3f4', borderRadius: 8, padding: '1rem', overflow: 'auto' },
          '& ul, & ol': { paddingLeft: '1.5em', margin: '0 0 1em' },
          '& li': { marginBottom: '0.25em', color: darkMode ? 'rgba(255,255,255,0.75)' : '#3c4043' },
          '& img.editor-image': { maxWidth: '100%', borderRadius: 8, margin: '1em 0' },
          '& blockquote': { borderLeft: `3px solid ${darkMode ? '#3c4043' : '#dadce0'}`, paddingLeft: '1em', margin: '1em 0', color: darkMode ? 'rgba(255,255,255,0.5)' : '#5f6368' },
        },
      }}>
        <EditorContent editor={editor} />
      </Box>

      {/* ── Word count footer ── */}
      <div style={{
        padding: '6px 16px',
        borderTop: `1px solid ${border}`,
        background: toolBg,
        fontSize: 11,
        color: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)',
        letterSpacing: '0.02em',
      }}>
        {editor.storage.characterCount?.words?.() ?? editor.getText().trim().split(/\s+/).filter(Boolean).length} words
      </div>
    </Box>
  );
}