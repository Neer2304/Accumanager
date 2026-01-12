import React from 'react';
import { SecurityIcon } from '../SecurityIcons';
import { SECURITY_CONTENT } from '../SecurityContent';

export const FAQSection = () => {
  const { faq } = SECURITY_CONTENT;

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
        {faq.title}
      </h2>
      
      <div className="max-w-4xl mx-auto grid gap-4">
        {faq.items.map((item, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              <SecurityIcon name="Shield" size="small" className="text-blue-600 mr-2 flex-shrink-0" />
              {item.question}
            </h3>
            <p className="text-gray-600 text-sm pl-6">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};