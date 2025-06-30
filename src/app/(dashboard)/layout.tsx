'use client';
import React from 'react';

// With auth disabled, the layout doesn't need to do much.
// It simply provides the structure for the dashboard pages.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
