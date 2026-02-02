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
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export function HotelCardList({ hotels, totalFound, onViewRooms, onAddToTrip }: HotelCardListProps) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-2.5 px-1"
    >
      <p className="text-[11px] text-text-tertiary px-2">
        {totalFound} hotels found &middot; showing top {hotels.length}
      </p>
      {hotels.slice(0, 5).map((hotel) => (
        <HotelCard
          key={hotel.hotelCode}
          hotel={hotel}
          onViewRooms={onViewRooms}
          onAddToTrip={onAddToTrip}
        />
      ))}
      {hotels.length > 5 && (
        <p className="text-xs text-text-tertiary text-center py-1">
          +{hotels.length - 5} more results
        </p>
      )}
    </motion.div>
  );
}
