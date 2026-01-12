import React from 'react';
import { SecurityIcon } from '../SecurityIcons';
import { SECURITY_CONTENT } from '../SecurityContent';

export const PaymentSecuritySection = () => {
  const { paymentSecurity } = SECURITY_CONTENT;

  return (
    <div className="mb-16">
      <div className="flex items-center mb-8">
        <SecurityIcon name={paymentSecurity.icon as any} size="large" className="text-blue-600 mr-3" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {paymentSecurity.title}
        </h2>
      </div>

      <div className={`bg-gradient-to-r ${paymentSecurity.gradient} rounded-2xl p-6 md:p-8`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paymentSecurity.cards.map((card, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SecurityIcon name={card.icon as any} size="medium" className="text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};