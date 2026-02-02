export const TBO_API_URL = process.env.TBO_API_URL || 'http://api.tbotechnology.in/TBOHolidays_HotelAPI';
export const TBO_USERNAME = process.env.TBO_USERNAME || '';
export const TBO_PASSWORD = process.env.TBO_PASSWORD || '';

export const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
export const GROQ_MODEL = 'openai/gpt-oss-120b';
export const GROQ_WHISPER_MODEL = 'whisper-large-v3-turbo';
export const GROQ_TTS_MODEL = 'canopylabs/orpheus-v1-english';
export const GROQ_TTS_VOICE = 'tara';

export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// TBO session TTL in ms (45 seconds — sessions expire at ~60s)
export const TBO_SESSION_TTL = 45_000;

// Top destination city codes (pre-mapped from TBO CityList)
export const CITY_MAP: Record<string, { code: string; country: string; countryCode: string }> = {
  'Dubai': { code: '115936', country: 'United Arab Emirates', countryCode: 'AE' },
  'Abu Dhabi': { code: '115935', country: 'United Arab Emirates', countryCode: 'AE' },
  'London': { code: '127402', country: 'United Kingdom', countryCode: 'GB' },
  'Paris': { code: '101014', country: 'France', countryCode: 'FR' },
  'New York': { code: '132185', country: 'United States', countryCode: 'US' },
  'Bangkok': { code: '126745', country: 'Thailand', countryCode: 'TH' },
  'Singapore': { code: '121635', country: 'Singapore', countryCode: 'SG' },
  'New Delhi': { code: '130443', country: 'India', countryCode: 'IN' },
  'Mumbai': { code: '130065', country: 'India', countryCode: 'IN' },
  'Goa': { code: '129164', country: 'India', countryCode: 'IN' },
  'Bali': { code: '109286', country: 'Indonesia', countryCode: 'ID' },
  'Tokyo': { code: '112667', country: 'Japan', countryCode: 'JP' },
  'Maldives': { code: '119380', country: 'Maldives', countryCode: 'MV' },
  'Istanbul': { code: '127400', country: 'Turkey', countryCode: 'TR' },
  'Rome': { code: '112283', country: 'Italy', countryCode: 'IT' },
  'Barcelona': { code: '123791', country: 'Spain', countryCode: 'ES' },
  'Sydney': { code: '100498', country: 'Australia', countryCode: 'AU' },
  'Kuala Lumpur': { code: '119075', country: 'Malaysia', countryCode: 'MY' },
  'Phuket': { code: '126767', country: 'Thailand', countryCode: 'TH' },
  'Cairo': { code: '100917', country: 'Egypt', countryCode: 'EG' },
};
