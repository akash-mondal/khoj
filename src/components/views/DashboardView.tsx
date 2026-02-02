"use client";

import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { cn, formatCurrency, daysUntil } from "@/lib/utils";
import {
  TrendingDown,
  Clock,
  MessageSquare,
  AlertTriangle,
  Check,
  ChevronRight,
} from "lucide-react";

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function StatCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <motion.div variants={fadeUp} className="flex flex-col">
      <p className="label-caps mb-2">{label}</p>
      <p className="display-serif text-3xl text-text-primary">{value}</p>
      {subtext && (
        <p className="text-xs text-text-tertiary mt-1">{subtext}</p>
      )}
    </motion.div>
  );
}

const alertIcons: Record<string, typeof TrendingDown> = {
  price_drop: TrendingDown,
  schedule_change: Clock,
  follow_up: MessageSquare,
  reconfirm: Check,
  deadline: AlertTriangle,
};

export function DashboardView() {
  const { trips, bookings, alerts, setActiveView, setActiveTrip, setCopilotOpen, setQueuedMessage } = useApp();

  const getAlertCopilotMessage = (alert: typeof alerts[0]) => {
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
  };

  const handleAlertClick = (alert: typeof alerts[0]) => {
    setCopilotOpen(true);
    setQueuedMessage(getAlertCopilotMessage(alert));
  };

  const activeTrips = trips.filter((t) => t.status !== "completed");
  const unreadAlerts = alerts.filter((a) => !a.isRead);
  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.price, 0);
  const pendingQuotes = bookings.filter((b) => b.status === "quote").length;

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="display-serif text-3xl text-text-primary mb-8">
          Good morning, Raj.
        </h1>
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-4 gap-8 mb-12"
      >
        <StatCard
          label="Today"
          value={String(bookings.filter((b) => b.status === "confirmed").length)}
          subtext="active bookings"
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(totalRevenue)}
          subtext="confirmed value"
        />
        <StatCard
          label="Quotes"
          value={String(pendingQuotes)}
          subtext="pending response"
        />
        <StatCard
          label="Alerts"
          value={String(unreadAlerts.length)}
          subtext="require attention"
        />
      </motion.div>

      {/* Active Trips */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mb-10"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="label-caps">Active Trips</p>
          <button
            onClick={() => setActiveView("trips")}
            className="text-xs text-text-tertiary hover:text-text-primary transition-colors"
          >
            View all
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {activeTrips.map((trip) => {
            const progress =
              trip.budget > 0
                ? Math.round((trip.spent / trip.budget) * 100)
                : 0;
            const daysAway = daysUntil(trip.startDate);

            return (
              <motion.div
                key={trip.id}
                variants={fadeUp}
                whileHover={{ y: -2 }}
                onClick={() => {
                  setActiveTrip(trip);
                  setActiveView("trips");
                }}
                className="border border-border rounded-lg p-4 bg-white cursor-pointer hover:border-text-tertiary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {trip.clientName}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {trip.destination}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-[11px] font-medium px-2 py-0.5 rounded-full",
                      trip.status === "booked"
                        ? "text-confirmed bg-confirmed-bg"
                        : trip.status === "quoted"
                          ? "text-pending bg-pending-bg"
                          : "text-info bg-info-bg"
                    )}
                  >
                    {trip.status}
                  </span>
                </div>
                <p className="text-xs text-text-tertiary mb-3">
                  {daysAway > 0
                    ? `In ${daysAway} days`
                    : daysAway === 0
                      ? "Today"
                      : "Past"}
                </p>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-text-secondary">
                    {formatCurrency(trip.spent)} of {formatCurrency(trip.budget)}
                  </span>
                  <span className="font-data text-text-tertiary">{progress}%</span>
                </div>
                <div className="h-1 bg-divider rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Alerts */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mb-10"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="label-caps">Alerts</p>
          <button
            onClick={() => setActiveView("alerts")}
            className="text-xs text-text-tertiary hover:text-text-primary transition-colors flex items-center gap-1"
          >
            {unreadAlerts.length} new <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-0 border border-border rounded-lg overflow-hidden">
          {alerts.slice(0, 4).map((alert) => {
            const Icon = alertIcons[alert.type] || AlertTriangle;
            return (
              <motion.div
                key={alert.id}
                variants={fadeUp}
                onClick={() => !alert.isRead && handleAlertClick(alert)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 border-b border-divider last:border-b-0 transition-colors",
                  alert.isRead ? "opacity-60" : "cursor-pointer hover:bg-muted/30"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 flex-shrink-0",
                    alert.type === "price_drop"
                      ? "text-confirmed"
                      : alert.type === "schedule_change"
                        ? "text-pending"
                        : alert.type === "follow_up"
                          ? "text-alert"
                          : "text-text-tertiary"
                  )}
                  strokeWidth={1.5}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary truncate">
                    {alert.title}
                  </p>
                  <p className="text-xs text-text-tertiary truncate">
                    {alert.description}
                  </p>
                </div>
                <span className="text-[11px] text-text-tertiary flex-shrink-0">
                  {alert.time}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Pending Tasks */}
      <motion.section variants={stagger} initial="hidden" animate="show">
        <p className="label-caps mb-4">Pending Tasks</p>
        <div className="space-y-2">
          {[
            { text: "Re-confirm Kumar hotel (3 days away)", done: false, copilotMsg: "Re-confirm Kumar's hotel booking at Marriott Dubai. Check-in is in 3 days. Should I check booking status and send reconfirmation?" },
            { text: "Follow up Mehra quote", done: false, copilotMsg: "Follow up with Priya Mehra about the Bali trip quote sent 3 days ago. Should I draft a follow-up message?" },
            { text: "Send Bali proposal to Patel", done: false, copilotMsg: "Search for hotels and activities in Bali to build a proposal for Vikram Patel." },
            { text: "Book Delhi airport transfer", done: true, copilotMsg: "" },
          ].map((task, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              onClick={() => {
                if (!task.done && task.copilotMsg) {
                  setCopilotOpen(true);
                  setQueuedMessage(task.copilotMsg);
                }
              }}
              className={cn(
                "flex items-center gap-3 py-1.5 transition-colors rounded-md px-1 -mx-1",
                !task.done && "cursor-pointer hover:bg-muted/30"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center flex-shrink-0",
                  task.done
                    ? "bg-accent border-accent"
                    : "border-border"
                )}
              >
                {task.done && <Check className="w-3 h-3 text-white" strokeWidth={2} />}
              </div>
              <span
                className={cn(
                  "text-sm",
                  task.done
                    ? "text-text-tertiary line-through"
                    : "text-text-primary"
                )}
              >
                {task.text}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
