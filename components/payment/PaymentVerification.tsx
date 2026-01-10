// components/payment/PaymentVerification.tsx
'use client'
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';

interface PaymentVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    amount: number;
    plan: string;
    upiId: string;
    timestamp: string;
  };
}

export function PaymentVerification({ isOpen, onClose, transaction }: PaymentVerificationProps) {
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const verifyPayment = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch(`/api/webhooks/upi?transaction_id=${transaction.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.success && data.data.verified) {
        setVerificationStatus('success');
      } else {
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          setTimeout(verifyPayment, 5000); // Retry after 5 seconds
        } else {
          setVerificationStatus('failed');
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
        setTimeout(verifyPayment, 5000);
      } else {
        setVerificationStatus('failed');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      verifyPayment();
      // Set up polling interval
      const interval = setInterval(verifyPayment, 10000); // Check every 10 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Verification
          </h3>
          <p className="text-gray-600">
            We're verifying your payment transaction
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
              {transaction.id.slice(0, 8)}...
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount:</span>
            <span className="font-bold text-gray-900">₹{transaction.amount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Plan:</span>
            <span className="font-medium text-gray-900">{transaction.plan}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">UPI ID:</span>
            <span className="font-mono text-sm">{transaction.upiId}</span>
          </div>
        </div>

        <div className="mb-8">
          {verificationStatus === 'pending' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 mb-2">Verifying payment...</p>
              <p className="text-sm text-gray-500">
                This usually takes 30-60 seconds
                {retryCount > 0 && ` (Retry ${retryCount}/3)`}
              </p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Payment Verified!
              </h4>
              <p className="text-gray-600 mb-4">
                Your payment has been successfully verified and your account has been upgraded.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Continue to Dashboard
              </button>
            </div>
          )}

          {verificationStatus === 'failed' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Verification Failed
              </h4>
              <p className="text-gray-600 mb-4">
                We couldn't verify your payment. Please contact support with your transaction ID.
              </p>
              <div className="space-y-3">
                <button
                  onClick={verifyPayment}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Having trouble? Contact our support team at support@accumamanage.com
          </p>
        </div>
      </div>
    </div>
  );
}