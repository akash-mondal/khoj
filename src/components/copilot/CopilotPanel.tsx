"use client";

import { useEffect, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { useAgent } from "@/hooks/useAgent";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { SuggestedActions } from "./SuggestedActions";
import { Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CopilotPanel() {
  const { copilotOpen, setCopilotOpen, activeClient, activeTrip, queuedMessage, setQueuedMessage } = useApp();

  const { messages, isLoading, activeTool, sendMessage, stop } = useAgent({
    clientName: activeClient?.name,
    clientPreferences: activeClient
      ? JSON.stringify(activeClient.preferences)
      : undefined,
    tripId: activeTrip?.id,
    tripSummary: activeTrip
      ? `${activeTrip.destination}, ${activeTrip.startDate} to ${activeTrip.endDate}, Budget $${activeTrip.budget}`
      : undefined,
  });

  // Detect rich content (hotel/room results) to auto-expand the panel
  const hasRichContent = useMemo(() => {
    return messages.some(
      (m) =>
        m.role === "tool" &&
        m.toolResult &&
        (m.toolName === "search_hotels" || m.toolName === "get_room_options")
    );
  }, [messages]);

  // Auto-send queued messages from external components (e.g., alert clicks)
  useEffect(() => {
    if (queuedMessage && copilotOpen && !isLoading) {
      const timer = setTimeout(() => {
        sendMessage(queuedMessage);
        setQueuedMessage(null);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [queuedMessage, copilotOpen, isLoading, sendMessage, setQueuedMessage]);

  return (
    <>
      {/* FAB button when closed */}
      <AnimatePresence>
        {!copilotOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => setCopilotOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-accent text-white shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center transition-shadow"
          >
            <Sparkles className="w-5 h-5" strokeWidth={1.5} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating chat panel when open */}
      <AnimatePresence>
        {copilotOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            layout
            className={`fixed bottom-6 right-6 z-50 rounded-2xl border border-border bg-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
              hasRichContent ? "w-[420px] h-[80vh] max-h-[720px]" : "w-[400px] h-[560px]"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" strokeWidth={1.5} />
                <span className="display-serif text-base text-text-primary">Khoj</span>
              </div>
              <button
                onClick={() => setCopilotOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* Context badge */}
            {(activeClient || activeTrip) && (
              <div className="px-4 py-2 border-b border-divider">
                <p className="label-caps mb-1">Context</p>
                <p className="text-xs text-text-secondary">
                  {activeClient?.name}
                  {activeTrip ? ` \u00b7 ${activeTrip.destination}` : ""}
                </p>
              </div>
            )}

            {/* Suggested actions */}
            {messages.length === 0 && (
              <SuggestedActions onAction={sendMessage} />
            )}

            {/* Messages */}
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              activeTool={activeTool}
              onSendMessage={sendMessage}
            />

            {/* Input */}
            <ChatInput onSend={sendMessage} isLoading={isLoading} onStop={stop} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
