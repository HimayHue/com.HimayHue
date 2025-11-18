
export const sampleBucketList: google.maps.places.Place[] = [
  {
    id: 'operaHouse',
    displayName: 'Sydney Opera House',
    formattedAddress: 'Bennelong Point, Sydney NSW 2000, Australia',
    location: new google.maps.LatLng(-33.8567844, 151.2152967),
    isOpen: false,

  },
  {
    id: 'tarongaZoo',
    displayName: 'Taronga Zoo',
    formattedAddress: 'Bradleys Head Rd, Mosman NSW 2088, Australia',
    location: { lat: () => -33.8472767, lng: () => 151.2188164 },
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'manlyBeach',
    displayName: 'Manly Beach',
    formattedAddress: 'Manly, NSW 2095, Australia',
    location: { lat: () => -33.8209738, lng: () => 151.2563253 },
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'hyderPark',
    displayName: 'Hyde Park',
    formattedAddress: 'Elizabeth St, Sydney NSW 2000, Australia',
    location: { lat: () => -33.8690081, lng: () => 151.2052393 },
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'theRocks',
    displayName: 'The Rocks',
    formattedAddress: 'The Rocks, Sydney NSW 2000, Australia',
    location: { lat: () => -33.8587568, lng: () => 151.2058246 },
    dateAdded: new Date().toISOString(),
  },
];
