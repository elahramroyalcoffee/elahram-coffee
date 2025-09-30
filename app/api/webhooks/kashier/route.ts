import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";
import { updateOrderPaymentStatus } from "@/utils/paymentHelpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Kashier webhook payload structure
    const {
      reference,
      status,
      order_reference,
      amount,
      currency,
      transaction_id,
    } = body;

    console.log("Kashier webhook received:", body);

    if (!reference || !order_reference || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Extract order ID from order_reference (assuming format: "ORDER_123")
    const orderId = parseInt(order_reference.replace("ORDER_", ""));

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: "Invalid order reference format" },
        { status: 400 }
      );
    }

    // Map Kashier status to our system
    let paymentStatus: string;
    switch (status.toLowerCase()) {
      case "paid":
      case "success":
        paymentStatus = "paid";
        break;
      case "failed":
      case "failure":
        paymentStatus = "failed";
        break;
      case "cancelled":
      case "canceled":
        paymentStatus = "cancelled";
        break;
      default:
        paymentStatus = "pending";
    }

    // Update order payment status
    const updateResult = await updateOrderPaymentStatus(
      orderId,
      paymentStatus,
      reference
    );

    if (!updateResult.success) {
      console.error(
        "Failed to update order payment status:",
        updateResult.error
      );
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    // If payment is successful, you might want to trigger other actions
    if (paymentStatus === "paid") {
      // Update order status to 'confirmed' or 'processing'
      await supabase
        .from("orders")
        .update({
          status: "confirmed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      // You could also send confirmation email, SMS, etc.
      console.log(`Payment confirmed for order ${orderId}`);
    }

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Kashier webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle GET requests (for webhook verification if needed)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Kashier webhook endpoint is active",
  });
}
