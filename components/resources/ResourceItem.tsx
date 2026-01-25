// components/resources/ResourceItem.tsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Description as PdfIcon,
  VideoLibrary as VideoIcon,
  TableChart as ExcelIcon,
  Description as WordIcon,
  Checklist as ChecklistIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  OpenInNew as OpenIcon,
} from '@mui/icons-material';
import { ResourceItem as ResourceItemType } from './data/resourcesData';

interface ResourceItemProps {
  item: ResourceItemType;
  isLast: boolean;
  categoryColor: string;
}

export const ResourceItem: React.FC<ResourceItemProps> = ({
  item,
  isLast,
  categoryColor,
}) => {
  const theme = useTheme();

  // Get icon based on resource type
  const getIcon = () => {
    switch (item.type) {
      case 'PDF Guide':
        return <PdfIcon color="action" />;
      case 'Video':
        return <VideoIcon color="action" />;
      case 'Excel Template':
        return <ExcelIcon color="action" />;
      case 'Word Template':
        return <WordIcon color="action" />;
      case 'Checklist':
        return <ChecklistIcon color="action" />;
      case 'Phone':
        return <PhoneIcon color="action" />;
      case 'Email':
        return <EmailIcon color="action" />;
      case 'WhatsApp':
        return <WhatsAppIcon color="action" />;
      case 'Calendar':
        return <CalendarIcon color="action" />;
      default:
        return <OpenIcon color="action" />;
    }
  };

  // Get button text and action
  const getButtonConfig = () => {
    if (item.type === 'Phone' || item.type === 'Email' || item.type === 'WhatsApp' || item.type === 'Calendar') {
      return {
        text: item.type === 'Phone' ? 'Call Now' : 
              item.type === 'Email' ? 'Email Now' :
              item.type === 'WhatsApp' ? 'Chat Now' : 'Book Now',
        icon: item.type === 'Phone' ? <PhoneIcon /> :
              item.type === 'Email' ? <EmailIcon /> :
              item.type === 'WhatsApp' ? <WhatsAppIcon /> : <CalendarIcon />,
        action: () => window.open(item.url, '_blank')
      };
    } else if (item.type.includes('PDF') || item.type.includes('Template') || item.type === 'Checklist') {
      return {
        text: 'Download',
        icon: <DownloadIcon />,
        action: () => {
          const link = document.createElement('a');
          link.href = item.url;
          link.download = item.title;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      };
    } else {
      return {
        text: 'Open',
        icon: <OpenIcon />,
        action: () => window.open(item.url, '_blank')
      };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          mb: isLast ? 0 : 2,
          bgcolor: alpha(theme.palette.action.hover, 0.3),
          border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: alpha(categoryColor, 0.05),
            borderColor: alpha(categoryColor, 0.3),
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(categoryColor, 0.1),
              color: categoryColor,
              flexShrink: 0,
              mt: 0.5,
            }}
          >
            {getIcon()}
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {item.title}
              </Typography>
              <Chip
                label={item.type}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  bgcolor: alpha(categoryColor, 0.1),
                  color: categoryColor,
                }}
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {item.description}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Size: {item.size}
              </Typography>
              {item.detail && (
                <Typography variant="caption" fontWeight="medium" color="primary">
                  {item.detail}
                </Typography>
              )}
              {item.tags && item.tags.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {item.tags.slice(0, 2).map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.65rem' }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
          
          <Button
            variant="contained"
            size="small"
            startIcon={buttonConfig.icon}
            onClick={buttonConfig.action}
            sx={{
              bgcolor: categoryColor,
              '&:hover': {
                bgcolor: alpha(categoryColor, 0.8),
              },
              minWidth: 100,
              whiteSpace: 'nowrap',
            }}
          >
            {buttonConfig.text}
          </Button>
        </Box>
      </Box>
      
      {!isLast && <Divider />}
    </>
  );
};