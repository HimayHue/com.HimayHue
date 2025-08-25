'use client'
// React
import { useState, useEffect } from 'react'

// Next.js & Routing
import { useSession } from 'next-auth/react'
import type { Metadata } from "next";


// Components
import GoogleMap from './components/GoogleMap'
import PlacesSearchbar from './components/PlaceSearchbar'
import { PlaceResultCard } from './components/PlaceResultCard'
import { BucketPlaceCard } from './components/BucketPlaceCard'

// UI
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Actions
import { getBucketList, removePlaceFromBucketList, addPlaceToBucketList, markPlaceAsVisited, unmarkPlaceAsVisited } from '../actions/bucketList'

// Types
import { BucketListPlace } from '@/types/bucketListTypes'


// export const metadata: Metadata = {
//   title: "Bucket List - Create and Share Bucket Lists!",
//   description: "Create your ultimate bucket list using Google Maps. Save dream destinations, organize your trips, and easily share them with friends.",
//   openGraph: {
//     title: "Bucket List - Create and Share Bucket Lists!",
//     description: "Plan, save, and share your dream destinations using our interactive bucket list app powered by Google Maps.",
//     url: "https://himayhue.com/bucketlist",
//     siteName: "Himay's Developer Projects",
//     images: [
//       {
//         url: "/bucketlist-og-image.png",
//         width: 1200,
//         height: 630,
//         alt: "Bucket List OpenGraph Preview",
//       },
//     ],
//     locale: "en_US",
//     type: "website",
//   },
//   themeColor: "#dc2626",
// };



