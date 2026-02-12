// app/company/setup/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  useTheme,
  alpha,
  Divider,
  Breadcrumbs,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Paper,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Home as HomeIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  AccountBalance as IndustryIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Import Layout
import { MainLayout } from "@/components/Layout/MainLayout";

// Import Google-themed components
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Alert as GoogleAlert } from "@/components/ui/Alert";

// Industry options
const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Real Estate",
  "Retail",
  "Manufacturing",
  "Consulting",
  "Marketing",
  "Legal",
  "Construction",
  "Transportation",
  "Hospitality",
  "Media",
  "Energy",
  "Agriculture",
  "Other",
];

// Company size options
const COMPANY_SIZES = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1000+", label: "1000+ employees" },
];

// Currency options
const CURRENCIES = [
  { value: "USD", label: "USD - US Dollar", symbol: "$" },
  { value: "EUR", label: "EUR - Euro", symbol: "€" },
  { value: "GBP", label: "GBP - British Pound", symbol: "£" },
  { value: "JPY", label: "JPY - Japanese Yen", symbol: "¥" },
  { value: "INR", label: "INR - Indian Rupee", symbol: "₹" },
];

// Timezone options
const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
];

// Plan options
const PLANS = [
  {
    value: "trial",
    label: "Free Trial",
    description: "14-day free trial",
    price: "$0",
    color: "#4285f4",
  },
  {
    value: "basic",
    label: "Basic",
    description: "Up to 10 users",
    price: "$29",
    color: "#34a853",
  },
  {
    value: "professional",
    label: "Professional",
    description: "Up to 50 users",
    price: "$79",
    color: "#fbbc04",
  },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "Unlimited users",
    price: "Custom",
    color: "#ea4335",
  },
];

