import { useState, useEffect } from 'react'

interface BusinessProfileData {
  businessName: string
  gstNumber: string
  businessAddress: string
  city: string
  state: string
  pincode: string
  country: string
  phone: string
  email: string
  logo?: string
}

export const useBusinessProfile = () => {
  const [formData, setFormData] = useState<BusinessProfileData>({
    businessName: '',
    gstNumber: '',
    businessAddress: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    phone: '',
    email: '',
    logo: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch business data on component mount
  useEffect(() => {
    fetchBusinessData()
  }, [])

  const fetchBusinessData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('/api/business', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.business) {
          // Map API response to form data
          setFormData({
            businessName: data.business.businessName || '',
            gstNumber: data.business.gstNumber || '',
            businessAddress: data.business.address || '',
            city: data.business.city || '',
            state: data.business.state || '',
            pincode: data.business.pincode || '',
            country: data.business.country || 'India',
            phone: data.business.phone || '',
            email: data.business.email || '',
            logo: data.business.logo || ''
          })
        }
      } else if (response.status === 404) {
        // No business found - this is okay for new users
        console.log('No existing business profile found')
      } else {
        throw new Error('Failed to fetch business data')
      }
    } catch (error) {
      console.error('Error fetching business:', error)
      setError('Failed to load business profile')
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (field: keyof BusinessProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Prepare data for API
      const apiData = {
        businessName: formData.businessName,
        address: formData.businessAddress,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
        gstNumber: formData.gstNumber,
        phone: formData.phone,
        email: formData.email,
        logo: formData.logo
      }

      const response = await fetch('/api/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(apiData),
      })

      if (response.ok) {
        const data = await response.json()
        setSuccess(data.message || 'Business profile saved successfully!')
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save business profile')
      }
    } catch (error: any) {
      console.error('Error saving business:', error)
      setError(error.message || 'Failed to save business profile')
    } finally {
      setSaving(false)
    }
  }

  return {
    formData,
    loading,
    saving,
    error,
    success,
    handleFormChange,
    handleSubmit,
    refreshData: fetchBusinessData
  }
}