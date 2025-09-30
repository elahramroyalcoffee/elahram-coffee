import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function POST(request: NextRequest) {
  try {
    const { order_id, customer_phone } = await request.json();

    // Validate input
    if (!order_id || !customer_phone) {
      return NextResponse.json(
        { error: "Order ID and customer phone are required" },
        { status: 400 }
      );
    }

    // Check if order exists and belongs to the phone number
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, customer_phone, customer_name, total_amount, created_at")
      .eq("id", order_id)
      .eq("customer_phone", customer_phone)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Order not found or phone number doesn't match" },
        { status: 404 }
      );
    }

    // Check if refund already exists for this order
    const { data: existingRefund, error: refundCheckError } = await supabase
      .from("refunds")
      .select("id")
      .eq("order_id", order_id)
      .single();

    if (existingRefund) {
      return NextResponse.json(
        { error: "A refund request already exists for this order" },
        { status: 400 }
      );
    }

    // Create refund request
    const { data: refund, error: refundError } = await supabase
      .from("refunds")
      .insert({
        order_id,
        customer_phone,
        refund_status: "pending",
      })
      .select()
      .single();

    if (refundError) {
      console.error("Refund creation error:", refundError);
      return NextResponse.json(
        { error: "Failed to create refund request" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Refund request created successfully",
        refund,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Refund API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch orders by phone number
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Fetch orders for the phone number (last 3 months for refund eligibility)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        customer_name,
        customer_phone,
        total_amount,
        created_at,
        refunds:refunds(id, refund_status)
      `
      )
      .eq("customer_phone", phone)
      .gte("created_at", threeMonthsAgo.toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Orders fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 }
      );
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error("Orders API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
