// components/googleapidocs/components/ApiEndpointList.tsx
import React from 'react';
import {
  Stack,
  useTheme
} from '@mui/material';
import { Endpoint } from './types';
import { ApiEndpointCard } from './ApiEndpointCard';

interface ApiEndpointListProps {
  endpoints: Endpoint[];
  expandedEndpoint: string | null;
  onToggleEndpoint: (endpointId: string) => void;
  onCopy: (text: string) => void;
  getMethodColor: (method: string) => string;
  darkMode: boolean;
}

export const ApiEndpointList: React.FC<ApiEndpointListProps> = ({
  endpoints,
  expandedEndpoint,
  onToggleEndpoint,
  onCopy,
  getMethodColor,
  darkMode
}) => {
  return (
    <Stack spacing={2}>
      {endpoints.map((endpoint) => (
        <ApiEndpointCard
          key={endpoint.id}
          endpoint={endpoint}
          isExpanded={expandedEndpoint === endpoint.id}
          onToggle={() => onToggleEndpoint(endpoint.id)}
          onCopy={onCopy}
          getMethodColor={getMethodColor}
          darkMode={darkMode}
        />
      ))}
    </Stack>
  );
};