import { useState } from 'react';

interface AIConversation {
  role: 'user' | 'assistant';
  content: string;
}

interface UseAIApiReturn {
  conversation: AIConversation[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearConversation: () => void;
}

export const useAIApi = (): UseAIApiReturn => {
  const [conversation, setConversation] = useState<AIConversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: AIConversation = { role: 'user', content: message };
    setConversation(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Call your AI API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...conversation, userMessage],
          context: 'accumanage_help_support', // Add context for your AI
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      // Add AI response
      const aiMessage: AIConversation = { role: 'assistant', content: data.response };
      setConversation(prev => [...prev, aiMessage]);

    } catch (err) {
      console.error('AI API error:', err);
      setError('Failed to get response from AI assistant. Please try again.');
      
      // Fallback to local response
      const fallbackResponse = getFallbackResponse(message);
      const aiMessage: AIConversation = { role: 'assistant', content: fallbackResponse };
      setConversation(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('dashboard') || lowerMessage.includes('data')) {
      return 'For dashboard issues, please check: 1) Your internet connection 2) API endpoints 3) Authentication status. Would you like specific troubleshooting steps?';
    }
    
    if (lowerMessage.includes('gst') || lowerMessage.includes('invoice')) {
      return 'For GST invoicing help: 1) Verify business GST details 2) Check customer GSTIN 3) Review tax calculation settings. Need specific help?';
    }
    
    // Add more fallback responses as needed
    
    return 'I understand you need help with AccumaManage. Could you provide more details about your issue?';
  };

  const clearConversation = () => {
    setConversation([]);
    setError(null);
  };

  return {
    conversation,
    isLoading,
    error,
    sendMessage,
    clearConversation,
  };
};