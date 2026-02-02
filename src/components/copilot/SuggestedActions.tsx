"use client";

import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { Search, User, MessageSquare, TrendingDown } from "lucide-react";

interface SuggestedActionsProps {
  onAction: (text: string) => void;
}

export function SuggestedActions({ onAction }: SuggestedActionsProps) {
  const { activeClient, activeTrip, alerts, bookings } = useApp();

  const suggestions: { icon: typeof Search; text: string; action: string }[] = [];

  if (activeTrip) {
    const hasHotel = activeTrip.items.some((i) => i.type === "hotel");
    if (!hasHotel) {
      suggestions.push({
        icon: Search,
        text: `Find hotels in ${activeTrip.destination}`,
        action: `Find hotels in ${activeTrip.destination} for ${activeTrip.startDate} to ${activeTrip.endDate}`,
      });
    }
  }

  if (activeClient) {
    suggestions.push({
      icon: User,
      text: `${activeClient.name}'s preferences`,
      action: `What are ${activeClient.name}'s travel preferences?`,
    });
  }

  const pendingQuotes = bookings.filter((b) => b.status === "quote");
  if (pendingQuotes.length > 0) {
    suggestions.push({
      icon: MessageSquare,
      text: "Follow up on quotes",
      action: `I have ${pendingQuotes.length} pending quotes. Help me follow up.`,
    });
  }

  const priceDrops = alerts.filter((a) => a.type === "price_drop" && !a.isRead);
  if (priceDrops.length > 0) {
    suggestions.push({
      icon: TrendingDown,
      text: "Check price drops",
      action: `There are ${priceDrops.length} price drop alerts. Show me the details.`,
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      icon: Search,
      text: "Search hotels",
      action: "Help me find hotels",
    });
  }

  return (
    <div className="px-4 py-2 border-b border-divider">
      <p className="label-caps mb-2">Suggested</p>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.slice(0, 3).map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onAction(s.action)}
              className="inline-flex items-center gap-1.5 text-xs text-text-secondary border border-border rounded-full px-2.5 py-1 hover:border-text-tertiary hover:text-text-primary transition-colors"
            >
              <Icon className="w-3 h-3" strokeWidth={1.5} />
              {s.text}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
