// app/components/pricing/FAQSection.tsx
import { HelpCircle } from "lucide-react";

export function FAQSection() {
  const faqs = [
    {
      question: "How does the UPI payment verification work?",
      answer: "After initiating payment, you'll receive a UPI QR code. Once payment is successful, our system automatically verifies the transaction through webhook notifications.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major UPI apps (Google Pay, PhonePe, Paytm), net banking, credit/debit cards, and other digital payment methods.",
    },
    {
      question: "Can I change plans later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately with pro-rated billing.",
    },
    {
      question: "Is there a setup fee?",
      answer: "No, there are no hidden setup fees. You only pay for the plan you choose, starting after your free trial period ends.",
    },
    {
      question: "Do you offer discounts for annual plans?",
      answer: "Yes! Our annual plans offer significant savings compared to monthly billing.",
    },
    {
      question: "What happens if I exceed my plan limits?",
      answer: "You'll receive notifications when approaching your limits. You can either upgrade your plan or purchase additional capacity.",
    },
  ];

  return (
    <div className="mt-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-lg md:text-xl text-gray-600">
          Get answers to common questions about our pricing and plans
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid gap-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              <HelpCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
              {faq.question}
            </h3>
            <p className="text-gray-600 text-sm pl-6">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}