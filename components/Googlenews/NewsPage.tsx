// 'use client';

// import React, { useState } from 'react';
// import {
//   Box, Container, Typography, Grid, Card, CardMedia, CardContent, CardActions,
//   Chip, IconButton, Skeleton, ToggleButton, ToggleButtonGroup,
//   useTheme, alpha, Breadcrumbs, Avatar, Paper, Link as MuiLink, useMediaQuery,
// } from '@mui/material';
// import {
//   Home as HomeIcon, AutoAwesome, Whatshot, Article as ArticleIcon,
//   Share as ShareIcon, BookmarkBorder as BookmarkIcon, OpenInNew as OpenInNewIcon,
//   TrendingUp, Code, Business, EmojiEvents, TheaterComedy, Checkroom,
//   Star, Science, HealthAndSafety, Refresh,
// } from '@mui/icons-material';
// import Link from 'next/link';
// import { formatDistanceToNow } from 'date-fns';
// import { MainLayout } from '@/components/Layout/MainLayout';
// import { NewsArticle, NewsCategory } from '@/app/api/news/route';

// // ─── Shared design system (import from your actual path) ─────────────────────
// import { GS, useAppColors, PillBtn, AppAlert, AppLogo } from '@/components/shared/AppCommon';

// // ─── News hook ────────────────────────────────────────────────────────────────
// import { useNews } from '@/hooks/useNews';

// // ─── Category config ──────────────────────────────────────────────────────────

// interface CategoryConfig {
//   id: NewsCategory;
//   label: string;
//   icon: React.ReactElement;
//   color: string;
// }

// const CATEGORIES: CategoryConfig[] = [
//   { id: 'general',       label: 'General',      icon: <Whatshot sx={{ fontSize: 16 }} />,        color: '#4285f4' },
//   { id: 'technology',    label: 'Tech',          icon: <Code sx={{ fontSize: 16 }} />,            color: '#34a853' },
//   { id: 'entertainment', label: 'Entertainment', icon: <TheaterComedy sx={{ fontSize: 16 }} />,   color: '#ea4335' },
//   { id: 'fashion',       label: 'Fashion',       icon: <Checkroom sx={{ fontSize: 16 }} />,       color: '#d81b60' },
//   { id: 'celebrity',     label: 'Celebrity',     icon: <Star sx={{ fontSize: 16 }} />,            color: '#fbbc04' },
//   { id: 'sports',        label: 'Sports',        icon: <EmojiEvents sx={{ fontSize: 16 }} />,     color: '#ff6d00' },
//   { id: 'business',      label: 'Business',      icon: <Business sx={{ fontSize: 16 }} />,        color: '#9334e6' },
//   { id: 'health',        label: 'Health',        icon: <HealthAndSafety sx={{ fontSize: 16 }} />, color: '#00acc1' },
//   { id: 'science',       label: 'Science',       icon: <Science sx={{ fontSize: 16 }} />,         color: '#1e88e5' },
//   { id: 'ai',            label: 'AI',            icon: <AutoAwesome sx={{ fontSize: 16 }} />,     color: '#8e24aa' },
//   { id: 'startup',       label: 'Startup',       icon: <TrendingUp sx={{ fontSize: 16 }} />,      color: '#fb8c00' },
//   { id: 'dev',           label: 'Dev',           icon: <Code sx={{ fontSize: 16 }} />,            color: '#0d47a1' },
// ];

// const SOURCES = [
//   { id: 'all',        label: 'All'         },
//   { id: 'gnews',      label: 'News'        },
//   { id: 'hackernews', label: 'Hacker News' },
//   { id: 'devto',      label: 'Dev.to'      },
// ];

// // ─── NewsCard ─────────────────────────────────────────────────────────────────

// function NewsCard({ article }: { article: NewsArticle }) {
//   const theme    = useTheme();
//   const c        = useAppColors();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const [imageError, setImageError] = useState(false);

//   const timeAgo                     = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });
//   const cat                         = CATEGORIES.find(x => x.id === article.category);
//   const catColor: string            = cat?.color ?? c.blue;
//   const catIcon: React.ReactElement = cat?.icon  ?? <ArticleIcon sx={{ fontSize: 14 }} />;

