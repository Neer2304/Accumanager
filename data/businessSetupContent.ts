export interface BusinessFormData {
  businessName: string
  address: string
  city: string
  state: string
  pincode: string
  country: string
  gstNumber: string
  phone: string
  email: string
  logo?: string
}

export const steps = [
  { id: 0, label: 'Business Info', icon: 'Business' },
  { id: 1, label: 'Address Details', icon: 'LocationOn' },
  { id: 2, label: 'Contact Info', icon: 'ContactPhone' }
]

export const businessSetupContent = {
  header: {
    title: 'Setup Your Business',
    subtitle: 'Complete your business profile to start creating invoices with GST',
    icon: 'Business'
  },
  businessInfo: {
    title: 'Business Information',
    fields: {
      businessName: {
        label: 'Business Name *',
        placeholder: 'Enter your business name',
        helperText: 'Legal name of your business as registered'
      },
      gstNumber: {
        label: 'GST Number *',
        placeholder: 'e.g., 07AABCU9603R1ZM',
        helperText: '15-character GST identification number',
        maxLength: 15
      },
      logo: {
        label: 'Business Logo URL (Optional)',
        placeholder: 'https://example.com/logo.png',
        helperText: 'URL to your business logo'
      }
    }
  },
  addressDetails: {
    title: 'Address Details',
    fields: {
      address: {
        label: 'Address *',
        placeholder: 'Street address, building name',
        multiline: true,
        rows: 3
      },
      city: {
        label: 'City *',
        placeholder: 'City'
      },
      state: {
        label: 'State *',
        placeholder: 'State'
      },
      pincode: {
        label: 'Pincode *',
        placeholder: '6-digit pincode',
        maxLength: 6
      },
      country: {
        label: 'Country',
        placeholder: 'Country',
        defaultValue: 'India'
      }
    }
  },
  contactInfo: {
    title: 'Contact Information',
    fields: {
      phone: {
        label: 'Phone Number *',
        placeholder: '10-digit mobile number',
        helperText: 'Primary contact number for your business',
        maxLength: 10
      },
      email: {
        label: 'Email Address *',
        placeholder: 'business@example.com',
        helperText: 'Official email address for communications',
        type: 'email'
      }
    }
  },
  buttons: {
    back: 'Back',
    next: 'Next',
    save: 'Save Business',
    update: 'Update Business',
    saving: 'Saving...'
  },
  benefits: {
    title: 'Why setup business profile?',
    items: [
      'Required for generating GST-compliant invoices',
      'Auto-calculates CGST/SGST or IGST based on your business state',
      'Professional invoices with your business details',
      'Required for tax compliance and record keeping'
    ]
  },
  messages: {
    successCreate: 'Business profile created successfully!',
    successUpdate: 'Business profile updated successfully!',
    businessFound: 'Business profile found! You can update your details.',
    errors: {
      businessName: 'Business name is required',
      gstNumber: 'GST Number is required',
      gstLength: 'GST Number must be 15 characters long',
      address: 'Address is required',
      city: 'City is required',
      state: 'State is required',
      pincode: 'Valid 6-digit pincode is required',
      phone: 'Valid 10-digit phone number is required',
      email: 'Email is required',
      emailValid: 'Valid email address is required',
      saveFailed: 'Failed to save business details'
    }
  }
}