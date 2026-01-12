import { useState, useEffect, useCallback } from 'react'
import { BusinessFormData, businessSetupContent } from '@/data/businessSetupContent'

export const useBusinessSetup = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [business, setBusiness] = useState<BusinessFormData | null>(null)

  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    gstNumber: '',
    phone: '',
    email: '',
    logo: ''
  })

  const validateStep = useCallback((step: number): boolean => {
    const { errors } = businessSetupContent.messages
    
    switch (step) {
      case 0:
        if (!formData.businessName.trim()) {
          setError(errors.businessName)
          return false
        }
        if (!formData.gstNumber.trim()) {
          setError(errors.gstNumber)
          return false
        }
        if (formData.gstNumber.length !== 15) {
          setError(errors.gstLength)
          return false
        }
        return true

      case 1:
        if (!formData.address.trim()) {
          setError(errors.address)
          return false
        }
        if (!formData.city.trim()) {
          setError(errors.city)
          return false
        }
        if (!formData.state.trim()) {
          setError(errors.state)
          return false
        }
        if (!formData.pincode.trim() || formData.pincode.length !== 6) {
          setError(errors.pincode)
          return false
        }
        return true

      case 2:
        if (!formData.phone.trim() || formData.phone.length !== 10) {
          setError(errors.phone)
          return false
        }
        if (!formData.email.trim()) {
          setError(errors.email)
          return false
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          setError(errors.emailValid)
          return false
        }
        return true

      default:
        return true
    }
  }, [formData])

  const handleInputChange = useCallback((field: keyof BusinessFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }, [])

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1)
      setError('')
    }
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
    setError('')
  }

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setBusiness(data.business)
        setSuccess(
          business 
            ? businessSetupContent.messages.successUpdate
            : businessSetupContent.messages.successCreate
        )
      } else {
        const errorData = await response.json()
        setError(errorData.message || businessSetupContent.messages.errors.saveFailed)
      }
    } catch (error) {
      console.error('Error saving business:', error)
      setError(businessSetupContent.messages.errors.saveFailed)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const checkBusiness = async () => {
      try {
        const response = await fetch('/api/business', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.business) {
            setBusiness(data.business)
            setFormData(data.business)
            setSuccess(businessSetupContent.messages.businessFound)
          }
        }
      } catch (error) {
        console.log('No existing business found')
      }
    }

    checkBusiness()
  }, [])

  return {
    activeStep,
    setActiveStep,
    isLoading,
    error,
    success,
    business,
    formData,
    handleInputChange,
    handleNext,
    handleBack,
    handleSubmit,
    validateStep
  }
}