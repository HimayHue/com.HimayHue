// Next.js & Routing
import Link from "next/link"

// React
import { useState } from "react"

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

// Actions
import { addPlaceToBucketList } from "@/app/actions/bucketList"
import { BucketListPlace } from "@/types/bucketListTypes";
import { on } from "events";
import { cn } from "@/lib/utils"

interface Props {
   place: google.maps.places.Place;
   hoveredPlace: String | null;
   setHoveredPlace: React.Dispatch<React.SetStateAction<string | null>>;
   onAdd: (place: google.maps.places.Place) => Promise<boolean>;
}

export function PlaceResultCard({ place, onAdd, hoveredPlace, setHoveredPlace }: Props) {
   const [buttonText, setButtonText] = useState("Add To Bucket List");
   const [disabled, setDisabled] = useState(false);

   return (
      <Card
         onClick={() => {
            if (hoveredPlace !== place.id) setHoveredPlace(place.id);
            else setHoveredPlace(null);
         }}
         className={cn(
            "transition-all duration-200 ease-in-out relative",
            hoveredPlace === place.id ? "bg-neutral-700" : "hover:bg-neutral-700"
         )}      >
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
               onClick={async () => {
                  setButtonText("Adding...");
                  setDisabled(true);
                  const success = await onAdd(place);
                  if (success) setButtonText("Added!");
                  else {
                     setButtonText("Failed. Try again");
                     setDisabled(false);
                     setTimeout(() => setButtonText("Add To Bucket List"), 2000);
                  }
               }}
               disabled={disabled}
               className="mt-3 w-full px-4 py-2"
            >
               {buttonText}
            </Button>

         </CardFooter>

      </Card>
   )
}
