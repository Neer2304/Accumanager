// store/slices/eventsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Types
export interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date?: string;
  paymentMethod?: string;
  notes?: string;
  subEventId?: string;
  createdAt: string;
}

export interface SubEvent {
  _id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  spentAmount: number;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Event {
  _id: string;
  name: string;
  description?: string;
  type: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  totalSpent: number;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  userId: string;
  expenses: Expense[];
  subEvents: SubEvent[];
  createdAt: string;
  updatedAt?: string;
}

export interface SubscriptionLimits {
  events: number;
  maxExpenseAmount?: number;
  maxSubEvents?: number;
  maxExpenses?: number;
}

export interface Subscription {
  isActive: boolean;
  plan?: string;
  limits: SubscriptionLimits;
}

export interface EventsState {
  events: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
  subscription: Subscription | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Initial state
const initialState: EventsState = {
  events: [],
  currentEvent: null,
  loading: false,
  error: null,
  subscription: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
};

// Async thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/events', {
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (!response.ok) {
        if (response.status === 402) {
          const data = await response.json();
          return rejectWithValue({ type: 'subscription', message: data.message });
        }
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (!response.ok) {
        if (response.status === 402) {
          const data = await response.json();
          return rejectWithValue({ type: 'subscription', message: data.message });
        }
        if (response.status === 404) {
          return rejectWithValue({ type: 'notfound', message: 'Event not found' });
        }
        throw new Error(`Failed to fetch event: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData: Partial<Event>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        if (response.status === 402) {
          const data = await response.json();
          return rejectWithValue({ type: 'subscription', message: data.message });
        }
        throw new Error(`Failed to create event: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, data }: { id: string; data: Partial<Event> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 402) {
          const data = await response.json();
          return rejectWithValue({ type: 'subscription', message: data.message });
        }
        throw new Error(`Failed to update event: ${response.status}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 402) {
          const data = await response.json();
          return rejectWithValue({ type: 'subscription', message: data.message });
        }
        throw new Error(`Failed to delete event: ${response.status}`);
      }

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Expense thunks
export const addExpense = createAsyncThunk(
  'events/addExpense',
  async ({ eventId, expense }: { eventId: string; expense: Partial<Expense> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/events/${eventId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(expense),
      });

      if (!response.ok) {
        if (response.status === 402) {
          const data = await response.json();
          return rejectWithValue({ type: 'subscription', message: data.message });
        }
        throw new Error(`Failed to add expense: ${response.status}`);
      }

      const data = await response.json();
      return { eventId, expense: data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'events/deleteExpense',
  async ({ eventId, expenseId }: { eventId: string; expenseId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/events/${eventId}/expenses/${expenseId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 402) {
          const data = await response.json();
          return rejectWithValue({ type: 'subscription', message: data.message });
        }
        throw new Error(`Failed to delete expense: ${response.status}`);
      }

      return { eventId, expenseId };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Sub-event thunks
export const addSubEvent = createAsyncThunk(
  'events/addSubEvent',
  async ({ eventId, subEvent }: { eventId: string; subEvent: Partial<SubEvent> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/events/${eventId}/sub-events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(subEvent),
      });

      if (!response.ok) {
        if (response.status === 402) {
          const data = await response.json();
          return rejectWithValue({ type: 'subscription', message: data.message });
        }
        throw new Error(`Failed to add sub-event: ${response.status}`);
      }

      const data = await response.json();
      return { eventId, subEvent: data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Check subscription
export const checkSubscription = createAsyncThunk(
  'events/checkSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/subscription/status', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to check subscription: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    setSubscription: (state, action: PayloadAction<Subscription>) => {
      state.subscription = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        state.pagination.total = action.payload.length;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Event By Id
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.events.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.currentEvent?._id === action.payload._id) {
          state.currentEvent = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(e => e._id !== action.payload);
        if (state.currentEvent?._id === action.payload) {
          state.currentEvent = null;
        }
        state.pagination.total -= 1;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add Expense
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentEvent?._id === action.payload.eventId) {
          state.currentEvent.expenses.push(action.payload.expense);
          state.currentEvent.totalSpent += action.payload.expense.amount;
        }
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Expense
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentEvent?._id === action.payload.eventId) {
          const expense = state.currentEvent.expenses.find(e => e._id === action.payload.expenseId);
          if (expense) {
            state.currentEvent.totalSpent -= expense.amount;
            state.currentEvent.expenses = state.currentEvent.expenses.filter(
              e => e._id !== action.payload.expenseId
            );
          }
        }
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add Sub-Event
      .addCase(addSubEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSubEvent.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentEvent?._id === action.payload.eventId) {
          state.currentEvent.subEvents.push(action.payload.subEvent);
        }
      })
      .addCase(addSubEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Check Subscription
      .addCase(checkSubscription.fulfilled, (state, action) => {
        state.subscription = action.payload;
      });
  },
});

export const { clearError, clearCurrentEvent, setSubscription } = eventsSlice.actions;

// Selectors
export const selectEvents = (state: RootState) => state.events.events;
export const selectCurrentEvent = (state: RootState) => state.events.currentEvent;
export const selectEventsLoading = (state: RootState) => state.events.loading;
export const selectEventsError = (state: RootState) => state.events.error;
export const selectSubscription = (state: RootState) => state.events.subscription;
export const selectEventsPagination = (state: RootState) => state.events.pagination;

export default eventsSlice.reducer;