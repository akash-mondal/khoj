"use client";

import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { cn, formatCurrency, formatDateShort } from "@/lib/utils";
import {
  Plane,
  Hotel,
  Car,
  MapPin,
  ChevronRight,
  Plus,
  Check,
  Clock,
  Sparkles,
} from "lucide-react";
import { MapView } from "@/components/trip/MapView";
import { DESTINATION_COORDS } from "@/config/constants";

const typeIcons = {
  flight: Plane,
  hotel: Hotel,
  transfer: Car,
  activity: MapPin,
};

const statusColors = {
  confirmed: "bg-confirmed",
  pending: "bg-pending",
  suggested: "bg-info",
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function TripWorkspace() {
  const { activeTrip, trips, setActiveTrip, setActiveView } = useApp();

  // If no active trip, show trip list
  if (!activeTrip) {
    return (
      <div className="max-w-5xl mx-auto px-8 py-8">
        <h1 className="display-serif text-2xl text-text-primary mb-6">Trips</h1>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {trips.map((trip) => (
            <motion.div
              key={trip.id}
              variants={fadeUp}
              whileHover={{ y: -1 }}
              onClick={() => setActiveTrip(trip)}
              className="border border-border rounded-lg p-4 bg-white cursor-pointer hover:border-text-tertiary/50 transition-colors flex items-center gap-4"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">
                  {trip.clientName}
                </p>
                <p className="text-xs text-text-secondary">
                  {trip.destination} &middot; {formatDateShort(trip.startDate)} &ndash;{" "}
                  {formatDateShort(trip.endDate)}
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
              <ChevronRight className="w-4 h-4 text-text-tertiary" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  const trip = activeTrip;
  const progress = trip.budget > 0 ? Math.round((trip.spent / trip.budget) * 100) : 0;

  // Group items by date
  const itemsByDate = trip.items.reduce(
    (acc, item) => {
      const date = item.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    },
    {} as Record<string, typeof trip.items>
  );

  const sortedDates = Object.keys(itemsByDate).sort();

  return (
    <div className="flex h-full">
      {/* Left: Itinerary */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {/* Trip header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <button
              onClick={() => setActiveTrip(null)}
              className="text-xs text-text-tertiary hover:text-text-primary mb-2 flex items-center gap-1"
            >
              &larr; All Trips
            </button>
            <h1 className="display-serif text-2xl text-text-primary">
              {trip.clientName} &middot; {trip.destination}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              {formatDateShort(trip.startDate)} &ndash; {formatDateShort(trip.endDate)}{" "}
              &middot; {trip.items.length} items
            </p>
          </div>
          <span
            className={cn(
              "text-[11px] font-medium px-2.5 py-1 rounded-full",
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

        {/* Itinerary timeline */}
        <p className="label-caps mb-4">Itinerary</p>
        {sortedDates.length === 0 ? (
          <div className="text-center py-12 text-text-tertiary">
            <Sparkles className="w-6 h-6 mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-sm">No items yet. Use Khoj to search and add hotels, flights, and activities.</p>
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="relative"
          >
            {/* Vertical timeline line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

            {sortedDates.map((date) => (
              <div key={date} className="mb-6">
                <p className="text-xs font-medium text-text-primary mb-3 pl-6">
                  {formatDateShort(date)}
                </p>
                <div className="space-y-3">
                  {itemsByDate[date].map((item) => {
                    const Icon = typeIcons[item.type] || MapPin;
                    return (
                      <motion.div
                        key={item.id}
                        variants={fadeUp}
                        className="flex items-start gap-3 pl-0"
                      >
                        {/* Timeline dot */}
                        <div
                          className={cn(
                            "w-3.5 h-3.5 rounded-full border-2 border-white flex-shrink-0 mt-1 relative z-10",
                            statusColors[item.status]
                          )}
                        />

                        {/* Card */}
                        <div className="flex-1 border border-border rounded-lg p-3 bg-white">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Icon
                                className="w-3.5 h-3.5 text-text-tertiary"
                                strokeWidth={1.5}
                              />
                              <p className="text-sm font-medium text-text-primary">
                                {item.name}
                              </p>
                            </div>
                            {item.price && (
                              <span className="font-data text-sm text-text-primary">
                                {formatCurrency(item.price)}
                              </span>
                            )}
                          </div>
                          {item.details && (
                            <p className="text-xs text-text-tertiary mt-1 ml-5.5">
                              {item.details}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2 ml-5.5">
                            <span
                              className={cn(
                                "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                                item.status === "confirmed"
                                  ? "text-confirmed bg-confirmed-bg"
                                  : item.status === "pending"
                                    ? "text-pending bg-pending-bg"
                                    : "text-info bg-info-bg"
                              )}
                            >
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Cost breakdown */}
        <div className="mt-8 border border-border rounded-lg p-4">
          <p className="label-caps mb-3">Cost Breakdown</p>
          <div className="space-y-2">
            {Object.entries(
              trip.items.reduce(
                (acc, item) => {
                  acc[item.type] = (acc[item.type] || 0) + (item.price || 0);
                  return acc;
                },
                {} as Record<string, number>
              )
            ).map(([type, total]) => (
              <div key={type} className="flex items-center justify-between text-sm">
                <span className="text-text-secondary capitalize">{type}s</span>
                <span className="font-data text-text-primary">
                  {formatCurrency(total)}
                </span>
              </div>
            ))}
            <div className="border-t border-divider pt-2 flex items-center justify-between text-sm font-medium">
              <span className="text-text-primary">Total</span>
              <span className="font-data text-text-primary">
                {formatCurrency(trip.spent)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-tertiary">
                Remaining of {formatCurrency(trip.budget)}
              </span>
              <span className="font-data text-text-tertiary">
                {formatCurrency(trip.budget - trip.spent)}
              </span>
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-divider rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Right: Map */}
      <div className="w-[400px] border-l border-border bg-muted/30">
        <MapView
          markers={trip.items
            .filter((item) => item.latitude && item.longitude)
            .map((item) => ({
              lat: parseFloat(item.latitude!),
              lng: parseFloat(item.longitude!),
              label: item.name,
              type: item.type,
              price: item.price ? formatCurrency(item.price) : undefined,
            }))}
          center={DESTINATION_COORDS[trip.destination]}
        />
      </div>
    </div>
  );
}
