import { BusinessFormData } from '@/data/businessSetupContent'

export interface ContactStepProps {
  formData: BusinessFormData
  onInputChange: (field: keyof BusinessFormData, value: string) => void
}