"use client";

import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  TrendingDown,
  Clock,
  MessageSquare,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";

const alertIcons = {
  price_drop: TrendingDown,
  schedule_change: Clock,
  follow_up: MessageSquare,
  reconfirm: Check,
  deadline: AlertTriangle,
};

const alertColors = {
  price_drop: "text-confirmed bg-confirmed-bg",
  schedule_change: "text-pending bg-pending-bg",
  follow_up: "text-alert bg-alert-bg",
  reconfirm: "text-info bg-info-bg",
  deadline: "text-text-secondary bg-muted",
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function AlertsView() {
  const { alerts, dismissAlert, setCopilotOpen, setQueuedMessage } = useApp();

  const handleAlertClick = (alert: typeof alerts[0]) => {
    const msg = (() => {
      switch (alert.type) {
        case "price_drop":
          return `The ${alert.title.replace("Price dropped on ", "")} price dropped — ${alert.description}. Affects ${alert.clientName || "client"}. Should I check current rates and rebook?`;
        case "schedule_change":
          return `Alert: ${alert.title}. ${alert.description}. Affects ${alert.clientName || "client"}. Should I check connecting transfers?`;
        case "follow_up":
          return `${alert.title}: ${alert.description}. Should I draft a follow-up message to ${alert.clientName || "the client"}?`;
        case "reconfirm":
          return `${alert.title}: ${alert.description}. Should I check booking status and send reconfirmation?`;
        default:
          return `Alert: ${alert.title}. ${alert.description}. What action should I take?`;
      }
    })();
    setCopilotOpen(true);
    setQueuedMessage(msg);
  };
  const unread = alerts.filter((a) => !a.isRead);
  const read = alerts.filter((a) => a.isRead);

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      <h1 className="display-serif text-2xl text-text-primary mb-6">Alerts</h1>

      {unread.length > 0 && (
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mb-8"
        >
          <p className="label-caps mb-3">New ({unread.length})</p>
          <div className="space-y-2">
            {unread.map((alert) => {
              const Icon = alertIcons[alert.type] || AlertTriangle;
              const colors = alertColors[alert.type] || "text-text-secondary bg-muted";

              return (
                <motion.div
                  key={alert.id}
                  variants={fadeUp}
                  onClick={() => handleAlertClick(alert)}
                  className="border border-border rounded-lg p-4 bg-white flex items-start gap-3 cursor-pointer hover:border-text-tertiary/50 transition-colors"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      colors
                    )}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">
                      {alert.title}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {alert.description}
                    </p>
                    {alert.clientName && (
                      <p className="text-[11px] text-text-tertiary mt-1">
                        {alert.clientName}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] text-text-tertiary">{alert.time}</span>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="text-text-tertiary hover:text-text-primary transition-colors"
                    >
                      <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      )}

      {read.length > 0 && (
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <p className="label-caps mb-3">Dismissed</p>
          <div className="space-y-2 opacity-60">
            {read.map((alert) => {
              const Icon = alertIcons[alert.type] || AlertTriangle;
              return (
                <motion.div
                  key={alert.id}
                  variants={fadeUp}
                  className="border border-border rounded-lg p-3 bg-white flex items-center gap-3"
                >
                  <Icon className="w-4 h-4 text-text-tertiary" strokeWidth={1.5} />
                  <p className="text-sm text-text-secondary flex-1 truncate">
                    {alert.title}
                  </p>
                  <span className="text-[11px] text-text-tertiary">{alert.time}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      )}
    </div>
  );
}
