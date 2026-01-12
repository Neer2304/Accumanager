import React from 'react';
import { SecurityIcon } from '../SecurityIcons';
import { SECURITY_CONTENT } from '../SecurityContent';

export const IncidentResponseSection = () => {
  const { incidentResponse } = SECURITY_CONTENT;

  return (
    <div className="mb-16">
      <div className="flex items-center mb-8">
        <SecurityIcon name={incidentResponse.icon as any} size="large" className="text-blue-600 mr-3" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {incidentResponse.title}
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="space-y-4">
          {incidentResponse.items.map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-4 flex-shrink-0">
                <SecurityIcon name={item.icon as any} size="medium" className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};