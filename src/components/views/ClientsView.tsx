"use client";

import { useState } from "react";
import { useApp, type ClientProfile } from "@/context/AppContext";
import { motion } from "framer-motion";
import { cn, formatCurrency } from "@/lib/utils";
import { ChevronRight, Star, Droplets, Utensils, CreditCard, MapPin } from "lucide-react";

const clients: ClientProfile[] = [
  {
    name: "Rahul Kumar",
    type: "VIP",
    trips: 14,
    lifetimeValue: 42000,
    preferences: {
      hotelStars: 5,
      poolRequired: true,
      dietaryRestrictions: "Vegetarian",
      loyaltyPrograms: ["Marriott Bonvoy"],
      seatPreference: "Window",
      budgetTier: "Mid-High",
      preferredBrands: ["Marriott", "Hyatt", "Taj"],
    },
    recentDestinations: ["Dubai", "Bali", "Goa"],
    typicalSpend: 3500,
    travelMonths: ["March", "October"],
    passportExpiry: "2027-08-15",
  },
  {
    name: "Priya Mehra",
    type: "Regular",
    trips: 6,
    lifetimeValue: 18000,
    preferences: {
      hotelStars: 4,
      poolRequired: false,
      dietaryRestrictions: "None",
      loyaltyPrograms: [],
      seatPreference: "Aisle",
      budgetTier: "Mid",
      preferredBrands: ["Holiday Inn", "Novotel"],
    },
    recentDestinations: ["Bali", "Phuket", "Maldives"],
    typicalSpend: 2500,
    travelMonths: ["April", "December"],
    passportExpiry: "2028-03-10",
  },
  {
    name: "Vikram Patel",
    type: "Group",
    trips: 3,
    lifetimeValue: 12000,
    preferences: {
      hotelStars: 4,
      poolRequired: true,
      dietaryRestrictions: "None",
      loyaltyPrograms: ["IHG"],
      seatPreference: "Any",
      budgetTier: "Budget-Mid",
      preferredBrands: ["Holiday Inn", "Ibis"],
    },
    recentDestinations: ["London", "Dubai"],
    typicalSpend: 2000,
    travelMonths: ["May", "November"],
    passportExpiry: "2029-01-20",
  },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function ClientsView() {
  const { setActiveClient, activeClient } = useApp();
  const [selected, setSelected] = useState<ClientProfile | null>(activeClient);

  if (selected) {
    return <ClientDetail client={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      <h1 className="display-serif text-2xl text-text-primary mb-6">Clients</h1>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {clients.map((client) => (
          <motion.div
            key={client.name}
            variants={fadeUp}
            whileHover={{ y: -1 }}
            onClick={() => {
              setSelected(client);
              setActiveClient(client);
            }}
            className="border border-border rounded-lg p-4 bg-white cursor-pointer hover:border-text-tertiary/50 transition-colors flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-text-primary">
              {client.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-text-primary">{client.name}</p>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-text-secondary">
                  {client.type}
                </span>
              </div>
              <p className="text-xs text-text-tertiary mt-0.5">
                {client.trips} trips &middot; {formatCurrency(client.lifetimeValue)} lifetime value
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-text-tertiary" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function ClientDetail({
  client,
  onBack,
}: {
  client: ClientProfile;
  onBack: () => void;
}) {
  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      <button
        onClick={onBack}
        className="text-xs text-text-tertiary hover:text-text-primary mb-4 flex items-center gap-1"
      >
        &larr; All Clients
      </button>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="display-serif text-3xl text-text-primary">{client.name}</h1>
          <p className="text-sm text-text-secondary mt-1">
            {client.type} Client &middot; {client.trips} trips
          </p>
        </div>
        <div className="text-right">
          <p className="label-caps mb-1">Lifetime Value</p>
          <p className="display-serif text-2xl text-text-primary">
            {formatCurrency(client.lifetimeValue)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="label-caps mb-3">Preferences (AI-derived)</p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm text-text-primary">
              <Star className="w-3.5 h-3.5 text-text-tertiary" strokeWidth={1.5} />
              {client.preferences.hotelStars}-star hotels
            </div>
            {client.preferences.poolRequired && (
              <div className="flex items-center gap-2 text-sm text-text-primary">
                <Droplets className="w-3.5 h-3.5 text-text-tertiary" strokeWidth={1.5} />
                Pool required
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-text-primary">
              <Utensils className="w-3.5 h-3.5 text-text-tertiary" strokeWidth={1.5} />
              {client.preferences.dietaryRestrictions || "No restrictions"}
            </div>
            {client.preferences.loyaltyPrograms.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-text-primary">
                <CreditCard className="w-3.5 h-3.5 text-text-tertiary" strokeWidth={1.5} />
                {client.preferences.loyaltyPrograms.join(", ")}
              </div>
            )}
            <div className="mt-3">
              <p className="text-xs text-text-tertiary mb-1.5">Preferred brands</p>
              <div className="flex flex-wrap gap-1.5">
                {client.preferences.preferredBrands.map((brand) => (
                  <span
                    key={brand}
                    className="text-xs px-2 py-0.5 rounded-full border border-border text-text-secondary"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Booking Patterns */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="label-caps mb-3">Booking Patterns</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Avg trip spend</span>
              <span className="font-data text-text-primary">
                {formatCurrency(client.typicalSpend)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Travel months</span>
              <span className="text-text-primary">{client.travelMonths.join(", ")}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Budget tier</span>
              <span className="text-text-primary">{client.preferences.budgetTier}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Passport expires</span>
              <span className="font-data text-text-primary">{client.passportExpiry}</span>
            </div>
            <div className="mt-3">
              <p className="text-xs text-text-tertiary mb-1.5">Recent destinations</p>
              <div className="flex flex-wrap gap-1.5">
                {client.recentDestinations.map((dest) => (
                  <span
                    key={dest}
                    className="text-xs px-2 py-0.5 rounded-full border border-border text-text-secondary flex items-center gap-1"
                  >
                    <MapPin className="w-2.5 h-2.5" strokeWidth={1.5} />
                    {dest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
