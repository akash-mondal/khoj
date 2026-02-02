"use client";

import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { useAgent } from "@/hooks/useAgent";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { SuggestedActions } from "./SuggestedActions";
import { Sparkles, X, Minimize2 } from "lucide-react";
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

  // Detect rich content — once expanded, stay expanded (sticky latch)
  const [isExpanded, setIsExpanded] = useState(false);

  const hasRichContent = useMemo(() => {
    return messages.some(
      (m) =>
        m.role === "tool" &&
        m.toolResult &&
        (m.toolName === "search_hotels" || m.toolName === "get_room_options")
    );
  }, [messages]);

  useEffect(() => {
    if (hasRichContent && !isExpanded) {
      setIsExpanded(true);
    }
  }, [hasRichContent, isExpanded]);

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

      {/* Backdrop when expanded */}
      <AnimatePresence>
        {copilotOpen && isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setCopilotOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {copilotOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{
              opacity: { duration: 0.2 },
              scale: { type: "spring", stiffness: 350, damping: 30 },
            }}
            className={`fixed z-50 rounded-2xl border border-border bg-white shadow-2xl flex flex-col overflow-hidden transition-[width,height,top,left,bottom,right,transform] duration-500 ease-out ${
              isExpanded
                ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[82vh] max-h-[780px]"
                : "bottom-6 right-6 w-[400px] h-[560px]"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" strokeWidth={1.5} />
                <span className="display-serif text-base text-text-primary">Khoj</span>
              </div>
              <div className="flex items-center gap-1">
                {isExpanded && (
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-muted transition-colors"
                    title="Minimize"
                  >
                    <Minimize2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                )}
                <button
                  onClick={() => setCopilotOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Context badge */}
            {(activeClient || activeTrip) && (
              <div className="px-4 py-2 border-b border-divider flex-shrink-0">
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
            />

            {/* Input */}
            <ChatInput onSend={sendMessage} isLoading={isLoading} onStop={stop} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
