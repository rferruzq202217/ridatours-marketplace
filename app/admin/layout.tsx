import AdminAuth from '@/components/AdminAuth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminAuth>
        {children}
      </AdminAuth>
    </div>
  );
}
