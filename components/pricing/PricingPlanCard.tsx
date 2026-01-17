// app/components/pricing/PricingPlanCard.tsx
import { Users, Package, Crown, Check } from "lucide-react";
import Link from "next/link";

interface PricingPlanCardProps {
  plan: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    period: string;
    popular: boolean;
    savingPercentage?: number;
    limits: {
      customers: number;
      products: number;
    };
    features: {
      included: Array<{ name: string }>;
    };
  };
  isAuthenticated: boolean;
  onSubscribe: (planId: string) => void;
}

export function PricingPlanCard({ plan, isAuthenticated, onSubscribe }: PricingPlanCardProps) {
  const isTrialPlan = plan.id === "trial";

  return (
    <div className={`relative rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
      plan.popular
        ? "shadow-xl ring-1 ring-blue-500 ring-offset-1"
        : "shadow-lg"
    } ${isTrialPlan ? "bg-white" : "bg-gradient-to-b from-white to-gray-50"}`}>
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center">
            <Crown className="w-3 h-3 mr-1" />
            Most Popular
          </span>
        </div>
      )}

      {/* Saving Badge */}
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <div className="flex items-baseline justify-center mb-2">
            <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
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
              {plan.limits.customers === 0 ? "Unlimited" : plan.limits.customers.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Customers</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <Package className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-xs font-semibold text-gray-900">
              {plan.limits.products === 0 ? "Unlimited" : plan.limits.products.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Products</div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onSubscribe(plan.id)}
          disabled={isAuthenticated && isTrialPlan}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-base transition-all duration-300 mb-6 ${
            plan.popular
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
              : isTrialPlan
              ? isAuthenticated
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-blue-100 hover:bg-blue-200 text-blue-700 shadow-sm hover:shadow"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow"
          }`}
        >
          {isTrialPlan && isAuthenticated
            ? "Already Using"
            : isTrialPlan
            ? "Start Free Trial"
            : "Get Started"}
        </button>

        {/* Features List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 text-base mb-3">Key Features:</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {plan.features.included.slice(0, 6).map((feature, index) => (
              <div key={index} className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature.name}</span>
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
  );
}