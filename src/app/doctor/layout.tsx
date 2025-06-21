'use client';
import React, { useEffect } from 'react';

export default function DoctorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);
  
  return <>{children}</>;
}
