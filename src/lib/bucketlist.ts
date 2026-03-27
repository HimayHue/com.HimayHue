import prisma from "@/lib/prisma";

/**
 * Adds a place to the specified bucket list in the database.
 * @param bucketListId - The ID of the bucket list to which the place will be added.
 * @param place - The place object containing details about the place to be added.
 * @return A promise that resolves to true if the place was added successfully, or false if there was an error.
 */
export async function handleAddPlaceToBucketList(
   bucketListId: string,
   place: Partial<google.maps.places.Place>,
): Promise<boolean> {
   if (!bucketListId || !place.id) {
      console.error("bucketListId and place.id are required to save a place");
      return false;
   }

   try {
      await prisma.bucketListPlace.create({
         data: {
            bucketListId,
            placeId: place.id,
            displayName: place.displayName || "Unnamed Place",
            address: place.formattedAddress || "No Address",
            latitude: place.location?.lat() || 0,
            longitude: place.location?.lng() || 0,
         },
      });
      return true;
   } catch (error) {
      console.error("Error adding place to bucket list:", error);
      return false;
   }
}