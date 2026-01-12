import React from 'react';
import { SecurityIcon } from '../SecurityIcons';
import { SECURITY_CONTENT } from '../SecurityContent';

export const HeroSection = () => {
  const { hero } = SECURITY_CONTENT;

  return (
    <div className="relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-r ${hero.gradient}`} />
      <div className="container mx-auto px-4 py-12 md:py-20 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 mb-6">
            <SecurityIcon name="ShieldCheck" size="small" />
            <span className="text-sm font-medium ml-2">{hero.tagline}</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Data is <span className="text-blue-600">Protected</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {hero.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};