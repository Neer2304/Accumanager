'use client';

// app/blog/[slug]/page.tsx
// Google Material Design 3 themed blog post page - matching blog listing page

import { useState, useEffect, useCallback, JSX } from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Divider,
  Paper,
  IconButton,
  Button,
  Breadcrumbs,
  useTheme,
  alpha,
  useMediaQuery,
  Snackbar,
  Skeleton,
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack,
  Schedule,
  Visibility,
  Person,
  Category as CategoryIcon,
  LocalFireDepartment,
  TrendingUp,
  BookmarkBorder,
  Bookmark,
  AutoAwesome,
  MenuBook,
  LibraryBooks,
  Code,
  Business,
  Speed,
  Psychology,
  NewReleases,
  Whatshot,
  AccessTime,
  CalendarToday,
  Share,
  Favorite,
  FavoriteBorder,
  Download,
  Print,
  Link as LinkIcon,
  Check,
  Email,
  Facebook,
  Twitter,
  LinkedIn,
  WhatsApp,
} from '@mui/icons-material';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RelatedPost {
  id: string; title: string; slug: string;
  excerpt: string; readTime: number; coverImage: string;
}
interface Post {
  id: string; title: string; slug: string; excerpt: string; content: string;
  author: { name: string; role: string; avatar?: string };
  category: { id: string; name: string; slug: string };
  tags: string[]; coverImage: string; readTime: number;
  featured: boolean; publishedAt: string;
  views: number; likes: number; relatedPosts: RelatedPost[];
}

// ─── Google colors matching blog page ───────────────────────────────────────

const google = {
  blue: '#4285f4',
  blueLight: '#e8f0fe',
  blueDark: '#3367d6',
  green: '#34a853',
  greenLight: '#e6f4ea',
  yellow: '#fbbc04',
  yellowLight: '#fef7e0',
  red: '#ea4335',
  redLight: '#fce8e6',
  grey: '#5f6368',
  greyLight: '#f8f9fa',
  greyBorder: '#dadce0',
  greyDark: '#3c4043',
  white: '#ffffff',
  black: '#202124',
};

// Category icons mapping (same as blog listing)
const categoryIcons: Record<string, JSX.Element> = {
  'development': <Code sx={{ fontSize: 18 }} />,
  'business': <Business sx={{ fontSize: 18 }} />,
  'productivity': <Speed sx={{ fontSize: 18 }} />,
  'psychology': <Psychology sx={{ fontSize: 18 }} />,
  'tutorial': <MenuBook sx={{ fontSize: 18 }} />,
  'news': <NewReleases sx={{ fontSize: 18 }} />,
  'technology': <AutoAwesome sx={{ fontSize: 18 }} />,
  'design': <AutoAwesome sx={{ fontSize: 18 }} />,
  'marketing': <TrendingUp sx={{ fontSize: 18 }} />,
};

// ─── Detect if content is HTML ────────────────────────────────────────────────

const isHTML = (s: string) => /<[a-z][\s\S]*>/i.test(s);

// Strip HTML tags to count words for read-time
const stripHTML = (s: string) => s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

// ─── Reading progress bar ─────────────────────────────────────────────────────

