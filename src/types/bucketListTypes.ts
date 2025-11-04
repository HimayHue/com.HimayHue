export type MapMarkersProps = {
  Places: google.maps.Place[];
  markerType: 'bucketList' | 'searchResult';
};

export type GoogleMapProps = {
  bucketListPlaces?: google.maps.Place[];
  searchResultsPlaces?: google.maps.Place[];
  userLocation?: google.maps.LatLngLiteral;
};
