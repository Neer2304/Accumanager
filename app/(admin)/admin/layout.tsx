// app/(admin)/batman-admin/layout.tsx (Batman Theme)
"use client";

import BatmanAdminLayout from "@/components/batmanadminlayout/BatmanAdminLayout";

export default function BatmanAdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BatmanAdminLayout>{children}</BatmanAdminLayout>;
}