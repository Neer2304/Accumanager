'use client';
import React from 'react';
import { NavigationSection } from './sections/NavigationSection';
import { HeroSection } from './sections/HeroSection';
import { ApiSecuritySection } from './sections/ApiSecuritySection';
import { DataSecuritySection } from './sections/DataSecuritySection';
import { UserAccessSection } from './sections/UserAccessSection';
import { InfrastructureSection } from './sections/InfrastructureSection';
import { PaymentSecuritySection } from './sections/PaymentSecuritySection';
import { IncidentResponseSection } from './sections/IncidentResponseSection';
import { ContactSection } from './sections/ContactSection';
import { FAQSection } from './sections/FAQSection';
import { FooterSection } from './sections/FooterSection';

const SecurityPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavigationSection />
      <HeroSection />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <ApiSecuritySection />
          <DataSecuritySection />
          <UserAccessSection />
          <InfrastructureSection />
          <PaymentSecuritySection />
          <IncidentResponseSection />
          <ContactSection />
          <FAQSection />
        </div>
      </div>
      
      <FooterSection />
    </div>
  );
};

export default SecurityPage;