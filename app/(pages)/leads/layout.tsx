'use client';

import { CompanyProvider } from '@/lib/companyContext';
import { MainLayout } from '@/components/Layout/MainLayout';

export default function CompaniesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CompanyProvider>
      <MainLayout title="Companies">
        {children}
      </MainLayout>
    </CompanyProvider>
  );
}