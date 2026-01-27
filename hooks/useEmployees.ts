import { useState, useCallback } from 'react';
import { Employee, EmployeeFilters, CreateEmployeeRequest, UpdateEmployeeRequest } from '@/types/employee.types';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  const fetchEmployees = useCallback(async (filters: EmployeeFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/attendance');
      
      if (!response.ok) {
        if (response.status === 402) {
          throw new Error('Please upgrade your subscription to access employee management');
        }
        throw new Error('Failed to fetch employees');
      }
      
      // Your /api/attendance returns array directly
      const allEmployees = await response.json();
      
      // Ensure it's an array
      if (!Array.isArray(allEmployees)) {
        throw new Error('Invalid response format from server');
      }

      // Filter based on local filters (since API doesn't support filtering)
      let filteredEmployees = allEmployees;
      
      if (filters.search) {
        filteredEmployees = filteredEmployees.filter((emp: Employee) =>
          emp.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
          emp.phone?.includes(filters.search) ||
          emp.email?.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      if (filters.department) {
        filteredEmployees = filteredEmployees.filter((emp: Employee) => 
          emp.department === filters.department
        );
      }
      
      if (filters.role) {
        filteredEmployees = filteredEmployees.filter((emp: Employee) => 
          emp.role === filters.role
        );
      }
      
      if (filters.isActive !== 'all') {
        const isActive = filters.isActive === 'true';
        filteredEmployees = filteredEmployees.filter((emp: Employee) => 
          emp.isActive === isActive
        );
      }

      // Apply sorting
      filteredEmployees.sort((a: Employee, b: Employee) => {
        const aVal = a[filters.sortBy as keyof Employee];
        const bVal = b[filters.sortBy as keyof Employee];
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          if (filters.sortOrder === 'asc') {
            return aVal.localeCompare(bVal);
          } else {
            return bVal.localeCompare(aVal);
          }
        } else if (typeof aVal === 'number' && typeof bVal === 'number') {
          if (filters.sortOrder === 'asc') {
            return aVal - bVal;
          } else {
            return bVal - aVal;
          }
        } else {
          // For dates or mixed types
          const aStr = String(aVal || '');
          const bStr = String(bVal || '');
          if (filters.sortOrder === 'asc') {
            return aStr.localeCompare(bStr);
          } else {
            return bStr.localeCompare(aStr);
          }
        }
      });

      // Apply pagination
      const startIndex = (filters.page - 1) * filters.limit;
      const endIndex = startIndex + filters.limit;
      const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);
      
      setEmployees(paginatedEmployees);
      setPagination({
        page: filters.page,
        limit: filters.limit,
        total: filteredEmployees.length,
        pages: Math.ceil(filteredEmployees.length / filters.limit),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmployee = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/employees/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch employee details');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employee');
      console.error('Error fetching employee:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEmployee = useCallback(async (employeeData: CreateEmployeeRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });
      
      if (!response.ok) {
        if (response.status === 402) {
          throw new Error('Please upgrade your subscription to add more employees');
        }
        throw new Error('Failed to create employee');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create employee');
      console.error('Error creating employee:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEmployee = useCallback(async (id: string, employeeData: UpdateEmployeeRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update employee');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update employee');
      console.error('Error updating employee:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEmployee = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete employee');
      console.error('Error deleting employee:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const markAttendance = useCallback(async (attendanceData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/attendance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark attendance');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark attendance');
      console.error('Error marking attendance:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleEmployeeSelection = useCallback((employeeId: string) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedEmployees([]);
  }, []);

  return {
    employees,
    selectedEmployees,
    loading,
    error,
    pagination,
    fetchEmployees,
    fetchEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    markAttendance,
    toggleEmployeeSelection,
    clearSelection,
    setError,
  };
};