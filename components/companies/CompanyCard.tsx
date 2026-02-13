'use client';

import { useRouter } from 'next/navigation';
import { Building2, Users, Trash2, Edit, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface CompanyCardProps {
  company: any;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function CompanyCard({ company, onDelete, isDeleting }: CompanyCardProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  
  const isAdmin = company.userRole === 'admin';
  const memberCount = company.memberCount || 1;
  const maxMembers = company.maxMembers || 10;
  const memberPercentage = (memberCount / maxMembers) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-8 h-8 rounded" />
              ) : (
                <Building2 className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-lg text-gray-900">{company.name}</h3>
              <p className="text-sm text-gray-500">{company.industry || 'General Business'}</p>
            </div>
          </div>
          
          <div className="relative">
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
              company.userRole === 'admin' 
                ? 'bg-purple-100 text-purple-700' 
                : company.userRole === 'manager'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {company.userRole}
            </span>
            
            {isAdmin && (
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="ml-2 p-1 hover:bg-gray-100 rounded"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
            )}
            
            {showMenu && isAdmin && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-10">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    router.push(`/dashboard/companies/${company._id}/edit`);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Company
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(company._id);
                  }}
                  disabled={isDeleting}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete Company'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Company Email */}
        <div className="mt-3">
          <p className="text-sm text-gray-600 truncate">{company.email}</p>
          {company.phone && (
            <p className="text-sm text-gray-500 mt-1">{company.phone}</p>
          )}
        </div>

        {/* Member Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Team Members
            </span>
            <span className="font-medium">
              {memberCount}/{maxMembers}
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                memberPercentage >= 90 ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(memberPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push(`/dashboard/companies/${company._id}`)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
          >
            Dashboard
          </button>
          
          <button
            onClick={() => router.push(`/dashboard/companies/${company._id}/members`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            Manage Team
          </button>
        </div>

        {/* Plan Badge */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
            {company.plan?.toUpperCase() || 'FREE'} PLAN
          </span>
          <span className="ml-2 text-xs text-gray-500">
            Created {new Date(company.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}