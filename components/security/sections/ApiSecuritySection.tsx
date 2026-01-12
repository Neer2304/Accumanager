import React from 'react';
import { SecurityIcon } from '../SecurityIcons';
import { SECURITY_CONTENT } from '../SecurityContent';

export const ApiSecuritySection = () => {
  const { apiSecurity } = SECURITY_CONTENT;

  return (
    <div className="mb-16">
      <div className="flex items-center mb-8">
        <SecurityIcon name={apiSecurity.icon as any} size="large" className="text-blue-600 mr-3" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {apiSecurity.title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {apiSecurity.cards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <SecurityIcon name={card.icon as any} size="medium" className="text-blue-600 mr-2" />
              <h3 className="font-bold text-lg text-gray-900">{card.title}</h3>
            </div>
            <ul className="space-y-3 text-gray-600">
              {card.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <SecurityIcon name="CheckCircle" size="small" className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};