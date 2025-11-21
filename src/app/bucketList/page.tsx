'use client'
// React
import { useState, useEffect } from 'react'

// Next.js & Routing
import { useSession } from 'next-auth/react'

// Components
import { PlacesPanel } from './components/PlaceSearchbar'

// Types
import { GoogleMap } from './components/GoogleMapComponent'

import { getBucketList } from '@/actions/bucketList';
import { SignInButton } from '@/components/signin-buttons'


export default function BucketListPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [bucketListPlaces, setBucketListPlaces] = useState<google.maps.places.Place[]>([]);
  const [searchResultsPlaces, setSearchResultsPlaces] = useState<google.maps.Place[]>([]);

  useEffect(() => {
    if (userId) {
      getBucketList(userId)
        .then((places) => {
          setBucketListPlaces(places);
        })
        .catch((error) => {
          console.error("Error fetching bucket list places:", error);
        });
    }
  }, [userId]);


  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">Please log in to view your bucket list.</p>
        <SignInButton />
      </div>
    );
  }

  return (
    <div className="flex flex-grow overflow-hidden h-full">
      <GoogleMap bucketListPlaces={bucketListPlaces} />

      <div className="w-1/3 bg-neutral-950 flex flex-col h-screen items-center p-2">
        <PlacesPanel bucketListPlaces={bucketListPlaces} />
      </div>
    </div >
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
