export interface BucketListPlace {
  /** Unique identifier for the place (from Google Places API) */
  id: string;
  
  /** Human-readable address of the place */
  formattedAddress: string;
  
  /** Display name of the place */
  displayName: string;
  
  /** Geographic coordinates of the place */
  location: {
    lat: number;
    lng: number;
  };
  
  /** ISO date string when the place was added to the bucket list */
  dateAdded: string;
  
  /** ISO date string when the place was marked as visited (null if not visited) */
  dateVisited?: string | null;
  
  /** Google Maps URI for the place (optional) */
  googleMapsURI?: string | null;
  
  /** Website URI for the place (optional) */
  websiteURI?: string | null;
}

export interface BucketListDocument {
  /** User ID who owns this bucket list */
  userId: string;
  
  /** Array of places in the bucket list */
  places: BucketListPlace[];
  
  /** Timestamp when the document was last updated */
  updatedAt?: Date;
}

export const PinColor = {
  Result: '#FDD835',     // Vibrant yellow for search results
  Visited: '#4CAF50',    // Green for visited places
  Unvisited: '#2196F3',  // Blue for unvisited places
  Hovered: '#FF5722',    // Orange for hovered state
} as const;

export type PinColorType = typeof PinColor[keyof typeof PinColor];