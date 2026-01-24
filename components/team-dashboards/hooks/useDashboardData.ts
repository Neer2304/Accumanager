// components/team-dashboard/hooks/useDashboardData.ts
import { useState, useEffect } from 'react';
import { EmployeeData, DashboardSummary, AssignFormData } from '../types';

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<DashboardSummary>({
    totalEmployees: 0,
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    completionRate: 0
  });
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  
  const [assignForm, setAssignForm] = useState<AssignFormData>({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    estimatedHours: 8,
    priority: 'medium',
    category: 'daily',
  });

  const [isDemoMode, setIsDemoMode] = useState(true);
  const [showDemoAlert, setShowDemoAlert] = useState(true);
  const [availableEmployees, setAvailableEmployees] = useState<any[]>([]);

  const fetchEmployeeData = async () => {
    try {
      const response = await fetch('/api/attendance');
      if (response.ok) {
        const data = await response.json();
        const employeesList = Array.isArray(data) ? data.map((emp: any) => ({
          _id: emp._id,
          name: emp.name || 'Unknown Employee',
          role: emp.role || 'Employee'
        })) : [];
        setAvailableEmployees(employeesList);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      
      if (isDemoMode) {
        setAvailableEmployees([
          { _id: 'demo1', name: 'John Doe', role: 'Developer' },
          { _id: 'demo2', name: 'Jane Smith', role: 'Designer' },
          { _id: 'demo3', name: 'Mike Johnson', role: 'Manager' },
        ]);
      }
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/tasks/manager');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await response.json();
      
      setSummary(data.summary || {
        totalEmployees: 0,
        totalTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        completionRate: 0
      });
      
      const employeesData = Array.isArray(data.employees) ? data.employees : [];
      const safeEmployees = employeesData.map((emp: any) => ({
        _id: emp._id || '',
        name: emp.name || 'Unknown Employee',
        role: emp.role || 'Employee',
        department: emp.department || 'General',
        stats: {
          totalTasks: emp.stats?.totalTasks || 0,
          completedTasks: emp.stats?.completedTasks || 0,
          inProgressTasks: emp.stats?.inProgressTasks || 0,
          pendingTasks: emp.stats?.pendingTasks || 0,
          overdueTasks: emp.stats?.overdueTasks || 0,
        },
        recentTasks: Array.isArray(emp.recentTasks) ? emp.recentTasks : []
      }));
      
      setEmployees(safeEmployees);
      
      if (isDemoMode && employeesData.length === 0) {
        loadDemoData();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      
      if (isDemoMode) {
        loadDemoData();
      }
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    const demoEmployees: EmployeeData[] = [
      {
        _id: 'demo1',
        name: 'John Doe',
        role: 'Senior Developer',
        department: 'Engineering',
        stats: {
          totalTasks: 12,
          completedTasks: 8,
          inProgressTasks: 3,
          pendingTasks: 1,
          overdueTasks: 0,
        },
        recentTasks: [
          {
            _id: 'task1',
            title: 'Implement user authentication',
            description: 'Add JWT authentication system',
            status: 'completed',
            priority: 'high',
            dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            estimatedHours: 16,
            actualHours: 14,
            progress: 100,
            category: 'project',
            projectName: 'Authentication System',
            assignedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            updates: []
          },
          {
            _id: 'task2',
            title: 'Fix mobile responsive issues',
            description: 'Optimize for mobile devices',
            status: 'in_progress',
            priority: 'medium',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            estimatedHours: 8,
            actualHours: 4,
            progress: 50,
            category: 'maintenance',
            projectName: 'Website Redesign',
            assignedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updates: []
          },
        ]
      },
      {
        _id: 'demo2',
        name: 'Jane Smith',
        role: 'UI/UX Designer',
        department: 'Design',
        stats: {
          totalTasks: 8,
          completedTasks: 6,
          inProgressTasks: 2,
          pendingTasks: 0,
          overdueTasks: 1,
        },
        recentTasks: [
          {
            _id: 'task3',
            title: 'Design dashboard layout',
            description: 'Create new dashboard mockups',
            status: 'completed',
            priority: 'medium',
            dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            estimatedHours: 12,
            actualHours: 10,
            progress: 100,
            category: 'project',
            projectName: 'Admin Dashboard',
            assignedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            updates: []
          },
        ]
      },
      {
        _id: 'demo3',
        name: 'Mike Johnson',
        role: 'Project Manager',
        department: 'Management',
        stats: {
          totalTasks: 5,
          completedTasks: 3,
          inProgressTasks: 2,
          pendingTasks: 0,
          overdueTasks: 0,
        },
        recentTasks: [
          {
            _id: 'task4',
            title: 'Weekly progress report',
            description: 'Compile team progress updates',
            status: 'in_progress',
            priority: 'low',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            estimatedHours: 4,
            actualHours: 2,
            progress: 50,
            category: 'daily',
            projectName: 'Weekly Reports',
            assignedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updates: []
          },
        ]
      }
    ];

    setEmployees(demoEmployees);
    setSummary({
      totalEmployees: demoEmployees.length,
      totalTasks: demoEmployees.reduce((sum, emp) => sum + emp.stats.totalTasks, 0),
      completedTasks: demoEmployees.reduce((sum, emp) => sum + emp.stats.completedTasks, 0),
      overdueTasks: demoEmployees.reduce((sum, emp) => sum + emp.stats.overdueTasks, 0),
      completionRate: 68,
    });
  };

  useEffect(() => {
    fetchDashboardData();
    fetchEmployeeData();
  }, []);

  const handleAssignTask = async () => {
    try {
      if (!assignForm.title.trim() || !assignForm.assignedTo) {
        setError('Please fill in all required fields');
        return;
      }

      if (isDemoMode) {
        alert('In demo mode: Task would be assigned successfully!\n\n' +
              `Task: ${assignForm.title}\n` +
              `Assigned to: ${availableEmployees.find(e => e._id === assignForm.assignedTo)?.name}\n` +
              `Due: ${assignForm.dueDate.toLocaleDateString()}`);
        
        const assignedToEmployee = availableEmployees.find(e => e._id === assignForm.assignedTo);
        if (assignedToEmployee) {
          const newTask = {
            _id: `demo-task-${Date.now()}`,
            title: assignForm.title,
            description: assignForm.description,
            status: 'assigned',
            priority: assignForm.priority,
            dueDate: assignForm.dueDate.toISOString(),
            estimatedHours: assignForm.estimatedHours,
            actualHours: 0,
            progress: 0,
            category: assignForm.category,
            projectName: 'New Assignment',
            assignedAt: new Date().toISOString(),
            updates: []
          };

          setEmployees(prev => prev.map(emp => {
            if (emp._id === assignForm.assignedTo) {
              return {
                ...emp,
                stats: {
                  ...emp.stats,
                  totalTasks: emp.stats.totalTasks + 1,
                  pendingTasks: emp.stats.pendingTasks + 1,
                },
                recentTasks: [newTask, ...emp.recentTasks]
              };
            }
            return emp;
          }));
        }

        setAssignDialogOpen(false);
        setAssignForm({
          title: '',
          description: '',
          assignedTo: '',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          estimatedHours: 8,
          priority: 'medium',
          category: 'daily',
        });
        return;
      }

      const response = await fetch('/api/tasks/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...assignForm,
          dueDate: assignForm.dueDate.toISOString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to assign task');
      }

      setAssignDialogOpen(false);
      setAssignForm({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        estimatedHours: 8,
        priority: 'medium',
        category: 'daily',
      });
      
      fetchDashboardData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign task');
    }
  };

  const getEmployeeTasks = async (employeeId: string) => {
    if (isDemoMode) {
      const employee = employees.find(emp => emp._id === employeeId);
      if (employee) {
        setSelectedEmployee(employee);
        setViewDialogOpen(true);
      }
      return;
    }

    try {
      const response = await fetch(`/api/tasks/employee/${employeeId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedEmployee({
          _id: employeeId,
          name: data.employee?.name || 'Unknown Employee',
          role: data.employee?.role || 'Employee',
          department: data.employee?.department || 'General',
          stats: {
            totalTasks: data.stats?.totalTasks || 0,
            completedTasks: data.stats?.completedTasks || 0,
            inProgressTasks: data.stats?.inProgressTasks || 0,
            pendingTasks: data.stats?.pendingTasks || 0,
            overdueTasks: data.stats?.overdueTasks || 0,
          },
          recentTasks: Array.isArray(data.tasks) ? data.tasks : []
        });
        setViewDialogOpen(true);
      }
    } catch (err) {
      console.error('Error fetching employee tasks:', err);
    }
  };

  return {
    loading,
    error,
    summary,
    employees,
    selectedTab,
    assignDialogOpen,
    viewDialogOpen,
    selectedEmployee,
    selectedTask,
    assignForm,
    isDemoMode,
    showDemoAlert,
    availableEmployees,
    setSelectedTab,
    setAssignDialogOpen,
    setViewDialogOpen,
    setSelectedEmployee,
    setSelectedTask,
    setAssignForm,
    setIsDemoMode,
    setShowDemoAlert,
    setError,
    fetchDashboardData,
    fetchEmployeeData,
    loadDemoData,
    handleAssignTask,
    getEmployeeTasks
  };
};