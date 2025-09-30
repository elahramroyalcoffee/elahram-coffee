import DashboardPageHeader from "@/components/admin/DashboardPageHeader";
import { supabase } from "@/utils/supabase";
import React from "react";
import DashboardCategory from "./_components/DashboardCategory";
import AddCategory from "./_components/AddCategory";

async function page() {
  const { data, error } = await supabase
    .from("categories")
    .select()
    .order("title", { ascending: true });

  if (error?.message) return <>{error?.message}</>;

  return (
    <>
      <DashboardPageHeader title="التصنيفات" />

      <div className="page-body">
        <AddCategory />

        <ul className="grid grid-cols-[repeat(auto-fit,_minmax(350px,_1fr))]  gap-6">
          {data?.map((category) => (
            <DashboardCategory key={category.id} category={category} />
          ))}
        </ul>
      </div>
    </>
  );
}

export default page;
