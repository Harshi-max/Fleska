import { NextRequest, NextResponse } from "next/server";
import { menuStore } from "@/lib/menu-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku } = await params;
    const item = menuStore.getItem(sku);

    if (!item) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch menu item" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku } = await params;
    const deleted = menuStore.removeItem(sku);

    if (!deleted) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Menu item deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 });
  }
}
