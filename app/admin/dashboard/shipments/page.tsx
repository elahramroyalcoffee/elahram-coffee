import DashboardPageHeader from "@/components/admin/DashboardPageHeader";
import { ShipmentSettings } from "./_components";

function page() {
  return (
    <>
      <DashboardPageHeader title="الشحن" />

      <div className="page-body">
        <ShipmentSettings />
      </div>
    </>
  );
}

export default page;
