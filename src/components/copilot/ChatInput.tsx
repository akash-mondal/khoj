"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoice } from "@/hooks/useVoice";

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  onStop?: () => void;
}

function AudioLevelBars({ level }: { level: number }) {
  const barCount = 4;
  const heights = [0.4, 0.7, 1.0, 0.6];
  return (
    <div className="flex items-center gap-[2px] h-4">
      {heights.map((baseHeight, i) => {
        const h = Math.max(4, baseHeight * level * 16);
        return (
          <motion.div
            key={i}
            className="w-[3px] rounded-full bg-white"
            animate={{ height: h }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

export function ChatInput({ onSend, isLoading, onStop }: ChatInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isRecording, isTranscribing, audioLevel, startRecording, stopRecording } = useVoice({
    onTranscript: (transcript) => {
      setText(transcript);
      // Auto-send after transcription
      if (transcript.trim()) {
        onSend(transcript.trim());
        setText("");
      }
    },
  });

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [text, isLoading, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  return (
    <div className="px-3 pb-3 pt-2">
      <div className="flex items-end gap-2 border border-border rounded-xl bg-white px-3 py-2 focus-within:border-accent/30 transition-colors">
        {/* Voice button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isTranscribing}
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
            isRecording
              ? "bg-alert text-white"
              : "text-text-tertiary hover:text-text-primary hover:bg-hover"
          )}
        >
          {isRecording ? (
            <AudioLevelBars level={audioLevel} />
          ) : (
            <Mic className="w-4 h-4" strokeWidth={1.5} />
          )}
        </button>

        {/* Text input */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={
            isRecording
              ? "Listening..."
              : isTranscribing
                ? "Transcribing..."
                : "Message Khoj..."
          }
          rows={1}
          className="flex-1 resize-none border-0 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none min-h-[32px] py-1"
        />

        {/* Send / Stop button */}
        {isLoading ? (
          <button
            onClick={onStop}
            className="flex-shrink-0 w-8 h-8 rounded-lg bg-text-tertiary text-white flex items-center justify-center hover:bg-text-secondary transition-colors"
          >
            <Square className="w-3.5 h-3.5" fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              text.trim()
                ? "bg-accent text-white"
                : "bg-divider text-text-tertiary"
            )}
          >
            <ArrowUp className="w-4 h-4" strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
}
