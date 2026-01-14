// hooks/useLegalDisclaimer.ts
'use client'

import { useState, useEffect } from 'react';

export const useLegalDisclaimer = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    // Check if user has already accepted the disclaimer
    const hasAccepted = localStorage.getItem('legal_disclaimer_accepted');
    const acceptanceDate = localStorage.getItem('legal_disclaimer_accepted_date');
    
    // If no acceptance found, show disclaimer
    if (!hasAccepted) {
      setShowDisclaimer(true);
    } else if (acceptanceDate) {
      // Optional: Show disclaimer again after certain period (e.g., 30 days)
      const acceptedDate = new Date(acceptanceDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      if (acceptedDate < thirtyDaysAgo) {
        // Clear old acceptance and show disclaimer again
        localStorage.removeItem('legal_disclaimer_accepted');
        localStorage.removeItem('legal_disclaimer_accepted_date');
        setShowDisclaimer(true);
      }
    }
  }, []);

  const handleAcceptDisclaimer = () => {
    setShowDisclaimer(false);
  };

  return {
    showDisclaimer,
    handleAcceptDisclaimer,
  };
};