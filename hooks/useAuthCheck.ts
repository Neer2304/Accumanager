import { useState, useEffect } from 'react';
import { sha256 } from 'js-sha256';

const ALLOWED_CREDENTIALS = {
  email: 'neermehta123432@gmail.com',
  passwordHash: '9fc3d7152ba9336a670e36d0ed79bc43aa7e9c9f9f8a4b8a0f3c7b1c4f2a6e8c'
};

export const useAuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedEmail = localStorage.getItem('meeting_auth_email');
        const storedHash = localStorage.getItem('meeting_auth_hash');
        
        if (storedEmail === ALLOWED_CREDENTIALS.email && 
            storedHash === ALLOWED_CREDENTIALS.passwordHash) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (email: string, password: string) => {
    // Use sha256 directly as a function
    const passwordHash = sha256(password);
    
    if (email === ALLOWED_CREDENTIALS.email && 
        passwordHash === ALLOWED_CREDENTIALS.passwordHash) {
      localStorage.setItem('meeting_auth_email', email);
      localStorage.setItem('meeting_auth_hash', passwordHash);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('meeting_auth_email');
    localStorage.removeItem('meeting_auth_hash');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, login, logout };
};