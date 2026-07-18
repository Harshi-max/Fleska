"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { StaffPerformance } from "@/components/dashboard/StaffPerformance";
import { KitchenMonitoring } from "@/components/dashboard/KitchenMonitoring";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { OrderScreen } from "@/components/OrderScreen";
import { SplitScreen } from "@/components/SplitScreen";
import { ReportsScreen } from "@/components/ReportsScreen";
import { BillingScreen } from "@/components/dashboard/BillingScreen";
import { MenuScreen } from "@/components/dashboard/MenuScreen";
import { InventoryScreen } from "@/components/dashboard/InventoryScreen";
import OrdersPageComponent from "@/components/pages/OrdersPage";
import { TablesScreen } from "@/components/dashboard/TablesScreen";
import { AdvancedAnalytics } from "@/components/dashboard/AdvancedAnalytics";
import { IntegrationsScreen } from "@/components/dashboard/IntegrationsScreen";
import { useRealtimeStore, pollRealtimeData } from "@/lib/realtime-store";
import { User } from "@/lib/auth-service";

export default function DashboardPage() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState("overview");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { setUser, startPolling, stopPolling } = useRealtimeStore();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setUser(user);
      
      // Start polling for real-time data
      startPolling();
      pollRealtimeData();
    } catch (error) {
      console.error("[v0] Auth error:", error);
      router.push("/login");
    }

    return () => {
      stopPolling();
    };
  }, [router, setUser, startPolling, stopPolling]);

  const renderContent = () => {
    switch (currentScreen) {
      case "overview":
        return <DashboardOverview />;
      case "orders":
        return <OrderScreen onComplete={() => {}} />;
      case "billing":
        return <BillingScreen />;
      case "menu":
        return <MenuScreen />;
      case "inventory":
        return <InventoryScreen />;
      case "tables":
        return <TablesScreen />;
      case "analytics":
        return <AdvancedAnalytics />;
      case "integrations":
        return <IntegrationsScreen />;
      case "staff":
        return <StaffPerformance />;
      case "kitchen":
        return <KitchenMonitoring />;
      case "reports":
        return <ReportsScreen />;
      case "ai-assistant":
        return <AIAssistant />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onScreenChange={setCurrentScreen} currentScreen={currentScreen} />
      <TopBar onScreenChange={setCurrentScreen} />

      {/* Main Content */}
      <main className="ml-64 mt-16">
        {renderContent()}
      </main>
    </div>
  );
}
