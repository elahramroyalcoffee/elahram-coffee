export type SizeTypes = {
  id: number;
  weight: number;
  size: string;
};

export type SizesTypes = SizeTypes[];

export type GrindTypes = {
  id: number;
  name: string;
};

export type GrindsTypes = GrindTypes[];

export type AddOnTypes = {
  id: number;
  name: string;
  price: number;
};

export type AddOnsTypes = AddOnTypes[];

export type CategoryTypes = {
  id: number;
  title: string;
  description: string | null;
  image: string;
  created_at: string;
  updated_at: string;
};

export type CategoriesTypes = CategoryTypes[];

export type ProductTypes = {
  product_sizes: any;
  id: number;
  title: string;
  description: string | null;
  image: string;
  category_id: number;
  category?: CategoryTypes; // Optional nested category object
  created_at: string;
  updated_at: string;
  in_stock: boolean;
};

export type ProductsTypes = ProductTypes[];

export type ShipmentTypes = {
  id: number;
  governorate_name: string;
  governorate_name_ar: string;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  in_stock: boolean;
};

export type ShipmentsTypes = ShipmentTypes[];

export type PaymentMethodTypes = {
  id: number;
  method_name: string;
  method_name_ar: string;
  is_enabled: boolean;
  settings: {
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
};

export type PaymentMethodsTypes = PaymentMethodTypes[];

export type OrderItemTypes = {
  id: number;
  order_id: number;
  product_id: number;
  size_id: number;
  grind_id?: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  add_ons?: any[];
  created_at: string;
  product?: ProductTypes;
  size?: SizeTypes;
  grind?: GrindTypes;
};

export type OrderTypes = {
  id: number;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number; // Changed from string to number to match DECIMAL(10,2) in database
  status: "pending" | "done";
  notes?: string;
  payment_method?: string; // 'cash_on_delivery' or 'kashier_visa'
  payment_method_id?: number;
  payment_status?: string; // 'pending', 'paid', 'failed'
  payment_reference?: string; // Transaction reference
  shipment_id?: number | null;
  shipment_cost?: number | null;
  shipment?: ShipmentTypes; // Optional nested shipment object
  shipments?: ShipmentTypes; // Alternative name used in queries
  payment_settings?: PaymentMethodTypes; // Nested payment method object
  order_items?: OrderItemTypes[]; // Order items with product details
  created_at: string;
  updated_at: string;
};

export type OrderItemsTypes = OrderItemTypes[];

export type OrdersTypes = OrderTypes[];

export type RefundTypes = {
  id: number;
  order_id: number;
  customer_phone: string;
  refund_status: "pending" | "approved" | "rejected" | "completed";
  created_at: string;
  order?: OrderTypes; // Optional nested order object
};

export type RefundsTypes = RefundTypes[];
