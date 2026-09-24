"use server"
import prisma from "@/lib/prisma";
import type { Property } from "@prisma/client";
import {
   actionFailure,
   actionSuccess,
   type ActionResult,
} from "@/lib/action-result";
import {
   propertyFormSchema,
   type PropertyFormOutput,
} from "@/lib/zod/properties";
import { auth } from "@/auth";

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
   Property[],
   PropertyActionError
>;

/**
 * Creates a new Property object with the given input values.
 */
export async function createProperty(
   formData: PropertyFormOutput,
): Promise<CreatePropertyResult> {
   // Gets the currents user ID from the server session
   const session = await auth();
   const userId = session?.user?.id;

   if (!userId) {
      return actionFailure(
         "UNAUTHENTICATED",
         "You must be signed in to create a property.",
      );
   }

   // Validate the form data against the schema
   const result = propertyFormSchema.safeParse(formData);

   if (!result.success) {
      return actionFailure(
         "INVALID_INPUT",
         "The property details are invalid. Please review the form.",
      );
   }

   const property: PropertyFormOutput = result.data;

   try {
      const createdProperty = await prisma.property.create({
         data: {
            ownerId: userId,

            name: property.name,
            description: property.description,
            propertyType: property.propertyType,
            url: property.url,
            coverImage: property.coverImage,

            price: property.price,
            propertyTax: property.propertyTax,
            hoaFees: property.hoaFees,

            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            squareFootage: property.squareFootage,
            lotSize: property.lotSize,
            yearBuilt: property.yearBuilt,

            address: property.address,
            city: property.city,
            state: property.state,
            zipCode: property.zipCode,
            latitude: property.latitude,
            longitude: property.longitude,
         },
      });

      return actionSuccess(
         { propertyId: createdProperty.id },
         "Property created successfully.",
      );
   } catch (error) {
      console.error("Error creating property:", error);
      return actionFailure(
         "DATABASE_ERROR",
         "We couldn't create the property. Please try again.",
      );
   }
}


/**
 * Returns all properties owned by the specified user.
 */
export async function getPropertiesByUserId(
   userId: string,
): Promise<GetPropertiesResult> {
   const session = await auth();
   const authenticatedUserId = session?.user?.id;

   if (!authenticatedUserId) {
      return actionFailure(
         "UNAUTHENTICATED",
         "You must be signed in to view properties.",
      );
   }

   if (!userId || userId !== authenticatedUserId) {
      return actionFailure(
         "UNAUTHORIZED",
         "You are not authorized to view these properties.",
      );
   }

   try {
      const properties = await prisma.property.findMany({
         where: { ownerId: userId },
         orderBy: { createdAt: "desc" },
      });

      return actionSuccess(
         properties,
         properties.length
            ? "Properties loaded successfully."
            : "No properties found.",
      );
   } catch (error) {
      console.error("Error fetching properties:", error);
      return actionFailure(
         "DATABASE_ERROR",
         "We couldn't load your properties. Please try again.",
      );
   }
}


/**
 * Deletes a property by its ID that belongs to the currently authenticated user.
 */
export async function deletePropertyById(
   propertyId: string,
): Promise<ActionResult<null, PropertyActionError>> {
   const session = await auth();
   const userId = session?.user?.id;

   if (!userId) {
      return actionFailure(
         "UNAUTHENTICATED",
         "You must be signed in to delete a property.",
      );
   }

   try {
      await prisma.property.delete({
         where: { id: propertyId, ownerId: userId },
      });

      return actionSuccess(
         null,
         "Property deleted successfully.",
      );
   } catch (error) {
      console.error("Error deleting property:", error);
      return actionFailure(
         "DATABASE_ERROR",
         "We couldn't delete the property. Please try again.",
      );
   }
}