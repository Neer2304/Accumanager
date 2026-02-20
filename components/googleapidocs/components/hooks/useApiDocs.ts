// components/googleapidocs/hooks/useApiDocs.ts
import { useState, useMemo, useCallback } from 'react';
import { endpoints, categories } from '@/components/googleapidocs/constants/endpoints';
import { Endpoint } from '../types';

export const useApiDocs = () => {
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredEndpoints = useMemo(() => {
    return endpoints.filter(endpoint => {
      const matchesSearch = endpoint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           endpoint.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || endpoint.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const stats = useMemo(() => ({
    totalEndpoints: endpoints.length,
    authRequired: endpoints.filter(e => e.requiresAuth).length,
    categories: categories.length - 1,
    methods: 4
  }), []);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const getMethodColor = useCallback((method: string) => {
    switch (method) {
      case 'GET': return '#34a853'; // Green
      case 'POST': return '#4285f4'; // Blue
      case 'PUT': return '#fbbc04'; // Yellow
      case 'DELETE': return '#ea4335'; // Red
      default: return '#5f6368';
    }
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
  }, []);

  return {
    endpoints,
    filteredEndpoints,
    categories,
    expandedEndpoint,
    searchQuery,
    selectedCategory,
    stats,
    setExpandedEndpoint,
    setSearchQuery,
    setSelectedCategory,
    handleCopy,
    getMethodColor,
    clearFilters
  };
};