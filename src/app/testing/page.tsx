"use client";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { searchPlacesByText } from '@/lib/api-providers/google/places-service'
import { GooglePlace } from '@/types/google-places';
import { useState } from 'react';
import { set } from 'zod';

function Page() {

   const [placeDetails, setPlaceDetails] = useState<GooglePlace[] | null>(null);

   const [searchText, setSearchText] = useState<string>("");
   const [lat, setLat] = useState<number>(-33.8688); // Default to Tempe AZ latitude
   const [lng, setLng] = useState<number>(-111.9300); // Default to Tempe AZ longitude
   const [radius, setRadius] = useState<number>(5000.0); // Default radius of 5km

   const [isSearching, setIsSearching] = useState<boolean>(false);


   function handleTestButtonClick() {
      setIsSearching(true);

      searchPlacesByText(searchText, lat, lng, radius)
         .then((data) => {
            console.log("Place details fetched successfully:", data);
            setPlaceDetails(data);
            setIsSearching(false);
            setSearchText("");
         })
         .catch((error) => {
            console.error("Error fetching place details:", error);
            setPlaceDetails(null);
            setIsSearching(false);
            setSearchText("");
         });
   }


   return (
      <div className='flex flex-col items-center lg:w-1/2 m-auto'>
         <h1 className="text-2xl font-bold">Testing Page</h1>
         <Input
            placeholder="Enter search text"
            className="mt-4"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
         />
         <Button className="mt-4" onClick={handleTestButtonClick}>
            Test Button
         </Button>
         {isSearching && <p>Searching...</p>}
         <p>{placeDetails ? `Searched for "${searchText}".` : "No data to display."}</p>
         <h1>{placeDetails ? `Place Details for "${searchText}"` : "No Place Details Available"}</h1>
         {placeDetails && (
            <pre className="p-4 rounded">
               {JSON.stringify(placeDetails, null, 2)}
            </pre>
         )}
      </div>
   )
}

export default Page