//   return (
//     <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: { xs: '10px', sm: '16px' }, border: `1px solid ${c.border}`, bgcolor: c.surface, transition: 'all 0.2s', overflow: 'hidden', '&:hover': { transform: { sm: 'translateY(-4px)' }, boxShadow: { sm: `0 12px 24px ${alpha(c.ink, 0.1)}` }, borderColor: { sm: alpha(catColor, 0.4) } } }}>
//       {article.imageUrl && !imageError ? (
//         <CardMedia component="img" height={isMobile ? 120 : 160} image={article.imageUrl} alt={article.title} onError={() => setImageError(true)} sx={{ objectFit: 'cover' }} />
//       ) : (
//         <Box sx={{ height: isMobile ? 120 : 160, bgcolor: alpha(catColor, 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//           {React.cloneElement(catIcon, { sx: { fontSize: isMobile ? 32 : 48, color: alpha(catColor, 0.45) } })}
//         </Box>
//       )}

//       <CardContent sx={{ flexGrow: 1, p: { xs: 1, sm: 2.5 } }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75, flexWrap: 'wrap' }}>
//           <Chip label={article.sourceLabel} size="small" sx={{ fontSize: '0.58rem', height: 18, bgcolor: alpha(c.blue, 0.1), color: c.blue, fontFamily: GS }} />
//           <Chip label={article.category}    size="small" sx={{ fontSize: '0.58rem', height: 18, bgcolor: alpha(catColor, 0.1), color: catColor, fontFamily: GS }} />
//           <Typography variant="caption" sx={{ color: c.inkMuted, fontFamily: GS, fontSize: '0.58rem' }}>{timeAgo}</Typography>
//         </Box>

//         <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '0.82rem', sm: '0.95rem' }, lineHeight: 1.4, mb: 0.5, color: c.ink, fontFamily: GS, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
//           {article.title}
//         </Typography>

//         {article.description && (
//           <Typography variant="body2" sx={{ color: c.inkSub, fontSize: { xs: '0.68rem', sm: '0.78rem' }, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: GS }}>
//             {article.description}
//           </Typography>
//         )}

//         {article.tags && article.tags.length > 0 && (
//           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4, mt: 0.75 }}>
//             {article.tags.slice(0, isMobile ? 2 : 3).map(tag => (
//               <Chip key={tag} label={tag} size="small" sx={{ fontSize: '0.52rem', height: 16, bgcolor: alpha(c.ink, 0.05), color: c.inkSub, fontFamily: GS }} />
//             ))}
//           </Box>
//         )}
//       </CardContent>

//       <CardActions sx={{ p: { xs: 1, sm: 2 }, pt: 0, gap: 0.5 }}>
//         <MuiLink href={article.url} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', color: c.blue, fontFamily: GS, fontSize: { xs: '0.62rem', sm: '0.72rem' }, '&:hover': { textDecoration: 'underline' } }}>
//           Read more <OpenInNewIcon sx={{ fontSize: { xs: 11, sm: 13 } }} />
//         </MuiLink>
//         <Box sx={{ flexGrow: 1 }} />
//         <IconButton size="small" sx={{ color: c.inkMuted, p: 0.5 }}>
//           <BookmarkIcon sx={{ fontSize: { xs: 15, sm: 17 } }} />
//         </IconButton>
//         <IconButton size="small" sx={{ color: c.inkMuted, p: 0.5 }}>
//           <ShareIcon sx={{ fontSize: { xs: 15, sm: 17 } }} />
//         </IconButton>
//       </CardActions>
//     </Card>
//   );
// }

// // ─── Skeleton ─────────────────────────────────────────────────────────────────

