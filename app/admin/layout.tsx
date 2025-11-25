import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Link href="/admin" className="inline-block">
            <h1 className="text-3xl font-bold text-blue-600">RIDATOURS</h1>
          </Link>
          <p className="text-gray-800 font-medium">Panel de Administración</p>
        </div>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}
