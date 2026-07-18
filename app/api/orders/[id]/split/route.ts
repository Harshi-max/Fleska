import { NextRequest, NextResponse } from "next/server";
import { orderStore } from "@/lib/store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!Number.isInteger(body.ways) || body.ways < 2 || body.ways > 20) {
      return NextResponse.json(
        { error: "ways must be an integer between 2 and 20" },
        { status: 400 }
      );
    }

    const order = orderStore.getOrder(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const totalAmount = parseFloat(order.total);
    const ways = body.ways;

    // Calculate shares that sum exactly to total with max difference of $0.01
    const baseShare = totalAmount / ways;
    const shares: string[] = [];
    let runningTotal = 0;

    for (let i = 0; i < ways; i++) {
      if (i === ways - 1) {
        // Last share gets the remainder to ensure exact sum
        const lastShare = totalAmount - runningTotal;
        shares.push(lastShare.toFixed(2));
      } else {
        const share = Math.round(baseShare * 100) / 100;
        shares.push(share.toFixed(2));
        runningTotal += share;
      }
    }

    // Validate: sum of shares equals total (±$0.01)
    const sharesSum = shares.reduce((sum, share) => sum + parseFloat(share), 0);
    if (Math.abs(sharesSum - totalAmount) > 0.01) {
      return NextResponse.json(
        { error: "Split calculation error: shares do not sum to total" },
        { status: 500 }
      );
    }

    // Validate: max share - min share ≤ $0.01
    const shareValues = shares.map(s => parseFloat(s));
    const maxShare = Math.max(...shareValues);
    const minShare = Math.min(...shareValues);
    if (maxShare - minShare > 0.01) {
      return NextResponse.json(
        { error: "Split calculation error: share difference exceeds $0.01" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      order_id: id,
      total: order.total,
      shares
    }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
