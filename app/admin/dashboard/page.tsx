import DashboardPageHeader from "@/components/admin/DashboardPageHeader";
import { DashboardStats, MonthlyChart, QuickLinks } from "./_components";

export default async function AdminDashboard() {
  return (
    <>
      <DashboardPageHeader title="الرئيسية" />

      <div className="page-body">
        {/* Dashboard Stats */}
        <DashboardStats />

        {/* Charts Section */}
        <div className="mt-8">
          <MonthlyChart />
        </div>

        {/* Quick Links */}
        {/* <div className="mt-8">
          <QuickLinks />
        </div> */}
      </div>
    </>
  );
}
