import { NextRequest, NextResponse } from "next/server";
import { orderStore } from "@/lib/store";
import { inventoryStore } from "@/lib/inventory-store";
import { menuStore } from "@/lib/menu-store";

export async function GET(request: NextRequest) {
  try {
    // Calculate analytics from real stores
    const orders = orderStore.listAllOrders();
    const inventory = inventoryStore.listInventory();
    const menuItems = menuStore.listItems();

    // Calculate totals
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate inventory value
    let inventoryValue = 0;
    inventory.forEach(item => {
      const menuItem = menuItems.find(m => m.sku === item.sku);
      if (menuItem) {
        inventoryValue += item.quantity * menuItem.price;
      }
    });

    // Low stock items
    const lowStockItems = inventory.filter(item => item.quantity < 20).length;
    const outOfStockItems = inventory.filter(item => item.quantity === 0).length;

    // Hourly metrics - calculate from orders
    const hourlyMetrics = Array.from({ length: 24 }, (_, i) => {
      const hourOrders = orders.filter(o => {
        const orderHour = new Date(o.placed_at).getHours();
        return orderHour === i;
      });
      const hourRevenue = hourOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
      return {
        hour: i,
        orders: hourOrders.length,
        revenue: hourRevenue
      };
    });

    // Top items by revenue
    const itemRevenue = new Map<string, { name: string; quantity: number; revenue: number }>();
    orders.forEach(order => {
      order.items.forEach(item => {
        const menuItem = menuItems.find(m => m.sku === item.sku);
        if (menuItem) {
          const existing = itemRevenue.get(item.sku) || { 
            name: menuItem.name, 
            quantity: 0, 
            revenue: 0 
          };
          existing.quantity += item.quantity;
          existing.revenue += item.quantity * menuItem.price;
          itemRevenue.set(item.sku, existing);
        }
      });
    });

    const topItems = Array.from(itemRevenue.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3)
      .map((item, i) => ({
        sku: Array.from(itemRevenue.keys())[i],
        name: item.name,
        quantity: item.quantity,
        revenue: parseFloat(item.revenue.toFixed(2))
      }));

    const response = {
      total_orders: totalOrders,
      total_revenue: parseFloat(totalRevenue.toFixed(2)),
      average_order_value: parseFloat(avgOrderValue.toFixed(2)),
      hourly_metrics: hourlyMetrics,
      top_items: topItems,
      inventory_metrics: {
        low_stock_items: lowStockItems,
        out_of_stock_items: outOfStockItems,
        inventory_value: parseFloat(inventoryValue.toFixed(2)),
        waste_count: 0,
        waste_value: 0
      }
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
