import { TBO_API_URL, TBO_USERNAME, TBO_PASSWORD } from "@/config/constants";

const AUTH_HEADER = "Basic " + Buffer.from(`${TBO_USERNAME}:${TBO_PASSWORD}`).toString("base64");

interface TBORequestOptions {
  endpoint: string;
  body?: Record<string, unknown>;
  method?: "GET" | "POST";
}

export async function tboRequest<T = unknown>({ endpoint, body, method = "POST" }: TBORequestOptions): Promise<T> {
  const url = `${TBO_API_URL}/${endpoint}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: AUTH_HEADER,
    },
    ...(body && method === "POST" ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TBO ${endpoint} failed (${res.status}): ${text.substring(0, 200)}`);
  }

  return res.json() as Promise<T>;
}

// --- Hotel Search ---
// IMPORTANT: Staging API uses CheckIn/CheckOut + PaxRooms with Adults/Children
// NOT CheckInDate/CheckOutDate + RoomGuests with AdultCount/ChildCount

export interface HotelSearchParams {
  hotelCodes: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  rooms: { adults: number; children: number; childAges?: number[] }[];
  guestNationality?: string;
  filters?: {
    starRating?: string;
    minPrice?: number;
    maxPrice?: number;
    orderBy?: string;
  };
  responseTime?: number;
  isDetailedResponse?: boolean;
}

// Raw response types matching the actual TBO staging API
export interface TBOHotelInfo {
  HotelCode: number;
  HotelName: string;
  HotelPicture: string;
  HotelDescription: string;
  Latitude: string;
  Longitude: string;
  HotelAddress: string;
  Rating: string; // "FiveStar", "FourStar", etc.
  TripAdvisorRating?: string;
  TagIds?: string;
}

export interface TBOHotelSearchResult {
  HotelBookingCode: string;
  HotelInfo: TBOHotelInfo;
  MinHotelPrice: {
    TotalPrice: number;
    Currency: string;
    OriginalPrice: number;
  };
  IsPkgProperty: boolean;
  IsPackageRate: boolean;
  MappedHotel: boolean;
  IsHalal: boolean;
}

export interface HotelSearchResponse {
  Status: { Code: number; Description: string };
  HotelSearchResults?: TBOHotelSearchResult[];
}

// Normalized hotel type for internal use
export interface TBOHotel {
  HotelCode: string;
  HotelName: string;
  StarRating: number;
  HotelPicture: string;
  HotelAddress: string;
  Latitude: string;
  Longitude: string;
  HotelDescription?: string;
  Price: number;
  Currency: string;
  HotelBookingCode: string;
  TripAdvisorRating?: string;
}

function ratingToNumber(rating: string): number {
  const map: Record<string, number> = {
    FiveStar: 5, FourStar: 4, ThreeStar: 3, TwoStar: 2, OneStar: 1,
  };
  return map[rating] || 0;
}

