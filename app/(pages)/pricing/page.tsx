// app/pricing/page.tsx
"use client";
import { useState, useEffect } from "react";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { PaymentVerification } from "@/components/payment/PaymentVerification";
import { useAuth } from "@/hooks/useAuth";
import { 
  Navigation, 
  PricingHeader, 
  PricingPlanCard, 
  FreeTrialBanner, 
  FAQSection, 
  PricingFooter 
} from "@/components/pricing";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  originalPrice?: number;
  description: string;
  popular: boolean;
  features: {
    included: Array<{
      name: string;
    }>;
    excluded: string[];
  };
  limits: {
    customers: number;
    products: number;
    invoices: number;
    storageMB: number;
    users: number;
    supportHours: number;
  };
  savingPercentage?: number;
}

export default function PricingPage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTransaction, setCurrentTransaction] = useState<any>(null);

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const fetchPricingPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/pricing/plans");

      if (!response.ok) throw new Error("Failed to fetch pricing plans");

      const data = await response.json();
      if (data.success && data.data) {
        setPlans(data.data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load pricing plans");
      console.error("Error fetching plans:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (planId: string) => {
    if (!isAuthenticated) {
      window.location.href = "/login?redirect=/pricing";
      return;
    }

    const plan = plans.find((p) => p.id === planId);
    if (!plan) {
      setError("Plan not found");
      return;
    }

    setSelectedPlan(planId);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = (transactionData: any) => {
    setCurrentTransaction(transactionData);
    setIsPaymentModalOpen(false);
    setIsVerificationOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Plans</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchPricingPlans}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <Navigation isAuthenticated={isAuthenticated} userName={user?.name} />
      <PricingHeader />
      
      {/* Pricing Section */}
      <div id="pricing" className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your business. All plans include our core features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <PricingPlanCard
              key={plan.id}
              plan={plan}
              isAuthenticated={isAuthenticated}
              onSubscribe={handleSubscribe}
            />
          ))}
        </div>

        <FreeTrialBanner
          isAuthenticated={isAuthenticated}
          onSubscribe={handleSubscribe}
          plans={plans}
        />

        <FAQSection />
      </div>

      <PricingFooter />

      {/* Modals */}
      {selectedPlan && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          plan={selectedPlan}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      {currentTransaction && (
        <PaymentVerification
          isOpen={isVerificationOpen}
          onClose={() => setIsVerificationOpen(false)}
          transaction={currentTransaction}
        />
      )}
    </div>
  );
}