"use client";

import { useEffect, useState } from "react";
import { getBucketList } from "@/actions/bucketList";
import { GoogleMap } from "./GoogleMapComponent";
import { PlacesPanel } from "./PlaceSearchbar";
import { getUsersLocation } from "@/lib/geolocation";


export default function BucketListClient({
   userId,
   initialBucketListPlaces,
}: {
   userId: string;
   initialBucketListPlaces: Partial<google.maps.places.Place>[];
}) {
   const [bucketListPlaces, setBucketListPlaces] = useState(initialBucketListPlaces);
   const [searchResultsPlaces, setSearchResultsPlaces] = useState<Partial<google.maps.places.Place>[]>([]);

   console.log(`Search Results are: ${JSON.stringify(searchResultsPlaces)}`);


   // Get user's current location
   const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
   useEffect(() => {
      getUsersLocation()
         .then((location) => {
            setUserLocation({
               lat: location.coords.latitude,
               lng: location.coords.longitude,
            });
         })
   }, []);

   return (
      <div className="flex flex-grow overflow-hidden h-full">
         <GoogleMap bucketListPlaces={bucketListPlaces} searchResultsPlaces={searchResultsPlaces} userLocation={userLocation ?? undefined} />
         <div className="w-1/3 bg-neutral-950 flex flex-col h-screen items-center p-2">
            <PlacesPanel
               bucketListPlaces={bucketListPlaces}
               searchResultsPlaces={searchResultsPlaces}
               setSearchResultsPlaces={setSearchResultsPlaces}
            />
         </div>
      </div>
   );
}

