import { NextRequest, NextResponse } from "next/server";
import { inventoryStore } from "@/lib/inventory-store";

export async function GET() {
  try {
    const inventory = inventoryStore.listInventory();
    return NextResponse.json({ inventory }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.sku || body.quantity === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: sku, quantity" },
        { status: 400 }
      );
    }

    const quantity = parseInt(body.quantity);
    let result;

    if (body.type === 'add') {
      result = inventoryStore.addStock(body.sku, quantity, body.reason);
    } else if (body.type === 'deduct') {
      result = inventoryStore.deductStock(body.sku, quantity, body.reason);
    } else {
      return NextResponse.json(
        { error: "Invalid type. Must be 'add' or 'deduct'" },
        { status: 400 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update inventory";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
