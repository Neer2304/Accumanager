import React from 'react';
import { SecurityIcon } from '@/components/security/SecurityIcons';

interface FeatureListProps {
  features: string[];
  icon?: string;
  iconColor?: string;
}

export const FeatureList = ({ features, icon = 'CheckCircle', iconColor = 'text-green-500' }: FeatureListProps) => {
  return (
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <SecurityIcon name={icon as any} size="small" className={`${iconColor} mr-2 mt-0.5 flex-shrink-0`} />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
};