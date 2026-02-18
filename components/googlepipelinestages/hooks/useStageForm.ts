// components/googlepipelinestages/hooks/useStageForm.ts
import { useState } from 'react';
import { initialFormData } from '../constants';
import { PipelineStage } from '../types';

export function useStageForm(selectedCompanyId: string, stages: PipelineStage[]) {
  const [formData, setFormData] = useState(initialFormData);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Stage name is required";
    }
    
    if (!formData.probability) {
      errors.probability = "Probability is required";
    } else {
      const prob = parseInt(formData.probability);
      if (isNaN(prob) || prob < 0 || prob > 100) {
        errors.probability = "Probability must be between 0 and 100";
      }
    }
    
    if (formData.autoAdvance && (!formData.autoAdvanceDays || parseInt(formData.autoAdvanceDays) <= 0)) {
      errors.autoAdvanceDays = "Auto advance days must be greater than 0";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleColorChange = (color: any) => {
    setFormData(prev => ({ ...prev, color: color.hex }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setValidationErrors({});
  };

  const setFormForEdit = (stage: PipelineStage) => {
    setFormData({
      name: stage.name,
      probability: stage.probability.toString(),
      color: stage.color,
      category: stage.category,
      isActive: stage.isActive,
      autoAdvance: stage.autoAdvance || false,
      autoAdvanceDays: stage.autoAdvanceDays?.toString() || "",
      notifyOnEnter: stage.notifyOnEnter || false,
      notifyOnExit: stage.notifyOnExit || false,
      notifyUsers: stage.notifyUsers || [],
      requiredFields: stage.requiredFields || [],
      allowedStages: stage.allowedStages || [],
      customFields: stage.customFields || []
    });
  };

  // API calls
  const addStage = async () => {
    if (!validateForm()) {
      return { success: false, error: "Please fix the errors in the form" };
    }

    try {
      setSubmitting(true);

      const stageData = {
        ...formData,
        probability: parseInt(formData.probability),
        autoAdvanceDays: formData.autoAdvance ? parseInt(formData.autoAdvanceDays) : undefined
      };

      const response = await fetch(`/api/pipeline-stages?companyId=${selectedCompanyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(stageData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add stage");
      }

      const newStage = await response.json();
      resetForm();
      return { success: true, data: newStage.stage };
      
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  const updateStage = async (stageId: string) => {
    if (!validateForm()) {
      return { success: false, error: "Please fix the errors in the form" };
    }

    try {
      setSubmitting(true);

      const stageData = {
        ...formData,
        probability: parseInt(formData.probability),
        autoAdvanceDays: formData.autoAdvance ? parseInt(formData.autoAdvanceDays) : undefined
      };

      const response = await fetch(`/api/pipeline-stages/${stageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(stageData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update stage");
      }

      const updatedStage = await response.json();
      return { success: true, data: updatedStage.stage };
      
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    validationErrors,
    submitting,
    handleInputChange,
    handleSelectChange,
    handleSwitchChange,
    handleColorChange,
    setFormForEdit,
    resetForm,
    addStage,
    updateStage
  };
}