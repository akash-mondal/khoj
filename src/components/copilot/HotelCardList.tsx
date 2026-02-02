"use client";

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
  onViewRooms?: (bookingCode: string, hotelName: string) => void;
  onAddToTrip?: (hotel: HotelData) => void;
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export function HotelCardList({ hotels, totalFound, onViewRooms, onAddToTrip }: HotelCardListProps) {
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
            onViewRooms={onViewRooms}
            onAddToTrip={onAddToTrip}
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
