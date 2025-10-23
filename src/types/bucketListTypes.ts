export type BucketListPlace = {
  id: string;
  formattedAddress: string;
  displayName: string;
  location: {
    lat: number;
    lng: number;
  };
  dateAdded: string;
  dateVisited?: string;
  googleMapsURI?: string;
  websiteURI?: string;
};
