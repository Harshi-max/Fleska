"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  change: number;
  icon?: React.ReactNode;
  trend?: "up" | "down";
}

export function MetricCard({
  label,
  value,
  change,
  icon,
  trend = "up",
}: MetricCardProps) {
  const isPositive = change > 0;

  return (
    <div className="metric-card h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="metric-label">{label}</p>
          <p className="metric-value mt-2">{value}</p>
        </div>
        {icon && <div className="text-primary/50">{icon}</div>}
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1 metric-change ${
            isPositive ? "text-success" : "text-danger"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{isPositive ? "+" : ""}{change}%</span>
        </div>
      </div>
    </div>
  );
}
