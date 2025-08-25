// Next.js & Routing
import Link from "next/link"

// Components
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MdCancel } from "react-icons/md";

import { cn } from "@/lib/utils";

// Types
import { BucketListPlace } from "@/types/bucketListTypes"

interface Props {
   place: BucketListPlace;
   hoveredPlace: String | null;
   setHoveredPlace: React.Dispatch<React.SetStateAction<string | null>>;
   onRemove: (placeId: string) => void;
   toggleVisit: (placeId: string, visited: boolean) => Promise<boolean>;
}

//



export function BucketPlaceCard({ place, setHoveredPlace, hoveredPlace, onRemove, toggleVisit }: Props) {
   function RemovePlaceButton({ placeId, onRemove }: { placeId: string; onRemove: (id: string) => void }) {
      return (
         <button
            className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-200 transition-colors duration-200 ease-in-out"
            onClick={() => onRemove(placeId)}
         >
            <MdCancel className="w-5 h-5" />
         </button>
      )
   }

   return (

      <Card
         onClick={() => {
            if (hoveredPlace !== place.id) setHoveredPlace(place.id);
            else setHoveredPlace(null);
         }}
         className={cn(
            "transition-all duration-200 ease-in-out relative",
            hoveredPlace === place.id ? "bg-neutral-700" : "hover:bg-neutral-700"
         )}
      >
         <RemovePlaceButton placeId={place.id} onRemove={onRemove} />
         <CardHeader>
            <CardTitle>{place.displayName}</CardTitle>
         </CardHeader>
         <CardContent>
            <CardDescription>{place.formattedAddress}</CardDescription>
            {place.websiteURI && (
               <CardDescription>
                  <Link
                     href={place.websiteURI}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-blue-500 hover:underline flex items-center gap-1"
                  >
                     Website
                  </Link>
               </CardDescription>
            )}
         </CardContent>
         <CardFooter>
            <Button
               variant={"default"}
               onClick={() => toggleVisit(place.id, place.dateVisited ? false : true)}
               className={cn(
                  "mt-3 w-full px-4 py-2 transition-colors duration-200",
                  place.dateVisited
                     ? "bg-green-600 hover:bg-green-700 text-white"  // Visited
                     : "bg-gray-600 hover:bg-gray-700 text-white"    // Unvisited
               )}

            >

               {place.dateVisited ? "Unmark as Visited" : "Mark as Visited"}
            </Button>
         </CardFooter>
      </Card>
   )
}
