"use client";

import { Sidebar } from "./Sidebar";
import { CopilotPanel } from "@/components/copilot/CopilotPanel";
import { useApp } from "@/context/AppContext";
import { PanelRight } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { copilotOpen, setCopilotOpen } = useApp();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Copilot toggle when closed */}
        {!copilotOpen && (
          <button
            onClick={() => setCopilotOpen(true)}
            className="fixed top-4 right-4 z-50 w-9 h-9 rounded-lg border border-border bg-white flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-text-tertiary transition-colors shadow-xs"
          >
            <PanelRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        )}
        {children}
      </main>

      {/* Copilot Panel */}
      <CopilotPanel />
    </div>
  );
}
