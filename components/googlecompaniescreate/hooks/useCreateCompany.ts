// components/googlecompaniescreate/hooks/useCreateCompany.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/lib/companyContext';
import { companyService } from '@/services/companyService';
import { initialFormData } from '../constants';

export function useCreateCompany() {
  const router = useRouter();
  const { refreshCompanies } = useCompany();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(initialFormData);

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Company name is required');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Company email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      
      const res = await companyService.createCompany(formData);
      
      if (!res.success) {
        setError(res.error || res.message || 'Failed to create company');
        return;
      }

      await refreshCompanies();
      router.push('/companies');
      
    } catch (err: any) {
      setError(err.message || 'Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [addressField]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setError('');
  };

  return {
    formData,
    loading,
    error,
    setError,
    handleSubmit,
    handleInputChange,
    handleSelectChange,
    resetForm
  };
}