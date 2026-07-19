"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  ShoppingCart,
  CreditCard,
  UtensilsCrossed,
  Package,
  Users,
  TrendingUp,
  Bot,
  LogOut,
  LayoutGrid,
  Settings,
  FileText,
  Zap,
  ChefHat,
  Divide,
} from "lucide-react";
import { useRealtimeStore } from "@/lib/realtime-store";

interface SidebarProps {
  onScreenChange: (screen: string) => void;
  currentScreen: string;
}

export function Sidebar({ onScreenChange, currentScreen }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useRealtimeStore();

  const allMenuItems = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "split", label: "Split Bill", icon: Divide, external: true },
    { id: "menu", label: "Menu", icon: UtensilsCrossed },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "tables", label: "Tables", icon: Users },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "ai-assistant", label: "AI Assistant", icon: Bot },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "integrations", label: "Integrations", icon: Zap },
    { id: "staff", label: "Staff", icon: Users, adminOnly: true },
    { id: "kitchen", label: "Kitchen", icon: ChefHat },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const menuItems = allMenuItems.filter(item => {
    if (item.adminOnly) {
      return user?.role === 'admin' || user?.role === 'manager';
    }
    return true;
  });

  return (
    <aside
      className={`fixed left-0 top-0 h-screen backdrop-blur-md transition-all duration-300 flex flex-col z-40 ${
        collapsed ? "w-20" : "w-64"
      }`}
      style={{ backgroundColor: 'rgba(26, 26, 26, 0.5)', borderRight: '1px solid rgba(255, 90, 0, 0.2)' }}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255, 90, 0, 0.2)' }}>
        <div className={`flex items-center gap-2 ${collapsed ? "hidden" : ""}`}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff5a00 0%, #ff8c42 100%)' }}>
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-mono" style={{ color: '#ff5a00' }}>FLEKSA</h1>
            <p className="text-xs" style={{ color: '#9ca3af' }}>Enterprise POS</p>
          </div>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded transition-colors"
          style={{ color: '#e5e7eb' }}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.external) {
                    if (item.id === 'split') {
                      window.location.href = '/split'
                    } else if (item.id === 'reports') {
                      window.location.href = '/report'
                    }
                  } else {
                    onScreenChange(item.id)
                  }
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200"
                style={isActive ? { backgroundColor: 'rgba(255, 90, 0, 0.15)', border: '1px solid rgba(255, 90, 0, 0.5)', color: '#ff5a00' } : { color: '#9ca3af' }}
                onMouseEnter={(e) => !isActive && (e.currentTarget.style.backgroundColor = 'rgba(255, 90, 0, 0.1)')}
                onMouseLeave={(e) => !isActive && (e.currentTarget.style.backgroundColor = '')}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-mono">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4" style={{ borderTop: '1px solid rgba(255, 90, 0, 0.2)' }}>
        <button className="w-full flex items-center gap-3 px-3 py-2 transition-colors" style={{ color: '#9ca3af' }}>
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-mono">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
