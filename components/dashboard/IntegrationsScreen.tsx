"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink, Check, X, Plus } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  connected: boolean;
  icon: string;
  features: string[];
}

export function IntegrationsScreen() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "stripe",
      name: "Stripe",
      description: "Accept payments online with Stripe",
      category: "Payment",
      connected: true,
      icon: "💳",
      features: ["Online Payments", "Subscriptions", "Invoicing"],
    },
    {
      id: "twilio",
      name: "Twilio",
      description: "Send SMS notifications to customers",
      category: "Communication",
      connected: false,
      icon: "📱",
      features: ["SMS Notifications", "Voice Calls", "Two-Factor Auth"],
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Email marketing and customer management",
      category: "Marketing",
      connected: true,
      icon: "📧",
      features: ["Email Campaigns", "Automation", "Analytics"],
    },
    {
      id: "slack",
      name: "Slack",
      description: "Real-time notifications to your Slack channel",
      category: "Communication",
      connected: true,
      icon: "💬",
      features: ["Order Updates", "Alerts", "Reports"],
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Automate workflows with Zapier",
      category: "Automation",
      connected: false,
      icon: "⚡",
      features: ["Workflow Automation", "App Integration", "Data Sync"],
    },
    {
      id: "google-analytics",
      name: "Google Analytics",
      description: "Track website and app analytics",
      category: "Analytics",
      connected: true,
      icon: "📊",
      features: ["Website Tracking", "Conversion Analytics", "Reports"],
    },
    {
      id: "quickbooks",
      name: "QuickBooks",
      description: "Sync accounting with QuickBooks",
      category: "Accounting",
      connected: false,
      icon: "💰",
      features: ["Expense Tracking", "Invoicing", "Financial Reports"],
    },
    {
      id: "gdpr-compliance",
      name: "GDPR Compliance",
      description: "Ensure data privacy compliance",
      category: "Compliance",
      connected: true,
      icon: "🔒",
      features: ["Data Protection", "Audit Logs", "Compliance Reports"],
    },
  ]);

  const handleToggleIntegration = (id: string) => {
    setIntegrations(
      integrations.map((int) =>
        int.id === id ? { ...int, connected: !int.connected } : int
      )
    );
  };

  // Simulate real-time sync status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIntegrations(prev => prev.map(int => {
        // Randomly simulate sync activity for connected integrations
        if (int.connected && Math.random() > 0.7) {
          // This could be expanded to show "syncing" status
          return int;
        }
        return int;
      }));
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const categories = [...new Set(integrations.map((i) => i.category))];
  const connectedCount = integrations.filter((i) => i.connected).length;

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold" style={{ color: "#e5e7eb" }}>
            Integrations Hub
          </h2>
          <p style={{ color: "#9ca3af" }}>
            Connect external services to enhance your restaurant operations
          </p>
        </div>

        {/* Connected Count */}
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: "rgba(255, 90, 0, 0.1)",
            borderColor: "rgba(255, 90, 0, 0.3)",
          }}
        >
          <p className="text-sm" style={{ color: "#9ca3af" }}>
            Connected Integrations
          </p>
          <p className="text-2xl font-bold" style={{ color: "#ff5a00" }}>
            {connectedCount} of {integrations.length}
          </p>
        </div>

        {/* Integrations by Category */}
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-lg font-bold mb-4" style={{ color: "#e5e7eb" }}>
                {category}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrations
                  .filter((int) => int.category === category)
                  .map((integration) => (
                    <div
                      key={integration.id}
                      className="p-4 rounded-lg border transition-all"
                      style={{
                        backgroundColor: "rgba(15, 15, 15, 0.5)",
                        borderColor: integration.connected
                          ? "rgba(16, 185, 129, 0.3)"
                          : "rgba(255, 90, 0, 0.2)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(15, 15, 15, 0.8)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(15, 15, 15, 0.5)";
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">{integration.icon}</span>
                          <div>
                            <h4 className="font-bold" style={{ color: "#e5e7eb" }}>
                              {integration.name}
                            </h4>
                            <p className="text-sm" style={{ color: "#9ca3af" }}>
                              {integration.description}
                            </p>
                          </div>
                        </div>
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: integration.connected
                              ? "rgba(16, 185, 129, 0.2)"
                              : "rgba(239, 68, 68, 0.2)",
                          }}
                        >
                          {integration.connected ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <X className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs" style={{ color: "#9ca3af" }}>
                          Features
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {integration.features.map((feature) => (
                            <span
                              key={feature}
                              className="px-2 py-1 rounded text-xs"
                              style={{
                                backgroundColor: "rgba(255, 90, 0, 0.1)",
                                color: "#ff5a00",
                              }}
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleIntegration(integration.id)}
                          className="flex-1 px-3 py-2 rounded text-sm font-mono transition-all"
                          style={{
                            backgroundColor: integration.connected
                              ? "rgba(239, 68, 68, 0.2)"
                              : "#ff5a00",
                            color: integration.connected ? "#ef4444" : "white",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "0.8";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "1";
                          }}
                        >
                          {integration.connected ? "Disconnect" : "Connect"}
                        </button>
                        <button className="px-3 py-2 rounded text-sm border transition-all" style={{ borderColor: "rgba(255, 90, 0, 0.3)" }}>
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Custom Integration */}
        <div
          className="p-6 rounded-lg border text-center"
          style={{
            backgroundColor: "rgba(15, 15, 15, 0.5)",
            borderColor: "rgba(255, 90, 0, 0.2)",
          }}
        >
          <Plus className="w-8 h-8 mx-auto mb-3" style={{ color: "#ff5a00" }} />
          <h3 className="font-bold mb-2" style={{ color: "#e5e7eb" }}>
            Need a Custom Integration?
          </h3>
          <p style={{ color: "#9ca3af" }} className="mb-4">
            Contact our support team for custom API integrations
          </p>
          <button
            className="px-4 py-2 rounded-lg text-sm font-mono text-white transition-all"
            style={{ backgroundColor: "#ff5a00" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ff7a1a")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ff5a00")}
          >
            Request Integration
          </button>
        </div>
      </div>
    </div>
  );
}
