"use client";

import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
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

export function HotelCard({ hotel, onViewRooms, onAddToTrip }: HotelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="border border-border rounded-lg overflow-hidden bg-white"
    >
      {/* Image */}
      <div className="relative h-[130px] bg-muted overflow-hidden">
        {hotel.image ? (
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-tertiary">
            <MapPin className="w-6 h-6" strokeWidth={1} />
          </div>
        )}
        {/* Star badge */}
        <div className="absolute top-2 left-2 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm rounded-full px-1.5 py-0.5">
          <Star className="w-3 h-3 text-pending fill-pending" strokeWidth={0} />
          <span className="text-[11px] font-medium text-text-primary">{hotel.stars}</span>
        </div>
        {/* Price badge */}
        <div className="absolute top-2 right-2 bg-accent/90 text-white rounded-full px-2 py-0.5">
          <span className="font-data text-[12px] font-medium">
            {formatCurrency(hotel.price.offeredPrice, hotel.price.currency)}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-text-primary leading-tight truncate">
          {hotel.name}
        </p>
        <p className="text-xs text-text-tertiary mt-0.5 truncate">{hotel.address}</p>

        {hotel.price.commission > 0 && (
          <p className="text-[10px] text-confirmed mt-1">
            Commission: {formatCurrency(hotel.price.commission, hotel.price.currency)}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-2.5">
          <button
            onClick={() => onViewRooms?.(hotel.bookingCode, hotel.name)}
            className="flex-1 text-xs font-medium text-white bg-accent rounded-lg py-1.5 hover:bg-accent/90 transition-colors"
          >
            View Rooms
          </button>
          <button
            onClick={() => onAddToTrip?.(hotel)}
            className="flex-1 text-xs font-medium text-text-secondary border border-border rounded-lg py-1.5 hover:border-text-tertiary transition-colors"
          >
            Add to Trip
          </button>
        </div>
      </div>
    </motion.div>
  );
}
