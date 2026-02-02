"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  hotelName: string;
  roomType: string;
  price: number;
  currency?: string;
  bookingCode: string;
}

type BookingState = "form" | "loading" | "success" | "error";

export function BookingModal({
  open,
  onClose,
  hotelName,
  roomType,
  price,
  currency = "USD",
  bookingCode,
}: BookingModalProps) {
  const [state, setState] = useState<BookingState>("form");
  const [title, setTitle] = useState("Mr");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [error, setError] = useState("");

  const handleBook = async () => {
    if (!firstName.trim() || !lastName.trim()) return;

    setState("loading");
    setError("");

    try {
      // Step 1: PreBook
      const prebookRes = await fetch("/api/tbo/prebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingCode }),
      });
      const prebookData = await prebookRes.json();

      if (!prebookRes.ok || prebookData.Status?.Code !== 200) {
        throw new Error(prebookData.Status?.Description || prebookData.error || "PreBook failed");
      }

      // Step 2: Book
      const bookRes = await fetch("/api/tbo/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingCode: prebookData.BookingCode || bookingCode,
          guestTitle: title,
          guestFirstName: firstName,
          guestLastName: lastName,
          clientRef: `KHOJ-${Date.now()}`,
        }),
      });
      const bookData = await bookRes.json();

      if (bookData.ConfirmationNumber) {
        setConfirmationNumber(bookData.ConfirmationNumber);
        setState("success");
      } else {
        throw new Error(bookData.Status?.Description || bookData.error || "Booking failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
      setState("error");
    }
  };

  const handleClose = () => {
    setState("form");
    setFirstName("");
    setLastName("");
    setConfirmationNumber("");
    setError("");
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] bg-white rounded-xl border border-border shadow-lg z-50 p-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <Dialog.Title className="text-base font-medium text-text-primary">
              {state === "success" ? "Booking Confirmed" : "Confirm Booking"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-text-tertiary hover:text-text-primary">
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </Dialog.Close>
          </div>

          <AnimatePresence mode="wait">
            {/* Form State */}
            {(state === "form" || state === "error") && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-5"
              >
                {/* Hotel summary */}
                <div className="mb-5 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-text-primary">{hotelName}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{roomType}</p>
                  <p className="font-data text-sm text-text-primary mt-1">
                    {formatCurrency(price, currency)}
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-alert-bg text-alert text-xs rounded-lg">
                    {error}
                  </div>
                )}

                {/* Guest details */}
                <div className="space-y-3">
                  <div>
                    <label className="label-caps block mb-1.5">Title</label>
                    <select
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm text-text-primary bg-white focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Ms">Ms</option>
                      <option value="Dr">Dr</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-caps block mb-1.5">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="label-caps block mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                <button
                  onClick={handleBook}
                  disabled={!firstName.trim() || !lastName.trim()}
                  className="w-full mt-5 bg-accent text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-40 hover:bg-accent/90 transition-colors"
                >
                  Confirm Booking
                </button>
              </motion.div>
            )}

            {/* Loading State */}
            {state === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-10 flex flex-col items-center"
              >
                <Loader2 className="w-8 h-8 animate-spin text-text-tertiary mb-3" />
                <p className="text-sm text-text-secondary">Processing booking...</p>
              </motion.div>
            )}

            {/* Success State */}
            {state === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-confirmed-bg flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-confirmed" strokeWidth={2} />
                </div>
                <p className="text-base font-medium text-text-primary mb-1">
                  Booking Confirmed
                </p>
                <p className="text-sm text-text-secondary mb-3">{hotelName}</p>
                <div className="bg-muted rounded-lg px-4 py-2 mb-5">
                  <p className="label-caps mb-0.5">Confirmation Number</p>
                  <p className="font-data text-lg text-text-primary">{confirmationNumber}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
