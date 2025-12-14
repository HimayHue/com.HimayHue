"use client";

import { useEffect, useState } from "react";
import { getBucketList } from "@/actions/bucketList";
import { GoogleMap } from "./GoogleMapComponent";
import { PlacesPanel } from "./PlaceSearchbar";
import { getBrowserLocation } from "@/lib/geolocation";

type LatLng = { lat: number; lng: number };


export default function BucketListClient({
   userId,
   initialBucketListPlaces,
}: {
   userId: string;
   initialBucketListPlaces: Partial<google.maps.places.Place>[];
}) {
   const [bucketListPlaces, setBucketListPlaces] = useState(initialBucketListPlaces);
   const [searchResultsPlaces, setSearchResultsPlaces] = useState<Partial<google.maps.places.Place>[]>([]);

   // optional: re-fetch after mount if you want freshest data
   useEffect(() => {
      getBucketList(userId).then(setBucketListPlaces).catch(console.error);
   }, [userId]);

   // Get user's current location
   const [userLoc, setUserLoc] = useState<LatLng | null>(null);
   const [locError, setLocError] = useState<string | null>(null);
   useEffect(() => {
      getBrowserLocation()
         .then((pos) => {
            setUserLoc({
               lat: pos.coords.latitude,
               lng: pos.coords.longitude,
            });
         })
         .catch((err) => setLocError(err.message));
   }, []);

   return (
      <div className="flex flex-grow overflow-hidden h-full">
         <GoogleMap bucketListPlaces={bucketListPlaces} />
         <div className="w-1/3 bg-neutral-950 flex flex-col h-screen items-center p-2">
            <PlacesPanel bucketListPlaces={searchResultsPlaces} />
         </div>
      </div>
   );
}

