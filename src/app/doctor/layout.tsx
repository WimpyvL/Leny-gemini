import React from 'react';

export default function DoctorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
