import { z } from "zod";

// Match exact casing from your Prisma PropertyType enum
export const propertyTypeEnum = z.enum([
   "HOUSE",
   "APARTMENT",
   "CONDO",
   "TOWNHOUSE",
   "LOT",
   "OTHER",
]);

// Helper to sanitize optional empty string inputs from HTML form controls
const optionalString = z
   .string()
   .trim()
   .optional()
   .or(z.literal(""))
   .transform((val) => (val === "" ? undefined : val));

const optionalUrl = z
   .string()
   .trim()
   .url("Must be a valid URL")
   .optional()
   .or(z.literal(""))
   .transform((val) => (val === "" ? undefined : val));

const optionalNumber = z
   .union([z.string(), z.number()])
   .optional()
   .transform((val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
   });



// Define the schema for the property form

const propertyFormBasicSchema = z.object({
   name: optionalString,
   description: optionalString,
   propertyType: propertyTypeEnum,
   url: optionalUrl,
   coverImage: optionalUrl,
});

const propertyFormFinancialSchema = z.object({
   price: optionalNumber.pipe(
      z.number().positive("Price must be greater than 0").optional()
   ),
   propertyTax: optionalNumber.pipe(
      z.number().nonnegative("Tax cannot be negative").optional()
   ),
   hoaFees: optionalNumber.pipe(
      z.number().nonnegative("HOA fees cannot be negative").optional()
   ),
});

const propertyFormFeaturesSchema = z.object({
   bedrooms: optionalNumber.pipe(
      z.number().int("Bedrooms must be a whole number").nonnegative().optional()
   ),
   bathrooms: optionalNumber.pipe(
      z
         .number()
         .nonnegative("Bathrooms cannot be negative")
         .multipleOf(0.5, "Bathrooms must be in 0.5 increments")
         .optional()
   ),
   squareFootage: optionalNumber.pipe(
      z.number().positive("Square footage must be positive").optional()
   ),
   lotSize: optionalNumber.pipe(
      z.number().positive("Lot size must be positive").optional()
   ),
   yearBuilt: optionalNumber.pipe(
      z
         .number()
         .int("Year built must be a whole number")
         .min(0, "Year built must be after 0")
         .optional()
   ),
});

const propertyFormLocationSchema = z.object({
   address: optionalString,
   city: z.string().trim().min(1, "City is required"),
   state: z //TODO: Change to state abbreviation validation (e.g., using a regex or a predefined list of state codes)
      .string()
      .trim()
      .min(2, "State must be at least 2 characters")
      .max(50, "State name is too long"),
   zipCode: z
      .string()
      .trim()
      .regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format (e.g. 12345 or 12345-6789)"),
   latitude: optionalNumber.pipe(
      z.number().min(-90).max(90, "Latitude must be between -90 and 90").optional()
   ),
   longitude: optionalNumber.pipe(
      z.number().min(-180).max(180, "Longitude must be between -180 and 180").optional()
   ),
});

/**
 * Represents the complete schema for the property form, combining basic info, financial details, features, and location.
 */
export const propertyFormSchema = propertyFormBasicSchema
   .merge(propertyFormFinancialSchema)
   .merge(propertyFormFeaturesSchema)
   .merge(propertyFormLocationSchema);

export type PropertyFormInput = z.input<typeof propertyFormSchema>;
export type PropertyFormOutput = z.infer<typeof propertyFormSchema>




/**
 * Represents a property listing fetched from an external API.
 */
export const PropertyListingSchema = z.object({
   listingKey: z.string(),
   listingId: z.string(), // MLS Number
   status: z.string(),
   price: z.number(),
   address: z.object({
      full: z.string(),
      street: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
   }),
   specs: z.object({
      bedrooms: z.number(),
      bathrooms: z.number(),
      approxSqFt: z.number().nullable(),
      yearBuilt: z.number().nullable(),
   }),
   subdivision: z.string().nullable(),
   coordinates: z.object({
      latitude: z.number(),
      longitude: z.number(),
   }),
   detailsUrl: z.string().url().nullable(),
   listAgentId: z.string().optional(),
   propertyClass: z.string().optional(),
   propertyType: z.string().optional(),
});

export type PropertyListing = z.infer<typeof PropertyListingSchema>;