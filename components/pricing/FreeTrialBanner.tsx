// app/components/pricing/FreeTrialBanner.tsx
import { Rocket, Zap, Clock, HelpCircle } from "lucide-react";
import Link from "next/link";

interface FreeTrialBannerProps {
  isAuthenticated: boolean;
  onSubscribe: (planId: string) => void;
  plans: Array<{ id: string; popular: boolean }>;
}

export function FreeTrialBanner({ isAuthenticated, onSubscribe, plans }: FreeTrialBannerProps) {
  if (!isAuthenticated) {
    return (
      <div className="mt-16">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 relative">
            <div className="relative max-w-4xl mx-auto text-center text-white">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 mb-6">
                <Rocket className="w-4 h-4 mr-2" />
                <span className="font-medium text-sm">Limited Time Offer</span>
              </div>

              <h2 className="text-2xl md:text-4xl font-bold mb-4">Start Your 14-Day Free Trial</h2>
              <p className="text-base md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Get full access to all Premium features. No credit card required.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { icon: Zap, title: "Full Feature Access", desc: "All premium features unlocked" },
                  { icon: Clock, title: "14 Days Free", desc: "No charges during trial" },
                  { icon: HelpCircle, title: "Priority Support", desc: "Dedicated help during trial" },
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-base mb-1">{item.title}</h3>
                    <p className="text-xs opacity-80">{item.desc}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onSubscribe("trial")}
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
    );
  }

  const paidPlan = plans.find(p => p.id !== "trial" && p.popular);

  return (
    <div className="mt-16">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-12 relative">
          <div className="relative max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 mb-6">
              <Rocket className="w-4 h-4 mr-2" />
              <span className="font-medium text-sm">Upgrade Your Plan</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold mb-4">Unlock More Features</h2>
            <p className="text-base md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Your current plan gives you basic access. Upgrade to unlock advanced features.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-white text-blue-600 rounded-xl font-bold text-base hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
              >
                Go to Dashboard
              </Link>
              {paidPlan && (
                <button
                  onClick={() => onSubscribe(paidPlan.id)}
                  className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-xl font-bold text-base hover:bg-white/10 transition-colors shadow-lg hover:shadow-xl"
                >
                  Upgrade Now
                </button>
              )}
            </div>

            <p className="text-xs opacity-80 mt-4">Need help choosing? Contact our sales team</p>
          </div>
        </div>
      </div>
    </div>
  );
}