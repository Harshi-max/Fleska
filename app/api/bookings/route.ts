import { NextRequest, NextResponse } from "next/server";
import { bookingsStore } from "@/lib/bookings-store";
import { tablesStore } from "@/lib/tables-store";

export async function GET() {
  try {
    const bookings = bookingsStore.listBookings();
    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Accept field names from the modal
    if (!body.guest_name || !body.guest_phone || !body.booking_date || !body.booking_time || body.guest_count === undefined) {
      return NextResponse.json({ 
        error: "Missing required fields: guest_name, guest_phone, booking_date, booking_time, guest_count" 
      }, { status: 400 });
    }

    const booking = bookingsStore.createBooking({
      name: body.guest_name,
      email: body.guest_email || "",
      phone: body.guest_phone,
      date: body.booking_date,
      time: body.booking_time,
      guests: parseInt(body.guest_count),
      duration: body.duration_minutes || 120,
      table_id: body.table_id,
      specialRequests: body.special_requests
    });

    // Update table status to reserved if table_id is provided
    if (body.table_id) {
      tablesStore.updateTableStatus(body.table_id, 'reserved');
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
