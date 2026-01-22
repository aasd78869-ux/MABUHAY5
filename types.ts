
export enum BookingStatus {
  PENDING = 'قيد الانتظار',
  CONFIRMED = 'تم التأكيد',
  CANCELLED = 'ملغي',
  COMPLETED = 'مكتمل'
}

export type Language = 'AR' | 'EN' | 'PH';

export interface DailyActivity {
  day: number;
  activity: string;
  location: string;
  timeSlots: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  localTip?: string;
}

export interface AIItinerary {
  destination: string;
  duration: string;
  hotelStars: number;
  hotelName: string;
  dailyPlan: DailyActivity[];
  totalEstimatedPriceSAR: string;
  priceBreakdown: {
    accommodation: string;
    meals: string;
    transport: string;
    activities: string;
  };
  essentialTips: string[];
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  travelDate: string;
  travelersCount: number;
  specialRequests: string;
  packageType: string;
  status: BookingStatus;
  createdAt: string;
  aiItinerary?: AIItinerary;
  userPreferences?: {
    vibe: string;
    budget: string;
    interests: string[];
  };
}

export interface Attraction {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  images: string[];
  location: Record<Language, string>;
  bestFor: Record<Language, string>;
  category: 'ISLAND' | 'SHOPPING' | 'RESTAURANT' | 'ACTIVITY' | 'MANILA' | 'MARKET';
  halal?: boolean;
  hidden?: boolean;
  duration?: Record<Language, string>;
  level?: Record<Language, string>;
  subCategory?: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  hidden?: boolean;
}

export interface AboutPHContent {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  image: string;
  sections: {
    geography: Record<Language, string>;
    people: Record<Language, string>;
    culture: Record<Language, string>;
    modernity: Record<Language, string>;
    climate: Record<Language, string>;
    cuisine: Record<Language, string>;
    tips: Record<Language, string>;
    bestTime: Record<Language, string>;
  };
  extraImages?: string[];
}

export interface SiteData {
  heroSlides: HeroSlide[];
  islands: Attraction[];
  manilaDistricts: Attraction[];
  shopping: Attraction[];
  restaurants: Attraction[];
  activities: Attraction[];
  translations: Record<string, Record<Language, string>>;
  aboutPH?: AboutPHContent;
}

export type ViewState = 'HOME' | 'BOOKING' | 'ISLANDS' | 'MANILA' | 'SHOPPING' | 'RESTAURANTS' | 'ACTIVITIES' | 'ADMIN_LOGIN' | 'ADMIN_DASHBOARD' | 'VISA_INFO' | 'ABOUT_PH';
