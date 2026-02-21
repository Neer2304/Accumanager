// components/googleadminlayout/hooks/useAdminLayout.ts
import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme, useMediaQuery } from '@mui/material';
import { User } from '../components/types';

export const useAdminLayout = () => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const darkMode = theme.palette.mode === 'dark';

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/auth/me');
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        if (!['/admin/login', '/admin/setup'].includes(pathname)) {
          router.push('/admin/login');
        }
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setError('Authentication failed');
      if (!['/admin/login', '/admin/setup'].includes(pathname)) {
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Logout failed');
    }
  }, [router]);

  const handleMobileMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setMobileMenuAnchor(null);
  }, []);

  const handleDrawerOpen = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleNavigation = useCallback((path: string) => {
    router.push(path);
    setDrawerOpen(false);
    setMobileMenuAnchor(null);
  }, [router]);

  return {
    user,
    loading,
    error,
    drawerOpen,
    mobileMenuAnchor,
    isMobile,
    isTablet,
    darkMode,
    setError,
    handleLogout,
    handleMobileMenuOpen,
    handleMobileMenuClose,
    handleDrawerOpen,
    handleDrawerClose,
    handleNavigation,
  };
};