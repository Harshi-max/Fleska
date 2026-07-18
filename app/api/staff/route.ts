import { NextResponse } from "next/server";

const demoStaff = [
  { id: '1', name: 'Admin User', email: 'admin@fleksa.com', role: 'admin', isOnline: true },
  { id: '2', name: 'Manager User', email: 'manager@fleksa.com', role: 'manager', isOnline: true },
  { id: '3', name: 'Chef User', email: 'chef@fleksa.com', role: 'staff', isOnline: true },
  { id: '4', name: 'Waiter User', email: 'waiter@fleksa.com', role: 'staff', isOnline: false }
];

export async function GET() {
  try {
    const staff = demoStaff.map(s => ({
      ...s,
      performanceMetrics: {
        ordersHandled: Math.floor(Math.random() * 100) + 10,
        avgTime: Math.floor(Math.random() * 20) + 5,
        rating: (Math.random() * 1 + 4).toFixed(1)
      }
    }));

    return NextResponse.json({ staff, total: staff.length }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ message: "Staff status updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update staff" }, { status: 500 });
  }
}
