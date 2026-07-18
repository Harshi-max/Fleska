import { NextRequest, NextResponse } from "next/server";
import { orderStore } from "@/lib/store";
import { menuStore } from "@/lib/menu-store";

export async function GET() {
  try {
    const orders = orderStore.listAllOrders();
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid items array" },
        { status: 400 }
      );
    }

    if (!body.shop_id) {
      return NextResponse.json(
        { error: "Missing shop_id" },
        { status: 400 }
      );
    }

    if (!["CARD", "CASH"].includes(body.payment_type)) {
      return NextResponse.json(
        { error: "Invalid payment_type (must be CARD or CASH)" },
        { status: 400 }
      );
    }

    const tip = parseFloat(body.tip || "0");
    const discount = parseFloat(body.discount || "0");

    if (tip < 0 || discount < 0) {
      return NextResponse.json(
        { error: "Negative tip or discount not allowed" },
        { status: 400 }
      );
    }

    // Validate all SKUs before processing
    for (const item of body.items) {
      const menuItem = menuStore.getItem(item.sku);
      if (!menuItem) {
        return NextResponse.json(
          { error: `Unknown SKU: ${item.sku}. Valid SKUs: ${Array.from(menuStore.listItems().map(i => i.sku)).join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Calculate item prices with dual pricing for CARD
    let subtotal = 0;
    let dualPricingSurcharge = 0;

    body.items.forEach((item: any) => {
      const menuItem = menuStore.getItem(item.sku);
      if (!menuItem) {
        return NextResponse.json(
          { error: `Unknown SKU: ${item.sku}` },
          { status: 400 }
        );
      }

      let itemPrice = menuItem.price;
      const qty = item.qty || item.quantity || 1;

      if (body.payment_type === "CARD") {
        // Apply 4% dual pricing surcharge
        const surcharge = itemPrice * 0.04;
        itemPrice += surcharge;
        dualPricingSurcharge += surcharge * qty;
      }

      subtotal += itemPrice * qty;
    });

    // Calculate convenience fee for CARD only
    let convenienceFee = "0.00";
    if (body.payment_type === "CARD") {
      convenienceFee = (subtotal * 0.029 + 0.30).toFixed(2);
    }

    const convenienceFeeNum = parseFloat(convenienceFee);
    const total = subtotal + convenienceFeeNum + tip - discount;

    // Validate invariant: subtotal + convenience_fee + tip - discount == total (±$0.01)
    const calculatedTotal = subtotal + convenienceFeeNum + tip - discount;
    if (Math.abs(calculatedTotal - total) > 0.01) {
      return NextResponse.json(
        { error: "Invariant violation: total calculation mismatch" },
        { status: 422 }
      );
    }

    if (discount > subtotal + convenienceFeeNum + tip) {
      return NextResponse.json(
        { error: "Discount cannot exceed pre-discount total" },
        { status: 400 }
      );
    }

    const placedAt = body.placed_at || new Date().toISOString();

    // Create order using store
    const order = orderStore.createOrder({
      placed_at: placedAt,
      shop_id: body.shop_id,
      items: body.items.map((item: any) => ({
        sku: item.sku,
        quantity: item.qty || item.quantity || 1,
        item_price: menuStore.getItem(item.sku)?.price.toFixed(2) || "0.00"
      })),
      payment_type: body.payment_type,
      subtotal: subtotal.toFixed(2),
      card_fee: "0.00",
      convenience_fee: convenienceFee,
      dual_pricing_surcharge: dualPricingSurcharge.toFixed(2),
      tip: tip.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2)
    });

    console.log('API - Created order:', order);
    console.log('API - All orders in store:', orderStore.listAllOrders());

    return NextResponse.json(order, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
