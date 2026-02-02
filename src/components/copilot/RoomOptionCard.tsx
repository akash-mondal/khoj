"use client";

import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { Shield, ShieldOff, Coffee } from "lucide-react";

interface RoomData {
  roomType: string;
  ratePlan: string;
  mealType: string;
  inclusions: string[];
  isRefundable: boolean;
  bookingCode: string;
  price: {
    currency: string;
    offeredPrice: number;
    publishedPrice: number;
    roomPrice: number;
    tax: number;
    commission: number;
  };
}

interface RoomOptionCardProps {
  room: RoomData;
  onSelect?: (bookingCode: string, roomType: string, price: number) => void;
}

export function RoomOptionCard({ room, onSelect }: RoomOptionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border rounded-lg p-3 bg-white"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary leading-tight">
            {room.roomType}
          </p>
          <p className="text-xs text-text-tertiary mt-0.5">{room.ratePlan}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-data text-sm font-medium text-text-primary">
            {formatCurrency(room.price.offeredPrice, room.price.currency)}
          </p>
          {room.price.publishedPrice > room.price.offeredPrice && (
            <p className="font-data text-[11px] text-text-tertiary line-through">
              {formatCurrency(room.price.publishedPrice, room.price.currency)}
            </p>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2">
        {room.mealType && room.mealType !== "NoMeal" && (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-confirmed-bg text-confirmed">
            <Coffee className="w-2.5 h-2.5" strokeWidth={1.5} />
            {room.mealType}
          </span>
        )}
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
            room.isRefundable
              ? "bg-confirmed-bg text-confirmed"
              : "bg-alert-bg text-alert"
          }`}
        >
          {room.isRefundable ? (
            <Shield className="w-2.5 h-2.5" strokeWidth={1.5} />
          ) : (
            <ShieldOff className="w-2.5 h-2.5" strokeWidth={1.5} />
          )}
          {room.isRefundable ? "Refundable" : "Non-refundable"}
        </span>
      </div>

      {room.price.commission > 0 && (
        <p className="text-[10px] text-confirmed mt-1.5">
          Commission: {formatCurrency(room.price.commission, room.price.currency)}
        </p>
      )}

      <button
        onClick={() => onSelect?.(room.bookingCode, room.roomType, room.price.offeredPrice)}
        className="w-full mt-2.5 text-xs font-medium text-white bg-accent rounded-lg py-1.5 hover:bg-accent/90 transition-colors"
      >
        Select Room
      </button>
    </motion.div>
  );
}
