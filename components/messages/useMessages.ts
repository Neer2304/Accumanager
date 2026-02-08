import { useState, useEffect } from 'react';
import { Message } from '@/types/messages';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/messages');
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  };

  const archiveMessage = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}/archive`, {
        method: 'PUT',
      });
      return response.ok;
    } catch (error) {
      console.error('Error archiving message:', error);
      return false;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}/read`, {
        method: 'PUT',
      });
      return response.ok;
    } catch (error) {
      console.error('Error marking as read:', error);
      return false;
    }
  };

  const toggleStar = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}/star`, {
        method: 'PUT',
      });
      return response.ok;
    } catch (error) {
      console.error('Error toggling star:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return {
    messages,
    loading,
    deleteMessage,
    archiveMessage,
    markAsRead,
    toggleStar,
    refetch: fetchMessages,
  };
};