function normalizeHotel(result: TBOHotelSearchResult): TBOHotel {
  const info = result.HotelInfo;
  return {
    HotelCode: String(info.HotelCode),
    HotelName: info.HotelName,
    StarRating: ratingToNumber(info.Rating),
    HotelPicture: info.HotelPicture,
    HotelAddress: info.HotelAddress,
    Latitude: info.Latitude,
    Longitude: info.Longitude,
    HotelDescription: info.HotelDescription?.replace(/^HotelDescription#/, ""),
    Price: result.MinHotelPrice.TotalPrice,
    Currency: result.MinHotelPrice.Currency,
    HotelBookingCode: result.HotelBookingCode,
    TripAdvisorRating: info.TripAdvisorRating,
  };
}

export async function searchHotels(params: HotelSearchParams): Promise<{ Status: { Code: number; Description: string }; hotels: TBOHotel[] }> {
  const paxRooms = params.rooms.map((r) => ({
    Adults: r.adults,
    Children: r.children,
    ...(r.childAges?.length ? { ChildAge: r.childAges } : {}),
  }));

  const raw = await tboRequest<HotelSearchResponse>({
    endpoint: "HotelSearch",
    body: {
      CheckIn: params.checkIn,
      CheckOut: params.checkOut,
      HotelCodes: params.hotelCodes,
      GuestNationality: params.guestNationality || "IN",
      NoOfRooms: String(params.rooms.length),
      PaxRooms: paxRooms,
      ResponseTime: params.responseTime || 25,
      IsDetailedResponse: params.isDetailedResponse ?? true,
      Filters: {
        StarRating: params.filters?.starRating || "All",
        OrderBy: params.filters?.orderBy || "PriceAsc",
        ...(params.filters?.minPrice ? { MinPrice: String(params.filters.minPrice) } : {}),
        ...(params.filters?.maxPrice ? { MaxPrice: String(params.filters.maxPrice) } : {}),
      },
    },
  });

  const hotels = (raw.HotelSearchResults || []).map(normalizeHotel);
  return { Status: raw.Status, hotels };
}

// --- Hotel Code List ---

export async function getHotelCodeList(cityCode: string): Promise<string[]> {
  const res = await fetch(
    `${TBO_API_URL}/HotelCodeList?CityCode=${cityCode}&IsDetailedResponse=false`,
    {
      method: "GET",
      headers: { Authorization: AUTH_HEADER },
    }
  );

  if (!res.ok) {
    throw new Error(`HotelCodeList failed (${res.status})`);
  }

  const data = await res.json();

  // API returns { HotelCodes: number[] }
  if (data.HotelCodes && Array.isArray(data.HotelCodes)) {
    return data.HotelCodes.map((code: number | string) => String(code));
  }

  return [];
}

// --- Hotel Details ---

export interface HotelDetailsResponse {
  HotelDetails?: Array<{
    HotelCode: string;
    HotelName: string;
    StarRating: number;
    HotelURL: string;
    Description: string;
    Attractions: { Key: string; Value: string }[];
    HotelFacilities: string[];
    Address: string;
    PinCode: string;
    CityName: string;
    CountryName: string;
    PhoneNumber: string;
    Map: string;
    Latitude: string;
    Longitude: string;
    Images: string[];
  }>;
}

export async function getHotelDetails(hotelCodes: string): Promise<HotelDetailsResponse> {
  return tboRequest<HotelDetailsResponse>({
    endpoint: "HotelDetails",
    body: { HotelCodes: hotelCodes },
  });
}

// --- Available Rooms ---
// Staging API returns flat Rooms[] array, not nested RoomResult[][]

export interface TBORoomResult {
  Name: string[];
  BookingCode: string;
  Inclusion: string;
  TotalFare: number;
  TotalTax: number;
  RoomPromotion: string[];
  CancelPolicies: Array<{
    FromDate: string;
    ChargeType: string;
    CancellationCharge: number;
  }>;
  MealType: string;
  IsRefundable: boolean;
  WithTransfers: boolean;
  ImageURLs?: string[];
}

export interface AvailableRoomsResponse {
  Status: { Code: number; Description: string };
  Rooms?: TBORoomResult[];
}

export async function getAvailableRooms(hotelBookingCode: string): Promise<AvailableRoomsResponse> {
  return tboRequest<AvailableRoomsResponse>({
    endpoint: "AvailableHotelRooms",
    body: { HotelBookingCode: hotelBookingCode },
  });
}

// --- PreBook ---

export interface PreBookResponse {
  Status: { Code: number; Description: string };
  IsPriceChanged?: boolean;
  IsCancellationPolicyChanged?: boolean;
  BookingCode?: string;
}

export async function preBook(bookingCode: string): Promise<PreBookResponse> {
  return tboRequest<PreBookResponse>({
    endpoint: "PreBook",
    body: { BookingCode: bookingCode, PaymentMode: "Limit" },
  });
}

// --- Book ---

export interface BookParams {
  bookingCode: string;
  clientRef: string;
  guests: {
    title: string;
    firstName: string;
    lastName: string;
    type: "Adult" | "Child";
    age?: number;
  }[];
}

export interface BookResponse {
  Status: { Code: number; Description: string };
  ConfirmationNumber?: string;
  BookingStatus?: string;
  HotelName?: string;
}

export async function bookHotel(params: BookParams): Promise<BookResponse> {
  return tboRequest<BookResponse>({
    endpoint: "HotelBook",
    body: {
      BookingCode: params.bookingCode,
      ClientReferenceId: params.clientRef,
      CustomerDetails: [
        {
          CustomerNames: [
            {
              Title: params.guests[0].title,
              FirstName: params.guests[0].firstName,
              LastName: params.guests[0].lastName,
              Type: params.guests[0].type,
            },
          ],
        },
      ],
      PaymentMode: "Limit",
    },
  });
}

// --- Booking Detail ---

export async function getBookingDetail(confirmationNumber: string) {
  return tboRequest({
    endpoint: "BookingDetail",
    body: { ConfirmationNumber: confirmationNumber },
  });
}

// --- Cancel ---

export async function cancelBooking(confirmationNumber: string) {
  return tboRequest({
    endpoint: "Cancel",
    body: { ConfirmationNumber: confirmationNumber },
  });
}

// --- Cancellation Policy ---

export async function getCancellationPolicy(bookingCode: string) {
  return tboRequest({
    endpoint: "HotelCancellationPolicy",
    body: { BookingCode: bookingCode },
  });
}

// --- Country List ---

export async function getCountryList() {
  return tboRequest({ endpoint: "CountryList", method: "GET" });
}

// --- City List ---

export async function getCityList(countryCode: string) {
  return tboRequest({
    endpoint: "CityList",
    body: { CountryCode: countryCode },
  });
}
