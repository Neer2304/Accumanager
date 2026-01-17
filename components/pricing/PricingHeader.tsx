// app/components/pricing/PricingHeader.tsx
import { Sparkles, Check } from "lucide-react";

export function PricingHeader() {
  return (
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
            Pricing That <span className="text-blue-600">Grows</span> With Your Business
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Start free, scale smart. Choose the perfect plan for your business needs with transparent pricing and no hidden fees.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              "14-day free trial",
              "No setup fees",
              "Cancel anytime",
              "24/7 support"
            ].map((feature) => (
              <div key={feature} className="flex items-center text-sm">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}