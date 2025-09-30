import DashboardSidebar from "@/components/admin/DashboardSidebar";
import coffeBG from "@/public/coffeBG.jpg";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen bg-orange-950/40 p-4 relative z-0"
      style={{
        backgroundImage: `url(${coffeBG.src})`,
      }}
    >
      <div className="absolute w-full h-full inset-0 bg-black/60 z-0 "></div>
      <div className="flex gap-4 z-10 relative">
        <div>
          <DashboardSidebar />
        </div>
        <div className="page-wrap">{children}</div>
      </div>
    </div>
  );
}
