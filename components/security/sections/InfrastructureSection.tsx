import React from 'react';
import { SecurityIcon } from '../SecurityIcons';
import { SECURITY_CONTENT } from '../SecurityContent';

export const InfrastructureSection = () => {
  const { infrastructure } = SECURITY_CONTENT;

  return (
    <div className="mb-16">
      <div className="flex items-center mb-8">
        <SecurityIcon name={infrastructure.icon as any} size="large" className="text-blue-600 mr-3" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {infrastructure.title}
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {infrastructure.sections.map((section, index) => (
            <div key={index}>
              <h3 className="font-bold text-xl text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-3 text-gray-600">
                {section.features.map((feature, idx) => (
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
    </div>
  );
};