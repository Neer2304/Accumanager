'use client';

import { useState } from 'react';
import { useCompany } from '@/lib/companyContext';
import { Building2, ChevronDown, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { companyService } from '@/services/companyService';

export default function CompanySwitcher() {
  const { companies, currentCompany, setCurrentCompany } = useCompany();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSwitchCompany = async (company: any) => {
    try {
      const res = await companyService.switchCompany(company._id);
      if (res.success) {
        setCurrentCompany(res.company);
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to switch company:', error);
    }
  };

  if (!currentCompany) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
          <Building2 className="w-3 h-3 text-white" />
        </div>
        <span className="font-medium text-sm">{currentCompany.name}</span>
        <ChevronDown className="w-4 h-4 text-gray-600" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-20">
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">
                Switch Company
              </p>
              
              {companies.map((company) => (
                <button
                  key={company._id}
                  onClick={() => handleSwitchCompany(company)}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                      <Building2 className="w-3 h-3 text-gray-600" />
                    </div>
                    <span className="ml-2 text-sm font-medium">{company.name}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      {company.userRole}
                    </span>
                  </div>
                  {currentCompany._id === company._id && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}

              <div className="border-t mt-2 pt-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/dashboard/companies/create');
                  }}
                  className="w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg text-left"
                >
                  + Create New Company
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/dashboard/companies');
                  }}
                  className="w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg text-left"
                >
                  Manage Companies
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}