function ReadingProgressBar({ darkMode }: { darkMode: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(progress);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 9999,
        pointerEvents: 'none',
        bgcolor: darkMode ? alpha(google.greyDark, 0.3) : alpha(google.greyLight, 0.8),
      }}
    >
      <Box
        sx={{
          height: '100%',
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${google.blue}, ${google.green}, ${google.yellow}, ${google.red})`,
          transition: 'width 0.1s ease',
        }}
      />
    </Box>
  );
}

// ─── Scroll to top button ────────────────────────────────────────────────────

function ScrollToTop({ darkMode }: { darkMode: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!show) return null;

  return (
    <IconButton
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 999,
        bgcolor: google.blue,
        color: google.white,
        width: 48,
        height: 48,
        '&:hover': {
          bgcolor: google.blueDark,
          transform: 'scale(1.1)',
        },
        transition: 'all 0.2s',
        boxShadow: `0 4px 12px ${alpha(google.blue, 0.4)}`,
      }}
    >
      <ArrowBack sx={{ transform: 'rotate(90deg)' }} />
    </IconButton>
  );
}

// ─── Table of contents ────────────────────────────────────────────────────────

function TableOfContents({ content, darkMode }: { content: string; darkMode: boolean }) {
  const [activeId, setActiveId] = useState('');

  const headings = (content?.split('\n') ?? [])
    .filter(line => /^#{1,3}\s/.test(line))
    .map(heading => ({
      level: heading.match(/^#+/)?.[0].length ?? 1,
      text: heading.replace(/^#+\s*/, '').trim(),
      id: heading
        .replace(/^#+\s*/, '')
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-'),
    }));

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 100;
      for (let i = headings.length - 1; i >= 0; i--) {
        const element = document.getElementById(headings[i].id);
        if (element && element.offsetTop <= scrollY) {
          setActiveId(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (!headings.length) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: darkMode ? alpha(google.greyDark, 0.5) : google.greyLight,
        border: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
        position: 'sticky',
        top: 80,
        maxHeight: 'calc(100vh - 96px)',
        overflowY: 'auto',
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2,
          color: darkMode ? '#e8eaed' : google.black,
          fontWeight: 600,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.5px',
        }}
      >
        <MenuBook sx={{ fontSize: 16, color: google.blue }} />
        Contents
      </Typography>
      <Divider sx={{ mb: 2, borderColor: darkMode ? google.greyDark : google.greyBorder }} />
      {headings.map((heading, index) => (
        <Button
          key={index}
          onClick={() => {
            document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
          }}
          sx={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            justifyContent: 'flex-start',
            p: 1,
            pl: 1 + (heading.level - 1) * 2,
            mb: 0.5,
            borderRadius: 2,
            bgcolor: activeId === heading.id ? alpha(google.blue, 0.1) : 'transparent',
            color: activeId === heading.id ? google.blue : darkMode ? '#9aa0a6' : google.grey,
            fontSize: '0.875rem',
            fontWeight: activeId === heading.id ? 600 : 400,
            textTransform: 'none',
            '&:hover': {
              bgcolor: alpha(google.blue, 0.1),
              color: google.blue,
            },
          }}
        >
          {heading.text}
        </Button>
      ))}
    </Paper>
  );
}

// ─── Share button ─────────────────────────────────────────────────────────────

function ShareButton({ 
  label, 
  icon, 
  color, 
  onClick,
  darkMode 
}: { 
  label: string; 
  icon: React.ReactNode; 
  color: string; 
  onClick: () => void;
  darkMode: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <IconButton
      aria-label={label}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        color: hovered ? color : darkMode ? '#9aa0a6' : google.grey,
        bgcolor: hovered ? alpha(color, 0.1) : 'transparent',
        '&:hover': {
          bgcolor: alpha(color, 0.1),
        },
        transition: 'all 0.2s',
      }}
    >
      {icon}
    </IconButton>
  );
}

// ─── Skeleton loader ─────────────────────────────────────────────────────────

function PostSkeleton({ darkMode }: { darkMode: boolean }) {
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Skeleton variant="text" width={120} height={24} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="80%" height={48} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={48} sx={{ mb: 3 }} />
      
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width={150} height={20} />
          <Skeleton variant="text" width={200} height={16} />
        </Box>
      </Box>

      <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3, mb: 4 }} />
      
      {[1, 2, 3, 4, 5].map(i => (
        <Skeleton key={i} variant="text" height={20} sx={{ mb: 1 }} />
      ))}
    </Box>
  );
}

// ─── Content renderer ────────────────────────────────────────────────────────

function BlogContent({ content, darkMode }: { content: string; darkMode: boolean }) {
  const [Markdown, setMarkdown] = useState<any>(null);

  useEffect(() => {
    if (!isHTML(content)) {
      import('react-markdown').then(mod => setMarkdown(() => mod.default));
    }
  }, [content]);

  if (isHTML(content)) {
    return (
      <Box
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: content }}
        sx={{
          '& h1, & h2, & h3, & h4': {
            color: darkMode ? '#e8eaed' : google.black,
            fontWeight: 600,
            scrollMarginTop: 80,
          },
          '& h1': { fontSize: '2rem', mb: 2, pb: 1, borderBottom: `2px solid ${darkMode ? google.greyDark : google.greyBorder}` },
          '& h2': { fontSize: '1.5rem', mb: 2 },
          '& h3': { fontSize: '1.25rem', mb: 1.5 },
          '& p': { fontSize: '1rem', lineHeight: 1.7, mb: 2, color: darkMode ? '#e8eaed' : google.black },
          '& ul, & ol': { pl: 3, mb: 2 },
          '& li': { mb: 0.5, color: darkMode ? '#e8eaed' : google.black },
          '& li::marker': { color: google.blue },
          '& code': {
            bgcolor: darkMode ? alpha(google.greyDark, 0.5) : google.greyLight,
            p: '2px 6px',
            borderRadius: 1,
            fontSize: '0.875rem',
            color: google.red,
          },
          '& pre': {
            bgcolor: darkMode ? '#0c0d10' : google.greyLight,
            p: 2,
            borderRadius: 2,
            overflow: 'auto',
            border: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
          },
          '& blockquote': {
            borderLeft: `4px solid ${google.blue}`,
            pl: 2,
            py: 0.5,
            my: 2,
            bgcolor: alpha(google.blue, 0.05),
            borderRadius: '0 8px 8px 0',
            fontStyle: 'italic',
          },
          '& img': {
            maxWidth: '100%',
            borderRadius: 2,
            border: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
          },
          '& a': {
            color: google.blue,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          },
        }}
      />
    );
  }

  if (!Markdown) {
    return (
      <Box sx={{ color: darkMode ? '#9aa0a6' : google.grey, p: 2 }}>
        Loading content...
      </Box>
    );
  }

  return (
    <Box
      className="blog-content"
      sx={{
        '& h1, & h2, & h3, & h4': {
          color: darkMode ? '#e8eaed' : google.black,
          fontWeight: 600,
          scrollMarginTop: 80,
        },
        '& h1': { fontSize: '2rem', mb: 2, pb: 1, borderBottom: `2px solid ${darkMode ? google.greyDark : google.greyBorder}` },
        '& h2': { fontSize: '1.5rem', mb: 2 },
        '& h3': { fontSize: '1.25rem', mb: 1.5 },
        '& p': { fontSize: '1rem', lineHeight: 1.7, mb: 2, color: darkMode ? '#e8eaed' : google.black },
        '& ul, & ol': { pl: 3, mb: 2 },
        '& li': { mb: 0.5, color: darkMode ? '#e8eaed' : google.black },
        '& li::marker': { color: google.blue },
        '& code': {
          bgcolor: darkMode ? alpha(google.greyDark, 0.5) : google.greyLight,
          p: '2px 6px',
          borderRadius: 1,
          fontSize: '0.875rem',
          color: google.red,
        },
        '& pre': {
          bgcolor: darkMode ? '#0c0d10' : google.greyLight,
          p: 2,
          borderRadius: 2,
          overflow: 'auto',
          border: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
        },
        '& blockquote': {
          borderLeft: `4px solid ${google.blue}`,
          pl: 2,
          py: 0.5,
          my: 2,
          bgcolor: alpha(google.blue, 0.05),
          borderRadius: '0 8px 8px 0',
          fontStyle: 'italic',
        },
        '& img': {
          maxWidth: '100%',
          borderRadius: 2,
          border: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
        },
        '& a': {
          color: google.blue,
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        },
      }}
    >
      <Markdown>{content}</Markdown>
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function BlogPostContent() {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const darkMode = theme.palette.mode === 'dark';
  
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readTime, setReadTime] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const loadPost = useCallback(async () => {
    if (!slug) {
      setError('Invalid post slug');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/blog/${slug}`);
      const data = await res.json();
      
      if (data.success) {
        setPost(data.data);
        const words = stripHTML(data.data.content ?? '').split(/\s+/).filter(Boolean).length;
        setReadTime(Math.max(1, Math.ceil(words / 200)) || data.data.readTime || 5);
      } else {
        setError(data.message || 'Post not found');
      }
    } catch {
      setError('Failed to load post.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const share = async (platform: string) => {
    const url = window.location.href;
    const title = post?.title ?? '';
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out this article: ' + url)}`,
    };

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setSnackbar({ open: true, message: 'Link copied to clipboard!' });
        setTimeout(() => setCopied(false), 2000);
      } catch {
        setSnackbar({ open: true, message: 'Failed to copy link' });
      }
    } else {
      window.open(shareUrls[platform], '_blank');
    }
  };

  const download = () => {
    if (!post) return;
    
    const text = stripHTML(post.content);
    const blob = new Blob([`# ${post.title}\n\n${post.excerpt}\n\n${text}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${post.slug}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    setSnackbar({ open: true, message: 'Article downloaded!' });
  };

  // Loading state
  if (loading) {
    return (
      <MainLayout title="Blog Post">
        <Box sx={{ 
          bgcolor: darkMode ? google.black : google.white,
          minHeight: '100vh',
        }}>
          <PostSkeleton darkMode={darkMode} />
        </Box>
      </MainLayout>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <MainLayout title="Blog Post">
        <Box sx={{ 
          bgcolor: darkMode ? google.black : google.white,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              textAlign: 'center',
              maxWidth: 400,
              bgcolor: darkMode ? google.greyDark : google.white,
              border: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
            }}
          >
            <MenuBook sx={{ fontSize: 64, color: alpha(google.blue, 0.3), mb: 2 }} />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Article Not Found
            </Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : google.grey, mb: 3 }}>
              {error || "This article doesn't exist or was removed."}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => router.back()}
                startIcon={<ArrowBack />}
                sx={{
                  borderColor: darkMode ? google.greyDark : google.greyBorder,
                  color: darkMode ? '#e8eaed' : google.black,
                }}
              >
                Go Back
              </Button>
              <Button
                variant="contained"
                component={Link}
                href="/blog"
                sx={{
                  bgcolor: google.blue,
                  '&:hover': { bgcolor: google.blueDark },
                }}
              >
                Browse Articles
              </Button>
            </Box>
          </Paper>
        </Box>
      </MainLayout>
    );
  }

  const publishDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <MainLayout title={`${post.title} - AccuManage Blog`}>
      <Box sx={{ 
        bgcolor: darkMode ? google.black : google.white,
        color: darkMode ? '#e8eaed' : google.black,
        minHeight: '100vh',
      }}>
        {/* Reading Progress Bar */}
        <ReadingProgressBar darkMode={darkMode} />

        {/* Header with breadcrumbs */}
        <Box sx={{ 
          p: { xs: 2, sm: 3 },
          borderBottom: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
          background: darkMode 
            ? 'linear-gradient(135deg, #1a237e 0%, #202124 100%)'
            : 'linear-gradient(135deg, #e8f0fe 0%, #ffffff 100%)',
        }}>
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', color: darkMode ? '#9aa0a6' : google.grey }}>
                <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                <Typography variant="body2">Dashboard</Typography>
              </Box>
            </Link>
            <Link href="/blog" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                Blog
              </Typography>
            </Link>
            <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : google.black, fontWeight: 500 }}>
              {post.title.length > 30 ? `${post.title.substring(0, 30)}...` : post.title}
            </Typography>
          </Breadcrumbs>

          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
            sx={{
              color: darkMode ? '#e8eaed' : google.black,
              '&:hover': {
                bgcolor: darkMode ? alpha(google.white, 0.05) : alpha(google.black, 0.05),
              },
            }}
          >
            Back to Blog
          </Button>
        </Box>

        {/* Main Content */}
        <Box sx={{ 
          maxWidth: 1400, 
          mx: 'auto', 
          p: { xs: 2, sm: 3 },
        }}>
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 3,
          }}>
            {/* Left Sidebar - Table of Contents (Desktop only) */}
            {!isTablet && (
              <Box sx={{ width: 260, flexShrink: 0 }}>
                <TableOfContents content={post.content} darkMode={darkMode} />
              </Box>
            )}

            {/* Main Article */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Category and Featured Badge */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={categoryIcons[post.category?.slug] || <LibraryBooks />}
                  label={post.category?.name || 'Uncategorized'}
                  size="small"
                  sx={{
                    bgcolor: alpha(google.blue, 0.1),
                    color: google.blue,
                    fontWeight: 500,
                    '& .MuiChip-icon': { color: google.blue },
                  }}
                />
                {post.featured && (
                  <Chip
                    icon={<AutoAwesome />}
                    label="Featured"
                    size="small"
                    sx={{
                      bgcolor: alpha(google.yellow, 0.1),
                      color: google.yellow,
                      fontWeight: 500,
                      '& .MuiChip-icon': { color: google.yellow },
                    }}
                  />
                )}
              </Box>

              {/* Title */}
              <Typography 
                variant={isMobile ? 'h4' : 'h3'} 
                fontWeight={600} 
                gutterBottom
                sx={{
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                  lineHeight: 1.2,
                  mb: 3,
                }}
              >
                {post.title}
              </Typography>

              {/* Author Info */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2,
                  bgcolor: darkMode ? alpha(google.greyDark, 0.5) : google.greyLight,
                  border: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
                  borderRadius: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={post.author?.avatar}
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: google.blue,
                    }}
                  >
                    {post.author?.name?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {post.author?.name || 'Anonymous'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                      {post.author?.role || 'Author'} · {publishDate}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTime sx={{ fontSize: 16, color: google.blue }} />
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                      {readTime} min read
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Visibility sx={{ fontSize: 16, color: google.yellow }} />
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                      {post.views?.toLocaleString()} views
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Cover Image (if exists) */}
              {post.coverImage && (
                <Box
                  component="img"
                  src={post.coverImage}
                  alt={post.title}
                  sx={{
                    width: '100%',
                    maxHeight: 500,
                    objectFit: 'cover',
                    borderRadius: 3,
                    mb: 4,
                    border: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
                  }}
                />
              )}

              {/* Excerpt */}
              {post.excerpt && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 4,
                    bgcolor: darkMode ? alpha(google.green, 0.1) : alpha(google.green, 0.05),
                    borderLeft: `4px solid ${google.green}`,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1" sx={{ fontStyle: 'italic', color: darkMode ? '#e8eaed' : google.black }}>
                    {post.excerpt}
                  </Typography>
                </Paper>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: darkMode ? '#9aa0a6' : google.grey }}>
                    Topics
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {post.tags.map(tag => (
                      <Chip
                        key={tag}
                        label={`# ${tag}`}
                        size="small"
                        onClick={() => router.push(`/blog?tag=${tag}`)}
                        sx={{
                          bgcolor: darkMode ? alpha(google.blue, 0.1) : alpha(google.blue, 0.05),
                          color: darkMode ? '#e8eaed' : google.black,
                          border: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
                          '&:hover': {
                            bgcolor: alpha(google.blue, 0.2),
                            borderColor: google.blue,
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Article Content */}
              <Box sx={{ mb: 4 }}>
                <BlogContent content={post.content} darkMode={darkMode} />
              </Box>

              {/* Google Colors Divider */}
              <Box sx={{ display: 'flex', gap: 1, my: 4 }}>
                {[google.blue, google.red, google.yellow, google.green].map(color => (
                  <Box key={color} sx={{ flex: 1, height: 4, borderRadius: 2, bgcolor: color }} />
                ))}
              </Box>

              {/* Engagement Buttons */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2,
                  bgcolor: darkMode ? alpha(google.greyDark, 0.5) : google.greyLight,
                  border: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
                  borderRadius: 3,
                }}
              >
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant={liked ? 'contained' : 'outlined'}
                    startIcon={liked ? <Favorite /> : <FavoriteBorder />}
                    onClick={() => setLiked(!liked)}
                    sx={{
                      bgcolor: liked ? google.red : 'transparent',
                      borderColor: liked ? google.red : darkMode ? google.greyDark : google.greyBorder,
                      color: liked ? '#fff' : darkMode ? '#e8eaed' : google.black,
                      '&:hover': {
                        bgcolor: liked ? google.red : alpha(google.red, 0.1),
                        borderColor: google.red,
                      },
                    }}
                  >
                    {liked ? 'Liked' : 'Like'} ({post.likes || 0})
                  </Button>
                  <Button
                    variant={saved ? 'contained' : 'outlined'}
                    startIcon={saved ? <Bookmark /> : <BookmarkBorder />}
                    onClick={() => setSaved(!saved)}
                    sx={{
                      bgcolor: saved ? google.blue : 'transparent',
                      borderColor: saved ? google.blue : darkMode ? google.greyDark : google.greyBorder,
                      color: saved ? '#fff' : darkMode ? '#e8eaed' : google.black,
                      '&:hover': {
                        bgcolor: saved ? google.blue : alpha(google.blue, 0.1),
                        borderColor: google.blue,
                      },
                    }}
                  >
                    {saved ? 'Saved' : 'Save'}
                  </Button>
                </Box>
                <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                  {post.likes || 0} people found this helpful
                </Typography>
              </Paper>

              {/* Share Bar */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2,
                  bgcolor: darkMode ? alpha(google.greyDark, 0.5) : google.greyLight,
                  border: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
                  borderRadius: 3,
                }}
              >
                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Share fontSize="small" />
                  Share
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <ShareButton
                    label="Share on X"
                    icon={<Twitter />}
                    color="#000000"
                    onClick={() => share('twitter')}
                    darkMode={darkMode}
                  />
                  <ShareButton
                    label="Share on LinkedIn"
                    icon={<LinkedIn />}
                    color="#0a66c2"
                    onClick={() => share('linkedin')}
                    darkMode={darkMode}
                  />
                  <ShareButton
                    label="Share on Facebook"
                    icon={<Facebook />}
                    color="#1877f2"
                    onClick={() => share('facebook')}
                    darkMode={darkMode}
                  />
                  <ShareButton
                    label="Share on WhatsApp"
                    icon={<WhatsApp />}
                    color="#25d366"
                    onClick={() => share('whatsapp')}
                    darkMode={darkMode}
                  />
                  <ShareButton
                    label="Share via Email"
                    icon={<Email />}
                    color={google.red}
                    onClick={() => share('email')}
                    darkMode={darkMode}
                  />
                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                  <ShareButton
                    label={copied ? 'Copied!' : 'Copy link'}
                    icon={copied ? <Check /> : <LinkIcon />}
                    color={copied ? google.green : google.grey}
                    onClick={() => share('copy')}
                    darkMode={darkMode}
                  />
                  <ShareButton
                    label="Download"
                    icon={<Download />}
                    color={google.yellow}
                    onClick={download}
                    darkMode={darkMode}
                  />
                  <ShareButton
                    label="Print"
                    icon={<Print />}
                    color={google.grey}
                    onClick={() => window.print()}
                    darkMode={darkMode}
                  />
                </Box>
              </Paper>

              {/* Mobile Related Posts */}
              {post.relatedPosts && post.relatedPosts.length > 0 && isTablet && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Related Articles
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {post.relatedPosts.map(related => (
                      <Link
                        key={related.id}
                        href={`/blog/${related.slug}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: darkMode ? google.greyDark : google.white,
                            border: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
                            borderRadius: 3,
                            transition: 'all 0.2s',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: darkMode 
                                ? '0 4px 12px rgba(0,0,0,0.5)'
                                : '0 4px 12px rgba(0,0,0,0.1)',
                            },
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            {related.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : google.grey, mb: 1 }}>
                            {related.excerpt.substring(0, 100)}...
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime sx={{ fontSize: 14, color: google.blue }} />
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                              {related.readTime} min read
                            </Typography>
                          </Box>
                        </Paper>
                      </Link>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Right Sidebar - Related Posts (Desktop only) */}
            {!isTablet && (
              <Box sx={{ width: 280, flexShrink: 0 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: darkMode ? alpha(google.greyDark, 0.5) : google.greyLight,
                    border: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
                    position: 'sticky',
                    top: 80,
                    maxHeight: 'calc(100vh - 96px)',
                    overflowY: 'auto',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 2,
                      color: darkMode ? '#e8eaed' : google.black,
                      fontWeight: 600,
                    }}
                  >
                    <LibraryBooks sx={{ fontSize: 16, color: google.green }} />
                    Related Articles
                  </Typography>
                  <Divider sx={{ mb: 2, borderColor: darkMode ? google.greyDark : google.greyBorder }} />

                  {post.relatedPosts && post.relatedPosts.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {post.relatedPosts.map(related => (
                        <Link
                          key={related.id}
                          href={`/blog/${related.slug}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              bgcolor: darkMode ? google.greyDark : google.white,
                              border: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
                              borderRadius: 2,
                              transition: 'all 0.2s',
                              '&:hover': {
                                bgcolor: darkMode ? alpha(google.white, 0.05) : alpha(google.black, 0.02),
                                transform: 'translateX(4px)',
                              },
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                              {related.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey, display: 'block', mb: 1 }}>
                              {related.excerpt.substring(0, 60)}...
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AccessTime sx={{ fontSize: 12, color: google.blue }} />
                              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey }}>
                                {related.readTime} min read
                              </Typography>
                            </Box>
                          </Paper>
                        </Link>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : google.grey, textAlign: 'center', py: 2 }}>
                      No related articles
                    </Typography>
                  )}

                  <Divider sx={{ my: 2, borderColor: darkMode ? google.greyDark : google.greyBorder }} />

                  {/* Newsletter CTA */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(google.blue, 0.1),
                      border: `1px solid ${alpha(google.blue, 0.3)}`,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Stay updated
                    </Typography>
                    <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : google.grey, display: 'block', mb: 2 }}>
                      Get the latest articles in your inbox
                    </Typography>
                    <Button
                      component={Link}
                      href="/newsletter"
                      fullWidth
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: google.blue,
                        '&:hover': { bgcolor: google.blueDark },
                      }}
                    >
                      Subscribe
                    </Button>
                  </Paper>
                </Paper>
              </Box>
            )}
          </Box>
        </Box>

        {/* Scroll to Top Button */}
        <ScrollToTop darkMode={darkMode} />

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          ContentProps={{
            sx: {
              bgcolor: darkMode ? google.greyDark : google.white,
              color: darkMode ? '#e8eaed' : google.black,
              border: `1px solid ${darkMode ? google.greyDark : google.greyBorder}`,
              borderRadius: 2,
            },
          }}
        />
      </Box>
    </MainLayout>
  );
}

export default function SingleBlogPostPage() {
  return <BlogPostContent />;
}