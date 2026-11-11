"use server"
import prisma from "@/lib/prisma";
import type { ScrapedPropertyListing } from "@/types/property-listing";
import {
   actionFailure,
   actionSuccess,
   type ActionResult,
} from "@/lib/action-result";
import { auth } from "@/auth";
import { PropertyListing } from "@prisma/client";

type PropertyActionError =
   | "UNAUTHENTICATED"
   | "UNAUTHORIZED"
   | "INVALID_INPUT"
   | "DATABASE_ERROR";

export type CreatePropertyResult = ActionResult<
   { propertyId: string },
   PropertyActionError
>;

export type GetPropertiesResult = ActionResult<
   PropertyListing[],
   PropertyActionError
>;




/**
 * Returns all properties associated with the specified user by oldest first.
 */
export async function getPropertiesByUserId(
   userId: string,
) {
   const session = await auth();
   const authenticatedUserId = session?.user?.id;

   if (!authenticatedUserId) {
      return {
         success: false,
         data: [],
         message: "You must be signed in to view properties.",
      };
   }

   if (!userId || userId !== authenticatedUserId) {
      return {
         success: false,
         data: [],
         message: "You are not authorized to view these properties.",
      };
   }

   try {
      const properties = await prisma.propertyListing.findMany({
         where: { ownerId: userId },
         orderBy: { createdAt: "asc" },
      });

      return {
         success: true,
         data: properties,
         message: "Properties fetched successfully.",
      }
   } catch (error) {
      console.error("Error fetching properties:", error);
      return {
         success: false,
         data: [],
         message: "We couldn't load your properties. Please try again.",
      }
   }
}


/**
 * Deletes a property by its ID that belongs to the currently authenticated user.
 */
export async function deletePropertyById(
   propertyId: string,
) {
   const session = await auth();
   const userId = session?.user?.id;

   if (!userId) {
      return {
         success: false,
         data: null,
         message: "You must be signed in to delete a property.",
      };
   }

   try {
      await prisma.propertyListing.delete({
         where: { id: propertyId, ownerId: userId },
      });

      return {
         success: true,
         data: null,
         message: "Property deleted successfully.",
      };
   } catch (error) {
      console.error("Error deleting property:", error);
      return {
         success: false,
         data: null,
         message: "We couldn't delete the property. Please try again.",
      };
   }
}


/**
 * Creates a new property listing in the database from a scraped URL's listing data.
 * @param listingData Listing data from the scraped URL
 * @returns 
 */
export async function createPropertyListing(
   listingData: PropertyListing,
) {
   const session = await auth();
   const userId = session?.user?.id;

   if (!userId) {
      return {
         success: false,
         message: "You must be signed in to create a property listing.",
      };
   }

   try {
      // Implementation for creating a property listing
      const newListing = await prisma.propertyListing.create({
         data: {
            ...listingData,
            // ownerId: userId,
         },
      });
      return {
         success: true,
         data: newListing,
         message: "Property listing created successfully.",
      };
   } catch (error) {
      console.error("Error creating property listing:", error);
      return {
         success: false,
         data: null,
         message: "We couldn't create the property listing. Please try again.",
      }
   }
}


/**
 * Checks if a property listing already exists in the database based on its unique listing key.
 * If the property listing exists, it updates the latest price and status if they have changed.
 * If the property listing does not exist, it creates a new entry in the database.
 * @param listings Listing data from the scraped URL
 */
export async function createManyPropertyListings(
   listings: ScrapedPropertyListing[],
) {
   const session = await auth();
   const userId = session?.user?.id;

   if (!userId) {
      return {
         success: false,
         message: "You must be signed in to create property listings.",
      };
   }

   try {
      const results = await Promise.all(
         listings.map(async (listing) => {

            const listingData = {
               listingKey: listing.listingKey,
               listingId: listing.listingId,
               status: listing.status,
               price: listing.price,
               address: listing.address,
               specs: {
                  bedrooms: listing.specs.bedrooms,
                  bathrooms: listing.specs.bathrooms,
                  approxSqFt: listing.specs.approxSqFt ?? 0,
                  yearBuilt: listing.specs.yearBuilt ?? 0,
               },
               coordinates: listing.coordinates,
               subdivision: listing.subdivision,
               detailsUrl: listing.detailsUrl,
               listAgentId: listing.listAgentId,
               propertyClass: listing.propertyClass,
               propertyType: listing.propertyType,
            };

            const existingListing = await prisma.propertyListing.findUnique({
               where: { listingKey: listing.listingKey },
               select: { priceHistory: true },
            });

            if (!existingListing) {
               return prisma.propertyListing.create({
                  data: {
                     ...listingData,
                     ownerId: userId,
                     priceHistory: [{
                        price: listing.price,
                        status: listing.status,
                     }],
                  },
               });
            }

            const latestPriceRecord =
               existingListing.priceHistory[existingListing.priceHistory.length - 1];
            const now = new Date();
            const hasHistoryForToday =
               latestPriceRecord !== undefined &&
               latestPriceRecord.recordedAt.getUTCFullYear() === now.getUTCFullYear() &&
               latestPriceRecord.recordedAt.getUTCMonth() === now.getUTCMonth() &&
               latestPriceRecord.recordedAt.getUTCDate() === now.getUTCDate();

            return prisma.propertyListing.update({
               where: { listingKey: listing.listingKey },
               data: {
                  ...listingData,
                  ...(!hasHistoryForToday && {
                     priceHistory: {
                        push: {
                           price: listing.price,
                           status: listing.status,
                        },
                     },
                  }),
               },
            });
         }),
      );

      return {
         success: true,
         data: { savedCount: results.length },
         message: "Property listings saved successfully.",
      };
   } catch (error) {
      console.error("Error creating property listings:", error);
      return {
         success: false,
         data: null,
         message: "We couldn't create the property listings. Please try again.",
      }
   }
}


/**
 * 
 */
export async function updatePropertyPrice() {

}

/**
 * 
 * @param batch 
 */
export async function syncScrapedPropertyListings(
   batch: ScrapedPropertyListing[],
) {

}