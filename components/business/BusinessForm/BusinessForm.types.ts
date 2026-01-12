import { BusinessFormData } from '@/data/businessSetupContent'

export interface BusinessFormProps {
  activeStep: number
  formData: BusinessFormData
  onInputChange: (field: keyof BusinessFormData, value: string) => void
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
  isLoading: boolean
  hasBusiness: boolean
}