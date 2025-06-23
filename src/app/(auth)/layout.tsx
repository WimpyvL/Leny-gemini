import { Logo } from '@/components/Logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
       <div className="absolute top-6 left-6">
        <Logo />
      </div>
      {children}
    </div>
  );
}
