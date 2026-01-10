// components/payment/PaymentModal.tsx - FIXED VERSION
'use client'
import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete?: (data: any) => void; // Add this prop
  plan: 'monthly' | 'quarterly' | 'yearly' | string; // Allow string for other plans
}

export function PaymentModal({ isOpen, onClose, plan, onPaymentComplete }: PaymentModalProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'success' | 'error'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [transactionId, setTransactionId] = useState('');
  const [isClient, setIsClient] = useState(false);

  // This ensures we don't render anything during SSR that might cause hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const planPrices: Record<string, number> = {
    monthly: 299,
    quarterly: 799,
    yearly: 2499,
    trial: 0,
    basic: 299,
    standard: 799,
    premium: 2499,
    enterprise: 4999
  };

  const planNames: Record<string, string> = {
    monthly: 'Monthly',
    quarterly: 'Quarterly (4 Months)',
    yearly: 'Yearly',
    trial: 'Free Trial',
    basic: 'Basic',
    standard: 'Standard',
    premium: 'Premium',
    enterprise: 'Enterprise'
  };

  const handleCreatePayment = async () => {
    try {
      setIsProcessing(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan })
      });

      const data = await response.json();
      
      if (data.success) {
        setPaymentData(data.data);
        setStep('payment');
        
        // Open UPI app if upiUrl exists
        if (data.data.upiUrl) {
          window.location.href = data.data.upiUrl;
        }
      } else {
        setStep('error');
      }
    } catch (error) {
      console.error('Payment creation error:', error);
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyPayment = async () => {
    try {
      setIsProcessing(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentId: paymentData?.paymentId,
          upiTransactionId: transactionId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setStep('success');
        // Call onPaymentComplete callback with transaction data
        if (onPaymentComplete) {
          onPaymentComplete({
            id: paymentData?.paymentId || `txn_${Date.now()}`,
            amount: planPrices[plan] || 0,
            plan: planNames[plan] || plan,
            upiId: paymentData?.upiId || '',
            timestamp: new Date().toISOString()
          });
        }
      } else {
        setStep('error');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setStep('details');
    setPaymentData(null);
    setTransactionId('');
    setIsProcessing(false);
    onClose();
  };

  // Don't render modal during SSR
  if (!isClient) {
    return null;
  }

  return (
    <Transition show={isOpen}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* Background overlay */}
        <Transition.Child
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        {/* Modal panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                
                {step === 'details' && (
                  <div>
                    <Dialog.Title className="text-lg font-bold mb-4">
                      Confirm Subscription
                    </Dialog.Title>
                    <div className="mb-4">
                      <p className="text-gray-600">Plan: <strong>{planNames[plan] || plan}</strong></p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{plan === 'trial' ? '0' : planPrices[plan] || '0'}
                      </p>
                      {plan === 'trial' && (
                        <p className="text-sm text-gray-500 mt-1">14-day free trial</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleClose}
                        className="flex-1 text-black px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreatePayment}
                        disabled={isProcessing}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {plan === 'trial' 
                          ? (isProcessing ? 'Starting...' : 'Start Free Trial')
                          : (isProcessing ? 'Processing...' : 'Pay via UPI')
                        }
                      </button>
                    </div>
                  </div>
                )}

                {step === 'payment' && (
                  <div>
                    <Dialog.Title className="text-lg font-bold mb-4">
                      Complete Payment
                    </Dialog.Title>
                    <div className="mb-4">
                      <p className="text-gray-600 mb-2">
                        UPI app should open automatically. If not, please open your UPI app and pay to:
                      </p>
                      <div className="bg-gray-100 p-3 rounded text-sm font-mono break-all">
                        {paymentData?.upiUrl ? paymentData.upiUrl.replace('upi://pay?', '') : 'Loading...'}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        UPI Transaction ID (from your bank app):
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="Enter UPI transaction ID"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setStep('details')}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleVerifyPayment}
                        disabled={!transactionId || isProcessing}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isProcessing ? 'Verifying...' : 'Verify Payment'}
                      </button>
                    </div>
                  </div>
                )}

                {step === 'success' && (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-green-500 text-2xl">✓</div>
                    </div>
                    <Dialog.Title className="text-lg font-bold mb-2 text-gray-900">
                      {plan === 'trial' ? 'Trial Started!' : 'Payment Successful!'}
                    </Dialog.Title>
                    <p className="text-gray-600 mb-6">
                      {plan === 'trial' 
                        ? 'Your free trial has been activated. You can now access all features for 14 days.'
                        : 'Your subscription has been activated. You can now access all features.'
                      }
                    </p>
                    <button
                      onClick={handleClose}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Continue to Dashboard
                    </button>
                  </div>
                )}

                {step === 'error' && (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-red-500 text-2xl">✗</div>
                    </div>
                    <Dialog.Title className="text-lg font-bold mb-2 text-gray-900">
                      {plan === 'trial' ? 'Trial Failed' : 'Payment Failed'}
                    </Dialog.Title>
                    <p className="text-gray-600 mb-6">
                      There was an issue processing your request. Please try again.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setStep('details')}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}