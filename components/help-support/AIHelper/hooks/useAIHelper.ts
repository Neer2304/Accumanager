import { useState, useCallback } from 'react';
import { 
  AI_HELPER_CONTENT, 
  getAIResponse, 
  formatAIResponse, 
  getQuickActionsByRole, 
  getTimeBasedGreeting, 
  getSystemStatus, 
  getEmergencyContact,
  type AIResponseType,
  type UserRole,
  type SystemStatus
} from '../AIHelperContent';

export interface ConversationMessage {
  type: 'user' | 'ai';
  text: string;
  data?: {
    title?: string;
    steps?: string[];
    followUp?: string;
    category?: string;
  };
}

export interface QuickAction {
  text: string;
  category?: string;
}

export interface UseAIHelperReturn {
  conversation: ConversationMessage[];
  message: string;
  isOpen: boolean;
  sendMessage: (text: string) => void;
  sendQuickAction: (action: string) => void;
  setMessage: (text: string) => void;
  openDialog: () => void;
  closeDialog: () => void;
  clearConversation: () => void;
  getQuickActionsByRole: (role?: UserRole) => string[];
  getTimeBasedGreeting: () => string;
  getSystemStatus: (status?: SystemStatus) => string;
  getEmergencyContact: (contactType: 'technical' | 'billing' | 'general') => string;
  getQuickSuggestions: () => QuickAction[];
  getCategorySuggestions: (category: 'technical' | 'functional' | 'setup' | 'billing') => string[];
  getTutorialResources: () => Array<{ title: string; url: string; duration: string }>;
  escalateSupport: (issueType: 'complex' | 'urgent' | 'technical') => string;
  provideFeedback: (rating: string, message?: string) => void;
}

