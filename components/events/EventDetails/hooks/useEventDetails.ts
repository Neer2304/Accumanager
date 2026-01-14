import { useState, useEffect } from 'react';
import { Event } from '../../types';

export const useEventDetails = (eventId: string | string[] | undefined) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchEvent = async () => {
    if (!eventId || Array.isArray(eventId)) return;
    
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Event not found");
        if (res.status === 401) throw new Error("Please login again");
        throw new Error(`Failed to fetch event: ${res.status}`);
      }

      const data = await res.json();
      setEvent(data);
    } catch (error: any) {
      console.error("Error fetching event:", error);
      setError(error.message || "Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData: any) => {
    try {
      const response = await fetch(`/api/events/${eventId}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(expenseData),
      });

      if (response.ok) {
        setSuccess("Expense added successfully!");
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to add expense");
        return false;
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      setError("Failed to add expense");
      return false;
    }
  };

  const addSubEvent = async (subEventData: any) => {
    try {
      const response = await fetch(`/api/events/${eventId}/sub-events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(subEventData),
      });

      if (response.ok) {
        setSuccess("Sub-event added successfully!");
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to add sub-event");
        return false;
      }
    } catch (error) {
      console.error("Error adding sub-event:", error);
      setError("Failed to add sub-event");
      return false;
    }
  };

  const deleteExpense = async (expenseId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/expenses/${expenseId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setSuccess("Expense deleted successfully!");
        return true;
      } else {
        setError("Failed to delete expense");
        return false;
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      setError("Failed to delete expense");
      return false;
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  return {
    event,
    loading,
    error,
    success,
    setError,
    setSuccess,
    refetch: fetchEvent,
    addExpense,
    addSubEvent,
    deleteExpense,
  };
};