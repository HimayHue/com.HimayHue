// 'use client'
import { useState, useEffect, useRef } from 'react'
import { Loader } from "@googlemaps/js-api-loader";

// Types
import { PinColor } from '@/types/bucketListTypes';
import { BucketListPlace } from '@/types/bucketListTypes';

interface GoogleMapProps {
   searchResultPlaces: google.maps.places.Place[];
   bucketListPlaces: BucketListPlace[];
   hoveredPlace: string | null;
   setHoveredPlace: React.Dispatch<React.SetStateAction<string | null>>;
}

interface MarkerWithPlaceId extends google.maps.marker.AdvancedMarkerElement {
   placeId?: string;
   color?: PinColor; // Optional color property for custom pin colors
}


export default function GoogleMap({ searchResultPlaces, bucketListPlaces, hoveredPlace, setHoveredPlace }: GoogleMapProps) {
   const mapElement = useRef<HTMLDivElement>(null); // Reference to the map div element
   const mapInstanceRef = useRef<google.maps.Map | null>(null); // Google Map instance
   const allMarkersMap = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());

   const [lastHoveredPlace, setLastHoveredPlace] = useState<string | null>(null);

   const searchResultPlacesMarkers = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
   const bucketListPlacesMarkers = useRef<MarkerWithPlaceId[]>([]);

   const [locationCircle, setLocationCircle] = useState<google.maps.Circle | null>(null);
   const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);

   const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 }; // Center of USA
   const MAP_OPTIONS: google.maps.MapOptions = {
      center: DEFAULT_CENTER,
      mapTypeId: "terrain",
      zoom: 15,
      mapId: "a1079c9cea2794a7",
   };

   // Cleanup markers on unmount
   useEffect(() => {
      return () => {
         searchResultPlacesMarkers.current.forEach(marker => {
            allMarkersMap.current.delete(marker.title ?? "");
            marker.map = null;
         });
         searchResultPlacesMarkers.current = [];

         bucketListPlacesMarkers.current.forEach(marker => {
            if (marker.placeId) allMarkersMap.current.delete(marker.placeId);
            marker.map = null;
         });
         bucketListPlacesMarkers.current = [];

      };
   }, []);

   useEffect(() => {
      (async () => {
         await initMap();

         try {
            const coords = await getCurrentLocation();
            if (coords) mapInstanceRef.current?.setCenter(coords);
         }
         catch {
            console.warn("User denied location or something went wrong.");
         }
      })();
   }, []);


   // Update Search Result Places Pins when places change
   useEffect(() => {
      if (mapInstanceRef.current) displaySearchResultsPlaces(searchResultPlaces);
   }, [searchResultPlaces]);


   // Update Bucket List Places Pins when places change
   useEffect(() => {
      if (!mapInstanceRef.current) return;
      displayBucketListPlaces(bucketListPlaces);
   }, [bucketListPlaces]);

   // Update Hovered Place Pin
   useEffect(() => {
      if (!mapInstanceRef.current) return;

      // Reset previous hover pin
      if (lastHoveredPlace && lastHoveredPlace !== hoveredPlace) {
         const prevMarker = allMarkersMap.current.get(lastHoveredPlace);

         if (prevMarker) {
            prevMarker.content = new google.maps.marker.PinElement({
               scale: 1.0,
               background: (prevMarker as MarkerWithPlaceId).color,
               borderColor: (prevMarker as MarkerWithPlaceId).color,
               glyphColor: '#fff',
            }).element;
         }
      }

      // Highlight new hovered marker
      if (hoveredPlace) {
         const marker = allMarkersMap.current.get(hoveredPlace);
         if (marker) {
            marker.content = new google.maps.marker.PinElement({
               scale: 1.2,
               background: PinColor.Hovered,
               borderColor: PinColor.Hovered,
               glyphColor: '#fff',
            }).element;
            marker.map?.panTo(marker.position!);
         }
      }

      setLastHoveredPlace(hoveredPlace ?? null);
   }, [hoveredPlace]);


   async function getCurrentLocation(): Promise<google.maps.LatLngLiteral | null> {
      if (!navigator.geolocation) {
         console.error("Geolocation is not supported by this browser.");
         return null;
      }

      return new Promise((resolve, reject) => {
         navigator.geolocation.getCurrentPosition(
            (position) => {
               const coords = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
               };
               setCurrentLocation(coords);
               resolve(coords); // ✅ return location directly
            },
            (error) => {
               console.error("Error getting location:", error);
               reject(null);
            }
         );
      });
   }


   async function initMap(): Promise<void> {
      if (!mapElement.current) return;

      const loader = new Loader({
         apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
         version: 'weekly',
      });

      try {
         const { Map } = await loader.importLibrary('maps');
         mapInstanceRef.current = new Map(mapElement.current, MAP_OPTIONS);
      }
      catch (e) {
         console.error('Error loading Google Maps:', e);
      }
   }

   async function displaySearchResultsPlaces(places: google.maps.places.Place[]) {
      // Clear previous markers
      searchResultPlacesMarkers.current.forEach(marker => marker.map = null);
      searchResultPlacesMarkers.current = [];

      if (!places.length) return;

      const bounds = new google.maps.LatLngBounds();
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

      // Create a new marker for each place
      places.forEach(place => {
         if (place.location) bounds.extend(place.location as google.maps.LatLng);

         // Create Pin
         const searchResultPin = new PinElement({
            scale: 1.0,
            background: PinColor.Result,  // Vibrant yellow for optimism and attention
            borderColor: PinColor.Result,  // Slightly darker yellow border
            glyphColor: '#fff',  // Black icon for better contrast
         });

         // Add marker to map
         const marker: MarkerWithPlaceId = new AdvancedMarkerElement({
            position: place.location || { lat: 0, lng: 0 },
            map: mapInstanceRef.current,
            title: place.displayName || "Result",
            content: searchResultPin.element,
            gmpClickable: true,
         });


         marker.placeId = place.id; // Allows us to identify the marker by place ID when clicked
         marker.color = PinColor.Result; // Allows resetting the color later when unhovered

         marker.addListener('click', () => {
            // If the marker is already hovered, unhover it
            if (hoveredPlace === place.id) {
               setHoveredPlace(null);
            }
            else {
               setHoveredPlace(place.id);
            }
         });
         searchResultPlacesMarkers.current.push(marker);

         // Register marker in global map for hover functionality
         allMarkersMap.current.set(place.id, marker);

      });

      mapInstanceRef.current?.fitBounds(bounds);
      if (mapInstanceRef.current?.getZoom()! > 18) mapInstanceRef.current?.setZoom(18);

   }

   async function displayBucketListPlaces(places: BucketListPlace[]) {
      // Clear previous markers
      bucketListPlacesMarkers.current.forEach(marker => marker.map = null);
      bucketListPlacesMarkers.current = [];

      if (!places.length) return;

      const bounds = new google.maps.LatLngBounds();
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

      const infoWindow = new google.maps.InfoWindow();
      let lastOpenedMarker: google.maps.marker.AdvancedMarkerElement | null = null;


      // Create a new marker for each place
      places.forEach(place => {
         if (place.location) bounds.extend(place.location);

         // Create Pin
         const bucketListPin = new PinElement({
            scale: 1.0,
            background: place.dateVisited ? PinColor.Visited : PinColor.Unvisited,
            borderColor: place.dateVisited ? PinColor.Visited : PinColor.Unvisited,
            glyphColor: '#fff',
         });

         // Add marker to map
         const marker: MarkerWithPlaceId = new AdvancedMarkerElement({
            position: place.location,
            map: mapInstanceRef.current,
            title: place.displayName,
            content: bucketListPin.element,
            gmpClickable: true,
         });

         // Set placeId to marker
         marker.placeId = place.id;
         marker.color = place.dateVisited ? PinColor.Visited : PinColor.Unvisited; // Set color based on visited status


         marker.addListener('click', () => {
            const isSameMarker = lastOpenedMarker === marker;

            if (isSameMarker) {
               infoWindow.close();
               lastOpenedMarker = null;
               setHoveredPlace(null);
            }
            else {
               /*
               infoWindow will display the title text in white color, so we need to create a custom header element
               to set the color and style of the title text.
               Since infoWindow displays the content in a div, we can set the header content using setHeaderContent method.
               */
               const header = document.createElement("div");
               header.innerText = marker.title;
               header.style.color = "black"; // or any other styling
               header.style.fontWeight = "bold";
               header.style.fontSize = "14px";


               infoWindow.setHeaderContent(header);
               infoWindow.open(marker.map, marker);
               lastOpenedMarker = marker;
               setHoveredPlace(place.id);
            }
         });

         bucketListPlacesMarkers.current.push(marker);

         // Register marker in global map for hover functionality
         allMarkersMap.current.set(place.id, marker);
      });

   }

   return (
      <div ref={mapElement} className="w-full">
      </div>
   )
}