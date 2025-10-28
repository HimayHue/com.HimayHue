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

export type Place = { key: string, location: google.maps.LatLngLiteral };

export type MapMarkersProps = {
  Places: Place[];
  markerType: 'bucketList' | 'searchResult';
};

export type GoogleMapProps = {
  initialCenter: google.maps.LatLngLiteral;
  initialZoom: number;
  bucketListPlaces?: Place[];
  searchResultsPlaces?: Place[];
  userLocation?: google.maps.LatLngLiteral;
};
