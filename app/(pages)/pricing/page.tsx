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
import { Box, Skeleton, Card, CardContent, Container } from "@mui/material";

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

// Skeleton Components
const PricingSkeleton = () => (
  <Box className="min-h-screen">
    {/* Navigation Skeleton */}
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Skeleton variant="text" width={120} height={40} />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
      </Box>
    </Box>

    {/* Header Skeleton */}
    <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
      <Skeleton variant="text" width="60%" height={60} sx={{ mx: 'auto', mb: 2 }} />
      <Skeleton variant="text" width="80%" height={30} sx={{ mx: 'auto', mb: 4 }} />
      <Skeleton variant="rectangular" width={200} height={50} sx={{ mx: 'auto', borderRadius: 2 }} />
    </Box>

    {/* Pricing Plans Skeleton */}
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Skeleton variant="text" width="50%" height={50} sx={{ mx: 'auto', mb: 2 }} />
        <Skeleton variant="text" width="70%" height={30} sx={{ mx: 'auto' }} />
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3,
        justifyContent: 'center'
      }}>
        {[1, 2, 3, 4].map((item) => (
          <Box key={item} sx={{ 
            width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 12px)' },
            minWidth: { xs: '100%', sm: '300px', md: '250px' }
          }}>
            <Card sx={{ height: '100%', position: 'relative' }}>
              <CardContent sx={{ p: 3 }}>
                {/* Popular Badge Skeleton */}
                <Skeleton 
                  variant="rectangular" 
                  width={100} 
                  height={24} 
                  sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    right: 16, 
                    borderRadius: 12 
                  }} 
                />
                
                <Box sx={{ mb: 3 }}>
                  <Skeleton variant="text" width="60%" height={30} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="80%" height={40} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="50%" height={20} />
                </Box>

                <Box sx={{ mb: 3 }}>
                  {[1, 2, 3, 4].map((feature) => (
                    <Box key={feature} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} />
                      <Skeleton variant="text" width="80%" height={20} />
                    </Box>
                  ))}
                </Box>

                <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 2 }} />
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Free Trial Banner Skeleton */}
      <Card sx={{ mt: 6, p: 4, textAlign: 'center' }}>
        <Skeleton variant="text" width="60%" height={40} sx={{ mx: 'auto', mb: 2 }} />
        <Skeleton variant="text" width="80%" height={30} sx={{ mx: 'auto', mb: 3 }} />
        <Skeleton variant="rectangular" width={200} height={48} sx={{ mx: 'auto', borderRadius: 2 }} />
      </Card>

      {/* FAQ Section Skeleton */}
      <Box sx={{ mt: 8 }}>
        <Skeleton variant="text" width="40%" height={50} sx={{ mb: 4 }} />
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3 
        }}>
          {[1, 2, 3, 4].map((item) => (
            <Box key={item} sx={{ 
              width: { xs: '100%', md: 'calc(50% - 12px)' }
            }}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="80%" height={30} sx={{ mb: 2 }} />
                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="90%" height={20} />
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  </Box>
);

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
    return <PricingSkeleton />;
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

        <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className="w-full sm:w-[calc(50%-12px)] md:w-[calc(25%-12px)] min-w-[250px]"
            >
              <PricingPlanCard
                plan={plan}
                isAuthenticated={isAuthenticated}
                onSubscribe={handleSubscribe}
              />
            </div>
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