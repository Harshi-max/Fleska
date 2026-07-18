"use client";

import { Search, Bell, Settings, Plus, LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRealtimeStore } from "@/lib/realtime-store";

interface TopBarProps {
  onScreenChange?: (screen: string) => void;
}

export function TopBar({ onScreenChange }: TopBarProps) {
  const router = useRouter();
  const { user } = useRealtimeStore();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="fixed top-0 left-64 right-0 h-16 backdrop-blur-md border-b flex items-center justify-between px-6 z-30" style={{ backgroundColor: 'rgba(26, 26, 26, 0.5)', borderColor: 'rgba(255, 90, 0, 0.2)' }}>
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders, menu, staff..."
            className="w-full rounded-lg pl-10 pr-4 py-2 text-sm text-[#e5e7eb] placeholder-[#9ca3af] focus:outline-none transition-colors"
            style={{ backgroundColor: 'rgba(15, 15, 15, 0.5)', border: '1px solid rgba(255, 90, 0, 0.2)' }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255, 90, 0, 0.5)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 90, 0, 0.2)'}
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-6">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg transition-colors" style={{ color: '#9ca3af' }} onMouseEnter={(e) => e.currentTarget.style.color = '#e5e7eb'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff5a00] rounded-full"></span>
        </button>

        {/* Settings */}
        <button className="p-2 rounded-lg transition-colors" style={{ color: '#9ca3af' }} onMouseEnter={(e) => e.currentTarget.style.color = '#e5e7eb'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
          <Settings className="w-5 h-5" />
        </button>

        {/* User Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowLogout(!showLogout)}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-mono font-bold transition-all relative"
            style={{ background: 'linear-gradient(135deg, #ff5a00 0%, #ff8c42 100%)' }}
            title={user?.name}
          >
            {user?.name?.substring(0, 2).toUpperCase() || "FL"}
          </button>
          {showLogout && (
            <div className="absolute right-0 top-12 rounded-lg p-2 z-50" style={{ backgroundColor: 'rgba(15, 15, 15, 0.9)', border: '1px solid rgba(255, 90, 0, 0.2)' }}>
              <div className="text-xs text-gray-300 px-3 py-1 mb-2 whitespace-nowrap">
                {user?.name} ({user?.role})
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition text-sm px-3 py-1 whitespace-nowrap"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* New Order Button */}
        <button 
          onClick={() => onScreenChange?.('orders')}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-lg font-mono text-sm font-bold transition-all" 
          style={{ backgroundColor: '#ff5a00' }} 
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ff7a1a'} 
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff5a00'}
        >
          <Plus className="w-4 h-4" />
          New Order
        </button>
      </div>
    </div>
  );
}
