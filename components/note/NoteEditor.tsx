// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   TextField,
//   Typography,
//   Chip,
//   IconButton,
//   Tooltip,
//   Paper,
//   useTheme,
//   alpha,
// } from '@mui/material';
// import {
//   FormatBold,
//   FormatItalic,
//   FormatUnderlined,
//   FormatListBulleted,
//   FormatListNumbered,
//   FormatQuote,
//   InsertLink,
//   InsertPhoto,
//   AttachFile,
//   Title,
//   Code,
//   Undo,
//   Redo,
//   Save,
// } from '@mui/icons-material';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { Note } from './types';
// import { Add } from '@mui/icons-material';

// interface NoteEditorProps {
//   note?: Note;
//   onSave?: (noteData: Partial<Note>) => Promise<void>;
//   onCancel?: () => void;
//   loading?: boolean;
//   autoSave?: boolean;
//   autoSaveInterval?: number;
// }

// export const NoteEditor: React.FC<NoteEditorProps> = ({
//   note,
//   onSave,
//   onCancel,
//   loading = false,
//   autoSave = false,
//   autoSaveInterval = 30000,
// }) => {
//   const theme = useTheme();
//   const [title, setTitle] = useState(note?.title || '');
//   const [content, setContent] = useState(note?.content || '');
//   const [summary, setSummary] = useState(note?.summary || '');
//   const [category, setCategory] = useState(note?.category || 'general');
//   const [tags, setTags] = useState<string[]>(note?.tags || []);
//   const [tagInput, setTagInput] = useState('');
//   const [priority, setPriority] = useState(note?.priority || 'medium');
//   const [color, setColor] = useState(note?.color || '#ffffff');
//   const [saved, setSaved] = useState(true);
//   const [lastSave, setLastSave] = useState<Date | null>(null);

//   // Auto-save effect
//   useEffect(() => {
//     if (!autoSave || saved) return;

//     const timer = setTimeout(() => {
//       handleSave();
//     }, autoSaveInterval);

//     return () => clearTimeout(timer);
//   }, [title, content, summary, category, tags, priority, color, autoSave, autoSaveInterval]);

//   // Detect changes
//   useEffect(() => {
//     const hasChanges =
//       title !== note?.title ||
//       content !== note?.content ||
//       summary !== note?.summary ||
//       category !== note?.category ||
//       JSON.stringify(tags) !== JSON.stringify(note?.tags || []) ||
//       priority !== note?.priority ||
//       color !== note?.color;

//     setSaved(!hasChanges);
//   }, [title, content, summary, category, tags, priority, color, note]);

//   const handleSave = async () => {
//     if (!onSave) return;

//     const noteData: Partial<Note> = {
//       title,
//       content,
//       summary,
//       category,
//       tags,
//       priority,
//       color,
//     };

//     try {
//       await onSave(noteData);
//       setSaved(true);
//       setLastSave(new Date());
//     } catch (error) {
//       console.error('Failed to save note:', error);
//     }
//   };

//   const handleAddTag = () => {
//     if (tagInput.trim() && !tags.includes(tagInput.trim())) {
//       setTags([...tags, tagInput.trim()]);
//       setTagInput('');
//     }
//   };

