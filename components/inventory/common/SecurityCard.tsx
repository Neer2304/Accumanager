import React, { ReactNode } from 'react';

interface SecurityCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export const SecurityCard = ({ title, icon, children, className = '' }: SecurityCardProps) => {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200 ${className}`}>
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="font-bold text-lg text-gray-900 ml-2">{title}</h3>
      </div>
      <div className="text-gray-600">
        {children}
      </div>
    </div>
  );
};