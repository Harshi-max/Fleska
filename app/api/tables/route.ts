import { NextRequest, NextResponse } from "next/server";
import { tablesStore } from "@/lib/tables-store";

export async function GET() {
  try {
    const tables = tablesStore.listTables();
    console.log('Tables API - Fetched tables:', tables);
    return NextResponse.json({ tables }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tables" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id || !body.status) {
      return NextResponse.json(
        { error: "Missing required fields: id, status" },
        { status: 400 }
      );
    }

    const updatedTable = tablesStore.updateTableStatus(body.id, body.status, body.currentOrder);
    
    if (!updatedTable) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTable, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update table" }, { status: 400 });
  }
}