// function NewsCardSkeleton() {
//   const c        = useAppColors();
//   const theme    = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   return (
//     <Card sx={{ borderRadius: { xs: '10px', sm: '16px' }, border: `1px solid ${c.border}`, bgcolor: c.surface }}>
//       <Skeleton variant="rectangular" height={isMobile ? 120 : 160} sx={{ bgcolor: alpha(c.ink, 0.07) }} />
//       <CardContent sx={{ p: { xs: 1, sm: 2.5 } }}>
//         <Box sx={{ display: 'flex', gap: 0.75, mb: 1 }}>
//           <Skeleton width={48} height={18} sx={{ bgcolor: alpha(c.ink, 0.07), borderRadius: '16px' }} />
//           <Skeleton width={38} height={18} sx={{ bgcolor: alpha(c.ink, 0.07), borderRadius: '16px' }} />
//         </Box>
//         <Skeleton width="88%" height={18} sx={{ bgcolor: alpha(c.ink, 0.07), mb: 0.75 }} />
//         <Skeleton width="100%" height={14} sx={{ bgcolor: alpha(c.ink, 0.07) }} />
//         <Skeleton width="75%"  height={14} sx={{ bgcolor: alpha(c.ink, 0.07) }} />
//       </CardContent>
//     </Card>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────

// export default function NewsPage() {
//   const theme    = useTheme();
//   const c        = useAppColors();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

//   const { articles, loading, refreshing, error, category, source, setCategory, setSource, refresh, clearError } = useNews();

//   const selectedCat = CATEGORIES.find(x => x.id === category);
//   const gridSize    = isMobile ? 12 : isTablet ? 6 : 4;

//   const handleSourceChange = (_e: React.MouseEvent<HTMLElement>, val: string) => {
//     if (val) setSource(val);
//   };

//   return (
//     <MainLayout title="News">
//       <Box sx={{ bgcolor: c.bg, minHeight: '100vh' }}>

//         {/* ══ Hero ════════════════════════════════════════════════════════════ */}
//         <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: c.bg, borderBottom: `1px solid ${c.border}`, pt: { xs: 1.5, sm: 4, md: 6 }, pb: { xs: 2, sm: 5, md: 7 } }}>
//           {/* Background blobs */}
//           <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
//             <Box sx={{ position: 'absolute', width: { xs: 240, sm: 500 }, height: { xs: 240, sm: 500 }, borderRadius: '50%', top: -120, right: -80, background: `radial-gradient(circle, ${alpha(c.blue, 0.15)} 0%, transparent 70%)` }} />
//             <Box sx={{ position: 'absolute', width: { xs: 200, sm: 400 }, height: { xs: 200, sm: 400 }, borderRadius: '50%', bottom: -80, left: -60, background: `radial-gradient(circle, ${alpha(c.blue, 0.08)} 0%, transparent 70%)` }} />
//             <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${alpha(c.ink, 0.04)} 1px, transparent 1px)`, backgroundSize: '28px 28px' }} />
//           </Box>

//           <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: { xs: 1, sm: 2, md: 3 } }}>

//             {/* Breadcrumbs — desktop only */}
//             {!isMobile && (
//               <Breadcrumbs sx={{ mb: 2, '& .MuiBreadcrumbs-separator': { color: c.inkMuted } }}>
//                 <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
//                   <HomeIcon sx={{ fontSize: 14, color: c.inkMuted }} />
//                   <Typography sx={{ color: c.inkMuted, fontSize: '0.75rem', '&:hover': { color: c.btn } }}>Dashboard</Typography>
//                 </Link>
//                 <Typography sx={{ color: c.btn, fontSize: '0.75rem', fontWeight: 600, fontFamily: GS }}>News</Typography>
//               </Breadcrumbs>
//             )}

//             <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between', gap: { xs: 1.5, md: 6 } }}>
//               <Box sx={{ flex: 1 }}>
//                 {/* AppLogo — always red (enforced inside AppLogo) */}
//                 <Box sx={{ mb: { xs: 1, sm: 1.5 } }}>
//                   <AppLogo size={isMobile ? 30 : 38} textVariant={isMobile ? 'body1' : 'h6'} />
//                 </Box>

//                 <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1, py: 0.35, borderRadius: '100px', bgcolor: alpha(c.btn, 0.1), border: `1px solid ${alpha(c.btn, 0.2)}`, mb: 1 }}>
//                   <AutoAwesome sx={{ fontSize: { xs: 10, sm: 13 }, color: c.btn }} />
//                   <Typography sx={{ fontSize: { xs: '0.58rem', sm: '0.68rem' }, fontWeight: 700, color: c.btn, letterSpacing: '0.1em', fontFamily: GS }}>LATEST NEWS</Typography>
//                 </Box>

