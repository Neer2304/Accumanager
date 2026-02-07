// components/team-activity/ProjectsOverviewSection.tsx
import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
} from '@mui/material';
import { Card } from '@/components/ui/Card';
import { ProjectProgress } from './types';

interface ProjectsOverviewSectionProps {
  projects: ProjectProgress[];
  darkMode: boolean;
}

const ProjectsOverviewSection: React.FC<ProjectsOverviewSectionProps> = ({
  projects,
  darkMode,
}) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#34a853';
    if (progress >= 50) return '#fbbc04';
    return '#ea4335';
  };

  return (
    <Card
      title="Projects Overview"
      subtitle={`${projects.length} active projects`}
      hover
      sx={{
        backgroundColor: darkMode ? '#202124' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        {projects.slice(0, 3).map((project) => (
          <Box key={project.id} sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" fontWeight={600}>
                {project.name}
              </Typography>
              <Typography variant="body2" sx={{ color: getProgressColor(project.progress) }}>
                {project.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={project.progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: darkMode ? '#3c4043' : '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getProgressColor(project.progress),
                  borderRadius: 4,
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                {project.members} members
              </Typography>
              <Typography variant="caption" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                Due: {new Date(project.deadline).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export default ProjectsOverviewSection;