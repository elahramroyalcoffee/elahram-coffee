import { supabase } from "@/utils/supabase";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const orderInfo = {
  customer_name: "Omar Ragab",
  customer_email: "tryragab@gmail.com",
  customer_phone: "01094123928",
  customer_address: "Dekernes, Almostashfa St",
  total_amount: 300,
  shipment_id: 6,
  // shipment_cost: 50,
  payment_method_id: 1,
};
const orderItems = [
  {
    product_id: 1,
    size_id: 1,
    quantity: 1,
    unit_price: 200,
    total_price: 200,
    grind_id: 1,
    add_ons: [
      {
        add_ons_id: 1,
        add_ons_name: "Extra Cheese",
        unit_price: 200,
        quantity: 2,
        total_price: 400,
      },
    ],
  },
];

export async function GET(request: Request) {
  // const supabase = await createClient();
  // // type-casting here for convenience
  // // in practice, you should validate your inputs
  // const data = {
  //   email: "elahramroyalcoffee@gmail.com",
  //   password: "Ezz1937555",
  // };
  // const { error } = await supabase.auth.signUp(data);
  // if (error) {
  //   return error;
  //   // redirect("/error");
  // }
  // revalidatePath("/", "layout");
  // redirect("/");
  // try {
  //   // const { data } = await supabase.from("products").select();
  //   // return new Response(JSON.stringify(data), {
  //   //   status: 200,
  //   //   headers: { "Content-Type": "application/json" },
  //   // });
  //   const { data: orderData } = await supabase
  //     .from("orders")
  //     .insert(orderInfo)
  //     .select()
  //     .single();
  //   // console.log(data.id);
  //   const { data: orderItemsData } = await supabase
  //     .from("order_items")
  //     .insert(orderItems.map((item) => ({ ...item, order_id: orderData.id })));
  //   return new Response(JSON.stringify(orderItemsData), {
  //     status: 200,
  //     headers: { "Content-Type": "application/json" },
  //   });
  // } catch (error) {
  //   const message = error instanceof Error ? error.message : "Unexpected error";
  //   return new Response(message);
  // }
}
