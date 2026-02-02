"use client";

import { AppProvider } from "@/context/AppContext";
import { AppShell } from "@/components/layout/AppShell";
import { MainContent } from "@/components/layout/MainContent";

export default function Home() {
  return (
    <AppProvider>
      <AppShell>
        <MainContent />
      </AppShell>
    </AppProvider>
  );
}
