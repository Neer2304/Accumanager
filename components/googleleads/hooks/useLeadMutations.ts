import { useState } from 'react';
import { Lead, LeadFormData } from '../types';
import { useRouter } from 'next/navigation';

interface UseLeadMutationsProps {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export function useLeadMutations({ onSuccess, onError }: UseLeadMutationsProps = {}) {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const validateForm = (formData: LeadFormData): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }
    
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = "Enter a valid 10-digit phone number";
    }
    
    if (!formData.source) {
      errors.source = "Source is required";
    }
    
    if (!formData.companyId) {
      errors.companyId = "Company is required";
    }
    
    if (formData.budget && parseFloat(formData.budget) < 0) {
      errors.budget = "Budget cannot be negative";
    }
    
    return errors;
  };

  const addLead = async (formData: LeadFormData): Promise<Lead | null> => {
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      onError?.("Please fix the errors in the form");
      return null;
    }

    try {
      setSubmitting(true);

      const leadData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      };

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(leadData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add lead");
      }

      const data = await response.json();
      onSuccess?.("Lead added successfully");
      return data.lead;
      
    } catch (err: any) {
      console.error('Error adding lead:', err);
      onError?.(err.message);
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (leadId: string, newStatus: string): Promise<boolean> => {
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error("Failed to update status");

      onSuccess?.("Status updated successfully");
      return true;
      
    } catch (err: any) {
      console.error('Error updating status:', err);
      onError?.(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteLead = async (leadId: string): Promise<boolean> => {
    if (!confirm("Are you sure you want to delete this lead?")) return false;
    
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "DELETE",
        credentials: 'include'
      });

      if (!response.ok) throw new Error("Failed to delete lead");

      onSuccess?.("Lead deleted successfully");
      return true;
      
    } catch (err: any) {
      console.error('Error deleting lead:', err);
      onError?.(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const convertLead = async (leadId: string): Promise<any | null> => {
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/leads/${leadId}/convert`, {
        method: "POST",
        credentials: 'include'
      });

      if (!response.ok) throw new Error("Failed to convert lead");

      const result = await response.json();
      onSuccess?.("Lead converted successfully! Contact and deal created.");
      return result;
      
    } catch (err: any) {
      console.error('Error converting lead:', err);
      onError?.(err.message);
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    validateForm,
    addLead,
    updateStatus,
    deleteLead,
    convertLead
  };
}