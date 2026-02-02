"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

// --- Types ---

export interface ClientProfile {
  name: string;
  type: string;
  trips: number;
  lifetimeValue: number;
  preferences: {
    hotelStars: number;
    poolRequired: boolean;
    dietaryRestrictions: string;
    loyaltyPrograms: string[];
    seatPreference: string;
    budgetTier: string;
    preferredBrands: string[];
  };
  recentDestinations: string[];
  typicalSpend: number;
  travelMonths: string[];
  passportExpiry: string;
}

export interface ItineraryItem {
  id: string;
  tripId: string;
  type: "hotel" | "flight" | "transfer" | "activity";
  name: string;
  date: string;
  endDate?: string;
  price?: number;
  details?: string;
  status: "confirmed" | "pending" | "suggested";
  bookingCode?: string;
  confirmationNumber?: string;
  latitude?: string;
  longitude?: string;
}

export interface Trip {
  id: string;
  clientName: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  status: "planning" | "quoted" | "booked" | "completed";
  items: ItineraryItem[];
}

export interface Booking {
  id: string;
  clientName: string;
  type: "hotel" | "flight" | "transfer" | "activity";
  productName: string;
  confirmationNumber?: string;
  status: "confirmed" | "pending" | "cancelled" | "quote";
  checkIn?: string;
  checkOut?: string;
  price: number;
  currency: string;
}

export interface Alert {
  id: string;
  type: "price_drop" | "schedule_change" | "deadline" | "follow_up" | "reconfirm";
  title: string;
  description: string;
  tripId?: string;
  clientName?: string;
  time: string;
  isRead: boolean;
}

type View = "dashboard" | "trips" | "clients" | "bookings" | "alerts";

interface AppState {
  // Navigation
  activeView: View;
  setActiveView: (view: View) => void;

  // Active context
  activeClient: ClientProfile | null;
  setActiveClient: (client: ClientProfile | null) => void;
  activeTrip: Trip | null;
  setActiveTrip: (trip: Trip | null) => void;

  // Data
  trips: Trip[];
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;

  // Copilot
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  queuedMessage: string | null;
  setQueuedMessage: (msg: string | null) => void;

  // Actions
  addItineraryItem: (item: ItineraryItem) => void;
  addBooking: (booking: Booking) => void;
  dismissAlert: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

// --- Initial Demo Data ---

const initialTrips: Trip[] = [
  {
    id: "trip-1",
    clientName: "Rahul Kumar",
    destination: "Dubai",
    startDate: "2026-03-15",
    endDate: "2026-03-20",
    budget: 5000,
    spent: 3200,
    status: "booked",
    items: [
      {
        id: "item-1",
        tripId: "trip-1",
        type: "flight",
        name: "DEL → DXB (IndiGo 6E-123)",
        date: "2026-03-15",
        price: 420,
        status: "confirmed",
        details: "14:30 departure",
      },
      {
        id: "item-2",
        tripId: "trip-1",
        type: "transfer",
        name: "Airport → Hotel Transfer",
        date: "2026-03-15",
        price: 35,
        status: "pending",
      },
      {
        id: "item-3",
        tripId: "trip-1",
        type: "hotel",
        name: "Marriott Resort & Spa",
        date: "2026-03-15",
        endDate: "2026-03-18",
        price: 540,
        status: "confirmed",
        details: "5-star, Pool, Beach access",
      },
    ],
  },
  {
    id: "trip-2",
    clientName: "Priya Mehra",
    destination: "Bali",
    startDate: "2026-04-02",
    endDate: "2026-04-08",
    budget: 4000,
    spent: 0,
    status: "quoted",
    items: [],
  },
  {
    id: "trip-3",
    clientName: "Vikram Patel",
    destination: "London",
    startDate: "2026-05-10",
    endDate: "2026-05-15",
    budget: 6000,
    spent: 0,
    status: "planning",
    items: [],
  },
];

const initialBookings: Booking[] = [
  {
    id: "bk-1",
    clientName: "Rahul Kumar",
    type: "hotel",
    productName: "Marriott Resort & Spa, Dubai",
    confirmationNumber: "MRT-2026-0315",
    status: "confirmed",
    checkIn: "2026-03-15",
    checkOut: "2026-03-18",
    price: 540,
    currency: "USD",
  },
  {
    id: "bk-2",
    clientName: "Rahul Kumar",
    type: "flight",
    productName: "DEL → DXB (IndiGo 6E-123)",
    confirmationNumber: "6E-ABC123",
    status: "confirmed",
    checkIn: "2026-03-15",
    price: 420,
    currency: "USD",
  },
  {
    id: "bk-3",
    clientName: "Priya Mehra",
    type: "hotel",
    productName: "Villa Ubud, Bali",
    status: "quote",
    checkIn: "2026-04-02",
    checkOut: "2026-04-05",
    price: 380,
    currency: "USD",
  },
];

const initialAlerts: Alert[] = [
  {
    id: "alert-1",
    type: "price_drop",
    title: "Price dropped on Marriott Dubai",
    description: "$23/night lower than when booked",
    clientName: "Rahul Kumar",
    tripId: "trip-1",
    time: "2h ago",
    isRead: false,
  },
  {
    id: "alert-2",
    type: "schedule_change",
    title: "Kumar flight DEL→DXB rescheduled",
    description: "Departure moved +1 hour to 15:30",
    clientName: "Rahul Kumar",
    tripId: "trip-1",
    time: "5h ago",
    isRead: false,
  },
  {
    id: "alert-3",
    type: "follow_up",
    title: "Mehra quote unanswered",
    description: "Bali trip quote sent 3 days ago — no response",
    clientName: "Priya Mehra",
    tripId: "trip-2",
    time: "3d ago",
    isRead: false,
  },
  {
    id: "alert-4",
    type: "reconfirm",
    title: "Re-confirm Kumar hotel",
    description: "Check-in in 13 days — reconfirmation recommended",
    clientName: "Rahul Kumar",
    tripId: "trip-1",
    time: "Today",
    isRead: false,
  },
  {
    id: "alert-5",
    type: "deadline",
    title: "Patel passport renewal",
    description: "Vikram Patel passport expires Jan 2029 — sufficient for London trip",
    clientName: "Vikram Patel",
    time: "1d ago",
    isRead: true,
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [activeClient, setActiveClient] = useState<ClientProfile | null>(null);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [queuedMessage, setQueuedMessage] = useState<string | null>(null);

  const addItineraryItem = useCallback((item: ItineraryItem) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === item.tripId ? { ...t, items: [...t.items, item] } : t
      )
    );
  }, []);

  const addBooking = useCallback((booking: Booking) => {
    setBookings((prev) => [...prev, booking]);
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        activeClient,
        setActiveClient,
        activeTrip,
        setActiveTrip,
        trips,
        setTrips,
        bookings,
        setBookings,
        alerts,
        setAlerts,
        copilotOpen,
        setCopilotOpen,
        queuedMessage,
        setQueuedMessage,
        addItineraryItem,
        addBooking,
        dismissAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
