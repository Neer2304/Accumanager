// // components/advance/ThemeCustomizerPanel.tsx
// 'use client'

// import {
//   Box,
//   Paper,
//   Typography,
//   IconButton,
//   Slider,
//   Switch,
//   FormControlLabel,
//   Button,
//   Divider,
//   Chip,
// } from '@mui/material'
// import { Close, Check } from '@mui/icons-material'
// import { useThemeContext } from '@/contexts/ThemeContexts'

// interface ThemeCustomizerPanelProps {
//   open: boolean
//   onClose: () => void
// }

// export default function ThemeCustomizerPanel({ open, onClose }: ThemeCustomizerPanelProps) {
//   const {
//     mode,
//     customScheme,
//     autoSwitch,
//     toggleTheme,
//     setMode,
//     toggleAutoSwitch,
//     currentScheme,
//     getAllColorSchemes,
//     getColorSchemeById,
//     applyCustomScheme,
//   } = useThemeContext()

//   const colorSchemes = getAllColorSchemes()
//   const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(customScheme?.id || null)

//   if (!open) return null

//   return (
//     <Paper
//       sx={{
//         position: 'fixed',
//         top: 80,
//         right: 24,
//         width: 320,
//         maxHeight: 'calc(100vh - 120px)',
//         overflowY: 'auto',
//         background: currentScheme.colors.components.card,
//         border: `1px solid ${currentScheme.colors.components.border}`,
//         zIndex: 9998,
//         p: 2,
//       }}
//     >
//       <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
//         <Typography variant="h6" fontWeight="bold">
//           Theme Customizer
//         </Typography>
//         <IconButton onClick={onClose} size="small">
//           <Close />
//         </IconButton>
//       </Box>

//       <Divider sx={{ borderColor: currentScheme.colors.components.border, mb: 2 }} />

//       {/* Theme Mode */}
//       <Box mb={3}>
//         <Typography variant="subtitle2" fontWeight="medium" mb={1}>
//           Theme Mode
//         </Typography>
//         <Box display="flex" gap={1}>
//           <Button
//             variant={mode === 'light' ? 'contained' : 'outlined'}
//             onClick={() => setMode('light')}
//             fullWidth
//             sx={{
//               background: mode === 'light' ? currentScheme.colors.primary : 'transparent',
//               borderColor: currentScheme.colors.components.border,
//             }}
//           >
//             Light
//           </Button>
//           <Button
//             variant={mode === 'dark' ? 'contained' : 'outlined'}
//             onClick={() => setMode('dark')}
//             fullWidth
//             sx={{
//               background: mode === 'dark' ? currentScheme.colors.primary : 'transparent',
//               borderColor: currentScheme.colors.components.border,
//             }}
//           >
//             Dark
//           </Button>
//         </Box>
//       </Box>

//       {/* Auto Switch */}
//       <Box mb={3}>
//         <FormControlLabel
//           control={
//             <Switch
//               checked={autoSwitch}
//               onChange={toggleAutoSwitch}
//               color="primary"
//             />
//           }
//           label="Follow System Theme"
//         />
//       </Box>

//       {/* Color Schemes */}
//       <Box mb={3}>
//         <Typography variant="subtitle2" fontWeight="medium" mb={1}>
//           Color Schemes
//         </Typography>
//         <Box display="flex" flexWrap="wrap" gap={1}>
//           {colorSchemes.map((scheme) => (
//             <Chip
//               key={scheme.id}
//               label={scheme.name}
//               onClick={() => {
//                 setSelectedSchemeId(scheme.id)
//                 applyCustomScheme(scheme)
//               }}
//               sx={{
//                 background: selectedSchemeId === scheme.id 
//                   ? currentScheme.colors.primary 
//                   : currentScheme.colors.components.card,
//                 color: selectedSchemeId === scheme.id 
//                   ? 'white' 
//                   : currentScheme.colors.text.primary,
//                 border: `1px solid ${currentScheme.colors.components.border}`,
//               }}
//               icon={selectedSchemeId === scheme.id ? <Check sx={{ fontSize: 16 }} /> : undefined}
//             />
//           ))}
//         </Box>
//       </Box>

//       {/* Quick Preview */}
//       <Box mb={2}>
//         <Typography variant="subtitle2" fontWeight="medium" mb={1}>
//           Preview
//         </Typography>
//         <Box
//           sx={{
//             p: 2,
//             borderRadius: 2,
//             background: currentScheme.colors.background,
//             border: `1px solid ${currentScheme.colors.components.border}`,
//           }}
//         >
//           <Typography variant="body2" mb={1}>
//             Current Scheme: {currentScheme.name}
//           </Typography>
//           <Box display="flex" gap={1}>
//             <Box
//               sx={{
//                 width: 24,
//                 height: 24,
//                 borderRadius: '50%',
//                 background: currentScheme.colors.primary,
//               }}
//             />
//             <Box
//               sx={{
//                 width: 24,
//                 height: 24,
//                 borderRadius: '50%',
//                 background: currentScheme.colors.secondary,
//               }}
//             />
//             <Box
//               sx={{
//                 width: 24,
//                 height: 24,
//                 borderRadius: '50%',
//                 background: currentScheme.colors.accent,
//               }}
//             />
//           </Box>
//         </Box>
//       </Box>

//       {/* Reset Button */}
//       <Button
//         variant="outlined"
//         fullWidth
//         onClick={() => {
//           setSelectedSchemeId(null)
//           applyCustomScheme(null)
//         }}
//         sx={{
//           borderColor: currentScheme.colors.components.border,
//           color: currentScheme.colors.text.primary,
//         }}
//       >
//         Reset to Default
//       </Button>
//     </Paper>
//   )
// }