//   const handleRemoveTag = (tagToRemove: string) => {
//     setTags(tags.filter(tag => tag !== tagToRemove));
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && e.ctrlKey) {
//       handleSave();
//     }
//   };

//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, 3, 4, 5, 6, false] }],
//       ['bold', 'italic', 'underline', 'strike'],
//       [{ list: 'ordered' }, { list: 'bullet' }],
//       [{ indent: '-1' }, { indent: '+1' }],
//       [{ align: [] }],
//       ['link', 'image', 'code-block'],
//       ['clean'],
//     ],
//   };

//   const formats = [
//     'header',
//     'bold', 'italic', 'underline', 'strike',
//     'list', 'bullet', 'indent',
//     'align',
//     'link', 'image', 'code-block',
//   ];

//   return (
//     <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
//       {/* Header */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Typography variant="h4" fontWeight="bold">
//           {note ? 'Edit Note' : 'Create New Note'}
//         </Typography>
//         <Box sx={{ display: 'flex', gap: 1 }}>
//           {lastSave && (
//             <Typography variant="caption" color="text.secondary">
//               Last saved: {lastSave.toLocaleTimeString()}
//             </Typography>
//           )}
//           <Tooltip title="Save (Ctrl+S)">
//             <IconButton
//               onClick={handleSave}
//               disabled={loading || saved}
//               color={saved ? "success" : "primary"}
//             >
//               <Save />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       </Box>

//       {/* Title */}
//       <TextField
//         fullWidth
//         label="Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         placeholder="Enter note title..."
//         variant="outlined"
//         size="medium"
//         sx={{
//           '& .MuiOutlinedInput-root': {
//             fontSize: '1.5rem',
//             fontWeight: 500,
//           },
//         }}
//         onKeyDown={handleKeyDown}
//       />

//       {/* Metadata Row */}
//       <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//         <TextField
//           select
//           label="Category"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           size="small"
//           sx={{ minWidth: 120 }}
//           SelectProps={{
//             native: true,
//           }}
//         >
//           <option value="general">General</option>
//           <option value="personal">Personal</option>
//           <option value="work">Work</option>
//           <option value="ideas">Ideas</option>
//           <option value="todo">Todo</option>
//           <option value="reference">Reference</option>
//           <option value="journal">Journal</option>
//         </TextField>

//         <TextField
//           select
//           label="Priority"
//           value={priority}
//           onChange={(e) => setPriority(e.target.value as any)}
//           size="small"
//           sx={{ minWidth: 120 }}
//           SelectProps={{
//             native: true,
//           }}
//         >
//           <option value="low">Low</option>
//           <option value="medium">Medium</option>
//           <option value="high">High</option>
//           <option value="critical">Critical</option>
//         </TextField>

//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <TextField
//             label="Tags"
//             value={tagInput}
//             onChange={(e) => setTagInput(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
//             size="small"
//             placeholder="Add tag..."
//             sx={{ minWidth: 150 }}
//           />
//           <Tooltip title="Add tag">
//             <IconButton onClick={handleAddTag} size="small">
//               <Add fontSize="small" />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       </Box>

//       {/* Tags Display */}
//       {tags.length > 0 && (
//         <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
//           {tags.map((tag, index) => (
//             <Chip
//               key={index}
//               label={tag}
//               onDelete={() => handleRemoveTag(tag)}
//               size="small"
//               sx={{
//                 bgcolor: alpha(theme.palette.primary.main, 0.1),
//               }}
//             />
//           ))}
//         </Box>
//       )}

//       {/* Summary */}
//       <TextField
//         fullWidth
//         label="Summary"
//         value={summary}
//         onChange={(e) => setSummary(e.target.value)}
//         placeholder="Brief summary of this note..."
//         multiline
//         rows={2}
//         variant="outlined"
//         helperText="Optional: A brief summary of what this note contains"
//       />

//       {/* Rich Text Editor */}
//       <Paper
//         sx={{
//           flex: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           border: `1px solid ${theme.palette.divider}`,
//           borderRadius: 2,
//           overflow: 'hidden',
//         }}
//       >
//         <ReactQuill
//           theme="snow"
//           value={content}
//           onChange={setContent}
//           modules={modules}
//           formats={formats}
//           style={{
//             height: '100%',
//             border: 'none',
//           }}
//           placeholder="Start typing your note here..."
//         />
//       </Paper>

//       {/* Status Bar */}
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           p: 1.5,
//           bgcolor: alpha(theme.palette.background.paper, 0.5),
//           borderRadius: 1,
//           border: `1px solid ${theme.palette.divider}`,
//         }}
//       >
//         <Typography variant="caption" color="text.secondary">
//           Words: {content.split(/\s+/).length} | Characters: {content.length}
//         </Typography>
//         <Typography
//           variant="caption"
//           color={saved ? "success.main" : "warning.main"}
//           fontWeight={500}
//         >
//           {saved ? '✓ All changes saved' : '● Unsaved changes'}
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// // Add icon import
