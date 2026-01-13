"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  alpha,
  Chip,
  Avatar,
  LinearProgress,
  Badge,
  Card,
  CardContent,
  Stack,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  Add,
  Refresh,
  Edit,
  Visibility,
  BarChart,
  AssignmentTurnedIn,
  Person,
  Search,
  FilterList,
  CheckCircle,
  AccessTime,
  Today,
  TrendingUp,
  Task as TaskIcon,
  Chat,
  AttachFile,
  PriorityHigh,
  CalendarToday,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import { MainLayout } from "@/components/Layout/MainLayout";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Router } from "next/router";

interface Employee {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  department?: string;
  salary?: number;
  salaryType?: string;
  joiningDate?: string;
  isActive?: boolean;
  leaveBalance?: number;
  stats?: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
    overdueTasks: number;
    completionRate: number;
  };
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status:
    | "assigned"
    | "in_progress"
    | "completed"
    | "blocked"
    | "review"
    | "on_hold";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string;
  progress: number;
  estimatedHours: number;
  actualHours: number;
  category: string;
  projectName?: string;
  assignedTo: {
    _id: string;
    name: string;
  };
  updates: Array<{
    description: string;
    progress: number;
    hoursWorked: number;
    createdAt: string;
  }>;
  comments: Array<{
    message: string;
    userName: string;
    createdAt: string;
  }>;
}

