// lib/validators/contact.ts
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  formId?: string;
}

export interface ValidationResult {
  valid: boolean;
  message: string;
  errors?: Record<string, string>;
}

export function validateContactForm(data: ContactFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Name validation
  if (!data.name?.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (data.name.length > 100) {
    errors.name = 'Name cannot exceed 100 characters';
  }

  // Email validation
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please provide a valid email address';
  } else if (data.email.length > 255) {
    errors.email = 'Email is too long';
  }

  // Phone validation (optional)
  if (data.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
    errors.phone = 'Please provide a valid phone number';
  }

  // Company validation (optional)
  if (data.company && data.company.length > 200) {
    errors.company = 'Company name cannot exceed 200 characters';
  }

  // Subject validation (optional)
  if (data.subject && data.subject.length > 200) {
    errors.subject = 'Subject cannot exceed 200 characters';
  }

  // Message validation
  if (!data.message?.trim()) {
    errors.message = 'Message is required';
  } else if (data.message.length < 10) {
    errors.message = 'Message must be at least 10 characters';
  } else if (data.message.length > 5000) {
    errors.message = 'Message cannot exceed 5000 characters';
  }

  // Check for suspicious content
  const suspiciousPatterns = [
    /http(s)?:\/\//gi,
    /\[url=/gi,
    /\[link=/gi,
    /viagra/gi,
    /casino/gi,
    /lottery/gi,
    /\$\$\$/gi,
  ];

  const fullText = `${data.name} ${data.email} ${data.message}`.toLowerCase();
  const suspicious = suspiciousPatterns.some(pattern => pattern.test(fullText));

  if (suspicious) {
    errors._form = 'Your message contains suspicious content. Please revise.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    message: Object.keys(errors).length > 0 ? 'Please fix the errors below' : 'Valid',
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
}