"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { cn, formatCurrency, formatDateShort } from "@/lib/utils";

type FilterStatus = "all" | "confirmed" | "pending" | "quote" | "cancelled";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export function BookingsView() {
  const { bookings } = useApp();
  const [filter, setFilter] = useState<FilterStatus>("all");

  const filtered =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  const tabs: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "all" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Pending", value: "pending" },
    { label: "Quotes", value: "quote" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      <h1 className="display-serif text-2xl text-text-primary mb-6">Bookings</h1>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              filter === tab.value
                ? "bg-accent text-white"
                : "text-text-secondary hover:text-text-primary hover:bg-hover"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_100px_1.5fr_90px_100px_80px] gap-4 px-4 py-2.5 border-b border-border bg-muted/50">
          <span className="label-caps">Client</span>
          <span className="label-caps">Type</span>
          <span className="label-caps">Details</span>
          <span className="label-caps">Status</span>
          <span className="label-caps">Date</span>
          <span className="label-caps text-right">Price</span>
        </div>

        {/* Rows */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-text-tertiary">
              No bookings found.
            </div>
          ) : (
            filtered.map((booking) => (
              <motion.div
                key={booking.id}
                variants={fadeUp}
                className="grid grid-cols-[1fr_100px_1.5fr_90px_100px_80px] gap-4 px-4 py-3 border-b border-divider last:border-b-0 hover:bg-hover/50 transition-colors cursor-pointer"
              >
                <span className="text-sm text-text-primary truncate">
                  {booking.clientName}
                </span>
                <span className="text-sm text-text-secondary capitalize">
                  {booking.type}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-text-primary truncate">
                    {booking.productName}
                  </p>
                  {booking.confirmationNumber && (
                    <p className="font-data text-[11px] text-text-tertiary">
                      {booking.confirmationNumber}
                    </p>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[11px] font-medium self-center",
                    booking.status === "confirmed"
                      ? "text-confirmed"
                      : booking.status === "quote"
                        ? "text-pending"
                        : booking.status === "cancelled"
                          ? "text-alert"
                          : "text-text-secondary"
                  )}
                >
                  {booking.status}
                </span>
                <span className="text-xs text-text-secondary self-center">
                  {booking.checkIn ? formatDateShort(booking.checkIn) : "—"}
                </span>
                <span className="font-data text-sm text-text-primary text-right self-center">
                  {formatCurrency(booking.price)}
                </span>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
