"use client";

import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  Users,
  Map,
  CalendarCheck,
  Bell,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "trips" as const, label: "Trips", icon: Map },
  { id: "clients" as const, label: "Clients", icon: Users },
  { id: "bookings" as const, label: "Bookings", icon: CalendarCheck },
  { id: "alerts" as const, label: "Alerts", icon: Bell },
];

export function Sidebar() {
  const { activeView, setActiveView, alerts } = useApp();
  const unreadAlerts = alerts.filter((a) => !a.isRead).length;

  return (
    <aside className="w-56 border-r border-border bg-muted/50 flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-8">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-text-primary" strokeWidth={1.5} />
          <span className="display-serif text-xl text-text-primary">Khoj</span>
        </div>
        <p className="text-[11px] text-text-tertiary mt-0.5 tracking-wide">
          Travel Agent Copilot
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            const Icon = item.icon;

            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors relative",
                    isActive
                      ? "text-text-primary font-medium bg-white shadow-xs"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/60"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-white rounded-lg shadow-xs"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" strokeWidth={1.5} />
                  <span className="relative z-10">{item.label}</span>
                  {item.id === "alerts" && unreadAlerts > 0 && (
                    <span className="relative z-10 ml-auto text-[11px] font-medium text-alert bg-alert-bg px-1.5 py-0.5 rounded-full">
                      {unreadAlerts}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="px-5 py-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-medium">
            RA
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">Raj Agarwal</p>
            <p className="text-[11px] text-text-tertiary">Travel Agent</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
