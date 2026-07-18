import { NextRequest, NextResponse } from "next/server";
import { orderStore } from "@/lib/store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const tz = searchParams.get("tz");

    if (!date) {
      return NextResponse.json(
        { error: "Missing date parameter" },
        { status: 400 }
      );
    }

    if (!tz) {
      return NextResponse.json(
        { error: "Missing timezone parameter" },
        { status: 400 }
      );
    }

    // Validate timezone
    try {
      Intl.DateTimeFormat.supportedLocalesOf('en-US', { timeZone: tz });
    } catch {
      return NextResponse.json(
        { error: "Invalid timezone" },
        { status: 400 }
      );
    }

    const allOrders = orderStore.listAllOrders();
    
    // Filter orders that belong to the given date in the given timezone
    const ordersForDate = allOrders.filter(order => {
      const orderDate = new Date(order.placed_at);
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const orderDateStr = formatter.format(orderDate).replace(/\//g, '-');
      // Format from MM-DD-YYYY to YYYY-MM-DD
      const [month, day, year] = orderDateStr.split('-');
      const formattedDate = `${year}-${month}-${day}`;
      
      return formattedDate === date;
    });

    const grossTotal = ordersForDate.reduce((sum, order) => {
      return sum + parseFloat(order.total || "0");
    }, 0);

    const cardFeesTotal = ordersForDate.reduce((sum, order) => {
      if (order.payment_type === 'CARD') {
        return sum + parseFloat(order.convenience_fee || "0");
      }
      return sum;
    }, 0);

    const report = {
      date,
      tz,
      order_count: ordersForDate.length,
      orders: ordersForDate.map(order => ({
        id: order.id,
        placed_at: order.placed_at,
        total: order.total
      })),
      gross_total: grossTotal.toFixed(2),
      card_fees_total: cardFeesTotal.toFixed(2)
    };

    return NextResponse.json(report, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
