// store/slices/attendanceSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Employee {
  id: string
  name: string
  phone: string
  email?: string
  role: string
  salary: number
  joiningDate: Date
  isActive: boolean
}

export interface Attendance {
  id: string
  employeeId: string
  employeeName: string
  date: string
  checkIn: string
  checkOut?: string
  status: 'present' | 'absent' | 'half-day'
  notes?: string
}

interface AttendanceState {
  employees: Employee[]
  attendance: Attendance[]
  selectedDate: string
  isLoading: boolean
  error: string | null
}

const initialState: AttendanceState = {
  employees: [],
  attendance: [],
  selectedDate: new Date().toISOString().split('T')[0],
  isLoading: false,
  error: null,
}

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setEmployees: (state, action: PayloadAction<Employee[]>) => {
      state.employees = action.payload
    },
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees.push(action.payload)
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      const index = state.employees.findIndex(e => e.id === action.payload.id)
      if (index !== -1) {
        state.employees[index] = action.payload
      }
    },
    setAttendance: (state, action: PayloadAction<Attendance[]>) => {
      state.attendance = action.payload
    },
    markAttendance: (state, action: PayloadAction<Attendance>) => {
      const existingIndex = state.attendance.findIndex(
        a => a.employeeId === action.payload.employeeId && a.date === action.payload.date
      )
      if (existingIndex !== -1) {
        state.attendance[existingIndex] = action.payload
      } else {
        state.attendance.push(action.payload)
      }
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setEmployees,
  addEmployee,
  updateEmployee,
  setAttendance,
  markAttendance,
  setSelectedDate,
  setLoading,
  setError,
} = attendanceSlice.actions
export default attendanceSlice.reducer