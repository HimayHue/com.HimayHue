export type MapMarkersProps = {
  Places: Partial<google.maps.places.Place>[];
  markerType: 'bucketList' | 'searchResult';
};

export type GoogleMapProps = {
  bucketListPlaces: Partial<google.maps.places.Place>[];
  searchResultsPlaces?: Partial<google.maps.places.Place>[];
  userLocation?: google.maps.LatLngLiteral;
};
