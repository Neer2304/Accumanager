// app/(admin)/admin/layout.tsx
"use client";

import AdminLayout from "@/components/googleadminlayout/AdminLayout";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}