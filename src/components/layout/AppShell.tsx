"use client";

import { Sidebar } from "./Sidebar";
import { CopilotPanel } from "@/components/copilot/CopilotPanel";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {children}
      </main>

      {/* Floating Copilot Widget — positions itself */}
      <CopilotPanel />
    </div>
  );
}
