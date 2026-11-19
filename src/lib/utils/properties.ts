import { ScrapedPropertyListing } from "@/types/property-listing";
import { PropertyListing, PropertyType } from "@prisma/client";

/**
 * Normalizes the scraped property type value to a valid PropertyType enum value defined in the Prisma schema.
 * If the provided type is not valid, it defaults to PropertyType.OTHER.
 * @param type The property type to normalize.
 * @returns A valid PropertyType enum value.
 */
export function normalizePropertyType(type: PropertyListing["propertyType"]): PropertyType {
   if (type && Object.values(PropertyType).includes(type as PropertyType)) {
      return type as PropertyType;
   }

   return PropertyType.OTHER;
}

/**
 * Mapping of scraped property type codes to normalized property type values of PropertyListing["propertyType"].
 * This mapping is used to convert raw property type codes (e.g., "A") from the scraped data into
 * the corresponding normalized property type values (e.g., "HOUSE").
 */
export const PROPERTY_TYPE_MAP: Record<string, PropertyType> = {
   A: PropertyType.HOUSE,
};


/**
 * Calculates an overview of the properties, including total properties, average home value, and average year built.
 */
export function calculatePropertiesOverview(properties: PropertyListing[]) {
   return {
      totalProperties: properties.length,
      averageHomeValue: properties.reduce((acc, property) => acc + (property.priceHistory[property.priceHistory.length - 1].price ?? 0), 0) / properties.length || 0,
      averageYearBuilt: properties.reduce((acc, property) => acc + (property.specs.yearBuilt ?? 0), 0) / properties.length || 0,
   }
}