export default function TeamDashboardPage() {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  // Data states
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Dialogs
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [viewEmployeeDialogOpen, setViewEmployeeDialogOpen] = useState(false);
  const [viewTaskDialogOpen, setViewTaskDialogOpen] = useState(false);
  const [updateProgressDialogOpen, setUpdateProgressDialogOpen] =
    useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const router = Router;
  // Forms
  const [assignForm, setAssignForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    estimatedHours: 8,
    priority: "medium" as const,
    category: "Development",
    requirements: "",
    acceptanceCriteria: "",
  });

  const [progressForm, setProgressForm] = useState({
    description: "",
    progress: 0,
    hoursWorked: 0,
    attachments: [] as string[],
  });

  // Fetch all data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch employees from attendance API
      const employeesResponse = await fetch("/api/attendance", {
        credentials: "include",
      });

      if (!employeesResponse.ok) {
        if (employeesResponse.status === 402) {
          const errorData = await employeesResponse.json();
          throw new Error(errorData.error);
        }
        throw new Error("Failed to fetch employees");
      }

      const employeesData = await employeesResponse.json();

      // Fetch tasks for each employee and calculate stats
      const employeesWithStats = await Promise.all(
        employeesData.map(async (emp: any) => {
          try {
            const tasksResponse = await fetch(
              `/api/tasks/employee/${emp._id}`,
              {
                credentials: "include",
              }
            );

            let taskStats = {
              totalTasks: 0,
              completedTasks: 0,
              inProgressTasks: 0,
              pendingTasks: 0,
              overdueTasks: 0,
              completionRate: 0,
            };

            let employeeTasks: Task[] = [];

            if (tasksResponse.ok) {
              const tasksData = await tasksResponse.json();
              taskStats = tasksData.stats || taskStats;
              employeeTasks =
                tasksData.tasks?.map((task: any) => ({
                  ...task,
                  assignedTo: { _id: emp._id, name: emp.name },
                })) || [];
            }

            return {
              ...emp,
              stats: taskStats,
              tasks: employeeTasks,
            };
          } catch (error) {
            console.error(
              `Error fetching tasks for employee ${emp._id}:`,
              error
            );
            return {
              ...emp,
              stats: {
                totalTasks: 0,
                completedTasks: 0,
                inProgressTasks: 0,
                pendingTasks: 0,
                overdueTasks: 0,
                completionRate: 0,
              },
              tasks: [],
            };
          }
        })
      );

      setEmployees(employeesWithStats);
      setFilteredEmployees(employeesWithStats);

      // Combine all tasks
      const allTasks = employeesWithStats.flatMap((emp) => emp.tasks || []);
      setTasks(allTasks);
      setFilteredTasks(allTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...employees];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter((emp) => emp.department === departmentFilter);
    }

    setFilteredEmployees(filtered);
  }, [searchTerm, departmentFilter, employees]);

  useEffect(() => {
    let filtered = [...tasks];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  }, [statusFilter, priorityFilter, tasks]);

  // Calculate overall stats
  const calculateOverallStats = () => {
    const totalEmployees = employees.length;
    const totalTasks = employees.reduce(
      (sum, emp) => sum + (emp.stats?.totalTasks || 0),
      0
    );
    const completedTasks = employees.reduce(
      (sum, emp) => sum + (emp.stats?.completedTasks || 0),
      0
    );
    const overdueTasks = employees.reduce(
      (sum, emp) => sum + (emp.stats?.overdueTasks || 0),
      0
    );
    const inProgressTasks = employees.reduce(
      (sum, emp) => sum + (emp.stats?.inProgressTasks || 0),
      0
    );
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate total hours
    const totalEstimatedHours = tasks.reduce(
      (sum, task) => sum + (task.estimatedHours || 0),
      0
    );
    const totalActualHours = tasks.reduce(
      (sum, task) => sum + (task.actualHours || 0),
      0
    );

    return {
      totalEmployees,
      totalTasks,
      completedTasks,
      overdueTasks,
      inProgressTasks,
      completionRate,
      totalEstimatedHours,
      totalActualHours,
    };
  };

  const stats = calculateOverallStats();

  // Get unique departments for filter
  const departments = Array.from(
    new Set(employees.map((emp) => emp.department).filter(Boolean))
  ) as string[];

  const handleViewEmployee = async (employeeId: string) => {
    try {
      // Fetch detailed employee data
      const response = await fetch(`/api/attendance/${employeeId}`, {
        credentials: "include",
      });

      if (response.ok) {
        const employeeData = await response.json();
        setSelectedEmployee(employeeData);
        setViewEmployeeDialogOpen(true);
      }
    } catch (err) {
      console.error("Error fetching employee details:", err);
      setError("Failed to load employee details");
    }
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setViewTaskDialogOpen(true);
  };

  // In your TeamDashboardPage component, update the handleAssignTask function:
  // In your handleAssignTask function in TeamDashboardPage.tsx
  const handleAssignTask = async () => {
    try {
      console.log("🚀 Starting task assignment...");

      // Validate form
      if (!assignForm.title.trim()) {
        setError("Task title is required");
        return;
      }

      if (!assignForm.assignedTo) {
        setError("Please select an employee to assign the task to");
        return;
      }

      // Check if due date is in the past
      if (assignForm.dueDate < new Date()) {
        setError("Due date cannot be in the past");
        return;
      }

      // Find selected employee
      const selectedEmp = employees.find(
        (emp) => emp._id === assignForm.assignedTo
      );
      if (!selectedEmp) {
        setError("Selected employee not found in the system");
        return;
      }

      console.log("📝 Preparing task data:", {
        title: assignForm.title,
        assignedTo: assignForm.assignedTo,
        assignedToName: selectedEmp.name,
        dueDate: assignForm.dueDate,
        estimatedHours: assignForm.estimatedHours,
      });

      // Prepare task data with CORRECT field names
      const taskData = {
        title: assignForm.title.trim(),
        description: assignForm.description || "",
        assignedTo: assignForm.assignedTo,
        assignedToName: selectedEmp.name,
        dueDate: assignForm.dueDate.toISOString(),
        estimatedHours: assignForm.estimatedHours || 8,
        priority: assignForm.priority,
        category: assignForm.category,
        projectName: assignForm.category,
        requirements: assignForm.requirements || "",
        acceptanceCriteria: assignForm.acceptanceCriteria || "",
        checklistItems: [], // This will be mapped to checklist in the API
      };

      console.log("📤 Sending task assignment request:", {
        url: "/api/tasks/assign",
        data: taskData,
        timestamp: new Date().toISOString(),
      });

      // Make API request
      const response = await fetch("/api/tasks/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(taskData),
      });

      console.log("📥 Response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      });

      // Parse response
      let responseData;
      try {
        responseData = await response.json();
        console.log("📊 Response data:", responseData);
      } catch (parseError) {
        console.error("❌ Failed to parse response:", parseError);
        throw new Error("Server returned invalid response format");
      }

      // Handle error responses
      if (!response.ok) {
        console.error("❌ Server error response:", responseData);

        // Specific error handling
        switch (response.status) {
          case 400:
            if (responseData.missingFields) {
              throw new Error(
                `Missing required fields: ${responseData.missingFields.join(
                  ", "
                )}`
              );
            }
            if (responseData.details) {
              const details = Array.isArray(responseData.details)
                ? responseData.details.join(", ")
                : typeof responseData.details === "object"
                ? Object.values(responseData.details)
                    .map((err: any) => err.message)
                    .join(", ")
                : responseData.details;
              throw new Error(`Validation error: ${details}`);
            }
            throw new Error(
              responseData.error || "Bad request - please check your input"
            );

          case 401:
            setError(
              "Session expired. Please refresh the page and login again."
            );
            // Optionally redirect to login after a delay
            return;

          case 403:
            throw new Error(
              responseData.error || "You do not have permission to assign tasks"
            );

          case 404:
            throw new Error(
              responseData.error ||
                "Employee not found. Please refresh the employee list."
            );

          case 409:
            throw new Error(
              responseData.error || "A task with this title already exists"
            );

          case 422:
            throw new Error(responseData.error || "Invalid data provided");

          case 429:
            throw new Error(
              "Too many requests. Please wait a moment before trying again."
            );

          case 500:
            throw new Error(
              responseData.error || "Server error. Please try again later."
            );

          default:
            throw new Error(
              responseData.error || `Failed to assign task (${response.status})`
            );
        }
      }

      // Success handling
      console.log("✅ Task assignment successful:", responseData);

      // Reset form
      setAssignForm({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        estimatedHours: 8,
        priority: "medium",
        category: "Development",
        requirements: "",
        acceptanceCriteria: "",
      });

      // Close dialog
      setAssignDialogOpen(false);

      // Show success message
      setError(null);

      // Refresh dashboard data
      setRefreshing(true);
      await fetchDashboardData();

      if (responseData.task) {
        console.log("🎉 New task created:", responseData.task);
      }
    } catch (err) {
      console.error("❌ Error in handleAssignTask:", {
        error: err,
        message: err instanceof Error ? err.message : "Unknown error",
        stack: err instanceof Error ? err.stack : undefined,
      });

      // Set error message
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to assign task. Please try again.";

      setError(errorMessage);
    } finally {
      console.log("🏁 Task assignment process completed");
    }
  };

  const handleUpdateProgress = async () => {
    try {
      if (!selectedTask) return;

      const response = await fetch("/api/tasks/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          taskId: selectedTask._id,
          progress: progressForm.progress,
          hoursWorked: progressForm.hoursWorked,
          description: progressForm.description,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update task");
      }

      setUpdateProgressDialogOpen(false);
      setProgressForm({
        description: "",
        progress: 0,
        hoursWorked: 0,
        attachments: [],
      });

      // Refresh data
      fetchDashboardData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "success";
      case "in_progress":
        return "info";
      case "assigned":
        return "warning";
      case "blocked":
        return "error";
      case "review":
        return "secondary";
      case "on_hold":
        return "default";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "urgent":
        return "error";
      case "high":
        return "warning";
      case "medium":
        return "info";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
      "#10b981",
      "#f59e0b",
      "#ef4444",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const EmployeeCard = ({ employee }: { employee: Employee }) => (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        transition: "all 0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent
        sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: employee.isActive ? "success.main" : "error.main",
                    border: `2px solid white`,
                  }}
                />
              }
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: getAvatarColor(employee.name),
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {employee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </Avatar>
            </Badge>
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {employee.name}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label={employee.role}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                />
                {employee.department && (
                  <Chip
                    label={employee.department}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          </Box>

          {employee.stats && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {employee.stats.completionRate}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Completion
              </Typography>
            </Box>
          )}
        </Box>

        {employee.stats && (
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Task Progress
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {employee.stats.completedTasks}/{employee.stats.totalTasks}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={employee.stats.completionRate}
              sx={{ height: 8, borderRadius: 4 }}
            />

            <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
              <Chip
                label={`${employee.stats.completedTasks} Done`}
                size="small"
                color="success"
                variant="outlined"
              />
              <Chip
                label={`${employee.stats.inProgressTasks} In Progress`}
                size="small"
                color="info"
                variant="outlined"
              />
              {employee.stats.overdueTasks > 0 && (
                <Chip
                  label={`${employee.stats.overdueTasks} Overdue`}
                  size="small"
                  color="error"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}

        <Box
          sx={{
            mt: "auto",
            pt: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Visibility />}
            onClick={() => handleViewEmployee(employee._id)}
            size="small"
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const TaskCard = ({ task }: { task: Task }) => {
    const isOverdue =
      new Date(task.dueDate) < new Date() && task.status !== "completed";

    return (
      <Card
        sx={{
          cursor: "pointer",
          height: "100%",
          borderRadius: 2,
          transition: "all 0.3s",
          "&:hover": {
            borderColor: theme.palette.primary.main,
            boxShadow: theme.shadows[4],
            transform: "translateY(-2px)",
          },
        }}
        onClick={() => handleViewTask(task)}
      >
        <CardContent sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TaskIcon fontSize="small" color="primary" />
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ flex: 1 }}
              >
                {task.title}
              </Typography>
            </Box>
            <Chip
              label={task.status.replace("_", " ")}
              size="small"
              color={getStatusColor(task.status)}
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {task.description?.substring(0, 100)}...
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                fontSize: 12,
                bgcolor: getAvatarColor(task.assignedTo.name),
              }}
            >
              {task.assignedTo.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {task.assignedTo.name}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" fontWeight="bold">
                {task.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={task.progress}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarToday fontSize="small" color="action" />
              <Typography
                variant="caption"
                color={isOverdue ? "error.main" : "text.secondary"}
                fontWeight={isOverdue ? "bold" : "normal"}
              >
                {new Date(task.dueDate).toLocaleDateString()}
                {isOverdue && " ⚠️"}
              </Typography>
            </Box>
            <Chip
              label={task.priority}
              size="small"
              color={getPriorityColor(task.priority)}
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>
    );
  };

  const StatsCard = ({ title, value, icon, color, trend }: any) => (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(color, 0.1),
              color: color,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <MainLayout title="Team Dashboard">
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Team Dashboard">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, margin: "0 auto" }}>
          {/* Header */}
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              mb: 4,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box sx={{ position: "absolute", top: 0, right: 0, opacity: 0.1 }}>
              <Person sx={{ fontSize: 200 }} />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                position: "relative",
              }}
            >
              <Box>
                <Typography
                  variant="h3"
                  component="h1"
                  fontWeight="bold"
                  gutterBottom
                >
                  Team Work Dashboard
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                  Assign tasks, track progress, and monitor team performance
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Tooltip title="Refresh data">
                  <IconButton
                    onClick={() => {
                      setRefreshing(true);
                      fetchDashboardData();
                    }}
                    disabled={refreshing}
                    sx={{
                      bgcolor: alpha("#fff", 0.2),
                      color: "white",
                      "&:hover": { bgcolor: alpha("#fff", 0.3) },
                    }}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setAssignDialogOpen(true)}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: alpha("#fff", 0.9),
                    },
                  }}
                >
                  Assign Task
                </Button>
              </Box>
            </Box>

            {/* Quick Stats */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 2,
                mt: 3,
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  bgcolor: alpha("#fff", 0.2),
                  color: "white",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalEmployees}
                </Typography>
                <Typography variant="body2">Team Members</Typography>
              </Paper>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: alpha("#fff", 0.2),
                  color: "white",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalTasks}
                </Typography>
                <Typography variant="body2">Total Tasks</Typography>
              </Paper>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: alpha("#fff", 0.2),
                  color: "white",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h4" fontWeight="bold">
                  {stats.completionRate}%
                </Typography>
                <Typography variant="body2">Completion Rate</Typography>
              </Paper>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: alpha("#fff", 0.2),
                  color: "white",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalActualHours}h
                </Typography>
                <Typography variant="body2">Work Hours</Typography>
              </Paper>
            </Box>
          </Paper>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Tabs */}
          <Paper sx={{ mb: 3, borderRadius: 3 }}>
            <Tabs
              value={selectedTab}
              onChange={(e, v) => setSelectedTab(v)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab icon={<Person />} label="Team Overview" />
              <Tab icon={<AssignmentTurnedIn />} label="Task Management" />
              <Tab icon={<BarChart />} label="Performance" />
            </Tabs>
          </Paper>

          {/* Team Overview Tab */}
          {selectedTab === 0 && (
            <Box>
              {/* Filters */}
              <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                    alignItems: { xs: "stretch", md: "center" },
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <Search sx={{ mr: 1, color: "action.active" }} />
                      ),
                    }}
                  />

                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                      label="Department"
                    >
                      <MenuItem value="all">All Departments</MenuItem>
                      {departments.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Paper>

              {/* Employees Grid */}
              {filteredEmployees.length > 0 ? (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                      lg: "repeat(4, 1fr)",
                    },
                    gap: 3,
                  }}
                >
                  {filteredEmployees.map((employee) => (
                    <EmployeeCard key={employee._id} employee={employee} />
                  ))}
                </Box>
              ) : (
                <Paper sx={{ textAlign: "center", p: 6, borderRadius: 3 }}>
                  <Person
                    sx={{
                      fontSize: 60,
                      color: "text.secondary",
                      mb: 2,
                      opacity: 0.5,
                    }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No employees found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm
                      ? "Try a different search term"
                      : "Add employees to get started"}
                  </Typography>
                </Paper>
              )}
            </Box>
          )}

          {/* Task Management Tab */}
          {selectedTab === 1 && (
            <Box>
              {/* Filters */}
              <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                    alignItems: { xs: "stretch", md: "center" },
                  }}
                >
                  <FormControl sx={{ flex: 1 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="assigned">Assigned</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="blocked">Blocked</MenuItem>
                      <MenuItem value="review">Review</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl sx={{ flex: 1 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      label="Priority"
                    >
                      <MenuItem value="all">All Priorities</MenuItem>
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="urgent">Urgent</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setAssignDialogOpen(true)}
                    sx={{ height: 56 }}
                  >
                    New Task
                  </Button>
                </Box>
              </Paper>

              {/* Tasks Grid */}
              {filteredTasks.length > 0 ? (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                    },
                    gap: 3,
                  }}
                >
                  {filteredTasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                </Box>
              ) : (
                <Paper sx={{ textAlign: "center", p: 6, borderRadius: 3 }}>
                  <AssignmentTurnedIn
                    sx={{
                      fontSize: 60,
                      color: "text.secondary",
                      mb: 2,
                      opacity: 0.5,
                    }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No tasks found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start by assigning tasks to your team members
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setAssignDialogOpen(true)}
                    sx={{ mt: 2 }}
                  >
                    Assign First Task
                  </Button>
                </Paper>
              )}
            </Box>
          )}

          {/* Performance Tab */}
          {selectedTab === 2 && (
            <Box>
              <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Team Performance Summary
                </Typography>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Employee</TableCell>
                        <TableCell align="center">Total Tasks</TableCell>
                        <TableCell align="center">Completed</TableCell>
                        <TableCell align="center">In Progress</TableCell>
                        <TableCell align="center">Overdue</TableCell>
                        <TableCell align="center">Completion Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee._id} hover>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: getAvatarColor(employee.name),
                                  width: 32,
                                  height: 32,
                                }}
                              >
                                {employee.name.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {employee.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {employee.role}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight="bold">
                              {employee.stats?.totalTasks || 0}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              size="small"
                              label={employee.stats?.completedTasks || 0}
                              color="success"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              size="small"
                              label={employee.stats?.inProgressTasks || 0}
                              color="info"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="center">
                            {employee.stats?.overdueTasks ? (
                              <Chip
                                size="small"
                                label={employee.stats.overdueTasks}
                                color="error"
                              />
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                0
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                              }}
                            >
                              <LinearProgress
                                variant="determinate"
                                value={employee.stats?.completionRate || 0}
                                sx={{ width: 80, height: 8, borderRadius: 4 }}
                              />
                              <Typography variant="body2" fontWeight="bold">
                                {employee.stats?.completionRate || 0}%
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          )}
        </Box>

        {/* Assign Task Dialog */}
        <Dialog
          open={assignDialogOpen}
          onClose={() => setAssignDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Assign New Task</DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}
            >
              <TextField
                label="Task Title *"
                value={assignForm.title}
                onChange={(e) =>
                  setAssignForm({ ...assignForm, title: e.target.value })
                }
                fullWidth
                required
              />

              <TextField
                label="Description"
                value={assignForm.description}
                onChange={(e) =>
                  setAssignForm({ ...assignForm, description: e.target.value })
                }
                multiline
                rows={3}
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel>Assign To *</InputLabel>
                <Select
                  value={assignForm.assignedTo}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, assignedTo: e.target.value })
                  }
                  label="Assign To *"
                  required
                >
                  {employees.map((emp) => (
                    <MenuItem key={emp._id} value={emp._id}>
                      {emp.name} ({emp.role})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <DatePicker
                    label="Due Date *"
                    value={assignForm.dueDate}
                    onChange={(date) =>
                      date && setAssignForm({ ...assignForm, dueDate: date })
                    }
                    slotProps={{
                      textField: { fullWidth: true, required: true },
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    label="Estimated Hours"
                    type="number"
                    value={assignForm.estimatedHours}
                    onChange={(e) =>
                      setAssignForm({
                        ...assignForm,
                        estimatedHours: Number(e.target.value) || 0,
                      })
                    }
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">hours</InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={assignForm.priority}
                      onChange={(e) =>
                        setAssignForm({
                          ...assignForm,
                          priority: e.target.value as any,
                        })
                      }
                      label="Priority"
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="urgent">Urgent</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={assignForm.category}
                      onChange={(e) =>
                        setAssignForm({
                          ...assignForm,
                          category: e.target.value,
                        })
                      }
                      label="Category"
                    >
                      <MenuItem value="Development">Development</MenuItem>
                      <MenuItem value="Design">Design</MenuItem>
                      <MenuItem value="Testing">Testing</MenuItem>
                      <MenuItem value="Documentation">Documentation</MenuItem>
                      <MenuItem value="Meeting">Meeting</MenuItem>
                      <MenuItem value="Research">Research</MenuItem>
                      <MenuItem value="Bug Fix">Bug Fix</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <TextField
                label="Requirements"
                value={assignForm.requirements}
                onChange={(e) =>
                  setAssignForm({ ...assignForm, requirements: e.target.value })
                }
                multiline
                rows={2}
                fullWidth
                placeholder="What needs to be done?"
              />

              <TextField
                label="Acceptance Criteria"
                value={assignForm.acceptanceCriteria}
                onChange={(e) =>
                  setAssignForm({
                    ...assignForm,
                    acceptanceCriteria: e.target.value,
                  })
                }
                multiline
                rows={2}
                fullWidth
                placeholder="How will we know it's done?"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleAssignTask}
              disabled={!assignForm.title || !assignForm.assignedTo}
            >
              Assign Task
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Task Dialog */}
        <Dialog
          open={viewTaskDialogOpen}
          onClose={() => setViewTaskDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedTask && (
            <>
              <DialogTitle>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {selectedTask.title}
                    </Typography>
                    <Box
                      sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}
                    >
                      <Chip
                        label={selectedTask.status.replace("_", " ")}
                        color={getStatusColor(selectedTask.status)}
                        size="small"
                      />
                      <Chip
                        label={selectedTask.priority}
                        color={getPriorityColor(selectedTask.priority)}
                        size="small"
                        variant="outlined"
                      />
                      {selectedTask.category && (
                        <Chip
                          label={selectedTask.category}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setProgressForm({
                        description: "",
                        progress: selectedTask.progress,
                        hoursWorked: 0,
                        attachments: [],
                      });
                      setUpdateProgressDialogOpen(true);
                    }}
                  >
                    Update Progress
                  </Button>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" paragraph>
                    {selectedTask.description}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 3,
                      mb: 3,
                    }}
                  >
                    <Paper sx={{ p: 2, borderRadius: 2, flex: 1 }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Assigned To
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: 14,
                            bgcolor: getAvatarColor(
                              selectedTask.assignedTo.name
                            ),
                          }}
                        >
                          {selectedTask.assignedTo.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedTask.assignedTo.name}
                        </Typography>
                      </Box>
                    </Paper>

                    <Paper sx={{ p: 2, borderRadius: 2, flex: 1 }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Due Date
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {new Date(selectedTask.dueDate).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  </Box>

                  {/* Progress */}
                  <Paper sx={{ p: 2, borderRadius: 2, mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Progress: {selectedTask.progress}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={selectedTask.progress}
                      sx={{ height: 10, borderRadius: 5, mb: 1 }}
                    />
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Estimated: {selectedTask.estimatedHours}h
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Actual: {selectedTask.actualHours}h
                      </Typography>
                    </Box>
                  </Paper>

                  {/* Updates */}
                  {selectedTask.updates && selectedTask.updates.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Updates
                      </Typography>
                      <Stack spacing={2}>
                        {selectedTask.updates.map((update, index) => (
                          <Paper key={index} sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="body2" paragraph>
                              {update.description}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Progress: {update.progress}% • Hours:{" "}
                                {update.hoursWorked}h
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(
                                  update.createdAt
                                ).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Paper>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setViewTaskDialogOpen(false)}>
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Update Progress Dialog */}
        <Dialog
          open={updateProgressDialogOpen}
          onClose={() => setUpdateProgressDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Update Task Progress</DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}
            >
              <TextField
                label="What did you work on?"
                value={progressForm.description}
                onChange={(e) =>
                  setProgressForm({
                    ...progressForm,
                    description: e.target.value,
                  })
                }
                multiline
                rows={3}
                fullWidth
                required
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <TextField
                    label="Progress %"
                    type="number"
                    value={progressForm.progress}
                    onChange={(e) =>
                      setProgressForm({
                        ...progressForm,
                        progress: Number(e.target.value),
                      })
                    }
                    fullWidth
                    InputProps={{
                      inputProps: { min: 0, max: 100 },
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    label="Hours Worked"
                    type="number"
                    value={progressForm.hoursWorked}
                    onChange={(e) =>
                      setProgressForm({
                        ...progressForm,
                        hoursWorked: Number(e.target.value),
                      })
                    }
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">hours</InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpdateProgressDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdateProgress}
              disabled={!progressForm.description}
            >
              Update Progress
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </MainLayout>
  );
}
