export interface LocalizedText {
   text: string;
   languageCode: string;
}

export interface LatLng {
   latitude: number;
   longitude: number;
}

export interface Viewport {
   low: LatLng;
   high: LatLng;
}

export interface Photo {
   name: string;
   widthPx: number;
   heightPx: number;
   authorAttributions: AuthorAttribution[];
}

export interface AuthorAttribution {
   displayName: string;
   uri: string;
   photoUri: string;
}

export interface GooglePlace {
   id: string;
   name: string; // Resource name: "places/PLACE_ID"
   displayName: LocalizedText;
   formattedAddress: string;
   shortFormattedAddress?: string;
   types?: string[];
   primaryType?: string;
   primaryTypeDisplayName?: LocalizedText;

   // Location Data
   location?: LatLng;
   viewport?: Viewport;
   googleMapsUri?: string;
   websiteUri?: string;

   // Contact & Business Info
   nationalPhoneNumber?: string;
   internationalPhoneNumber?: string;
   businessStatus?: "BUSINESS_STATUS_UNSPECIFIED" | "OPERATIONAL" | "CLOSED_TEMPORARILY" | "CLOSED_PERMANENTLY" | "FUTURE_OPENING";
   priceLevel?: "PRICE_LEVEL_UNSPECIFIED" | "PRICE_LEVEL_FREE" | "PRICE_LEVEL_INEXPENSIVE" | "PRICE_LEVEL_MODERATE" | "PRICE_LEVEL_EXPENSIVE" | "PRICE_LEVEL_VERY_EXPENSIVE";

   // Ratings
   rating?: number;
   userRatingCount?: number;

   // Amenities (Great for Gym features!)
   restroom?: boolean;
   allowsDogs?: boolean;
   goodForGroups?: boolean;
   accessibilityOptions?: {
      wheelchairAccessibleParking?: boolean;
      wheelchairAccessibleEntrance?: boolean;
      wheelchairAccessibleRestroom?: boolean;
      wheelchairAccessibleSeating?: boolean;
   };

   // Media
   photos?: Photo[];
}
