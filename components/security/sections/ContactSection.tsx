import React from 'react';
import { SecurityIcon } from '../SecurityIcons';
import { SECURITY_CONTENT } from '../SecurityContent';

export const ContactSection = () => {
  const { contact } = SECURITY_CONTENT;

  return (
    <div className="mb-16">
      <div className={`bg-gradient-to-r ${contact.gradient} rounded-2xl shadow-xl overflow-hidden`}>
        <div className="p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {contact.title}
            </h2>
            <p className="text-lg opacity-90 mb-8">
              {contact.subtitle}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {contact.contactPoints.map((point, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <SecurityIcon name={point.icon as any} size="medium" />
                  </div>
                  <h3 className="font-bold text-base mb-1">{point.title}</h3>
                  <p className="text-xs opacity-80">{point.details}</p>
                </div>
              ))}
            </div>

            <div className="text-sm opacity-80">
              <p>{contact.disclosure}</p>
              <p className="mt-1">Response time: {contact.responseTime}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};