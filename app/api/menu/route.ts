import { NextRequest, NextResponse } from "next/server";
import { menuStore } from "@/lib/menu-store";

export async function GET() {
  try {
    console.log('Menu API - Fetching menu items');
    const items = menuStore.listItems();
    console.log('Menu API - Fetched items:', items);
    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error('Menu API - Error:', error);
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.sku || !body.name || body.price === undefined || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields: sku, name, price, category" },
        { status: 400 }
      );
    }

    const newItem = menuStore.addItem({
      sku: body.sku,
      name: body.name,
      price: parseFloat(body.price),
      category: body.category,
      available: body.available !== false,
      image: body.image
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.sku) {
      return NextResponse.json(
        { error: "Missing required field: sku" },
        { status: 400 }
      );
    }

    const updatedItem = menuStore.updateItem(body.sku, {
      name: body.name,
      price: body.price !== undefined ? parseFloat(body.price) : undefined,
      category: body.category,
      available: body.available !== undefined ? body.available : undefined,
      image: body.image
    });

    if (!updatedItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 400 });
  }
}
