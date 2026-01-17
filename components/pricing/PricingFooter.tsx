// app/components/pricing/PricingFooter.tsx
import { Rocket } from "lucide-react";
import Link from "next/link";

export function PricingFooter() {
  const links = {
    product: ["Features", "Pricing", "API", "Documentation"],
    company: ["About", "Blog", "Careers", "Contact"],
    support: ["Help Center", "Community", "Status", "Security"],
  };

  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Rocket className="w-6 h-6" />
              <span className="text-lg font-bold">AccumaManage</span>
            </div>
            <p className="text-gray-400 text-sm">
              Streamline your business operations with our all-in-one management platform.
            </p>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-bold mb-4 text-base capitalize">{category}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} AccumaManage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}