'use server';

import { BucketListPlace } from "@/types/bucketListTypes";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function addPlaceToBucketList(place: BucketListPlace): Promise<BucketListPlace> {
   const session = await auth();
   const userId = session?.user?.id;
   if (!userId) throw new Error('User not authenticated');

   console.log('Adding place to bucket list for user:', userId, 'Place:', place);

   try {
      // First, try to find an existing bucket list for the user
      const existingBucketList = await prisma.bucketList.findUnique({
         where: { userId },
      });

      if (existingBucketList) {
         // Check if the place already exists
         const placeExists = existingBucketList.places.some(p => p.id === place.id);
         if (placeExists) {
            return place; // Place already exists, return without adding
         }

         // Update existing bucket list with new place
         await prisma.bucketList.update({
            where: { userId },
            data: {
               places: {
                  push: place,
               },
            },
         });
      } else {
         // Create new bucket list with the place
         await prisma.bucketList.create({
            data: {
               userId,
               places: [place],
            },
         });
      }

      return place;
   }
   catch (error) {
      throw new Error("Failed to add place to bucket list: " + error);
   }
}

export async function getBucketList(userId: string): Promise<BucketListPlace[]> {
   console.log('Fetching bucket list for user:', userId);
   
   try {
      const bucketList = await prisma.bucketList.findUnique({
         where: { userId },
      });

      return bucketList?.places || [];
   } catch (error) {
      console.error('Error fetching bucket list:', error);
      return [];
   }
}

/* * Removes a place from the user's bucket list.
   * @param placeId - The ID of the place to remove.
   * @param userId - The ID of the user whose bucket list is being modified.
   * @throws Will throw an error if the user is not authenticated.
   */
export async function removePlaceFromBucketList(placeId: string, userId: string) {
   if (!userId) throw new Error("User not authenticated");

   try {
      const bucketList = await prisma.bucketList.findUnique({
         where: { userId },
      });

      if (!bucketList) {
         throw new Error("Bucket list not found");
      }

      // Filter out the place to remove
      const updatedPlaces = bucketList.places.filter(place => place.id !== placeId);

      await prisma.bucketList.update({
         where: { userId },
         data: {
            places: updatedPlaces,
         },
      });
   } catch (error) {
      console.error('Error removing place from bucket list:', error);
      throw error;
   }
}

export async function markPlaceAsVisited(placeId: string, userId: string) {
   if (!userId) throw new Error("User not authenticated");

   try {
      const bucketList = await prisma.bucketList.findUnique({
         where: { userId },
      });

      if (!bucketList) {
         throw new Error("Bucket list not found");
      }

      // Update the specific place's dateVisited
      const updatedPlaces = bucketList.places.map(place => {
         if (place.id === placeId) {
            return { ...place, dateVisited: new Date().toISOString() };
         }
         return place;
      });

      await prisma.bucketList.update({
         where: { userId },
         data: {
            places: updatedPlaces,
         },
      });

      console.log(`Marked place ${placeId} as visited for user ${userId}`);
   } catch (error) {
      console.error('Error marking place as visited:', error);
      throw error;
   }
}

export async function unmarkPlaceAsVisited(placeId: string, userId: string) {
   if (!userId) throw new Error("User not authenticated");

   try {
      const bucketList = await prisma.bucketList.findUnique({
         where: { userId },
      });

      if (!bucketList) {
         throw new Error("Bucket list not found");
      }

      // Update the specific place to remove dateVisited
      const updatedPlaces = bucketList.places.map(place => {
         if (place.id === placeId) {
            return { ...place, dateVisited: null };
         }
         return place;
      });

      await prisma.bucketList.update({
         where: { userId },
         data: {
            places: updatedPlaces,
         },
      });

      console.log(`Unmarked place ${placeId} as visited for user ${userId}`);
   } catch (error) {
      console.error('Error unmarking place as visited:', error);
      throw error;
   }
}