//                 <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.4rem', sm: '2rem', md: '2.6rem', lg: '3rem' }, color: c.ink, lineHeight: 1.2, letterSpacing: '-0.03em', mb: { xs: 0.75, sm: 1 }, fontFamily: GS }}>
//                   News &amp;
//                   <br />
//                   <Box component="span" sx={{ color: selectedCat?.color ?? c.btn }}>{selectedCat?.label ?? 'Trends'}</Box>
//                 </Typography>

//                 <Typography sx={{ color: c.inkSub, fontSize: { xs: '0.72rem', sm: '0.85rem', md: '1rem' }, mb: { xs: 1.5, sm: 2 }, maxWidth: 480, lineHeight: 1.6, fontFamily: GS }}>
//                   Stay updated with the latest from tech, fashion, entertainment, sports, and business.
//                 </Typography>

//                 {/* Primary button — always blue via PillBtn variant="primary" */}
//                 <PillBtn
//                   variant="primary"
//                   size={isMobile ? 'sm' : 'md'}
//                   onClick={refresh}
//                   loading={refreshing}
//                   icon={<Refresh sx={{ fontSize: { xs: 12, sm: 15 }, animation: refreshing ? 'spin 0.8s linear infinite' : 'none', '@keyframes spin': { to: { transform: 'rotate(360deg)' } } }} />}
//                 >
//                   Refresh
//                 </PillBtn>
//               </Box>

//               {/* Summary card — desktop only */}
//               {!isMobile && (
//                 <Box sx={{ width: { md: 256, lg: 280 }, flexShrink: 0 }}>
//                   <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, bgcolor: c.surface, border: `1px solid ${c.border}`, boxShadow: c.isDark ? '0 24px 60px rgba(0,0,0,0.4)' : `0 24px 60px ${alpha(c.btn, 0.08)}` }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
//                       <Avatar sx={{ width: 38, height: 38, borderRadius: 2.5, bgcolor: alpha(c.btn, 0.1), color: c.btn }}>
//                         <TrendingUp sx={{ fontSize: 20 }} />
//                       </Avatar>
//                       <Box>
//                         <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: c.ink, fontFamily: GS }}>News Summary</Typography>
//                         <Typography variant="caption" sx={{ color: c.inkSub, fontFamily: GS }}>{articles.length} articles</Typography>
//                       </Box>
//                     </Box>
//                     {[
//                       { label: 'Category', value: selectedCat?.label ?? category, chipColor: selectedCat?.color ?? c.btn },
//                       { label: 'Source',   value: SOURCES.find(s => s.id === source)?.label ?? 'All', chipColor: c.info },
//                     ].map(row => (
//                       <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.6, borderBottom: `1px solid ${c.border}`, '&:last-child': { borderBottom: 'none' } }}>
//                         <Typography variant="caption" sx={{ color: c.inkSub, fontFamily: GS }}>{row.label}</Typography>
//                         <Chip label={row.value} size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700, bgcolor: alpha(row.chipColor, 0.12), color: row.chipColor, fontFamily: GS }} />
//                       </Box>
//                     ))}
//                   </Paper>
//                 </Box>
//               )}
//             </Box>

//             {/* Category pills — horizontally scrollable, minimal mobile gap */}
//             <Box sx={{ display: 'flex', gap: { xs: 0.6, sm: 1 }, mt: { xs: 1.5, sm: 3, md: 4 }, flexWrap: 'nowrap', overflowX: 'auto', pb: 0.5, '&::-webkit-scrollbar': { height: 3 }, '&::-webkit-scrollbar-thumb': { bgcolor: alpha(c.ink, 0.12), borderRadius: 4 } }}>
//               {CATEGORIES.map(cat => (
//                 <Box
//                   key={cat.id}
//                   onClick={() => setCategory(cat.id)}
//                   sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: { xs: 0.9, sm: 1.5 }, py: { xs: 0.4, sm: 0.65 }, borderRadius: '100px', bgcolor: category === cat.id ? alpha(cat.color, 0.14) : alpha(c.ink, 0.04), border: `1px solid ${category === cat.id ? alpha(cat.color, 0.3) : c.border}`, cursor: 'pointer', transition: 'all 0.18s', whiteSpace: 'nowrap', flexShrink: 0, '&:hover': { transform: 'translateY(-1px)' } }}
//                 >
//                   {React.cloneElement(cat.icon, { sx: { fontSize: { xs: 11, sm: 14 }, color: category === cat.id ? cat.color : c.inkSub } })}
//                   <Typography sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, fontWeight: 600, color: category === cat.id ? cat.color : c.ink, fontFamily: GS }}>
//                     {cat.label}
//                   </Typography>
//                 </Box>
//               ))}
//             </Box>
//           </Container>
//         </Box>

