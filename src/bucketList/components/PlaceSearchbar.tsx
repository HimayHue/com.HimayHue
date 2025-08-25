'use client';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BiSearch } from "react-icons/bi";
import { MdOutlineClear } from "react-icons/md";


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
         <form onSubmit={form.handleSubmit(onSubmit)} className="border border-grey-300 w-full px-2 py-1">
            <div className="flex items-center w-full">
               <FormField
                  control={form.control}
                  name="searchInput"
                  render={({ field }) => (
                     <FormItem className="w-full">
                        <FormControl>
                           <input
                              placeholder="Search Google Maps"
                              {...field}
                              onChange={(event) => field.onChange(event)}
                              className="w-full bg-transparent border-none ml-2 placeholder:text-muted-foreground text-sm font-medium leading-tight focus:outline-none focus:ring-0 focus:border-none"
                           />
                        </FormControl>
                     </FormItem>
                  )}
               />
               <Button type="submit" variant="ghost">
                  <BiSearch />
               </Button>
               <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                     form.setValue("searchInput", "");
                     UpdatePlacesResults([]);
                  }}
               >
                  <MdOutlineClear />
               </Button>
            </div>
         </form>
      </Form>
   )
}
