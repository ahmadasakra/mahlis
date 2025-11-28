import { Suspense } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Lädt...</div>}>
        {children}
      </Suspense>
    </div>
  );
}
