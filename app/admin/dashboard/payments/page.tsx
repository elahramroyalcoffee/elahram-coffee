import DashboardPageHeader from "@/components/admin/DashboardPageHeader";
import { PaymentSettings } from "./_components";

function page() {
  return (
    <>
      <DashboardPageHeader title="إعدادات وسائل الدفع" />
      <div className="page-body">
        <PaymentSettings />
      </div>
    </>
  );
}

export default page;
