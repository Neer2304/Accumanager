import React from 'react';

export const CategoryIcons: Record<string, string> = {
  food: '🍕',
  transport: '🚗',
  entertainment: '🎬',
  shopping: '🛍️',
  bills: '📄',
  healthcare: '🏥',
  education: '📚',
  travel: '✈️',
  business: '💼',
  personal: '👤',
  other: '📦',
};

export const getCategoryIcon = (category: string): string => {
  return CategoryIcons[category] || '📦';
};