export const useAIHelper = (): UseAIHelperReturn => {
  const [conversation, setConversation] = useState<ConversationMessage[]>([
    {
      type: 'ai',
      text: `${getTimeBasedGreeting()} ${AI_HELPER_CONTENT.dialog.welcomeMessage}`,
      data: {
        title: 'Welcome',
        steps: [],
        followUp: 'Try asking about a specific feature or click on a quick action below.'
      }
    }
  ]);
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const getEnhancedAIResponse = useCallback((userMessage: string): { 
    response: string; 
    data: { title: string; steps: string[]; followUp: string; category?: string } 
  } => {
    const aiResponse = getAIResponse(userMessage);
    const formattedResponse = formatAIResponse(aiResponse);
    
    // Determine category based on response type
    let category: string | undefined;
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('dashboard') || lowerMessage.includes('api') || lowerMessage.includes('error')) {
      category = 'technical';
    } else if (lowerMessage.includes('gst') || lowerMessage.includes('inventory') || lowerMessage.includes('customer')) {
      category = 'functional';
    } else if (lowerMessage.includes('setup') || lowerMessage.includes('how to') || lowerMessage.includes('configure')) {
      category = 'setup';
    } else if (lowerMessage.includes('subscription') || lowerMessage.includes('billing') || lowerMessage.includes('payment')) {
      category = 'billing';
    }

    return {
      response: formattedResponse,
      data: {
        ...aiResponse,
        category
      }
    };
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: ConversationMessage = { 
      type: 'user', 
      text,
      data: {
        title: 'User Query'
      }
    };
    setConversation(prev => [...prev, userMsg]);

    // Get AI response
    const { response, data } = getEnhancedAIResponse(text);
    
    // Simulate AI thinking delay
    setTimeout(() => {
      const aiMsg: ConversationMessage = { 
        type: 'ai', 
        text: response,
        data
      };
      setConversation(prev => [...prev, aiMsg]);
    }, 1000);

    setMessage('');
  }, [getEnhancedAIResponse]);

  const sendQuickAction = useCallback((action: string) => {
    sendMessage(action);
  }, [sendMessage]);

  const getQuickSuggestions = useCallback((): QuickAction[] => {
    return AI_HELPER_CONTENT.quickActions.map(action => ({
      text: action,
      category: action.toLowerCase().includes('gst') || action.toLowerCase().includes('invoice') ? 'functional' :
                action.toLowerCase().includes('api') || action.toLowerCase().includes('loading') ? 'technical' :
                action.toLowerCase().includes('setup') || action.toLowerCase().includes('configure') ? 'setup' :
                action.toLowerCase().includes('subscription') || action.toLowerCase().includes('plan') ? 'billing' :
                'general'
    })).slice(0, 8); // Return top 8 suggestions
  }, []);

  const getCategorySuggestions = useCallback((category: 'technical' | 'functional' | 'setup' | 'billing'): string[] => {
    const categoryMap = {
      technical: ['API Integration', 'Data Sync', 'Performance Issues', 'Error Messages'],
      functional: ['GST Invoicing', 'Inventory Management', 'Customer Management', 'Event Tracking'],
      setup: ['Initial Configuration', 'Data Import', 'User Setup', 'Template Configuration'],
      billing: ['Subscription Plans', 'Payment Issues', 'Invoice Generation', 'Plan Upgrades']
    };
    
    return categoryMap[category] || [];
  }, []);

  const getTutorialResources = useCallback((): Array<{ title: string; url: string; duration: string }> => {
    return AI_HELPER_CONTENT.resources.tutorials;
  }, []);

  const escalateSupport = useCallback((issueType: 'complex' | 'urgent' | 'technical'): string => {
    const triggers = AI_HELPER_CONTENT.escalation.triggers;
    const levels = AI_HELPER_CONTENT.escalation.levels;
    
    switch (issueType) {
      case 'complex':
        return `${triggers.complex}\n\n${levels.chat}: ${levels.email}`;
      case 'urgent':
        return `${triggers.urgent}\n\n${levels.phone}: ${AI_HELPER_CONTENT.emergencyContacts.phone}`;
      case 'technical':
        return `${triggers.technical}\n\n${levels.email}: ${AI_HELPER_CONTENT.emergencyContacts.technical}`;
      default:
        return triggers.complex;
    }
  }, []);

  const provideFeedback = useCallback((rating: string, message?: string) => {
    console.log(`Feedback received: ${rating}`, message ? `Message: ${message}` : '');
    // In a real implementation, you would send this to your backend
    // fetch(AI_HELPER_CONTENT.api.endpoints.feedback, {
    //   method: 'POST',
    //   body: JSON.stringify({ rating, message })
    // });
    
    // Show feedback confirmation in conversation
    setTimeout(() => {
      setConversation(prev => [...prev, {
        type: 'ai',
        text: AI_HELPER_CONTENT.learning.improvement,
        data: { title: 'Feedback Received' }
      }]);
    }, 500);
  }, []);

  const openDialog = () => {
    setIsOpen(true);
    // Add welcome message if conversation is empty
    if (conversation.length === 0) {
      setConversation([{
        type: 'ai',
        text: `${getTimeBasedGreeting()} ${AI_HELPER_CONTENT.dialog.welcomeMessage}`,
        data: {
          title: 'Welcome',
          steps: [],
          followUp: 'Try asking about a specific feature or click on a quick action below.'
        }
      }]);
    }
  };

  const closeDialog = () => setIsOpen(false);
  const clearConversation = () => setConversation([]);

  return {
    conversation,
    message,
    isOpen,
    sendMessage,
    sendQuickAction,
    setMessage,
    openDialog,
    closeDialog,
    clearConversation,
    getQuickActionsByRole: (role?: UserRole) => getQuickActionsByRole(role),
    getTimeBasedGreeting,
    getSystemStatus: (status?: SystemStatus) => getSystemStatus(status),
    getEmergencyContact,
    getQuickSuggestions,
    getCategorySuggestions,
    getTutorialResources,
    escalateSupport,
    provideFeedback,
  };
};

// Example usage patterns:
export const useExampleAIHelper = () => {
  const aiHelper = useAIHelper();

  // Get AI response for a specific query
  const handleDashboardIssue = () => {
    const response = getAIResponse("dashboard not loading");
    const formatted = formatAIResponse(response);
    console.log(formatted);
  };

  // Get quick actions for specific roles
  const adminActions = getQuickActionsByRole('admin');
  const ownerActions = getQuickActionsByRole('owner');
  const managerActions = getQuickActionsByRole('manager');
  const staffActions = getQuickActionsByRole('staff');

  // Get time-based greeting
  const greeting = getTimeBasedGreeting();

  // Get system status
  const normalStatus = getSystemStatus('normal');
  const maintenanceStatus = getSystemStatus('maintenance');

  // Get emergency contact
  const techContact = getEmergencyContact('technical');
  const billingContact = getEmergencyContact('billing');

  return {
    aiHelper,
    adminActions,
    ownerActions,
    managerActions,
    staffActions,
    greeting,
    normalStatus,
    maintenanceStatus,
    techContact,
    billingContact
  };
};