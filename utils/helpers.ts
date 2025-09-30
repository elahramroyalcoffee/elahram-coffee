import { supabase } from "./supabase";

export const getData = async (
  tableName: string,
  orderBy: string = "created_at"
) => {
  try {
    const res = await supabase.from(tableName).select().order(orderBy);
    return res.data || [];
  } catch (error) {
    console.log(error);
  }
};

// Shipment helpers
export const getActiveShipments = async () => {
  try {
    const { data, error } = await supabase
      .from("shipments")
      .select("*")
      .eq("is_active", true)
      .order("governorate_name_ar");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching active shipments:", error);
    return [];
  }
};

export const getShipmentById = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("shipments")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching shipment:", error);
    return null;
  }
};

export const calculateShippingCost = async (shipmentId: number) => {
  try {
    const shipment = await getShipmentById(shipmentId);
    return shipment ? shipment.price : 0;
  } catch (error) {
    console.error("Error calculating shipping cost:", error);
    return 0;
  }
};
