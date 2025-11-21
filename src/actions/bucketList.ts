'use server';

import { auth } from "@/auth";

export async function addPlaceToBucketList(place: Partial<google.maps.places.Place>): Promise<boolean> {
   const session = await auth();
   const userId = session?.user?.id;
   if (!userId) throw new Error('User not authenticated');

   console.log('Adding place to bucket list for user:', userId, 'Place:', place);

   try {
      console.log(`Place ${place.id} added to bucket list for user ${userId}`);
      return true;
   }
   catch (error) {
      throw new Error("Failed to add place to bucket list: " + error);
      return false;
   }
}

export async function getBucketList(userId: string): Promise<Partial<google.maps.places.Place>[]> {

   try {
      console.log(`Fetched bucket list for user ${userId}`);
      return [];
   }
   catch (error) {
      throw new Error("Failed to fetch bucket list: " + error);
   }

}

/* * Removes a place from the user's bucket list.
   * @param placeId - The ID of the place to remove.
   * @param userId - The ID of the user whose bucket list is being modified.
   * @throws Will throw an error if the user is not authenticated.
   */
export async function removePlaceFromBucketList(placeId: string): Promise<boolean> {
   const session = await auth();
   const userId = session?.user?.id;
   if (!userId) throw new Error('User not authenticated');

   try {
      console.log(`Place ${placeId} removed from bucket list for user ${userId}`);
      return true;
   }
   catch (error) {
      throw new Error("Failed to remove place from bucket list: " + error);
   }


}

export async function markPlaceAsVisited(placeId: string): Promise<boolean> {
   const session = await auth();
   const userId = session?.user?.id;
   if (!userId) throw new Error("User not authenticated");

   try {
      console.log(`Marked place ${placeId} as visited for user ${userId}`);
      return true;
   }
   catch (error) {
      throw new Error("Failed to mark place as visited: " + error);
   }
}

export async function unmarkPlaceAsVisited(placeId: string): Promise<boolean> {
   const session = await auth();
   const userId = session?.user?.id;
   if (!userId) throw new Error("User not authenticated");

   try {
      console.log(`Marked place ${placeId} as unvisited for user ${userId}`);
      return true;
   }
   catch (error) {
      throw new Error("Failed to mark place as visited: " + error);
   }
}