// components/admin/blog/RichTextEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha
} from '@mui/material';
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
  Redo
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
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      TextStyle,
      Color,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        style: 'min-height: 400px; padding: 1rem;',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false, // This fixes the SSR warning!
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const MenuBar = () => (
    <Box sx={{ 
      borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      pb: 1,
      mb: 2,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 0.5
    }}>
      <ToggleButtonGroup size="small">
        <ToggleButton 
          value="bold" 
          selected={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FormatBold fontSize="small" />
        </ToggleButton>
        <ToggleButton 
          value="italic"
          selected={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FormatItalic fontSize="small" />
        </ToggleButton>
        <ToggleButton 
          value="underline"
          selected={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <FormatUnderlined fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup size="small">
        <ToggleButton 
          value="bulletList"
          selected={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FormatListBulleted fontSize="small" />
        </ToggleButton>
        <ToggleButton 
          value="orderedList"
          selected={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FormatListNumbered fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup size="small">
        <ToggleButton 
          value="h1"
          selected={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Title fontSize="small" />
          <Box component="span" sx={{ ml: 0.5, fontSize: '0.75rem' }}>1</Box>
        </ToggleButton>
        <ToggleButton 
          value="h2"
          selected={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Title fontSize="small" />
          <Box component="span" sx={{ ml: 0.5, fontSize: '0.75rem' }}>2</Box>
        </ToggleButton>
        <ToggleButton 
          value="h3"
          selected={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Title fontSize="small" />
          <Box component="span" sx={{ ml: 0.5, fontSize: '0.75rem' }}>3</Box>
        </ToggleButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup size="small">
        <ToggleButton value="link" onClick={addLink}>
          <LinkIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton value="image" onClick={addImage}>
          <ImageIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton 
          value="codeBlock" 
          selected={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup size="small" sx={{ ml: 'auto' }}>
        <ToggleButton value="undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo fontSize="small" />
        </ToggleButton>
        <ToggleButton value="redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );

  return (
    <Box sx={{ 
      border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      borderRadius: '8px',
      backgroundColor: darkMode ? '#303134' : '#fff',
      p: 2
    }}>
      <MenuBar />
      <EditorContent editor={editor} />
    </Box>
  );
}