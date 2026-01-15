import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  TextField,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Button,
  Menu,
  MenuItem,
  Popover,
  useTheme,
  alpha,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  FormatClear,
  Link,
  Image,
  Code,
  Title,
  FormatSize,
  FormatColorText,
  FormatColorFill,
  Add,
  Save,
  Undo,
  Redo,
  Check,
  ExpandMore,
  Palette,
  TextFields,
} from '@mui/icons-material';
import { Note } from './types';

interface NoteEditorProps {
  note?: Note;
  onSave?: (noteData: Partial<Note>) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

type FormatType = 'bold' | 'italic' | 'underline' | 'strikethrough';
type ListType = 'bulleted' | 'numbered';
type AlignType = 'left' | 'center' | 'right' | 'justify';
type HeadingType = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onSave,
  onCancel,
  loading = false,
  autoSave = false,
  autoSaveInterval = 30000,
}) => {
  const theme = useTheme();
  const editorRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [summary, setSummary] = useState(note?.summary || '');
  const [category, setCategory] = useState(note?.category || 'general');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [priority, setPriority] = useState(note?.priority || 'medium');
  const [color, setColor] = useState(note?.color || '#ffffff');
  const [saved, setSaved] = useState(true);
  const [lastSave, setLastSave] = useState<Date | null>(null);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  
  // Toolbar states
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [colorAnchor, setColorAnchor] = useState<null | HTMLElement>(null);
  const [headingAnchor, setHeadingAnchor] = useState<null | HTMLElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<FormatType>>(new Set());
  const [activeList, setActiveList] = useState<ListType | null>(null);
  const [activeAlign, setActiveAlign] = useState<AlignType>('left');
  const [activeHeading, setActiveHeading] = useState<HeadingType>('p');
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  // Auto-save effect
  useEffect(() => {
    if (!autoSave || saved) return;

    const timer = setTimeout(() => {
      handleSave();
    }, autoSaveInterval);

    return () => clearTimeout(timer);
  }, [title, content, summary, category, tags, priority, color, autoSave, autoSaveInterval]);

  // Detect changes
  useEffect(() => {
    const hasChanges =
      title !== note?.title ||
      content !== note?.content ||
      summary !== note?.summary ||
      category !== note?.category ||
      JSON.stringify(tags) !== JSON.stringify(note?.tags || []) ||
      priority !== note?.priority ||
      color !== note?.color;

    setSaved(!hasChanges);
  }, [title, content, summary, category, tags, priority, color, note]);

  // Save content to undo stack
  const saveToUndoStack = useCallback(() => {
    if (editorRef.current) {
      setUndoStack(prev => [...prev, editorRef.current!.innerHTML]);
      setRedoStack([]);
    }
  }, []);

  // Initialize editor with content
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content || '';
      saveToUndoStack();
    }
  }, []);

  // Handle editor input
  const handleEditorInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      saveToUndoStack();
      setSaved(false);
    }
  };

  // Formatting functions
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleEditorInput();
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    const formats = new Set<FormatType>();
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('strikethrough')) formats.add('strikethrough');
    setActiveFormats(formats);
  };

  // Undo/Redo
  const handleUndo = () => {
    if (undoStack.length > 1) {
      const lastState = undoStack[undoStack.length - 2];
      const currentState = undoStack[undoStack.length - 1];
      
      setUndoStack(prev => prev.slice(0, -1));
      setRedoStack(prev => [...prev, currentState]);
      
      if (editorRef.current) {
        editorRef.current.innerHTML = lastState;
        setContent(lastState);
      }
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      
      setRedoStack(prev => prev.slice(0, -1));
      setUndoStack(prev => [...prev, nextState]);
      
      if (editorRef.current) {
        editorRef.current.innerHTML = nextState;
        setContent(nextState);
      }
    }
  };

  // Insert link
  const handleInsertLink = () => {
    const url = prompt('Enter URL:', 'https://');
    if (url) {
      formatText('createLink', url);
    }
  };

  // Insert image
  const handleInsertImage = () => {
    const url = prompt('Enter image URL:', 'https://');
    if (url) {
      formatText('insertImage', url);
    }
  };

  // Clear formatting
  const handleClearFormatting = () => {
    formatText('removeFormat');
    setActiveFormats(new Set());
    setActiveList(null);
    setActiveAlign('left');
    setActiveHeading('p');
  };

  const handleSave = async () => {
    if (!onSave) return;

    const noteData: Partial<Note> = {
      title,
      content,
      summary,
      category,
      tags,
      priority,
      color,
    };

    try {
      await onSave(noteData);
      setSaved(true);
      setLastSave(new Date());
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  // Toolbar components
  const FormatButton = ({ 
    format, 
    icon: Icon,
    tooltip 
  }: { 
    format: FormatType; 
    icon: React.ElementType;
    tooltip: string;
  }) => (
    <Tooltip title={tooltip}>
      <ToggleButton
        value={format}
        selected={activeFormats.has(format)}
        onChange={() => formatText(format)}
        size="small"
        sx={{ minWidth: 40, height: 36 }}
      >
        <Icon />
      </ToggleButton>
    </Tooltip>
  );

  const ColorPicker = ({ 
    type, 
    color: currentColor, 
    onChange,
    icon: Icon
  }: { 
    type: 'text' | 'bg'; 
    color: string;
    onChange: (color: string) => void;
    icon: React.ElementType;
  }) => (
    <>
      <Tooltip title={`${type === 'text' ? 'Text' : 'Background'} Color`}>
        <IconButton
          size="small"
          onClick={(e) => setColorAnchor(e.currentTarget)}
          sx={{ 
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: currentColor,
            color: type === 'text' ? currentColor : 'inherit',
            '&:hover': { bgcolor: alpha(currentColor, 0.8) }
          }}
        >
          <Icon />
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(colorAnchor)}
        anchorEl={colorAnchor}
        onClose={() => setColorAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 1 }}>
          {[
            '#000000', '#434343', '#666666', '#999999', '#cccccc', '#efefef', '#f3f3f3', '#ffffff',
            '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff',
            '#9900ff', '#ff00ff', '#ffcccc', '#ffcc99', '#ffffcc', '#ccffcc', '#ccffff', '#cfe2f3',
            '#d9d2e9', '#ead1dc', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#d9d2e9', '#ead1dc'
          ].map((color) => (
            <Tooltip key={color} title={color}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: color,
                  border: `1px solid ${theme.palette.divider}`,
                  cursor: 'pointer',
                  borderRadius: '2px',
                  '&:hover': { transform: 'scale(1.1)' }
                }}
                onClick={() => {
                  onChange(color);
                  if (type === 'text') {
                    formatText('foreColor', color);
                  } else {
                    formatText('backColor', color);
                  }
                  setColorAnchor(null);
                }}
              />
            </Tooltip>
          ))}
        </Box>
      </Popover>
    </>
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          {note ? 'Edit Note' : 'Create New Note'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {lastSave && (
            <Typography variant="caption" color="text.secondary">
              Last saved: {lastSave.toLocaleTimeString()}
            </Typography>
          )}
          <Tooltip title="Save (Ctrl+S)">
            <IconButton
              onClick={handleSave}
              disabled={loading || saved}
              color={saved ? "success" : "primary"}
            >
              <Save />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Title */}
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter note title..."
        variant="outlined"
        size="medium"
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: '1.5rem',
            fontWeight: 500,
          },
        }}
        onKeyDown={handleKeyDown}
      />

      {/* Metadata Row */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          size="small"
          sx={{ minWidth: 120 }}
          SelectProps={{
            native: true,
          }}
        >
          <option value="general">General</option>
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="ideas">Ideas</option>
          <option value="todo">Todo</option>
          <option value="reference">Reference</option>
          <option value="journal">Journal</option>
        </TextField>

        <TextField
          select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          size="small"
          sx={{ minWidth: 120 }}
          SelectProps={{
            native: true,
          }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </TextField>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            label="Tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
            size="small"
            placeholder="Add tag..."
            sx={{ minWidth: 150 }}
          />
          <Tooltip title="Add tag">
            <IconButton onClick={handleAddTag} size="small">
              <Add fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Tags Display */}
      {tags.length > 0 && (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => handleRemoveTag(tag)}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }}
            />
          ))}
        </Box>
      )}

      {/* Summary */}
      <TextField
        fullWidth
        label="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Brief summary of this note..."
        multiline
        rows={2}
        variant="outlined"
        helperText="Optional: A brief summary of what this note contains"
      />

      {/* Custom Rich Text Editor Toolbar */}
      <Paper
        sx={{
          p: 1,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          alignItems: 'center',
        }}
      >
        {/* Undo/Redo */}
        <Tooltip title="Undo (Ctrl+Z)">
          <IconButton size="small" onClick={handleUndo} disabled={undoStack.length <= 1}>
            <Undo />
          </IconButton>
        </Tooltip>
        <Tooltip title="Redo (Ctrl+Y)">
          <IconButton size="small" onClick={handleRedo} disabled={redoStack.length === 0}>
            <Redo />
          </IconButton>
        </Tooltip>

        <Box sx={{ width: 1, height: 20, borderLeft: `1px solid ${theme.palette.divider}`, mx: 1 }} />

        {/* Text Formatting */}
        <FormatButton format="bold" icon={FormatBold} tooltip="Bold (Ctrl+B)" />
        <FormatButton format="italic" icon={FormatItalic} tooltip="Italic (Ctrl+I)" />
        <FormatButton format="underline" icon={FormatUnderlined} tooltip="Underline (Ctrl+U)" />
        <FormatButton format="strikethrough" icon={FormatStrikethrough} tooltip="Strikethrough" />

        <Box sx={{ width: 1, height: 20, borderLeft: `1px solid ${theme.palette.divider}`, mx: 1 }} />

        {/* Headings */}
        <Tooltip title="Heading">
          <IconButton size="small" onClick={(e) => setHeadingAnchor(e.currentTarget)}>
            <Title />
            <ExpandMore fontSize="small" />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={headingAnchor}
          open={Boolean(headingAnchor)}
          onClose={() => setHeadingAnchor(null)}
        >
          {[
            { value: 'p', label: 'Normal Text' },
            { value: 'h1', label: 'Heading 1' },
            { value: 'h2', label: 'Heading 2' },
            { value: 'h3', label: 'Heading 3' },
            { value: 'h4', label: 'Heading 4' },
            { value: 'h5', label: 'Heading 5' },
            { value: 'h6', label: 'Heading 6' },
          ].map((heading) => (
            <MenuItem
              key={heading.value}
              selected={activeHeading === heading.value}
              onClick={() => {
                formatText('formatBlock', `<${heading.value}>`);
                setActiveHeading(heading.value as HeadingType);
                setHeadingAnchor(null);
              }}
            >
              <Typography variant={heading.value as any}>{heading.label}</Typography>
            </MenuItem>
          ))}
        </Menu>

        <Box sx={{ width: 1, height: 20, borderLeft: `1px solid ${theme.palette.divider}`, mx: 1 }} />

        {/* Lists */}
        <Tooltip title="Bulleted List">
          <ToggleButton
            value="bulleted"
            selected={activeList === 'bulleted'}
            onChange={() => {
              formatText('insertUnorderedList');
              setActiveList(activeList === 'bulleted' ? null : 'bulleted');
            }}
            size="small"
            sx={{ minWidth: 40, height: 36 }}
          >
            <FormatListBulleted />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Numbered List">
          <ToggleButton
            value="numbered"
            selected={activeList === 'numbered'}
            onChange={() => {
              formatText('insertOrderedList');
              setActiveList(activeList === 'numbered' ? null : 'numbered');
            }}
            size="small"
            sx={{ minWidth: 40, height: 36 }}
          >
            <FormatListNumbered />
          </ToggleButton>
        </Tooltip>

        <Box sx={{ width: 1, height: 20, borderLeft: `1px solid ${theme.palette.divider}`, mx: 1 }} />

        {/* Alignment */}
        <ToggleButtonGroup
          value={activeAlign}
          exclusive
          onChange={(_, value) => {
            if (value) {
              formatText('justify' + value.charAt(0).toUpperCase() + value.slice(1));
              setActiveAlign(value);
            }
          }}
          size="small"
        >
          <ToggleButton value="left">
            <Tooltip title="Align Left">
              <FormatAlignLeft />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="center">
            <Tooltip title="Align Center">
              <FormatAlignCenter />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="right">
            <Tooltip title="Align Right">
              <FormatAlignRight />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="justify">
            <Tooltip title="Justify">
              <FormatAlignJustify />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ width: 1, height: 20, borderLeft: `1px solid ${theme.palette.divider}`, mx: 1 }} />

        {/* Colors */}
        <ColorPicker
          type="text"
          color={textColor}
          onChange={setTextColor}
          icon={FormatColorText}
        />
        <ColorPicker
          type="bg"
          color={bgColor}
          onChange={setBgColor}
          icon={FormatColorFill}
        />

        <Box sx={{ width: 1, height: 20, borderLeft: `1px solid ${theme.palette.divider}`, mx: 1 }} />

        {/* Insert Options */}
        <Tooltip title="Insert Link">
          <IconButton size="small" onClick={handleInsertLink}>
            <Link />
          </IconButton>
        </Tooltip>
        <Tooltip title="Insert Image">
          <IconButton size="small" onClick={handleInsertImage}>
            <Image />
          </IconButton>
        </Tooltip>
        <Tooltip title="Code Block">
          <IconButton size="small" onClick={() => formatText('formatBlock', '<pre>')}>
            <Code />
          </IconButton>
        </Tooltip>
        <Tooltip title="Quote">
          <IconButton size="small" onClick={() => formatText('formatBlock', '<blockquote>')}>
            <FormatQuote />
          </IconButton>
        </Tooltip>

        <Box sx={{ flex: 1 }} />

        {/* Clear Formatting */}
        <Tooltip title="Clear Formatting">
          <IconButton size="small" onClick={handleClearFormatting}>
            <FormatClear />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* Rich Text Editor Area */}
      <Paper
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          ref={editorRef}
          contentEditable
          onInput={handleEditorInput}
          onFocus={updateActiveFormats}
          suppressContentEditableWarning
          sx={{
            flex: 1,
            p: 3,
            outline: 'none',
            overflowY: 'auto',
            minHeight: 300,
            fontSize: '1rem',
            lineHeight: 1.6,
            '&:focus': {
              outline: 'none',
            },
            '& h1': { fontSize: '2rem', fontWeight: 'bold', mt: 2, mb: 1 },
            '& h2': { fontSize: '1.75rem', fontWeight: 'bold', mt: 2, mb: 1 },
            '& h3': { fontSize: '1.5rem', fontWeight: 'bold', mt: 2, mb: 1 },
            '& h4': { fontSize: '1.25rem', fontWeight: 'bold', mt: 2, mb: 1 },
            '& h5': { fontSize: '1rem', fontWeight: 'bold', mt: 2, mb: 1 },
            '& h6': { fontSize: '0.875rem', fontWeight: 'bold', mt: 2, mb: 1 },
            '& p': { mt: 1, mb: 1 },
            '& ul, & ol': { pl: 4, my: 1 },
            '& li': { my: 0.5 },
            '& blockquote': {
              pl: 2,
              ml: 2,
              borderLeft: `4px solid ${theme.palette.divider}`,
              fontStyle: 'italic',
              color: theme.palette.text.secondary,
            },
            '& pre': {
              p: 2,
              bgcolor: theme.palette.grey[100],
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              overflow: 'auto',
            },
            '& a': {
              color: theme.palette.primary.main,
              textDecoration: 'underline',
              '&:hover': { color: theme.palette.primary.dark },
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 1,
              my: 1,
            },
          }}
          placeholder="Start typing your note here..."
          data-placeholder="Start typing your note here..."
        />
        
        {/* Placeholder text */}
        {!content && (
          <Typography
            sx={{
              position: 'absolute',
              top: 24,
              left: 24,
              pointerEvents: 'none',
              color: theme.palette.text.disabled,
              fontSize: '1rem',
            }}
          >
            Start typing your note here...
          </Typography>
        )}
      </Paper>

      {/* Status Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1.5,
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Words: {content.split(/\s+/).filter(w => w.length > 0).length} | 
          Characters: {content.length} |
          Formatting: {Array.from(activeFormats).join(', ') || 'None'}
        </Typography>
        <Typography
          variant="caption"
          color={saved ? "success.main" : "warning.main"}
          fontWeight={500}
        >
          {saved ? '✓ All changes saved' : '● Unsaved changes'}
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || saved}
          startIcon={<Save />}
        >
          {loading ? 'Saving...' : saved ? 'Saved' : 'Save Note'}
        </Button>
      </Box>
    </Box>
  );
};