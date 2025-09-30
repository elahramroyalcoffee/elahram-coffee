import { supabase } from "./supabase";

// Payment Methods Helpers
export const getActivePaymentMethods = async () => {
  try {
    const { data, error } = await supabase
      .from("payment_settings")
      .select("*")
      .eq("is_enabled", true)
      .order("id");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching active payment methods:", error);
    return [];
  }
};

export const getPaymentMethodByName = async (methodName: string) => {
  try {
    const { data, error } = await supabase
      .from("payment_settings")
      .select("*")
      .eq("method_name", methodName)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching payment method:", error);
    return null;
  }
};

// Kashier Integration Helpers
interface KashierPaymentData {
  merchantId: string;
  amount: number;
  currency: string;
  orderReference: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  redirectUrl: string;
  webhookUrl?: string;
  testMode?: boolean;
}

interface KashierResponse {
  success: boolean;
  paymentUrl?: string;
  reference?: string;
  error?: string;
}

export const createKashierPayment = async (
  paymentData: KashierPaymentData,
  apiKey: string
): Promise<KashierResponse> => {
  try {
    const kashierEndpoint = paymentData.testMode
      ? "https://test-api.kashier.io/payment/create"
      : "https://api.kashier.io/payment/create";

    const response = await fetch(kashierEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        merchant_id: paymentData.merchantId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        order_reference: paymentData.orderReference,
        customer_name: paymentData.customerName,
        customer_email: paymentData.customerEmail,
        customer_phone: paymentData.customerPhone,
        redirect_url: paymentData.redirectUrl,
        webhook_url: paymentData.webhookUrl,
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return {
        success: true,
        paymentUrl: result.payment_url,
        reference: result.reference,
      };
    } else {
      return {
        success: false,
        error: result.message || "حدث خطأ في إنشاء رابط الدفع",
      };
    }
  } catch (error) {
    console.error("Kashier payment creation error:", error);
    return {
      success: false,
      error: "حدث خطأ في الاتصال ببوابة الدفع",
    };
  }
};

export const verifyKashierPayment = async (
  reference: string,
  apiKey: string,
  testMode: boolean = false
): Promise<{ success: boolean; status?: string; error?: string }> => {
  try {
    const kashierEndpoint = testMode
      ? `https://test-api.kashier.io/payment/status/${reference}`
      : `https://api.kashier.io/payment/status/${reference}`;

    const response = await fetch(kashierEndpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        status: result.status, // 'pending', 'paid', 'failed', 'cancelled'
      };
    } else {
      return {
        success: false,
        error: result.message || "حدث خطأ في التحقق من حالة الدفع",
      };
    }
  } catch (error) {
    console.error("Kashier payment verification error:", error);
    return {
      success: false,
      error: "حدث خطأ في التحقق من حالة الدفع",
    };
  }
};

// Calculate total order amount including shipping and payment fees
export const calculateOrderTotal = async (
  subtotal: number,
  shipmentId?: number | null,
  paymentMethod?: string
) => {
  try {
    let total = subtotal;

    // Add shipping cost
    if (shipmentId) {
      const { data: shipment } = await supabase
        .from("shipments")
        .select("price")
        .eq("id", shipmentId)
        .single();

      if (shipment) {
        total += shipment.price;
      }
    }

    // Add payment method fee
    if (paymentMethod) {
      const paymentMethodData = await getPaymentMethodByName(paymentMethod);
      if (paymentMethodData && paymentMethodData.settings.fee) {
        total += paymentMethodData.settings.fee;
      }
    }

    return total;
  } catch (error) {
    console.error("Error calculating order total:", error);
    return subtotal;
  }
};

// Update order payment status
export const updateOrderPaymentStatus = async (
  orderId: number,
  paymentStatus: string,
  paymentReference?: string
) => {
  try {
    const updateData: any = {
      payment_status: paymentStatus,
      updated_at: new Date().toISOString(),
    };

    if (paymentReference) {
      updateData.payment_reference = paymentReference;
    }

    const { error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error updating order payment status:", error);
    return { success: false, error };
  }
};
