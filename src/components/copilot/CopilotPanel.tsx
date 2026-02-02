"use client";

import { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useAgent } from "@/hooks/useAgent";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { SuggestedActions } from "./SuggestedActions";
import { Sparkles, PanelRightClose } from "lucide-react";
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
    <AnimatePresence>
      {copilotOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 380, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="border-l border-border bg-white flex flex-col h-full overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-text-primary" strokeWidth={1.5} />
              <span className="display-serif text-base text-text-primary">Khoj</span>
            </div>
            <button
              onClick={() => setCopilotOpen(false)}
              className="text-text-tertiary hover:text-text-primary transition-colors"
            >
              <PanelRightClose className="w-4 h-4" strokeWidth={1.5} />
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
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
