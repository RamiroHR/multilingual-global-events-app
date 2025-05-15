import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-space-300">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-space-300">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  );
}
