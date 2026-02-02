"use client";

import { useApp } from "@/context/AppContext";
import { DashboardView } from "@/components/views/DashboardView";
import { TripWorkspace } from "@/components/views/TripWorkspace";
import { ClientsView } from "@/components/views/ClientsView";
import { BookingsView } from "@/components/views/BookingsView";
import { AlertsView } from "@/components/views/AlertsView";
import { AnimatePresence, motion } from "framer-motion";

export function MainContent() {
  const { activeView } = useApp();

  const views: Record<string, React.ReactNode> = {
    dashboard: <DashboardView />,
    trips: <TripWorkspace />,
    clients: <ClientsView />,
    bookings: <BookingsView />,
    alerts: <AlertsView />,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="h-full"
      >
        {views[activeView] || <DashboardView />}
      </motion.div>
    </AnimatePresence>
  );
}
