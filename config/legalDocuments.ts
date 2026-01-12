// config/legalDocuments.ts
import { DocumentTypeConfig } from '@/types/legal';

export const legalDocumentTypes: DocumentTypeConfig[] = [
  {
    type: "privacy_policy",
    label: "Privacy Policy",
    description: "How user data is collected and used",
    apiEndpoint: "privacy-policy",
    icon: "privacy_tip",
    required: true
  },
  {
    type: "terms_of_service", 
    label: "Terms of Service",
    description: "Rules and guidelines for using the platform",
    apiEndpoint: "terms-of-service",
    icon: "gavel",
    required: true
  },
  {
    type: "cookie_policy",
    label: "Cookie Policy",
    description: "Information about cookies and tracking",
    apiEndpoint: "cookie-policy",
    icon: "cookie",
    required: true
  }
];

export const optionalDocumentTypes: DocumentTypeConfig[] = [
  {
    type: "refund_policy",
    label: "Refund Policy",
    description: "Policy for refunds and returns",
    apiEndpoint: "refund-policy",
    icon: "currency_exchange",
    required: false
  },
  {
    type: "shipping_policy",
    label: "Shipping Policy",
    description: "Information about shipping and delivery",
    apiEndpoint: "shipping-policy",
    icon: "local_shipping",
    required: false
  },
  {
    type: "cancellation_policy",
    label: "Cancellation Policy",
    description: "Policy for order cancellations",
    apiEndpoint: "cancellation-policy",
    icon: "cancel",
    required: false
  }
];

export const getAllDocumentTypes = (): DocumentTypeConfig[] => {
  return [...legalDocumentTypes, ...optionalDocumentTypes];
};