export default function CompanySetupPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";
  const router = useRouter();

  // State
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Company Info
    name: "",
    legalName: "",
    email: "",
    phone: "",
    website: "",
    taxId: "",
    industry: "",
    size: "",

    // Address
    address: {
      street: "",
      city: "",
      state: "",
      country: "USA",
      zipCode: "",
    },

    // Settings
    timezone: "America/New_York",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    language: "en",

    // Subscription
    plan: "trial",
    seats: 5,

    // Acceptance
    acceptedTerms: false,
    acceptedPrivacy: false,
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Steps
  const steps = [
    { label: "Company Info", description: "Tell us about your company" },
    { label: "Address", description: "Where is your company located?" },
    { label: "Preferences", description: "Configure your workspace" },
    { label: "Plan", description: "Choose a subscription plan" },
    { label: "Confirm", description: "Review and create" },
  ];

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle select changes
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  // Validate current step
  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.name.trim()) errors.name = "Company name is required";
      if (!formData.email.trim()) {
        errors.email = "Company email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Enter a valid email address";
      }
      if (!formData.industry) errors.industry = "Industry is required";
      if (!formData.size) errors.size = "Company size is required";
    }

    if (step === 1) {
      if (!formData.address.street.trim())
        errors["address.street"] = "Street address is required";
      if (!formData.address.city.trim())
        errors["address.city"] = "City is required";
      if (!formData.address.state.trim())
        errors["address.state"] = "State is required";
      if (!formData.address.zipCode.trim())
        errors["address.zipCode"] = "ZIP code is required";
    }

    if (step === 4) {
      if (!formData.acceptedTerms)
        errors.acceptedTerms = "You must accept the Terms of Service";
      if (!formData.acceptedPrivacy)
        errors.acceptedPrivacy = "You must accept the Privacy Policy";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setValidationErrors({});
    window.scrollTo(0, 0);
  };

  // Get plan features
  const getPlanFeatures = (plan: string) => {
    const features: Record<string, string[]> = {
      trial: [
        "Up to 5 users",
        "Lead management",
        "Contact management",
        "Deal tracking",
        "Basic reporting",
        "Email support",
      ],
      basic: [
        "Up to 10 users",
        "All Trial features",
        "Advanced reporting",
        "API access",
        "Custom fields",
        "Priority email support",
      ],
      professional: [
        "Up to 50 users",
        "All Basic features",
        "Workflow automation",
        "Advanced analytics",
        "Team collaboration",
        "Phone support",
      ],
      enterprise: [
        "Unlimited users",
        "All Professional features",
        "Custom development",
        "SLA guarantee",
        "Dedicated account manager",
        "24/7 support",
      ],
    };
    return features[plan] || features.trial;
  };

  // Create company
  const createCompany = async () => {
    if (!validateStep(4)) return;

    try {
      setLoading(true);
      setError(null);

      const companyData = {
        name: formData.name,
        legalName: formData.legalName || formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        website: formData.website || undefined,
        taxId: formData.taxId || undefined,
        industry: formData.industry,
        size: formData.size,
        address: formData.address,
        settings: {
          timezone: formData.timezone,
          dateFormat: formData.dateFormat,
          currency: formData.currency,
          language: formData.language,
        },
        subscription: {
          plan: formData.plan,
          status: formData.plan === "trial" ? "trial" : "active",
          seats: formData.seats,
          usedSeats: 1,
          startDate: new Date(),
          endDate:
            formData.plan === "trial"
              ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          autoRenew: true,
          features: getPlanFeatures(formData.plan),
        },
      };

      console.log("📡 Creating company...");

      const response = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(companyData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create company");
      }

      console.log("✅ Company created:", data.company);
      setSuccess(true);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add this near the top of your CompanySetupPage component

  // Check company limit
  useEffect(() => {
    const checkCompanyLimit = async () => {
      try {
        const response = await fetch("/api/companies");
        const data = await response.json();

        if (data.success) {
          const activeCount = data.companies?.length || 0;
          if (activeCount >= 5) {
            setError(
              `You have reached the maximum limit of 5 active companies. Please delete or deactivate an existing company before creating a new one.`,
            );
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Error checking company limit:", err);
      }
    };

    checkCompanyLimit();
  }, []);

  // Render step content
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" fontWeight={500} gutterBottom>
              Company Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Tell us about your company. This information helps us set up your
              workspace.
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ width: "calc(50% - 8px)" }}>
                <TextField
                  fullWidth
                  label="Company Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!validationErrors.name}
                  helperText={validationErrors.name}
                  required
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon
                          sx={{
                            fontSize: 18,
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: darkMode ? "#303134" : "#f8f9fa",
                    },
                  }}
                />
              </Box>
              <Box sx={{ width: "calc(50% - 8px)" }}>
                <TextField
                  fullWidth
                  label="Legal Name"
                  name="legalName"
                  value={formData.legalName}
                  onChange={handleInputChange}
                  helperText="If different from company name"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon
                          sx={{
                            fontSize: 18,
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: darkMode ? "#303134" : "#f8f9fa",
                    },
                  }}
                />
              </Box>
              <Box sx={{ width: "calc(50% - 8px)" }}>
                <TextField
                  fullWidth
                  label="Company Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!validationErrors.email}
                  helperText={validationErrors.email}
                  required
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon
                          sx={{
                            fontSize: 18,
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: darkMode ? "#303134" : "#f8f9fa",
                    },
                  }}
                />
              </Box>
              <Box sx={{ width: "calc(50% - 8px)" }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon
                          sx={{
                            fontSize: 18,
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: darkMode ? "#303134" : "#f8f9fa",
                    },
                  }}
                />
              </Box>
              <Box sx={{ width: "calc(50% - 8px)" }}>
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://www.example.com"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WebsiteIcon
                          sx={{
                            fontSize: 18,
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: darkMode ? "#303134" : "#f8f9fa",
                    },
                  }}
                />
              </Box>
              <Box sx={{ width: "calc(50% - 8px)" }}>
                <TextField
                  fullWidth
                  label="Tax ID / VAT"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  placeholder="Optional"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: darkMode ? "#303134" : "#f8f9fa",
                    },
                  }}
                />
              </Box>
              <Box sx={{ width: "calc(50% - 8px)" }}>
                <FormControl
                  fullWidth
                  size="small"
                  error={!!validationErrors.industry}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: darkMode ? "#303134" : "#f8f9fa",
                    },
                  }}
                >
                  <InputLabel>Industry *</InputLabel>
                  <Select
                    name="industry"
                    value={formData.industry}
                    label="Industry *"
                    onChange={handleSelectChange}
                  >
                    {INDUSTRIES.map((industry) => (
                      <MenuItem key={industry} value={industry}>
                        {industry}
                      </MenuItem>
                    ))}
                  </Select>
                  {validationErrors.industry && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5 }}
                    >
                      {validationErrors.industry}
                    </Typography>
                  )}
                </FormControl>
              </Box>
              <Box sx={{ width: "calc(50% - 8px)" }}>
                <FormControl
                  fullWidth
                  size="small"
                  error={!!validationErrors.size}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: darkMode ? "#303134" : "#f8f9fa",
                    },
                  }}
                >
                  <InputLabel>Company Size *</InputLabel>
                  <Select
                    name="size"
                    value={formData.size}
                    label="Company Size *"
                    onChange={handleSelectChange}
                  >
                    {COMPANY_SIZES.map((size) => (
                      <MenuItem key={size.value} value={size.value}>
                        {size.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {validationErrors.size && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5 }}
                    >
                      {validationErrors.size}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h5" fontWeight={500} gutterBottom>
              Company Address
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Where is your company located? This will be used as your primary
              business address.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <TextField
                  fullWidth
                  label="Street Address *"
                  value={formData.address.street}
                  onChange={(e) =>
                    handleAddressChange("street", e.target.value)
                  }
                  error={!!validationErrors["address.street"]}
                  helperText={validationErrors["address.street"]}
                  required
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon
                          sx={{
                            fontSize: 18,
                            color: darkMode ? "#9aa0a6" : "#5f6368",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: darkMode ? "#303134" : "#f8f9fa",
                    },
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ width: "calc(50% - 8px)" }}>
                  <TextField
                    fullWidth
                    label="City *"
                    value={formData.address.city}
                    onChange={(e) =>
                      handleAddressChange("city", e.target.value)
                    }
                    error={!!validationErrors["address.city"]}
                    helperText={validationErrors["address.city"]}
                    required
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: darkMode ? "#303134" : "#f8f9fa",
                      },
                    }}
                  />
                </Box>
                <Box sx={{ width: "calc(50% - 8px)" }}>
                  <TextField
                    fullWidth
                    label="State / Province *"
                    value={formData.address.state}
                    onChange={(e) =>
                      handleAddressChange("state", e.target.value)
                    }
                    error={!!validationErrors["address.state"]}
                    helperText={validationErrors["address.state"]}
                    required
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: darkMode ? "#303134" : "#f8f9fa",
                      },
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ width: "calc(50% - 8px)" }}>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: darkMode ? "#303134" : "#f8f9fa",
                      },
                    }}
                  >
                    <InputLabel>Country</InputLabel>
                    <Select
                      value={formData.address.country}
                      label="Country"
                      onChange={(e) =>
                        handleAddressChange("country", e.target.value)
                      }
                    >
                      <MenuItem value="USA">United States</MenuItem>
                      <MenuItem value="CAN">Canada</MenuItem>
                      <MenuItem value="UK">United Kingdom</MenuItem>
                      <MenuItem value="AUS">Australia</MenuItem>
                      <MenuItem value="IND">India</MenuItem>
                      <MenuItem value="SGP">Singapore</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ width: "calc(50% - 8px)" }}>
                  <TextField
                    fullWidth
                    label="ZIP / Postal Code *"
                    value={formData.address.zipCode}
                    onChange={(e) =>
                      handleAddressChange("zipCode", e.target.value)
                    }
                    error={!!validationErrors["address.zipCode"]}
                    helperText={validationErrors["address.zipCode"]}
                    required
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: darkMode ? "#303134" : "#f8f9fa",
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h5" fontWeight={500} gutterBottom>
              Workspace Preferences
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Configure your workspace settings like timezone, currency, and
              date format.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ width: "calc(50% - 8px)" }}>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: darkMode ? "#303134" : "#f8f9fa",
                      },
                    }}
                  >
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      name="timezone"
                      value={formData.timezone}
                      label="Timezone"
                      onChange={handleSelectChange}
                    >
                      {TIMEZONES.map((tz) => (
                        <MenuItem key={tz} value={tz}>
                          {tz}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ width: "calc(50% - 8px)" }}>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: darkMode ? "#303134" : "#f8f9fa",
                      },
                    }}
                  >
                    <InputLabel>Currency</InputLabel>
                    <Select
                      name="currency"
                      value={formData.currency}
                      label="Currency"
                      onChange={handleSelectChange}
                    >
                      {CURRENCIES.map((currency) => (
                        <MenuItem key={currency.value} value={currency.value}>
                          {currency.symbol} - {currency.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ width: "calc(50% - 8px)" }}>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: darkMode ? "#303134" : "#f8f9fa",
                      },
                    }}
                  >
                    <InputLabel>Date Format</InputLabel>
                    <Select
                      name="dateFormat"
                      value={formData.dateFormat}
                      label="Date Format"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                      <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                      <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ width: "calc(50% - 8px)" }}>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: darkMode ? "#303134" : "#f8f9fa",
                      },
                    }}
                  >
                    <InputLabel>Language</InputLabel>
                    <Select
                      name="language"
                      value={formData.language}
                      label="Language"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="de">German</MenuItem>
                      <MenuItem value="hi">Hindi</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  Team Size
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <TextField
                    type="number"
                    label="Seats"
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    size="small"
                    InputProps={{
                      inputProps: { min: 1, max: 1000 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <PeopleIcon
                            sx={{
                              fontSize: 18,
                              color: darkMode ? "#9aa0a6" : "#5f6368",
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      width: 120,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: darkMode ? "#303134" : "#f8f9fa",
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    You can add more seats later
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h5" fontWeight={500} gutterBottom>
              Choose Your Plan
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select a plan that fits your business needs. You can change or
              cancel anytime.
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {PLANS.map((plan) => (
                <Box sx={{ width: "calc(50% - 8px)" }} key={plan.value}>
                  <Card
                    hover
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, plan: plan.value }))
                    }
                    sx={{
                      p: 2.5,
                      cursor: "pointer",
                      position: "relative",
                      border:
                        formData.plan === plan.value
                          ? `2px solid ${plan.color}`
                          : `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                      backgroundColor:
                        formData.plan === plan.value
                          ? alpha(plan.color, 0.05)
                          : darkMode
                            ? "#303134"
                            : "#ffffff",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: plan.color,
                        backgroundColor: alpha(plan.color, 0.05),
                      },
                    }}
                  >
                    {formData.plan === plan.value && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          color: plan.color,
                        }}
                      >
                        <CheckCircleIcon fontSize="small" />
                      </Box>
                    )}

                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {plan.label}
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight={700}
                      sx={{ color: plan.color, mb: 1 }}
                    >
                      {plan.price}
                      {plan.value !== "enterprise" &&
                        plan.value !== "trial" && (
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                            sx={{ ml: 0.5 }}
                          >
                            /mo
                          </Typography>
                        )}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {plan.description}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.75,
                      }}
                    >
                      {getPlanFeatures(plan.value)
                        .slice(0, 4)
                        .map((feature, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CheckCircleIcon
                              sx={{ fontSize: 14, color: plan.color }}
                            />
                            <Typography variant="caption">{feature}</Typography>
                          </Box>
                        ))}
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>

            {formData.plan === "trial" && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: "8px",
                  bgcolor: darkMode
                    ? alpha("#fbbc04", 0.1)
                    : alpha("#fbbc04", 0.05),
                  border: `1px solid ${darkMode ? alpha("#fbbc04", 0.2) : alpha("#fbbc04", 0.1)}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <CalendarIcon sx={{ fontSize: 18, color: "#fbbc04" }} />
                  <strong>14-day free trial:</strong> No credit card required.
                  Cancel anytime.
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h5" fontWeight={500} gutterBottom>
              Review & Confirm
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please review your information before creating your company.
            </Typography>

            <Card
              sx={{
                p: 3,
                backgroundColor: darkMode ? "#303134" : "#f8f9fa",
                border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                mb: 3,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <BusinessIcon sx={{ fontSize: 20, color: "#4285f4" }} />
                Company Information
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
                <Box sx={{ width: "calc(50% - 8px)" }}>
                  <Typography variant="caption" color="text.secondary">
                    Company Name
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formData.name}
                  </Typography>
                </Box>
                <Box sx={{ width: "calc(50% - 8px)" }}>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body2">{formData.email}</Typography>
                </Box>
                <Box sx={{ width: "calc(50% - 8px)" }}>
                  <Typography variant="caption" color="text.secondary">
                    Industry
                  </Typography>
                  <Typography variant="body2">{formData.industry}</Typography>
                </Box>
                <Box sx={{ width: "calc(50% - 8px)" }}>
                  <Typography variant="caption" color="text.secondary">
                    Size
                  </Typography>
                  <Typography variant="body2">
                    {
                      COMPANY_SIZES.find((s) => s.value === formData.size)
                        ?.label
                    }
                  </Typography>
                </Box>
                <Box sx={{ width: "100%" }}>
                  <Typography variant="caption" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body2">
                    {formData.address.street}, {formData.address.city},{" "}
                    {formData.address.state} {formData.address.zipCode},{" "}
                    {formData.address.country}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <SettingsIcon sx={{ fontSize: 20, color: "#34a853" }} />
                Workspace Settings
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
                <Box sx={{ width: "calc(33.33% - 11px)" }}>
                  <Typography variant="caption" color="text.secondary">
                    Timezone
                  </Typography>
                  <Typography variant="body2">{formData.timezone}</Typography>
                </Box>
                <Box sx={{ width: "calc(33.33% - 11px)" }}>
                  <Typography variant="caption" color="text.secondary">
                    Currency
                  </Typography>
                  <Typography variant="body2">
                    {
                      CURRENCIES.find((c) => c.value === formData.currency)
                        ?.label
                    }
                  </Typography>
                </Box>
                <Box sx={{ width: "calc(33.33% - 11px)" }}>
                  <Typography variant="caption" color="text.secondary">
                    Seats
                  </Typography>
                  <Typography variant="body2">
                    {formData.seats} seats
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <SecurityIcon sx={{ fontSize: 20, color: "#ea4335" }} />
                Subscription Plan
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
                <Box sx={{ width: "calc(50% - 8px)" }}>
                  <Typography variant="caption" color="text.secondary">
                    Plan
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      color: PLANS.find((p) => p.value === formData.plan)
                        ?.color,
                    }}
                  >
                    {PLANS.find((p) => p.value === formData.plan)?.label}
                  </Typography>
                </Box>
                <Box sx={{ width: "calc(50% - 8px)" }}>
                  <Typography variant="caption" color="text.secondary">
                    Price
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {PLANS.find((p) => p.value === formData.plan)?.price}
                    {formData.plan !== "enterprise" &&
                      formData.plan !== "trial" &&
                      "/month"}
                  </Typography>
                </Box>
              </Box>
            </Card>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.acceptedTerms}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      acceptedTerms: e.target.checked,
                    }))
                  }
                  style={{ width: 18, height: 18 }}
                />
                <Typography variant="body2">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    style={{ color: "#4285f4", textDecoration: "none" }}
                  >
                    Terms of Service
                  </Link>
                </Typography>
              </Box>
              {validationErrors.acceptedTerms && (
                <Typography variant="caption" color="error" sx={{ ml: 3 }}>
                  {validationErrors.acceptedTerms}
                </Typography>
              )}

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <input
                  type="checkbox"
                  id="privacy"
                  checked={formData.acceptedPrivacy}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      acceptedPrivacy: e.target.checked,
                    }))
                  }
                  style={{ width: 18, height: 18 }}
                />
                <Typography variant="body2">
                  I agree to the{" "}
                  <Link
                    href="/privacy"
                    style={{ color: "#4285f4", textDecoration: "none" }}
                  >
                    Privacy Policy
                  </Link>
                </Typography>
              </Box>
              {validationErrors.acceptedPrivacy && (
                <Typography variant="caption" color="error" sx={{ ml: 3 }}>
                  {validationErrors.acceptedPrivacy}
                </Typography>
              )}
            </Box>

            {success && (
              <GoogleAlert
                severity="success"
                title="Company Created Successfully!"
                message="Redirecting to dashboard..."
                sx={{ mt: 3 }}
              />
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout title="Setup Your Company">
      <Box
        sx={{
          backgroundColor: darkMode ? "#202124" : "#ffffff",
          color: darkMode ? "#e8eaed" : "#202124",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Box sx={{ maxWidth: 900, mx: "auto", px: 3 }}>
          {/* Header */}
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link
              href="/dashboard"
              style={{
                textDecoration: "none",
                color: darkMode ? "#9aa0a6" : "#5f6368",
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
              Dashboard
            </Link>
            <Typography color={darkMode ? "#e8eaed" : "#202124"}>
              Company Setup
            </Typography>
          </Breadcrumbs>

          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" fontWeight={500} gutterBottom>
              Create Your Company Workspace
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Get started in just a few steps
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper
            activeStep={activeStep}
            sx={{
              mb: 4,
              "& .MuiStepLabel-label": {
                color: darkMode ? "#e8eaed" : "#202124",
              },
            }}
          >
            {steps.map((step) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography variant="body2" fontWeight={500}>
                    {step.label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Error Alert */}
          {error && !success && (
            <GoogleAlert
              severity="error"
              title="Error"
              message={error}
              sx={{ mb: 3 }}
            />
          )}

          {/* Step Content */}
          <Card
            sx={{
              p: 4,
              backgroundColor: darkMode ? "#202124" : "#ffffff",
              border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
            }}
          >
            {renderStepContent(activeStep)}
          </Card>

          {/* Navigation */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0 || loading || success}
              startIcon={<ArrowBackIcon />}
              sx={{
                borderRadius: "8px",
                visibility: activeStep === 0 ? "hidden" : "visible",
              }}
            >
              Back
            </Button>

            <Button
              variant="contained"
              onClick={
                activeStep === steps.length - 1 ? createCompany : handleNext
              }
              disabled={loading || success}
              endIcon={
                activeStep === steps.length - 1 ? (
                  <SaveIcon />
                ) : (
                  <ArrowForwardIcon />
                )
              }
              sx={{
                borderRadius: "8px",
                backgroundColor:
                  activeStep === steps.length - 1 ? "#34a853" : "#4285f4",
                "&:hover": {
                  backgroundColor:
                    activeStep === steps.length - 1 ? "#2d9248" : "#3367d6",
                },
              }}
            >
              {loading && <CircularProgress size={20} sx={{ mr: 1 }} />}
              {activeStep === steps.length - 1 ? "Create Company" : "Continue"}
            </Button>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}
