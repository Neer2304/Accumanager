import React from 'react';
import Link from 'next/link';
import { SecurityIcon } from '../SecurityIcons';
import { SECURITY_CONTENT } from '../SecurityContent';

export const FooterSection = () => {
  const { footer } = SECURITY_CONTENT;

  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <SecurityIcon name="Shield" size="medium" />
              <span className="text-lg font-bold">{footer.company.name}</span>
            </div>
            <p className="text-gray-400 text-sm">
              {footer.company.description}
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-base">Product</h4>
            <ul className="space-y-2">
              {footer.productLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-base">Legal</h4>
            <ul className="space-y-2">
              {footer.legalLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-base">Contact</h4>
            <ul className="space-y-2">
              {footer.contactInfo.map((info, index) => (
                <li key={index} className="text-gray-400 text-sm">{info}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>{footer.copyright}</p>
          <p className="mt-1">{footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
};