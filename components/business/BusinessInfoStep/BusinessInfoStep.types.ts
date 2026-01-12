import { BusinessFormData } from '@/data/businessSetupContent'

export interface BusinessInfoStepProps {
  formData: BusinessFormData
  onInputChange: (field: keyof BusinessFormData, value: string) => void
}