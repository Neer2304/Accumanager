import React from 'react';
import { SecurityIcon } from '../SecurityIcons';
import { SECURITY_CONTENT } from '../SecurityContent';

export const DataSecuritySection = () => {
  const { dataSecurity } = SECURITY_CONTENT;

  return (
    <div className="mb-16">
      <div className="flex items-center mb-8">
        <SecurityIcon name={dataSecurity.icon as any} size="large" className="text-blue-600 mr-3" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {dataSecurity.title}
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-4">{dataSecurity.encryption.title}</h3>
              <ul className="space-y-4">
                {dataSecurity.encryption.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <SecurityIcon name={item.icon as any} size="medium" className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-4">{dataSecurity.storage.title}</h3>
              <ul className="space-y-4">
                {dataSecurity.storage.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <SecurityIcon name={item.icon as any} size="medium" className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};