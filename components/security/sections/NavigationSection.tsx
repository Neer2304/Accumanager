import React from 'react';
import Link from 'next/link';
import { SecurityIcon } from '../SecurityIcons';
import { SECURITY_CONTENT } from '../SecurityContent';

export const NavigationSection = () => {
  const { navigation } = SECURITY_CONTENT;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <SecurityIcon name="Shield" size="large" className="text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              {navigation.logo.text}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {navigation.links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`${
                  link.active
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-600 hover:text-blue-600 transition-colors'
                } text-sm`}
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};