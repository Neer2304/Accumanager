"use client";
import { useState, useEffect } from "react";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { PaymentVerification } from "@/components/payment/PaymentVerification";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import {
  Check,
  X,
  HelpCircle,
  Database,
  TrendingUp,
  FileText,
  Bell,
  Smartphone,
  Cloud,
  Server,
  Mail,
  MessageSquare,
  Video,
  Download,
  Upload,
  Search,
  Target,
  AlertTriangle,
  RefreshCw,
  Lock,
  Globe,
  BarChart,
  Calendar,
  CreditCard,
  Settings,
  UserCheck,
  FileBarChart,
  Workflow,
  Rocket,
  Award,
  BadgeCheck,
  Sparkles,
  Crown,
  Star,
  Users,
  Package,
  Receipt,
  Shield,
  Zap,
  Clock,
  BarChart3,
  Cpu,
  SmartphoneCharging,
  CheckCircle,
  XCircle,
} from "lucide-react";

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
      icon: string;
      description: string;
      category: string;
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
  highlights: string[];
  savingPercentage?: number;
}

export default function PricingPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
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

      if (!response.ok) {
        throw new Error("Failed to fetch pricing plans");
      }

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
      // Redirect to login page if not authenticated
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

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      Package: Package,
      BarChart3: BarChart3,
      Users: Users,
      Receipt: Receipt,
      Shield: Shield,
      Zap: Zap,
      Database: Database,
      TrendingUp: TrendingUp,
      FileText: FileText,
      Bell: Bell,
      Smartphone: Smartphone,
      Cloud: Cloud,
      Server: Server,
      Mail: Mail,
      MessageSquare: MessageSquare,
      Video: Video,
      Download: Download,
      Upload: Upload,
      Search: Search,
      Target: Target,
      RefreshCw: RefreshCw,
      Lock: Lock,
      Globe: Globe,
      Cpu: Cpu,
      BarChart: BarChart,
      Calendar: Calendar,
      CreditCard: CreditCard,
      Settings: Settings,
      UserCheck: UserCheck,
      FileBarChart: FileBarChart,
      SmartphoneCharging: SmartphoneCharging,
      Workflow: Workflow,
      Rocket: Rocket,
      Award: Award,
      BadgeCheck: BadgeCheck,
      Sparkles: Sparkles,
      Crown: Crown,
      Star: Star,
    };

    return iconMap[iconName] || Package;
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Plans
          </h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchPricingPlans}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Rocket className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                AccumaManage
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
              >
                Pricing
              </Link>
              <Link
                href="#faq"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
              >
                FAQ
              </Link>
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {user?.name}
                  </span>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Dashboard
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 py-12 md:py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                No Credit Card Required for Trial
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Pricing That <span className="text-blue-600">Grows</span> With
              Your Business
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Start free, scale smart. Choose the perfect plan for your business
              needs with transparent pricing and no hidden fees.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <div className="flex items-center text-sm">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-700">14-day free trial</span>
              </div>
              <div className="flex items-center text-sm">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-700">No setup fees</span>
              </div>
              <div className="flex items-center text-sm">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-700">Cancel anytime</span>
              </div>
              <div className="flex items-center text-sm">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-700">24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div id="pricing" className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your business. All plans include our core
            features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                plan.popular
                  ? "shadow-xl ring-1 ring-blue-500 ring-offset-1"
                  : "shadow-lg"
              } ${
                plan.id === "trial"
                  ? "bg-white"
                  : "bg-gradient-to-b from-white to-gray-50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center">
                    <Crown className="w-3 h-3 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              {plan.savingPercentage && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                    Save {plan.savingPercentage}%
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      ₹{plan.price}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-base text-gray-500 line-through ml-2">
                        ₹{plan.originalPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{plan.period}</p>
                </div>

                {/* Limits Summary */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-xs font-semibold text-gray-900">
                      {plan.limits.customers === 0
                        ? "Unlimited"
                        : plan.limits.customers.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Customers</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-xs font-semibold text-gray-900">
                      {plan.limits.products === 0
                        ? "Unlimited"
                        : plan.limits.products.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Products</div>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isAuthenticated && plan.id === "trial"}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-base transition-all duration-300 mb-6 ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
                      : plan.id === "trial"
                      ? isAuthenticated
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "bg-blue-100 hover:bg-blue-200 text-blue-700 shadow-sm hover:shadow"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow"
                  }`}
                >
                  {plan.id === "trial" && isAuthenticated
                    ? "Already Using"
                    : plan.id === "trial"
                    ? "Start Free Trial"
                    : "Get Started"}
                </button>

                {/* Features List */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 text-base mb-3">
                    Key Features:
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {plan.features.included
                      .slice(0, 6)
                      .map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    {plan.features.included.length > 6 && (
                      <div className="text-sm text-blue-600 font-medium pt-1">
                        + {plan.features.included.length - 6} more features
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Free Trial Banner - HIDDEN FOR AUTHENTICATED USERS */}
        {!isAuthenticated && (
          <div className="mt-16">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8 md:p-12 relative">
                <div className="relative max-w-4xl mx-auto text-center text-white">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 mb-6">
                    <Rocket className="w-4 h-4 mr-2" />
                    <span className="font-medium text-sm">
                      Limited Time Offer
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-4xl font-bold mb-4">
                    Start Your 14-Day Free Trial
                  </h2>

                  <p className="text-base md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                    Get full access to all Premium features. No credit card
                    required. Experience how AccumaManage can transform your
                    business.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Zap className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-base mb-1">
                        Full Feature Access
                      </h3>
                      <p className="text-xs opacity-80">
                        All premium features unlocked
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-base mb-1">14 Days Free</h3>
                      <p className="text-xs opacity-80">
                        No charges during trial
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <HelpCircle className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-base mb-1">
                        Priority Support
                      </h3>
                      <p className="text-xs opacity-80">
                        Dedicated help during trial
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSubscribe("trial")}
                    className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold text-base hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Sign Up for Free Trial
                  </button>

                  <p className="text-xs opacity-80 mt-4">
                    No credit card required • Cancel anytime • Instant setup
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alternative Content for Authenticated Users */}
        {isAuthenticated && (
          <div className="mt-16">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8 md:p-12 relative">
                <div className="relative max-w-4xl mx-auto text-center text-white">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 mb-6">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="font-medium text-sm">
                      Upgrade Your Plan
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-4xl font-bold mb-4">
                    Unlock More Features
                  </h2>

                  <p className="text-base md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                    Your current plan gives you basic access. Upgrade to unlock
                    advanced features, higher limits, and priority support.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-base mb-1">
                        Advanced Analytics
                      </h3>
                      <p className="text-xs opacity-80">
                        Deep insights for growth
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-base mb-1">
                        More Users
                      </h3>
                      <p className="text-xs opacity-80">
                        Add team members
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Shield className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-base mb-1">
                        Enhanced Security
                      </h3>
                      <p className="text-xs opacity-80">
                        Advanced protection
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/dashboard"
                      className="px-8 py-3 bg-white text-blue-600 rounded-xl font-bold text-base hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
                    >
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        const paidPlan = plans.find(p => p.id !== "trial" && p.popular);
                        if (paidPlan) handleSubscribe(paidPlan.id);
                      }}
                      className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-xl font-bold text-base hover:bg-white/10 transition-colors shadow-lg hover:shadow-xl"
                    >
                      Upgrade Now
                    </button>
                  </div>

                  <p className="text-xs opacity-80 mt-4">
                    Need help choosing? Contact our sales team
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div id="faq" className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Get answers to common questions about our pricing and plans
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid gap-4">
            {[
              {
                question: "How does the UPI payment verification work?",
                answer:
                  "After initiating payment, you'll receive a UPI QR code. Once payment is successful, our system automatically verifies the transaction through webhook notifications from the payment gateway and updates your account status in real-time.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major UPI apps (Google Pay, PhonePe, Paytm), net banking, credit/debit cards, and other digital payment methods through secure payment gateways.",
              },
              {
                question: "Can I change plans later?",
                answer:
                  "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately with pro-rated billing for the remaining period.",
              },
              {
                question: "Is there a setup fee?",
                answer:
                  "No, there are no hidden setup fees. You only pay for the plan you choose, starting after your free trial period ends.",
              },
              {
                question: "Do you offer discounts for annual plans?",
                answer:
                  "Yes! Our annual plans offer significant savings compared to monthly billing. Check the pricing table for current discount percentages.",
              },
              {
                question: "What happens if I exceed my plan limits?",
                answer:
                  "You'll receive notifications when approaching your limits. You can either upgrade your plan or purchase additional capacity as needed.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 shadow-md border border-gray-200"
              >
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <HelpCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 text-sm pl-6">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Rocket className="w-6 h-6" />
                <span className="text-lg font-bold">AccumaManage</span>
              </div>
              <p className="text-gray-400 text-sm">
                Streamline your business operations with our all-in-one
                management platform.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-base">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    API
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-base">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-base">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Community
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Status
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>
              © {new Date().getFullYear()} AccumaManage. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          plan={selectedPlan}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      {/* Payment Verification Modal */}
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