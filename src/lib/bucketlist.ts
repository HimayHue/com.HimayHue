import { addPlaceToBucketList } from "@/actions/bucketList"

export function handleAddPlaceToBucketList(place: Partial<google.maps.places.Place>): Promise<boolean> {
   // Turn the JSON place into a plain object 
   const placeObject = {
      id: place.id,
      displayName: place.displayName,
      formattedAddress: place.formattedAddress,
      location: place.location,
      websiteURI: place.websiteURI,
      primaryTypeDisplayName: place.primaryTypeDisplayName,

   }

   // Save place to database
   return addPlaceToBucketList(placeObject);

}