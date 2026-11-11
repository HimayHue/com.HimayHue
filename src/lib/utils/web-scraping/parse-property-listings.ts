import * as cheerio from "cheerio";
import type { ScrapedPropertyListing } from "@/types/property-listing";


const PROPERTY_TYPE_MAP: Record<string, ScrapedPropertyListing["propertyType"]> = {
   A: "HOUSE",
};


/**
 * Maps a raw property type string to a normalized `ScrapedPropertyListing["propertyType"]` value.
 * If the input value is not recognized, it defaults to "OTHER".
 *
 * @param value - The raw property type string to normalize.
 * @returns The normalized property type.
 */
function normalizePropertyType(value?: string): ScrapedPropertyListing["propertyType"] {
   if (!value) return "OTHER";
   return PROPERTY_TYPE_MAP[value] ?? "OTHER";
}


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


export function parseListingsFromHtml(html: string): ScrapedPropertyListing[] {
   if (!html || !html.trim()) return [];

   // Protect <tr> tags from being discarded if table HTML is passed in
   const sanitizedHtml = html.includes("<tr") && !html.includes("<table")
      ? `<table><tbody>${html}</tbody></table>`
      : html;

   const $ = cheerio.load(sanitizedHtml);
   const listings: ScrapedPropertyListing[] = [];

   // Target both summary cards (<div>) and table rows (<tr>)
   $(".listingListItem").each((_, element) => {
      const item = $(element);

      // 1. Extract embedded JSON payload
      const saveLink = item.find("a.consumerSaveListingLink, a.unhideListingLink");
      const rawJson = saveLink.attr("data-listing");

      let embeddedData: RawEmbeddedListing | null = null;
      if (rawJson) {
         try {
            embeddedData = JSON.parse(rawJson);
         } catch {
            console.warn(`Failed to parse data-listing JSON for listing ${item.attr("id")}`);
         }
      }

      // 2. Identification & Status
      const mlsNumber =
         embeddedData?.ListingId ||
         item.find(".mls-nbr").text().replace("#", "").trim() ||
         item.find("td.listing-number").text().trim() ||
         "";

      const status =
         embeddedData?.MlsStatus ||
         item.attr("data-standard-status") ||
         item.find(".summary-status").text().trim() ||
         item.find("td.listing-status").text().trim() ||
         "Active";

      // 3. Price
      const priceRaw =
         embeddedData?.CurrentPrice ??
         parseFloat(item.attr("data-current-price") || "0");

      // 4. Address Components
      const street =
         embeddedData?.StreetAddress ||
         item.find(".address-wrapper .line-one").text().trim() ||
         "";

      const cityStateZip = item.find(".address-wrapper .line-two").text().trim();
      let city = embeddedData?.City || "";
      let state = embeddedData?.StateOrProvince || "";
      let postalCode = embeddedData?.PostalCode || "";

      if (!city && cityStateZip) {
         const parts = cityStateZip.split(",");
         city = parts[0]?.trim() || "";
         if (parts[1]) {
            const stateZipParts = parts[1].trim().split(" ");
            state = stateZipParts[0]?.trim() || "";
            postalCode = stateZipParts[1]?.trim() || "";
         }
      }

      const fullAddress =
         street && city && state
            ? `${street}, ${city}, ${state} ${postalCode}`.trim()
            : item.find(".listing-address").text().trim() || street;

      // 5. Specs & Dimensions (Extracting from .data-row key-values or table cells)
      const specsMap: Record<string, string> = {};
      item.find(".data-row").each((_, rowEl) => {
         const title = $(rowEl).find(".title").text().trim().toLowerCase();
         const val = $(rowEl).find(".value").text().trim();
         if (title && val) specsMap[title] = val;
      });

      const subdivision =
         specsMap["subdivision"] ||
         item.find('td[class=""]').first().text().trim() ||
         null;

      const yearBuiltRaw = parseInt(
         specsMap["year built"] || item.find("td.align-right").eq(0).text().trim(),
         10
      );
      const yearBuilt = !isNaN(yearBuiltRaw) ? yearBuiltRaw : null;

      const bedsRaw =
         embeddedData?.BedsTotal ??
         parseInt(specsMap["bedrooms"] || item.find("td.align-right").eq(1).text().trim(), 10);
      const bedrooms = typeof bedsRaw === "string" ? parseInt(bedsRaw, 10) : Number(bedsRaw) || 0;

      const bathsRaw =
         embeddedData?.BathsTotal ??
         parseFloat(specsMap["bathrooms"] || item.find("td.align-right").eq(2).text().trim());
      const bathrooms = typeof bathsRaw === "string" ? parseFloat(bathsRaw) : Number(bathsRaw) || 0;

      const sqftText = (
         specsMap["approx sqft"] || item.find("td.align-right").eq(3).text().trim()
      ).replace(/,/g, "");
      const sqftRaw = parseInt(sqftText, 10);
      const approxSqFt = !isNaN(sqftRaw) ? sqftRaw : null;

      // 6. Coordinates
      const latitude =
         embeddedData?.Latitude ??
         parseFloat(item.attr("data-latitude") || "0");

      const longitude =
         embeddedData?.Longitude ??
         parseFloat(item.attr("data-longitude") || "0");

      // 7. URLs & Media
      let detailsUrl = item.attr("data-href") || null;
      if (detailsUrl && detailsUrl.startsWith("/")) {
         detailsUrl = `https://my.flexmls.com${detailsUrl}`;
      }

      const imageUrl = item.find(".thumbnail img").attr("src") || null;

      // 8. Assemble the scraped listing
      const rawListing = {
         listingKey: embeddedData?.ListingKey || item.attr("id") || "",
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
         imageUrl: imageUrl,
         listAgentId: embeddedData?.ListAgentId,
         propertyClass: embeddedData?.StandardFields?.PropertyClass,
         propertyType: normalizePropertyType(embeddedData?.StandardFields?.PropertyType),
      };

      console.assert(embeddedData?.ListingKey, `Missing ListingKey for listing ${mlsNumber}`);
      listings.push(rawListing);
   });

   return listings;
}