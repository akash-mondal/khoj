"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HotelCard } from "./HotelCard";

interface HotelData {
  hotelCode: string;
  name: string;
  stars: number;
  image: string;
  address: string;
  latitude: string;
  longitude: string;
  price: {
    currency: string;
    offeredPrice: number;
    publishedPrice: number;
    tax: number;
    commission: number;
  };
  bookingCode: string;
}

interface HotelCardListProps {
  hotels: HotelData[];
  totalFound: number;
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export function HotelCardList({ hotels, totalFound }: HotelCardListProps) {
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const displayed = hotels.slice(0, 6);
  const remaining = hotels.length - displayed.length;

  return (
    <div className="px-1">
      <p className="text-[11px] text-text-tertiary px-1 mb-2">
        {totalFound} hotels found &middot; showing top {displayed.length}
      </p>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-2"
      >
        {displayed.map((hotel) => (
          <HotelCard
            key={hotel.hotelCode}
            hotel={hotel}
            isExpanded={expandedCode === hotel.hotelCode}
            onToggle={() =>
              setExpandedCode((prev) =>
                prev === hotel.hotelCode ? null : hotel.hotelCode
              )
            }
          />
        ))}
      </motion.div>
      {remaining > 0 && (
        <p className="text-xs text-text-tertiary text-center py-2 mt-1">
          +{remaining} more results
        </p>
      )}
    </div>
  );
}
