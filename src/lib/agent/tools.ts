import type { ToolDefinition } from "@/lib/groq/llm-client";

export const agentTools: ToolDefinition[] = [
  {
    type: "function",
    function: {
      name: "search_hotels",
      description:
        "Search for available hotels in a city using the TBO hotel API. Returns a list of hotels with prices, star ratings, images, and locations. Always use this when the user asks to find hotels, accommodation, or places to stay. You must provide the destination city name and check-in/check-out dates.",
      parameters: {
        type: "object",
        properties: {
          destination_city: {
            type: "string",
            description: "City name, e.g. 'Dubai', 'London', 'Bali'",
          },
          check_in_date: {
            type: "string",
            description: "Check-in date in YYYY-MM-DD format",
          },
          check_out_date: {
            type: "string",
            description: "Check-out date in YYYY-MM-DD format",
          },
          num_rooms: {
            type: "number",
            description: "Number of rooms needed. Defaults to 1.",
          },
          adults_per_room: {
            type: "number",
            description: "Number of adults per room. Defaults to 2.",
          },
          min_star_rating: {
            type: "number",
            description: "Minimum star rating filter (1-5). Optional.",
          },
          max_budget_per_night: {
            type: "number",
            description: "Maximum budget per night in USD. Optional.",
          },
          guest_nationality: {
            type: "string",
            description: "Two-letter country code for guest nationality. Defaults to 'IN'.",
          },
        },
        required: ["destination_city", "check_in_date", "check_out_date"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_hotel_details",
      description:
        "Get detailed information about a specific hotel including full description, all amenities, facilities, nearby attractions, and high-resolution images. Use this when the user wants to know more about a particular hotel from the search results.",
      parameters: {
        type: "object",
        properties: {
          hotel_code: {
            type: "string",
            description: "The TBO hotel code from search results.",
          },
        },
        required: ["hotel_code"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_room_options",
      description:
        "Get available room types and pricing for a specific hotel. Returns room categories, meal plans, cancellation policies, and detailed pricing. Use this when the user wants to see room options or is ready to select a room to book.",
      parameters: {
        type: "object",
        properties: {
          hotel_booking_code: {
            type: "string",
            description: "The HotelBookingCode from hotel search results.",
          },
        },
        required: ["hotel_booking_code"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_cancellation_policy",
      description:
        "Check the cancellation policy for a specific room booking. Returns dates, charges, and whether free cancellation is available. Use this when the user asks about cancellation terms before booking.",
      parameters: {
        type: "object",
        properties: {
          booking_code: {
            type: "string",
            description: "The BookingCode from room options.",
          },
        },
        required: ["booking_code"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "prebook_room",
      description:
        "Confirm the current price and availability of a room before final booking. This is a required step before booking — it locks in the price and checks for any changes. Use this when the user has selected a room and wants to proceed toward booking.",
      parameters: {
        type: "object",
        properties: {
          booking_code: {
            type: "string",
            description: "The BookingCode from room options.",
          },
        },
        required: ["booking_code"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "book_hotel",
      description:
        "Complete the hotel booking with guest details. This creates a confirmed reservation and returns a confirmation number. Only use this after prebook_room has been called successfully and the user has explicitly confirmed they want to book.",
      parameters: {
        type: "object",
        properties: {
          booking_code: {
            type: "string",
            description: "The BookingCode from prebook response.",
          },
          guest_title: {
            type: "string",
            description: "Guest title: Mr, Mrs, Ms, etc.",
          },
          guest_first_name: {
            type: "string",
            description: "Guest first name.",
          },
          guest_last_name: {
            type: "string",
            description: "Guest last name.",
          },
          client_reference: {
            type: "string",
            description: "Agent's internal reference ID for this booking.",
          },
        },
        required: ["booking_code", "guest_title", "guest_first_name", "guest_last_name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_booking_status",
      description:
        "Check the status of an existing booking using its confirmation number. Returns booking details, status, hotel info, and dates. Use this when the user wants to check on a booking.",
      parameters: {
        type: "object",
        properties: {
          confirmation_number: {
            type: "string",
            description: "The booking confirmation number.",
          },
        },
        required: ["confirmation_number"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "cancel_booking",
      description:
        "Cancel an existing hotel booking. This is irreversible. Only use when the user explicitly requests cancellation and confirms they want to proceed.",
      parameters: {
        type: "object",
        properties: {
          confirmation_number: {
            type: "string",
            description: "The booking confirmation number to cancel.",
          },
        },
        required: ["confirmation_number"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_client_preferences",
      description:
        "Retrieve a client's travel preferences, booking history, and profile information. Use this to personalize hotel recommendations and understand the client's needs before searching. Always call this when a client name is mentioned.",
      parameters: {
        type: "object",
        properties: {
          client_name: {
            type: "string",
            description: "The client's name to look up.",
          },
        },
        required: ["client_name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_to_itinerary",
      description:
        "Add a travel product (hotel, flight, transfer, activity) to the current trip itinerary. Use this when the user confirms they want to add something to the trip plan.",
      parameters: {
        type: "object",
        properties: {
          trip_id: {
            type: "string",
            description: "The trip ID to add to.",
          },
          product_type: {
            type: "string",
            enum: ["hotel", "flight", "transfer", "activity"],
            description: "Type of travel product.",
          },
          product_name: {
            type: "string",
            description: "Name of the product (hotel name, flight route, etc.).",
          },
          date: {
            type: "string",
            description: "Date for this item in YYYY-MM-DD format.",
          },
          end_date: {
            type: "string",
            description: "End date if applicable (e.g. hotel checkout).",
          },
          price: {
            type: "number",
            description: "Price in USD.",
          },
          details: {
            type: "string",
            description: "Additional details about the product.",
          },
          status: {
            type: "string",
            enum: ["confirmed", "pending", "suggested"],
            description: "Status of this itinerary item.",
          },
        },
        required: ["trip_id", "product_type", "product_name", "date"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generate_quote",
      description:
        "Generate a formatted price quote/proposal for a trip. Compiles all itinerary items into a professional quote with pricing, markup, and terms. Use this when the agent wants to send a quote to the client.",
      parameters: {
        type: "object",
        properties: {
          trip_id: {
            type: "string",
            description: "The trip ID to generate a quote for.",
          },
          markup_percentage: {
            type: "number",
            description: "Agent markup percentage. Defaults to 15.",
          },
        },
        required: ["trip_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "suggest_activities",
      description:
        "Get activity and experience suggestions for a destination. Returns curated suggestions based on the destination, travel dates, and client preferences. Use this to help build complete itineraries beyond just hotels.",
      parameters: {
        type: "object",
        properties: {
          destination: {
            type: "string",
            description: "City or destination name.",
          },
          dates: {
            type: "string",
            description: "Travel date range, e.g. 'March 15-20, 2026'.",
          },
          client_preferences: {
            type: "string",
            description: "Client preference notes to match activities to.",
          },
          budget: {
            type: "number",
            description: "Budget for activities in USD.",
          },
        },
        required: ["destination"],
      },
    },
  },
];
