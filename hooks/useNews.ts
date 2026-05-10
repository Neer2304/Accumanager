// /**
//  * useNews.ts — custom hook for the /api/news endpoint
//  *
//  * Usage:
//  *   const { articles, loading, error, refresh, setCategory, setSource } = useNews();
//  */

// import { useState, useEffect, useCallback } from 'react';
// import { useMediaQuery, useTheme } from '@mui/material';
// // import { NewsArticle, NewsCategory } from ';

// interface UseNewsState {
//   articles: NewsArticle[];
//   loading: boolean;
//   refreshing: boolean;
//   error: string | null;
//   category: NewsCategory;
//   source: string;
// }

// interface UseNewsReturn extends UseNewsState {
//   setCategory: (c: NewsCategory) => void;
//   setSource: (s: string) => void;
//   refresh: () => Promise<void>;
//   clearError: () => void;
// }

// export function useNews(
//   initialCategory: NewsCategory = 'general',
//   initialSource = 'all',
// ): UseNewsReturn {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const [articles,   setArticles]   = useState<NewsArticle[]>([]);
//   const [loading,    setLoading]    = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error,      setError]      = useState<string | null>(null);
//   const [category,   setCategory]   = useState<NewsCategory>(initialCategory);
//   const [source,     setSource]     = useState(initialSource);

//   const fetchNews = useCallback(
//     async (isRefresh = false) => {
//       try {
//         if (isRefresh) setRefreshing(true);
//         else setLoading(true);

//         setError(null);

//         const limit = isMobile ? 12 : 24;
//         const res   = await fetch(
//           `/api/news?category=${category}&source=${source}&limit=${limit}`,
//         );

//         if (!res.ok) {
//           throw new Error(`HTTP ${res.status}: Failed to fetch news`);
//         }

//         const data = await res.json();

//         if (data.success) {
//           setArticles(data.data ?? []);
//         } else {
//           setError(data.message || 'Failed to fetch news');
//         }
//       } catch (err: unknown) {
//         const message =
//           err instanceof Error ? err.message : 'Failed to fetch news. Please try again.';
//         setError(message);
//         console.error('[useNews]', err);
//       } finally {
//         setLoading(false);
//         setRefreshing(false);
//       }
//     },
//     [category, source, isMobile],
//   );

//   // Re-fetch whenever category / source / screen-size changes
//   useEffect(() => {
//     fetchNews(false);
//   }, [fetchNews]);

//   const refresh = useCallback(async () => {
//     await fetchNews(true);
//   }, [fetchNews]);

//   const clearError = useCallback(() => setError(null), []);

//   return {
//     articles,
//     loading,
//     refreshing,
//     error,
//     category,
//     source,
//     setCategory,
//     setSource,
//     refresh,
//     clearError,
//   };
// }