import { BusinessFormData } from '@/data/businessSetupContent'

export interface AddressStepProps {
  formData: BusinessFormData
  onInputChange: (field: keyof BusinessFormData, value: string) => void
}