// services/customerService.ts - UPDATED WITH SUBSCRIPTION HANDLING
import { Customer, CustomerFormData } from '@/types'

class CustomerService {
  private baseUrl = '/api/customers'

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      // Try multiple sources for the auth token
      const localStorageToken = localStorage.getItem('auth_token')
      if (localStorageToken) return localStorageToken

      const cookieToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]
      if (cookieToken) return cookieToken

      const sessionToken = sessionStorage.getItem('auth_token')
      if (sessionToken) return sessionToken
    }
    return null
  }

  async getCustomers(): Promise<any> {
    try {
      console.log('🔄 Fetching customers from:', this.baseUrl)
      
      const token = this.getAuthToken()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(this.baseUrl, {
        credentials: 'include',
        headers,
      })

      console.log('📡 Response status:', response.status)

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required - Please log in again')
        }
        if (response.status === 403) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Subscription required - Please upgrade your plan')
        }
        throw new Error(`Failed to fetch customers: ${response.status}`)
      }

      const data = await response.json()
      console.log(`✅ Retrieved ${data.customers?.length || 0} customers`)
      return data
    } catch (error: any) {
      console.error('❌ Failed to fetch customers:', error)
      throw error
    }
  }

  async addCustomer(customer: CustomerFormData): Promise<Customer> {
    try {
      console.log('🔄 Adding customer:', customer)

      const token = this.getAuthToken()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(customer),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        if (response.status === 401) {
          throw new Error('Authentication required - Please log in again')
        }
        if (response.status === 403) {
          throw new Error(errorData.message || 'Customer limit reached - Please upgrade your plan')
        }
        if (response.status === 400) {
          throw new Error(errorData.message || 'Invalid customer data')
        }
        
        throw new Error(errorData.message || `Failed to add customer: ${response.status}`)
      }

      const newCustomer = await response.json()
      console.log('✅ Customer added successfully:', newCustomer)
      return newCustomer
    } catch (error) {
      console.error('❌ Failed to add customer:', error)
      throw error
    }
  }

  async updateCustomer(customer: Customer): Promise<Customer> {
    try {
      console.log('🔄 Updating customer:', customer.id)

      const token = this.getAuthToken()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${this.baseUrl}/${customer.id}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(customer),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        if (response.status === 401) {
          throw new Error('Authentication required')
        }
        if (response.status === 403) {
          throw new Error(errorData.message || 'Subscription required')
        }
        
        throw new Error(errorData.message || `Failed to update customer: ${response.status}`)
      }

      const updatedCustomer = await response.json()
      console.log('✅ Customer updated successfully:', updatedCustomer)
      return updatedCustomer
    } catch (error) {
      console.error('❌ Failed to update customer:', error)
      throw error
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      console.log('🔄 Deleting customer:', id)

      const token = this.getAuthToken()
      const headers: HeadersInit = {}

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        if (response.status === 401) {
          throw new Error('Authentication required')
        }
        if (response.status === 403) {
          throw new Error(errorData.message || 'Subscription required')
        }
        
        throw new Error(errorData.message || `Failed to delete customer: ${response.status}`)
      }

      console.log('✅ Customer deleted successfully')
    } catch (error) {
      console.error('❌ Failed to delete customer:', error)
      throw error
    }
  }

  // Get customer statistics
  async getCustomerStats(): Promise<any> {
    try {
      const response = await this.getCustomers()
      const customers = response.customers || response

      const totalCustomers = customers.length
      const customersWithGST = customers.filter((c: Customer) => c.gstNumber).length
      const totalPurchases = customers.reduce((sum: number, customer: Customer) => 
        sum + (customer.totalPurchases || 0), 0
      )

      return {
        totalCustomers,
        customersWithGST,
        totalPurchases,
        averagePurchase: totalCustomers > 0 ? totalPurchases / totalCustomers : 0
      }
    } catch (error) {
      console.error('❌ Failed to get customer stats:', error)
      throw error
    }
  }
}

export const customerService = new CustomerService()