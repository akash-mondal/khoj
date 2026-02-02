"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/hooks/useAgent";
import { HotelCardList } from "./HotelCardList";
import { RoomOptionCard } from "./RoomOptionCard";
import { Search, BookOpen, Hotel, CreditCard, XCircle, User, Sparkles, Loader2 } from "lucide-react";

const toolIcons: Record<string, typeof Search> = {
  search_hotels: Search,
  get_hotel_details: Hotel,
  get_room_options: BookOpen,
  prebook_room: CreditCard,
  book_hotel: CreditCard,
  cancel_booking: XCircle,
  get_client_preferences: User,
};

function ToolIndicator({ message }: { message: ChatMessage }) {
  const Icon = toolIcons[message.toolName || ""] || Sparkles;
  const isComplete = !!message.toolResult;

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary"
    >
      {isComplete ? (
        <Icon className="w-3.5 h-3.5 text-confirmed" strokeWidth={1.5} />
      ) : (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-text-tertiary" strokeWidth={1.5} />
      )}
      <span>{message.content}</span>
    </motion.div>
  );
}

function ToolResultRenderer({
  message,
  onSendMessage,
}: {
  message: ChatMessage;
  onSendMessage?: (text: string) => void;
}) {
  const result = message.toolResult as { success?: boolean; data?: Record<string, unknown> } | undefined;

  if (!result?.success || !result?.data) {
    return <ToolIndicator message={message} />;
  }

  // Hotel search results
  if (message.toolName === "search_hotels" && result.data.hotels) {
    const hotels = result.data.hotels as Array<Record<string, unknown>>;
    const totalFound = (result.data.totalFound as number) || hotels.length;

    return (
      <div className="space-y-1">
        <ToolIndicator message={message} />
        <HotelCardList
          hotels={hotels as never}
          totalFound={totalFound}
          onViewRooms={(bookingCode, hotelName) => {
            onSendMessage?.(`Show me room options for ${hotelName}`);
          }}
        />
      </div>
    );
  }

  // Room options results
  if (message.toolName === "get_room_options" && result.data.rooms) {
    const rooms = result.data.rooms as Array<Record<string, unknown>>;

    return (
      <div className="space-y-1">
        <ToolIndicator message={message} />
        <div className="space-y-2 px-1">
          <p className="text-[11px] text-text-tertiary px-2">
            {rooms.length} room options available
          </p>
          {rooms.slice(0, 4).map((room, i) => (
            <RoomOptionCard
              key={i}
              room={room as never}
              onSelect={(bookingCode, roomType, price) => {
                onSendMessage?.(`Book the ${roomType} room at $${price}`);
              }}
            />
          ))}
          {rooms.length > 4 && (
            <p className="text-xs text-text-tertiary text-center py-1">
              +{rooms.length - 4} more options
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default: just show the indicator
  return <ToolIndicator message={message} />;
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-text-tertiary"
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  activeTool: string | null;
  onSendMessage?: (text: string) => void;
}

export function ChatMessages({ messages, isLoading, activeTool, onSendMessage }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      <AnimatePresence mode="popLayout">
        {messages.map((msg) => {
          if (msg.role === "tool") {
            return (
              <ToolResultRenderer
                key={msg.id}
                message={msg}
                onSendMessage={onSendMessage}
              />
            );
          }

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "max-w-[90%]",
                msg.role === "user" ? "ml-auto" : "mr-auto"
              )}
            >
              <div
                className={cn(
                  "rounded-xl px-3.5 py-2.5 text-[13.5px] leading-relaxed",
                  msg.role === "user"
                    ? "bg-accent text-white"
                    : "bg-muted text-text-primary"
                )}
              >
                <div className="break-words prose-chat">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      em: ({ children }) => <em>{children}</em>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2 last:mb-0 space-y-0.5">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2 last:mb-0 space-y-0.5">{children}</ol>,
                      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      code: ({ children }) => (
                        <code className="bg-black/10 rounded px-1 py-0.5 text-[12px] font-mono">{children}</code>
                      ),
                      h3: ({ children }) => <h3 className="font-semibold text-sm mb-1">{children}</h3>,
                      h4: ({ children }) => <h4 className="font-semibold text-[13px] mb-1">{children}</h4>,
                    }}
                  >
                    {msg.content || ""}
                  </ReactMarkdown>
                </div>
                {msg.isStreaming && (
                  <span className="inline-block w-1 h-4 bg-text-tertiary animate-pulse ml-0.5 -mb-0.5" />
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {isLoading && !activeTool && messages[messages.length - 1]?.role !== "assistant" && (
        <ThinkingDots />
      )}
    </div>
  );
}
