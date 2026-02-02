import { CITY_MAP } from "@/config/constants";
import { getHotelCodesForCity, batchHotelCodes } from "@/lib/tbo/hotel-code-cache";
import {
  searchHotels,
  getHotelDetails,
  getAvailableRooms,
  getCancellationPolicy,
  preBook,
  bookHotel,
  getBookingDetail,
  cancelBooking,
  type TBOHotel,
} from "@/lib/tbo/rest-client";

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export async function executeTool(name: string, args: Record<string, unknown>): Promise<ToolResult> {
  try {
    switch (name) {
      case "search_hotels":
        return await executeSearchHotels(args);
      case "get_hotel_details":
        return await executeGetHotelDetails(args);
      case "get_room_options":
        return await executeGetRoomOptions(args);
      case "check_cancellation_policy":
        return await executeCheckCancellation(args);
      case "prebook_room":
        return await executePrebook(args);
      case "book_hotel":
        return await executeBookHotel(args);
      case "get_booking_status":
        return await executeBookingStatus(args);
      case "cancel_booking":
        return await executeCancelBooking(args);
      case "get_client_preferences":
        return executeGetClientPreferences(args);
      case "add_to_itinerary":
        return executeAddToItinerary(args);
      case "generate_quote":
        return executeGenerateQuote(args);
      case "suggest_activities":
        return executeSuggestActivities(args);
      default:
        return { success: false, error: `Unknown tool: ${name}` };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}

// --- Real TBO API Tools ---

async function executeSearchHotels(args: Record<string, unknown>): Promise<ToolResult> {
  const city = String(args.destination_city || "");
  const checkIn = String(args.check_in_date || "");
  const checkOut = String(args.check_out_date || "");
  const numRooms = Number(args.num_rooms) || 1;
  const adultsPerRoom = Number(args.adults_per_room) || 2;
  const minStars = Number(args.min_star_rating) || 0;
  const maxBudget = Number(args.max_budget_per_night) || 0;
  const nationality = String(args.guest_nationality || "IN");

  // Resolve city to code
  const cityInfo = CITY_MAP[city];
  if (!cityInfo) {
    // Try case-insensitive match
    const match = Object.entries(CITY_MAP).find(
      ([k]) => k.toLowerCase() === city.toLowerCase()
    );
    if (!match) {
      return {
        success: false,
        error: `City "${city}" not found in our database. Available cities: ${Object.keys(CITY_MAP).join(", ")}`,
      };
    }
    return executeSearchHotelsWithCity(match[1].code, checkIn, checkOut, numRooms, adultsPerRoom, minStars, maxBudget, nationality);
  }

  return executeSearchHotelsWithCity(cityInfo.code, checkIn, checkOut, numRooms, adultsPerRoom, minStars, maxBudget, nationality);
}

async function executeSearchHotelsWithCity(
  cityCode: string,
  checkIn: string,
  checkOut: string,
  numRooms: number,
  adultsPerRoom: number,
  minStars: number,
  maxBudget: number,
  nationality: string
): Promise<ToolResult> {
  // Get hotel codes for city
  const allCodes = await getHotelCodesForCity(cityCode);
  if (allCodes.length === 0) {
    return { success: false, error: "No hotel codes found for this city." };
  }

  // Search in batches (start from offset 500, batch size 300, max 3 batches)
  const batches = batchHotelCodes(allCodes, 300, 500, 3);
  const allHotels: TBOHotel[] = [];

  for (const batch of batches) {
    const codesStr = batch.join(",");
    const rooms = Array.from({ length: numRooms }, () => ({
      adults: adultsPerRoom,
      children: 0,
    }));

    const result = await searchHotels({
      hotelCodes: codesStr,
      checkIn,
      checkOut,
      rooms,
      guestNationality: nationality,
      filters: {
        starRating: minStars > 0 ? `${minStars}` : "All",
        orderBy: "PriceAsc",
        ...(maxBudget > 0 ? { maxPrice: maxBudget } : {}),
      },
    });

    if (result.hotels.length > 0) {
      allHotels.push(...result.hotels);
    }

    // Stop early if we have enough results
    if (allHotels.length >= 20) break;
  }

  if (allHotels.length === 0) {
    return { success: false, error: "No hotels found with availability for these dates. Try different dates or a wider search." };
  }

  // Filter by star rating if specified
  let filtered = allHotels;
  if (minStars > 0) {
    filtered = filtered.filter((h) => h.StarRating >= minStars);
  }

  // Return top 15
  const top = filtered.slice(0, 15).map((h) => ({
    hotelCode: h.HotelCode,
    name: h.HotelName,
    stars: h.StarRating,
    image: h.HotelPicture,
    address: h.HotelAddress,
    latitude: h.Latitude,
    longitude: h.Longitude,
    price: {
      currency: h.Currency,
      offeredPrice: h.Price,
      publishedPrice: h.Price,
      tax: 0,
      commission: 0,
    },
    bookingCode: h.HotelBookingCode,
  }));

  return {
    success: true,
    data: {
      totalFound: filtered.length,
      showing: top.length,
      hotels: top,
    },
  };
}

async function executeGetHotelDetails(args: Record<string, unknown>): Promise<ToolResult> {
  const code = String(args.hotel_code || "");
  const result = await getHotelDetails(code);
  if (!result.HotelDetails?.length) {
    return { success: false, error: "Hotel details not found." };
  }
  return { success: true, data: result.HotelDetails[0] };
}

async function executeGetRoomOptions(args: Record<string, unknown>): Promise<ToolResult> {
  const code = String(args.hotel_booking_code || "");
  const result = await getAvailableRooms(code);
  if (!result.Rooms?.length) {
    return { success: false, error: "No rooms available. The session may have expired — try searching again." };
  }

  const rooms = result.Rooms.map((r) => ({
    roomType: r.Name?.[0] || "Standard Room",
    ratePlan: "",
    mealType: r.MealType,
    inclusions: r.Inclusion ? r.Inclusion.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
    isRefundable: r.IsRefundable,
    bookingCode: r.BookingCode,
    price: {
      currency: "USD",
      offeredPrice: r.TotalFare,
      publishedPrice: r.TotalFare,
      roomPrice: r.TotalFare - r.TotalTax,
      tax: r.TotalTax,
      commission: 0,
    },
    cancellationPolicies: r.CancelPolicies,
    imageURLs: r.ImageURLs,
  }));

  return { success: true, data: { rooms } };
}

async function executeCheckCancellation(args: Record<string, unknown>): Promise<ToolResult> {
  const code = String(args.booking_code || "");
  const result = await getCancellationPolicy(code);
  return { success: true, data: result };
}

async function executePrebook(args: Record<string, unknown>): Promise<ToolResult> {
  const code = String(args.booking_code || "");
  const result = await preBook(code);
  return {
    success: result.Status.Code === 200,
    data: {
      isPriceChanged: result.IsPriceChanged,
      isCancellationPolicyChanged: result.IsCancellationPolicyChanged,
      bookingCode: result.BookingCode || code,
      status: result.Status,
    },
    ...(result.Status.Code !== 200 ? { error: result.Status.Description } : {}),
  };
}

async function executeBookHotel(args: Record<string, unknown>): Promise<ToolResult> {
  const code = String(args.booking_code || "");
  const result = await bookHotel({
    bookingCode: code,
    clientRef: String(args.client_reference || `KHOJ-${Date.now()}`),
    guests: [
      {
        title: String(args.guest_title || "Mr"),
        firstName: String(args.guest_first_name || ""),
        lastName: String(args.guest_last_name || ""),
        type: "Adult",
      },
    ],
  });

  if (result.ConfirmationNumber) {
    return {
      success: true,
      data: {
        confirmationNumber: result.ConfirmationNumber,
        bookingStatus: result.BookingStatus,
        hotelName: result.HotelName,
      },
    };
  }

  return { success: false, error: result.Status?.Description || "Booking failed" };
}

async function executeBookingStatus(args: Record<string, unknown>): Promise<ToolResult> {
  const num = String(args.confirmation_number || "");
  const result = await getBookingDetail(num);
  return { success: true, data: result };
}

async function executeCancelBooking(args: Record<string, unknown>): Promise<ToolResult> {
  const num = String(args.confirmation_number || "");
  const result = await cancelBooking(num);
  return { success: true, data: result };
}

// --- Local/Smart Tools ---

function executeGetClientPreferences(args: Record<string, unknown>): ToolResult {
  const name = String(args.client_name || "").toLowerCase();

  // Client profiles stored in context — these will be populated from AppContext
  const clients: Record<string, unknown> = {
    kumar: {
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
    mehra: {
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
    patel: {
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
  };

  const match = Object.entries(clients).find(([key]) => name.includes(key));
  if (match) {
    return { success: true, data: match[1] };
  }

  return { success: false, error: `Client "${args.client_name}" not found. Available clients: Rahul Kumar, Priya Mehra, Vikram Patel` };
}

function executeAddToItinerary(args: Record<string, unknown>): ToolResult {
  // This will interact with the frontend state via the SSE response
  return {
    success: true,
    data: {
      action: "add_itinerary_item",
      item: {
        id: `item-${Date.now()}`,
        tripId: args.trip_id,
        type: args.product_type,
        name: args.product_name,
        date: args.date,
        endDate: args.end_date,
        price: args.price,
        details: args.details,
        status: args.status || "suggested",
      },
    },
  };
}

function executeGenerateQuote(args: Record<string, unknown>): ToolResult {
  const markup = Number(args.markup_percentage) || 15;
  return {
    success: true,
    data: {
      action: "generate_quote",
      tripId: args.trip_id,
      markupPercentage: markup,
      generatedAt: new Date().toISOString(),
    },
  };
}

function executeSuggestActivities(args: Record<string, unknown>): ToolResult {
  const destination = String(args.destination || "");
  // Activity suggestions — the LLM will use its knowledge to suggest
  // We return a structured format for the LLM to fill
  return {
    success: true,
    data: {
      action: "suggest_activities",
      destination,
      dates: args.dates,
      preferences: args.client_preferences,
      budget: args.budget,
      note: "Use your knowledge to suggest relevant activities for this destination. Include name, estimated price, duration, and why it matches the client.",
    },
  };
}
