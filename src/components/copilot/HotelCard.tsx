"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Hotel } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

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

interface HotelCardProps {
  hotel: HotelData;
  onViewRooms?: (bookingCode: string, hotelName: string) => void;
  onAddToTrip?: (hotel: HotelData) => void;
}

export function HotelCard({ hotel, onViewRooms }: HotelCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.2 }}
      className="border border-border rounded-lg overflow-hidden bg-white cursor-pointer group"
      onClick={() => onViewRooms?.(hotel.bookingCode, hotel.name)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {hotel.image && !imgError ? (
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-divider text-text-tertiary">
            <Hotel className="w-8 h-8" strokeWidth={1} />
          </div>
        )}
        {/* Star badge */}
        <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm rounded-full px-1.5 py-0.5">
          <Star className="w-2.5 h-2.5 text-pending fill-pending" strokeWidth={0} />
          <span className="text-[10px] font-medium text-text-primary">{hotel.stars}</span>
        </div>
        {/* Price badge */}
        <div className="absolute bottom-1.5 right-1.5 bg-accent text-white rounded-md px-2 py-0.5 shadow-sm">
          <span className="font-data text-[13px] font-semibold">
            {formatCurrency(hotel.price.offeredPrice, hotel.price.currency)}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-2.5 py-2">
        <p className="text-[12.5px] font-medium text-text-primary leading-tight truncate">
          {hotel.name}
        </p>
        <p className="text-[10.5px] text-text-tertiary mt-0.5 truncate">{hotel.address}</p>
        {hotel.price.commission > 0 && (
          <p className="text-[10px] text-confirmed mt-1 font-medium">
            +{formatCurrency(hotel.price.commission, hotel.price.currency)} commission
          </p>
        )}
      </div>
    </motion.div>
  );
}
