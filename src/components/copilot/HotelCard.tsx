"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Hotel, ChevronDown, ChevronUp, Shield, ShieldOff, Coffee, Loader2 } from "lucide-react";
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

interface RoomData {
  roomType: string;
  mealType: string;
  isRefundable: boolean;
  bookingCode: string;
  price: {
    currency: string;
    offeredPrice: number;
    tax: number;
  };
}

interface HotelCardProps {
  hotel: HotelData;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectRoom?: (bookingCode: string, roomType: string, price: number) => void;
}

export function HotelCard({ hotel, isExpanded, onToggle, onSelectRoom }: HotelCardProps) {
  const [imgError, setImgError] = useState(false);
  const [rooms, setRooms] = useState<RoomData[] | null>(null);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState<string | null>(null);

  const handleClick = async () => {
    if (isExpanded) {
      onToggle();
      return;
    }

    onToggle();

    // Fetch rooms if not already loaded
    if (!rooms && !roomsLoading) {
      setRoomsLoading(true);
      setRoomsError(null);
      try {
        const res = await fetch("/api/tbo/rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hotelBookingCode: hotel.bookingCode }),
        });
        if (!res.ok) throw new Error("Failed to load rooms");
        const data = await res.json();
        if (!data.Rooms?.length) {
          setRoomsError("No rooms available right now");
          setRooms([]);
        } else {
          setRooms(
            data.Rooms.map((r: Record<string, unknown>) => ({
              roomType: (r.Name as string[])?.[0] || "Standard Room",
              mealType: r.MealType as string,
              isRefundable: r.IsRefundable as boolean,
              bookingCode: r.BookingCode as string,
              price: {
                currency: "USD",
                offeredPrice: r.TotalFare as number,
                tax: r.TotalTax as number,
              },
            }))
          );
        }
      } catch {
        setRoomsError("Could not load rooms — session may have expired");
      } finally {
        setRoomsLoading(false);
      }
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, layout: { duration: 0.3 } }}
      className={`border rounded-lg overflow-hidden bg-white ${
        isExpanded ? "border-accent/40 shadow-md col-span-2" : "border-border cursor-pointer group"
      }`}
    >
      {/* Clickable header — always grid tile */}
      <div
        className={`${isExpanded ? "flex gap-3 p-3 cursor-pointer" : ""}`}
        onClick={handleClick}
      >
        {/* Image */}
        <div className={`relative bg-muted overflow-hidden ${
          isExpanded ? "w-[140px] h-[100px] rounded-lg flex-shrink-0" : "aspect-[4/3]"
        }`}>
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
          {!isExpanded && (
            <>
              <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                <Star className="w-2.5 h-2.5 text-pending fill-pending" strokeWidth={0} />
                <span className="text-[10px] font-medium text-text-primary">{hotel.stars}</span>
              </div>
              <div className="absolute bottom-1.5 right-1.5 bg-accent text-white rounded-md px-2 py-0.5 shadow-sm">
                <span className="font-data text-[13px] font-semibold">
                  {formatCurrency(hotel.price.offeredPrice, hotel.price.currency)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Info */}
        <div className={isExpanded ? "flex-1 min-w-0 flex flex-col justify-center" : "px-2.5 py-2"}>
          <div className={isExpanded ? "flex items-start justify-between" : ""}>
            <div className="min-w-0">
              <p className={`font-medium text-text-primary leading-tight truncate ${
                isExpanded ? "text-sm" : "text-[12.5px]"
              }`}>
                {hotel.name}
              </p>
              <p className="text-[10.5px] text-text-tertiary mt-0.5 truncate">{hotel.address}</p>
              {isExpanded && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 text-pending fill-pending" strokeWidth={0} />
                    <span className="text-[10px] font-medium text-text-primary">{hotel.stars}-star</span>
                  </div>
                  {hotel.price.commission > 0 && (
                    <span className="text-[10px] text-confirmed font-medium">
                      +{formatCurrency(hotel.price.commission, hotel.price.currency)} commission
                    </span>
                  )}
                </div>
              )}
            </div>
            {isExpanded && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-data text-base font-semibold text-accent">
                  {formatCurrency(hotel.price.offeredPrice, hotel.price.currency)}
                </span>
                <ChevronUp className="w-4 h-4 text-text-tertiary" strokeWidth={1.5} />
              </div>
            )}
          </div>
          {!isExpanded && hotel.price.commission > 0 && (
            <p className="text-[10px] text-confirmed mt-1 font-medium">
              +{formatCurrency(hotel.price.commission, hotel.price.currency)} commission
            </p>
          )}
        </div>
      </div>

      {/* Expanded: Room options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 border-t border-border/50 pt-2">
              {roomsLoading && (
                <div className="flex items-center gap-2 py-4 justify-center text-text-tertiary">
                  <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                  <span className="text-xs">Loading rooms...</span>
                </div>
              )}

              {roomsError && (
                <p className="text-xs text-text-tertiary text-center py-3">{roomsError}</p>
              )}

              {rooms && rooms.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] text-text-tertiary font-medium uppercase tracking-wider">
                    {rooms.length} rooms available
                  </p>
                  {rooms.slice(0, 4).map((room, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2 p-2 rounded-md border border-border hover:border-accent/30 transition-colors cursor-pointer group/room"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRoom?.(room.bookingCode, room.roomType, room.price.offeredPrice);
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-text-primary truncate">
                          {room.roomType}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {room.mealType && room.mealType !== "NoMeal" && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-medium text-confirmed">
                              <Coffee className="w-2 h-2" strokeWidth={1.5} />
                              {room.mealType}
                            </span>
                          )}
                          <span className={`inline-flex items-center gap-0.5 text-[9px] font-medium ${
                            room.isRefundable ? "text-confirmed" : "text-alert"
                          }`}>
                            {room.isRefundable ? (
                              <Shield className="w-2 h-2" strokeWidth={1.5} />
                            ) : (
                              <ShieldOff className="w-2 h-2" strokeWidth={1.5} />
                            )}
                            {room.isRefundable ? "Refundable" : "Non-refundable"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="font-data text-[13px] font-semibold text-text-primary">
                          {formatCurrency(room.price.offeredPrice, "USD")}
                        </span>
                        <span className="text-[10px] font-medium text-accent opacity-0 group-hover/room:opacity-100 transition-opacity">
                          Book →
                        </span>
                      </div>
                    </div>
                  ))}
                  {rooms.length > 4 && (
                    <p className="text-[10px] text-text-tertiary text-center pt-1">
                      +{rooms.length - 4} more rooms
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
