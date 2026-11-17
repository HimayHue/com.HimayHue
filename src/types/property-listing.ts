import type { PropertyType } from "@prisma/client";

export interface ScrapedPropertyListing {
   listingKey: string;
   listingId: string;
   status: string;
   price: number;
   address: {
      full: string;
      street: string;
      city: string;
      state: string;
      postalCode: string;
   };
   specs: {
      bedrooms: number;
      bathrooms: number;
      approxSqFt: number | null;
      yearBuilt: number | null;
   };
   subdivision: string | null;
   coordinates: {
      latitude: number;
      longitude: number;
   };
   detailsUrl: string | null;
   imageUrl?: string | null;
   listAgentId?: string;
   propertyType?: string;
}


export interface ParsedPropertyListing {
   listingKey: string;
   listingId: string;
   status: string;
   price: number;
   address: {
      full: string;
      street: string;
      city: string;
      state: string;
      postalCode: string;
   };
   specs: {
      bedrooms: number;
      bathrooms: number;
      approxSqFt: number | null;
      yearBuilt: number | null;
   };
   subdivision: string | null;
   coordinates: {
      latitude: number;
      longitude: number;
   };
   detailsUrl: string | null;
   imageUrl?: string | null;
   listAgentId?: string;
   propertyType: PropertyType;
}