export default function BucketList() {
  const [placesResults, setPlacesResults] = useState<google.maps.places.Place[]>([]);
  const [bucketListPlaces, setBucketListPlaces] = useState<BucketListPlace[]>([]);
  const [hoveredPlace, setHoveredPlace] = useState<string | null>(null); // Can be a Map Marker or a Place Card

  const { data: session } = useSession();
  const userId = session?.user?.id;


  useEffect(() => {
    if (!userId) return;

    const fetchBucketList = async () => {
      try {
        const data = await getBucketList(userId);
        setBucketListPlaces(data);
      }
      catch (error) {
        console.error('Error fetching bucket list:', error);
      }
    };

    fetchBucketList();
  }, [userId]);

  useEffect(() => {
    console.log("Hovered place:", hoveredPlace);
  }, [hoveredPlace]);


  /** Handles removing a place from the bucket list.
    @param placeId - The ID of the place to remove.
    @returns {Promise<void>} - A promise that resolves when the place is removed.
    @throws Will log an error if the removal fails.
   * */
  async function handleRemovePlaceToBucketList(placeId: string): Promise<void> {
    if (!userId) return;
    const prev = bucketListPlaces;
    try {
      setBucketListPlaces((prev) => prev.filter(place => place.id !== placeId));
      await removePlaceFromBucketList(placeId, userId);
    }
    catch (err) {
      console.error("Error removing place:", err);
      setBucketListPlaces(prev); // Revert state on failure
      // Optionally show toast or alert
    }
  }



  /** Handles adding a place to the bucket list.
    @param place - The place to add, as a google.maps.places.Place object.
    @returns {Promise<boolean>} - A promise that resolves to true if the place was added successfully, false otherwise.
    @throws Will log an error if the addition fails.
   * */
  async function handleAddPlaceToBucketList(place: google.maps.places.Place): Promise<boolean> {
    if (!userId) return false;

    // Check if the place is already in the bucket list
    const isAlreadyAdded = bucketListPlaces.some((p) => p.id === place.id);
    if (isAlreadyAdded) return false;


    try {
      let formattedPlace: BucketListPlace = {
        id: place.id,
        formattedAddress: place.formattedAddress as string,
        displayName: place.displayName as string,
        location: {
          lat: place.location!.lat(),
          lng: place.location!.lng(),
        },
        dateAdded: new Date().toISOString(),
        dateVisited: undefined,
        googleMapsURI: place.googleMapsURI || undefined,
        websiteURI: place.websiteURI || undefined,
      };
      await addPlaceToBucketList(formattedPlace);

      setBucketListPlaces((prev) => [...prev, formattedPlace]);

      // Remove the place from the search results
      setPlacesResults((prev) => prev.filter(p => p.id !== place.id));

      return true; // Indicate success
    }
    catch (err) {
      console.error("Error adding place to bucket list:", err);
      return false; // Indicate failure
    }
  }

  /** Handles toggling the visited state of a place in the bucket list.
    @param placeId - The ID of the place to toggle.
    @param visited - The new visited state (true for visited, false for unvisited).
    @returns {Promise<boolean>} - A promise that resolves to true if the state was toggled successfully, false otherwise.
    @throws Will log an error if the toggle fails.
   * */
  async function handleToggleVisited(placeId: string, visited: boolean): Promise<boolean> {
    if (!userId) return false;
    try {
      if (visited) {
        await markPlaceAsVisited(placeId, userId);
      }
      else {
        await unmarkPlaceAsVisited(placeId, userId);
      }

      setBucketListPlaces(prev =>
        prev.map(place =>
          place.id === placeId
            ? { ...place, dateVisited: visited ? new Date().toISOString() : undefined }
            : place
        )
      );

      return true;
    }
    catch (err) {
      console.error("Error toggling visited state:", err);
      return false;
    }
  }

  /** Handles the results from the Places Searchbar.
    @param results - An array of google.maps.places.Place objects.
    @returns {void}
   * */
  function handleSearchbarResults(results: google.maps.places.Place[]) {
    // filter out places that are already in the bucket list
    const filteredPlaceResults = results.filter(place => !bucketListPlaces.some(bucketPlace => bucketPlace.id === place.id));
    setPlacesResults(filteredPlaceResults);
  }



  return (
    <div className="flex flex-grow overflow-hidden h-full">
      {/* Map Section */}
      <GoogleMap searchResultPlaces={placesResults} bucketListPlaces={bucketListPlaces} hoveredPlace={hoveredPlace} setHoveredPlace={setHoveredPlace} />

      {/* Sidebar */}
      <div className="w-1/3 bg-neutral-950 flex flex-col h-screen">
        <Tabs defaultValue="bucket-list" className="w-full h-full flex flex-col p-0">
          <TabsList className="w-full p-0">
            <TabsTrigger value="bucket-list" className="w-1/2 rounded-none h-full">
              Bucket List
            </TabsTrigger>
            <TabsTrigger value="search" className="w-1/2 rounded-none h-full">
              Search
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent
              value="bucket-list"
              className="data-[state=inactive]:hidden h-full"
              forceMount
            >
              <ScrollArea className="h-full w-full">
                {bucketListPlaces.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">
                    Your bucket list is empty.
                  </p>
                ) : (
                  bucketListPlaces.map((place) => (
                    <BucketPlaceCard
                      key={place.id}
                      place={place}
                      hoveredPlace={hoveredPlace}
                      setHoveredPlace={setHoveredPlace}
                      onRemove={handleRemovePlaceToBucketList}
                      toggleVisit={handleToggleVisited}
                    />
                  ))
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent
              value="search"
              className="data-[state=inactive]:hidden h-full"
              forceMount
            >
              <PlacesSearchbar UpdatePlacesResults={handleSearchbarResults} />
              <ScrollArea className="w-full flex-1 border-bg-white">
                {placesResults.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No results found</p>
                ) : (
                  placesResults.map((place) => (
                    <PlaceResultCard
                      key={place.id}
                      place={place}
                      hoveredPlace={hoveredPlace}
                      setHoveredPlace={setHoveredPlace}
                      onAdd={handleAddPlaceToBucketList}
                    />
                  ))
                )}
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>

    </div>
  );
}

/*
TODOS:
- Display total number of places in the bucket list
- Add a button to clear the bucket list
- Fix the website button being too wide
- Add tags
- Improve Places Card UI
- Combine PlaceResultCard and BucketPlaceCard into a single component with conditional rendering for buttons
- Add a loading state when fetching bucket list or adding/removing places
- Add error handling and user feedback (toasts or alerts) for actions like adding/removing places
- Implement pagination or infinite scroll for search results if there are many places
- Add a filter to show only visited or unvisited places in the bucket list
- Add a way to sort places in the bucket list (e.g., by date added, name, etc.)
- Allow users to edit place details in the bucket list (e.g., change name, address, etc.)
- Add a way to share the bucket list with friends or on social media
- Add a way to export the bucket list to a file (e.g., JSON, CSV)
- Allow collaborative editing of the bucket list with friends
- Add a way to categorize places in the bucket list (e.g., by type, location, etc.)
- Allow dropping pins on the map to add custom locations to the bucket listw
*/