//         {/* ══ Body ════════════════════════════════════════════════════════════ */}
//         <Container maxWidth="xl" sx={{ py: { xs: 1.5, sm: 3, md: 5 }, px: { xs: 1, sm: 2, md: 3 } }}>

//           {/* Source filter — selected = blue button */}
//           <Paper sx={{ mb: { xs: 1.5, sm: 3, md: 4 }, p: { xs: '3px', sm: '5px' }, borderRadius: '100px', border: `1px solid ${c.border}`, bgcolor: c.surface, display: 'inline-flex', width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
//             <ToggleButtonGroup value={source} exclusive onChange={handleSourceChange} aria-label="news source"
//               sx={{ width: '100%', '& .MuiToggleButton-root': { borderRadius: '100px !important', px: { xs: 1.25, sm: 2.5 }, py: { xs: 0.35, sm: 0.6 }, fontFamily: GS, fontSize: { xs: '0.68rem', sm: '0.82rem' }, textTransform: 'none', border: 'none', color: c.inkSub, flex: { xs: 1, sm: 'none' }, '&.Mui-selected': { bgcolor: c.btn, color: '#fff', '&:hover': { bgcolor: c.btnHov } } } }}
//             >
//               {SOURCES.map(s => <ToggleButton key={s.id} value={s.id}>{s.label}</ToggleButton>)}
//             </ToggleButtonGroup>
//           </Paper>

//           {/* Error — red AppAlert */}
//           {error && (
//             <AppAlert severity="error" onDismiss={clearError} sx={{ mb: 2 }}>
//               {error}
//             </AppAlert>
//           )}

//           {/* Grid */}
//           <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
//             {loading ? (
//               Array.from({ length: isMobile ? 6 : 12 }).map((_, i) => (
//                 <Grid key={i} size={gridSize}><NewsCardSkeleton /></Grid>
//               ))
//             ) : articles.length === 0 ? (
//               <Grid size={12}>
//                 <Box sx={{ py: { xs: 4, sm: 8 }, display: 'flex', justifyContent: 'center' }}>
//                   {/* Info — green AppAlert */}
//                   <AppAlert severity="info" sx={{ maxWidth: 400 }}>
//                     No articles found. Try a different category or source.
//                   </AppAlert>
//                 </Box>
//               </Grid>
//             ) : (
//               articles.map(article => (
//                 <Grid key={article.id} size={gridSize}><NewsCard article={article} /></Grid>
//               ))
//             )}
//           </Grid>

//           {/* Footer */}
//           {!loading && articles.length > 0 && (
//             <Box sx={{ mt: { xs: 2.5, sm: 5 }, pt: { xs: 1.5, sm: 3 }, borderTop: `1px solid ${c.border}`, textAlign: 'center' }}>
//               <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mb: 1.25 }}>
//                 {['#4285f4', '#ea4335', '#fbbc04', '#34a853'].map(col => (
//                   <Box key={col} sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: col, opacity: 0.75 }} />
//                 ))}
//               </Box>
//               <Typography sx={{ fontFamily: GS, fontSize: { xs: '0.6rem', sm: '0.72rem' }, color: c.inkMuted }}>
//                 Sourced from GNews, Hacker News &amp; Dev.to · Refreshed every 10 min
//               </Typography>
//             </Box>
//           )}
//         </Container>
//       </Box>
//     </MainLayout>
//   );
// }