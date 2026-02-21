// hooks/useEvents.ts
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  addExpense,
  deleteExpense,
  addSubEvent,
  checkSubscription,
  clearError,
  clearCurrentEvent,
  selectEvents,
  selectCurrentEvent,
  selectEventsLoading,
  selectEventsError,
  selectSubscription,
  selectEventsPagination,
  Event,
  Expense,
  SubEvent,
} from '@/store/slices/eventsSlice';
import { AppDispatch } from '@/store/store';

interface UseEventsReturn {
  // State
  events: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
  subscription: any;
  pagination: any;

  // Actions
  fetchAllEvents: () => Promise<void>;
  fetchEvent: (id: string) => Promise<void>;
  createNewEvent: (eventData: Partial<Event>) => Promise<boolean>;
  updateExistingEvent: (id: string, data: Partial<Event>) => Promise<boolean>;
  deleteExistingEvent: (id: string) => Promise<boolean>;
  addEventExpense: (eventId: string, expense: Partial<Expense>) => Promise<boolean>;
  removeEventExpense: (eventId: string, expenseId: string) => Promise<boolean>;
  addEventSubEvent: (eventId: string, subEvent: Partial<SubEvent>) => Promise<boolean>;
  checkUserSubscription: () => Promise<void>;
  resetError: () => void;
  resetCurrentEvent: () => void;

  // Helpers
  getEventById: (id: string) => Event | undefined;
  getExpensesByCategory: (eventId: string) => Record<string, number>;
  getBudgetUtilization: (eventId: string) => number;
  getSubEventProgress: (eventId: string, subEventId: string) => number;
}

export const useEvents = (): UseEventsReturn => {
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const events = useSelector(selectEvents);
  const currentEvent = useSelector(selectCurrentEvent);
  const loading = useSelector(selectEventsLoading);
  const error = useSelector(selectEventsError);
  const subscription = useSelector(selectSubscription);
  const pagination = useSelector(selectEventsPagination);

  // Fetch all events
  const fetchAllEvents = useCallback(async () => {
    await dispatch(fetchEvents()).unwrap();
  }, [dispatch]);

  // Fetch single event
  const fetchEvent = useCallback(async (id: string) => {
    await dispatch(fetchEventById(id)).unwrap();
  }, [dispatch]);

  // Create event
  const createNewEvent = useCallback(async (eventData: Partial<Event>): Promise<boolean> => {
    try {
      await dispatch(createEvent(eventData)).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [dispatch]);

  // Update event
  const updateExistingEvent = useCallback(async (id: string, data: Partial<Event>): Promise<boolean> => {
    try {
      await dispatch(updateEvent({ id, data })).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [dispatch]);

  // Delete event
  const deleteExistingEvent = useCallback(async (id: string): Promise<boolean> => {
    try {
      await dispatch(deleteEvent(id)).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [dispatch]);

  // Add expense
  const addEventExpense = useCallback(async (eventId: string, expense: Partial<Expense>): Promise<boolean> => {
    try {
      await dispatch(addExpense({ eventId, expense })).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [dispatch]);

  // Delete expense
  const removeEventExpense = useCallback(async (eventId: string, expenseId: string): Promise<boolean> => {
    try {
      await dispatch(deleteExpense({ eventId, expenseId })).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [dispatch]);

  // Add sub-event
  const addEventSubEvent = useCallback(async (eventId: string, subEvent: Partial<SubEvent>): Promise<boolean> => {
    try {
      await dispatch(addSubEvent({ eventId, subEvent })).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [dispatch]);

  // Check subscription
  const checkUserSubscription = useCallback(async () => {
    await dispatch(checkSubscription()).unwrap();
  }, [dispatch]);

  // Reset error
  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Reset current event
  const resetCurrentEvent = useCallback(() => {
    dispatch(clearCurrentEvent());
  }, [dispatch]);

  // Helper: Get event by ID from list
  const getEventById = useCallback((id: string): Event | undefined => {
    return events.find(event => event._id === id);
  }, [events]);

  // Helper: Get expenses grouped by category
  const getExpensesByCategory = useCallback((eventId: string): Record<string, number> => {
    const event = events.find(e => e._id === eventId) || currentEvent;
    if (!event) return {};

    return event.expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [events, currentEvent]);

  // Helper: Calculate budget utilization percentage
  const getBudgetUtilization = useCallback((eventId: string): number => {
    const event = events.find(e => e._id === eventId) || currentEvent;
    if (!event || event.totalBudget === 0) return 0;

    return (event.totalSpent / event.totalBudget) * 100;
  }, [events, currentEvent]);

  // Helper: Calculate sub-event progress
  const getSubEventProgress = useCallback((eventId: string, subEventId: string): number => {
    const event = events.find(e => e._id === eventId) || currentEvent;
    if (!event) return 0;

    const subEvent = event.subEvents.find(se => se._id === subEventId);
    if (!subEvent || !subEvent.budget || subEvent.budget === 0) return 0;

    return (subEvent.spentAmount / subEvent.budget) * 100;
  }, [events, currentEvent]);

  // Auto-check subscription on mount
  useEffect(() => {
    checkUserSubscription();
  }, []);

  return {
    // State
    events,
    currentEvent,
    loading,
    error,
    subscription,
    pagination,

    // Actions
    fetchAllEvents,
    fetchEvent,
    createNewEvent,
    updateExistingEvent,
    deleteExistingEvent,
    addEventExpense,
    removeEventExpense,
    addEventSubEvent,
    checkUserSubscription,
    resetError,
    resetCurrentEvent,

    // Helpers
    getEventById,
    getExpensesByCategory,
    getBudgetUtilization,
    getSubEventProgress,
  };
};