import * as cheerio from "cheerio";
import { PropertyListing, PropertyListingSchema } from "@/lib/zod/properties";

interface RawEmbeddedListing {
   ListingKey: string;
   ListingId: string;
   CurrentPrice?: number;
   ListPrice?: number;
   MlsStatus?: string;
   StandardStatus?: string;
   StreetAddress?: string;
   City?: string;
   StateOrProvince?: string;
   PostalCode?: string;
   BedsTotal?: string | number;
   BathsTotal?: string | number;
   Latitude?: number;
   Longitude?: number;
   ListAgentId?: string;
   StandardFields?: {
      PropertyClass?: string;
      PropertyType?: string;
      [key: string]: unknown;
   };
   [key: string]: unknown;
}

export function parseListingsFromHtml(html: string): PropertyListing[] {
   if (!html || !html.trim()) return [];

   // CRITICAL FIX: Standalone <tr> tags are stripped by HTML parsers unless enclosed in a table
   const sanitizedHtml = html.includes("<table")
      ? html
      : `<table><tbody>${html}</tbody></table>`;

   const $ = cheerio.load(sanitizedHtml);
   const listings: PropertyListing[] = [];

   $("tr.listingListItem").each((_, element) => {
      const row = $(element);

      // 1. Extract the embedded JSON payload from the Save button
      const saveLink = row.find("a.consumerSaveListingLink");
      const rawJson = saveLink.attr("data-listing");

      let embeddedData: RawEmbeddedListing | null = null;
      if (rawJson) {
         try {
            embeddedData = JSON.parse(rawJson);
         } catch {
            console.warn(`Failed to parse data-listing JSON for row ${row.attr("id")}`);
         }
      }

      // 2. Extract MLS number & Status
      const mlsNumber =
         embeddedData?.ListingId ||
         row.find("td.listing-number span").text().trim() ||
         row.find("td.listing-number").text().trim() ||
         "";

      const status =
         embeddedData?.MlsStatus ||
         row.attr("data-standard-status") ||
         row.find("td.listing-status").text().trim() ||
         "Unknown";

      // 3. Price
      const priceRaw =
         embeddedData?.CurrentPrice ??
         parseFloat(row.attr("data-current-price") || "0");

      // 4. Address
      const domAddressText = row.find(".listing-address").text().trim();
      const addressParts = domAddressText.split(",").map((s) => s.trim());

      const fullAddress =
         embeddedData?.StreetAddress && embeddedData?.City && embeddedData?.StateOrProvince
            ? `${embeddedData.StreetAddress}, ${embeddedData.City}, ${embeddedData.StateOrProvince}`
            : domAddressText;

      const street = embeddedData?.StreetAddress || addressParts[0] || "";
      const city = embeddedData?.City || addressParts[1] || "";
      const state = embeddedData?.StateOrProvince || addressParts[2] || "";
      const postalCode = embeddedData?.PostalCode || "";

      // 5. Subdivision & Year
      const subdivision =
         row.find('td[class=""]').first().text().trim() ||
         row.find("td:nth-child(7)").text().trim() ||
         null;

      const yearBuiltRaw = parseInt(row.find("td.align-right").eq(0).text().trim(), 10);
      const yearBuilt = !isNaN(yearBuiltRaw) ? yearBuiltRaw : null;

      // 6. Beds & Baths
      const bedsRaw =
         embeddedData?.BedsTotal ??
         parseInt(row.find("td.align-right").eq(1).text().trim(), 10);
      const bedrooms = typeof bedsRaw === "string" ? parseInt(bedsRaw, 10) : Number(bedsRaw) || 0;

      const bathsRaw =
         embeddedData?.BathsTotal ??
         parseFloat(row.find("td.align-right").eq(2).text().trim());
      const bathrooms = typeof bathsRaw === "string" ? parseFloat(bathsRaw) : Number(bathsRaw) || 0;

      // 7. SqFt
      const sqftText = row.find("td.align-right").eq(3).text().trim().replace(/,/g, "");
      const sqftRaw = parseInt(sqftText, 10);
      const approxSqFt = !isNaN(sqftRaw) ? sqftRaw : null;

      // 8. Coordinates
      const latitude =
         embeddedData?.Latitude ??
         parseFloat(row.attr("data-latitude") || "0");

      const longitude =
         embeddedData?.Longitude ??
         parseFloat(row.attr("data-longitude") || "0");

      // 9. Details URL (format relative paths to full URLs if needed)
      let detailsUrl = row.attr("data-href") || null;
      if (detailsUrl && detailsUrl.startsWith("/")) {
         detailsUrl = `https://my.flexmls.com${detailsUrl}`;
      }

      // 10. Assemble and validate
      const rawListing = {
         listingKey: embeddedData?.ListingKey || row.attr("id") || "",
         listingId: String(mlsNumber),
         status: status,
         price: Number(priceRaw),
         address: {
            full: fullAddress,
            street: street,
            city: city,
            state: state,
            postalCode: postalCode,
         },
         specs: {
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            approxSqFt: approxSqFt,
            yearBuilt: yearBuilt,
         },
         subdivision: subdivision,
         coordinates: {
            latitude: Number(latitude),
            longitude: Number(longitude),
         },
         detailsUrl: detailsUrl,
         listAgentId: embeddedData?.ListAgentId,
         propertyClass: embeddedData?.StandardFields?.PropertyClass,
         propertyType: embeddedData?.StandardFields?.PropertyType,
      };

      const parsed = PropertyListingSchema.safeParse(rawListing);
      if (parsed.success) {
         listings.push(parsed.data);
      } else {
         console.error(
            `Schema validation failed for listing ${mlsNumber}:`,
            JSON.stringify(parsed.error.format(), null, 2)
         );
      }
   });

   console.log(`Parsed ${listings.length} property listings from HTML.`);
   return listings;
}