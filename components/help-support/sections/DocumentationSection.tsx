import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { HelpSupportIcon } from '../HelpSupportIcons';
import { HELP_SUPPORT_CONTENT } from '../HelpSupportContent';

interface DocumentationSectionProps {
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCategorySelect: (category: string) => void;
}

export const DocumentationSection = ({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategorySelect,
}: DocumentationSectionProps) => {
  const { documentation, faq } = HELP_SUPPORT_CONTENT;

  const filteredFaqs = faq.data.filter(
    (faqItem) =>
      (selectedCategory === "All" || faqItem.category === selectedCategory) &&
      (faqItem.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faqItem.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {documentation.title}
        </Typography>

        {/* Search */}
        <TextField
          fullWidth
          placeholder={documentation.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <HelpSupportIcon name="Search" sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
        />

        {/* Category Filters */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 4 }}>
          {faq.categories.map((category) => (
            <Chip
              key={category}
              label={category}
              clickable
              color={selectedCategory === category ? "primary" : "default"}
              onClick={() => onCategorySelect(category)}
            />
          ))}
        </Box>

        {/* FAQ List */}
        <Box>
          {filteredFaqs.map((faqItem, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<HelpSupportIcon name="ExpandMore" />}>
                <Typography fontWeight="600">{faqItem.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {faqItem.answer}
                </Typography>
                <Chip
                  label={faqItem.category}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};