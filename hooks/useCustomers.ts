// hooks/useCustomers.ts - FIXED VERSION
import { useState, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  address?: string;
  state?: string;
  city?: string;
  pincode?: string;
  gstin?: string;
  gstNumber?: string; // Handle both field names
  isInterState?: boolean;
  totalOrders?: number;
  totalSpent?: number;
  totalPurchases?: number; // Handle both field names
  lastOrderDate?: string;
  createdAt: string;
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Add refs to prevent multiple fetches
  const isFetchingRef = useRef(false);
  const hasFetchedRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  const fetchCustomers = async (force = false) => {
    // Prevent multiple simultaneous fetches
    if (isFetchingRef.current && !force) {
      console.log('⏭️ Customer fetch already in progress');
      return;
    }
    
    // Don't fetch if no user
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    // Check if we've already fetched for this user
    const currentUserId = user.id || user._id;
    if (!force && hasFetchedRef.current && lastUserIdRef.current === currentUserId) {
      console.log('📦 Using cached customers for user:', currentUserId);
      setIsLoading(false);
      return;
    }

    isFetchingRef.current = true;

    try {
      console.log('🔄 Fetching customers for user:', currentUserId);
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/customers', {
        // Add cache control
        cache: 'no-cache',
        headers: {
          'Pragma': 'no-cache',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      
      const data = await response.json();
      
      // Handle the nested response structure
      if (data.customers && Array.isArray(data.customers)) {
        // Transform the data to match frontend expectations
        const transformedCustomers = data.customers.map((customer: any) => ({
          ...customer,
          // Map fields to expected names
          gstin: customer.gstin || customer.gstNumber || '',
          totalOrders: customer.totalOrders || customer.totalPurchases || 0,
          totalSpent: customer.totalSpent || 0,
          isInterState: customer.isInterState || false,
          state: customer.state || '',
          company: customer.company || '',
          address: customer.address || '',
          city: customer.city || '',
          pincode: customer.pincode || '',
          email: customer.email || ''
        }));
        
        setCustomers(transformedCustomers);
        hasFetchedRef.current = true;
        lastUserIdRef.current = currentUserId;
        console.log('✅ Customers fetched successfully:', transformedCustomers.length);
      } else {
        setCustomers([]);
        hasFetchedRef.current = true;
        lastUserIdRef.current = currentUserId;
      }
    } catch (err) {
      console.error('❌ Error fetching customers:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setCustomers([]);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  const addCustomer = async (customerData: any) => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add customer');
      }

      const newCustomer = await response.json();
      
      // Transform the new customer data
      const transformedCustomer = {
        ...newCustomer,
        gstin: newCustomer.gstin || newCustomer.gstNumber || '',
        totalOrders: newCustomer.totalOrders || newCustomer.totalPurchases || 0,
        totalSpent: newCustomer.totalSpent || 0,
        isInterState: newCustomer.isInterState || false,
        state: newCustomer.state || '',
        company: newCustomer.company || '',
        address: newCustomer.address || '',
        city: newCustomer.city || '',
        pincode: newCustomer.pincode || '',
        email: newCustomer.email || ''
      };
      
      setCustomers(prev => [...prev, transformedCustomer]);
      return transformedCustomer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add customer');
      throw err;
    }
  };

  const updateCustomer = async (customerData: any) => {
    try {
      const response = await fetch(`/api/customers/${customerData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update customer');
      }

      const updatedCustomer = await response.json();
      
      // Transform the updated customer data
      const transformedCustomer = {
        ...updatedCustomer,
        gstin: updatedCustomer.gstin || updatedCustomer.gstNumber || '',
        totalOrders: updatedCustomer.totalOrders || updatedCustomer.totalPurchases || 0,
        totalSpent: updatedCustomer.totalSpent || 0,
        isInterState: updatedCustomer.isInterState || false,
        state: updatedCustomer.state || '',
        company: updatedCustomer.company || '',
        address: updatedCustomer.address || '',
        city: updatedCustomer.city || '',
        pincode: updatedCustomer.pincode || '',
        email: updatedCustomer.email || ''
      };
      
      setCustomers(prev => prev.map(c => 
        c._id === customerData.id ? transformedCustomer : c
      ));
      return transformedCustomer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update customer');
      throw err;
    }
  };

  const deleteCustomer = async (customerId: string) => {
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete customer');
      }

      setCustomers(prev => prev.filter(c => c._id !== customerId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer');
      throw err;
    }
  };

  // Fetch customers only when user changes from null to authenticated or vice versa
  useEffect(() => {
    let isMounted = true;
    
    const currentUserId = user?.id || user?._id || null;
    const previousUserId = lastUserIdRef.current;
    
    // Only fetch if:
    // 1. User exists AND we haven't fetched for this user yet
    // 2. OR user changed from one ID to another
    if (currentUserId && (!hasFetchedRef.current || currentUserId !== previousUserId)) {
      if (isMounted) {
        fetchCustomers();
      }
    } else if (!currentUserId && hasFetchedRef.current) {
      // User logged out - clear data
      if (isMounted) {
        setCustomers([]);
        hasFetchedRef.current = false;
        lastUserIdRef.current = null;
        setIsLoading(false);
      }
    } else if (!currentUserId) {
      // No user and haven't fetched - just set loading to false
      if (isMounted) {
        setIsLoading(false);
      }
    }
    
    return () => {
      isMounted = false;
    };
  }, [user?.id, user?._id]); // Only depend on user ID, not the whole user object

  return {
    customers,
    isLoading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    refetch: () => fetchCustomers(true), // Force refetch when needed
  };
};