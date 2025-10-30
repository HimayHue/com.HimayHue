'use client';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BiSearch } from "react-icons/bi";
import { MdOutlineClear } from "react-icons/md";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Place } from '@/types/bucketListTypes';
import {
   Card,
   CardAction,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"

interface PlacesSearchbarProps {
   UpdatePlacesResults: (places: google.maps.places.Place[]) => void;
}


/**
 * MapsSearchForm Component
 * Takes in a search query and updates the Places parent state with the search results.
 *
 */
export default function PlacesSearchbar({ UpdatePlacesResults }: PlacesSearchbarProps) {

   // Validation schema using Zod
   const FormSchema = z.object({
      searchInput: z
         .string()
         .min(1, { message: "Search must be at least 1 characters." }),
   });

   // Initialize form state and validation
   const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: { searchInput: "" },
   });



   async function findGooglePlaces(placeSearchText: string) {
      const { Place } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;

      const request = {
         textQuery: placeSearchText,
         fields: ['formattedAddress', 'displayName', 'location', 'websiteURI', 'primaryTypeDisplayName',],
         language: 'en-US',
         maxResultCount: 15,
         region: 'us',
         useStrictTypeFiltering: false,
      };

      const { places } = await Place.searchByText(request);
      UpdatePlacesResults(places);

   }

   /**
    * Handles form submission.
    * Updates the shared search query state and resets the input field.
    */
   function onSubmit(data: z.infer<typeof FormSchema>) {
      findGooglePlaces(data.searchInput);
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="relative w-full">
               <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
               <Input
                  placeholder="Search Google Maps"
                  {...form.register("searchInput")}
                  className="w-full bg-transparent pl-10 pr-10" // Padding for icons
               />
               {form.watch("searchInput") && (
                  <Button
                     type="button"
                     variant="ghost"
                     size="icon"
                     className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                     onClick={() => {
                        form.setValue("searchInput", "");
                        UpdatePlacesResults([]);
                     }}
                  >
                     <MdOutlineClear className="h-5 w-5" />
                  </Button>
               )}
            </div>
         </form>
      </Form>
   );
}

export function PlacesPanel({ bucketListPlaces }: { bucketListPlaces: Place[] }) {
   return (
      <Tabs defaultValue="list" className="w-full">
         <TabsList className="w-full">
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
         </TabsList>

         <TabsContent value="list" className="space-y-2">
            <div className="h-9 flex items-center justify-between px-3 border-b border-neutral-800">
               <h3 className="font-semibold text-white">Bucket List</h3>
               <span className="text-sm text-muted-foreground">
                  {bucketListPlaces.length} {bucketListPlaces.length === 1 ? 'Place' : 'Places'}
               </span>
            </div>
            <PlacesList places={bucketListPlaces} />
         </TabsContent>


         <TabsContent value="search">
            <div className="mb-2">
               <PlacesSearchbar UpdatePlacesResults={() => { }} />
            </div>
            <PlacesList places={bucketListPlaces} />
         </TabsContent>

      </Tabs>
   );
}

export function PlacesList({ places }: { places: Place[] }) {
   return (
      <div className="flex-col flex flex-grow w-full overflow-y-auto gap-2">
         {places.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">Your bucket list is empty. Start adding places!</p>
         ) : (
            places.map((place) => (
               <Card key={place.key} className="">
                  <CardHeader className="">{place.key}</CardHeader>
               </Card>
            ))
         )}
      </div>
   );
}

