import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
  Rating,
} from '@mui/material';
import { HelpSupportIcon } from '../HelpSupportIcons';
import { HELP_SUPPORT_CONTENT } from '../HelpSupportContent';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactSupportSectionProps {
  formData: ContactForm;
  isSubmitting: boolean;
  onFormChange: (field: keyof ContactForm, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ContactSupportSection = ({
  formData,
  isSubmitting,
  onFormChange,
  onSubmit,
}: ContactSupportSectionProps) => {
  const { contactSupport } = HELP_SUPPORT_CONTENT;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        "& > *": {
          flex: "1 1 calc(66.666% - 16px)",
          minWidth: 300,
        },
      }}
    >
      {/* Contact Form */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {contactSupport.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {contactSupport.description}
          </Typography>

          <form onSubmit={onSubmit}>
            <Stack spacing={3}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  "& > *": {
                    flex: "1 1 calc(50% - 8px)",
                    minWidth: 200,
                  },
                }}
              >
                <TextField
                  fullWidth
                  label={contactSupport.form.name}
                  value={formData.name}
                  onChange={(e) => onFormChange("name", e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  label={contactSupport.form.email}
                  type="email"
                  value={formData.email}
                  onChange={(e) => onFormChange("email", e.target.value)}
                  required
                />
              </Box>

              <TextField
                fullWidth
                label={contactSupport.form.subject}
                value={formData.subject}
                onChange={(e) => onFormChange("subject", e.target.value)}
                required
              />

              <TextField
                fullWidth
                label={contactSupport.form.message}
                multiline
                rows={4}
                value={formData.message}
                onChange={(e) => onFormChange("message", e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ alignSelf: "flex-start" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? contactSupport.form.sending : contactSupport.form.sendButton}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      {/* Contact Info & Testimonials */}
      <Box>
        <Stack spacing={3}>
          {/* Contact Methods */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {contactSupport.contactMethods.title}
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <HelpSupportIcon name="Email" color="primary" />
                  <Box>
                    <Typography variant="body2" fontWeight="600">
                      {contactSupport.contactMethods.emailSupport}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {contactSupport.contactMethods.emailAddress}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <HelpSupportIcon name="Phone" color="primary" />
                  <Box>
                    <Typography variant="body2" fontWeight="600">
                      {contactSupport.contactMethods.phoneSupport}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {contactSupport.contactMethods.phoneNumber}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <HelpSupportIcon name="Schedule" color="primary" />
                  <Box>
                    <Typography variant="body2" fontWeight="600">
                      {contactSupport.contactMethods.supportHours}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {contactSupport.contactMethods.hours}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Testimonials */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {contactSupport.testimonials.title}
              </Typography>
              <Stack spacing={2}>
                {contactSupport.testimonials.testimonials.map((testimonial, index) => (
                  <Box key={index}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="600">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {testimonial.company}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating value={testimonial.rating} size="small" readOnly />
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {testimonial.comment}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
};