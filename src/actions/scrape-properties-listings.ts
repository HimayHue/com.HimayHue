"use server";

import { parseListingsFromHtml } from "@/lib/utils/web-scraping/parse-property-listings";
import { PropertyListing } from "@/lib/zod/properties";

// Extract base headers copied from browser session
const SCRAPE_HEADERS: HeadersInit = {
   "accept": "text/html, */*; q=0.01",
   "accept-language": "en-US,en;q=0.9",
   "cookie": "cid=6a9789ce44d0f2.90055957; selectedCartCount_public_20241126235524617956000000=0; SearchResultsLastViewMode=list; _mls_search_session=%2FogrFcF8x3Vdt%2BTyze9jz%2FE883xBhYEdz%2FN1a%2Bg9HO5t2IEOvBoxnGeCMxQC9DO9LIMAyRoLH2LI6xB3tMSwfvEwfJLRE29tpVIV24R5WSbu7VeowaFDTpOrYmG9Nd96j9%2F7UKwsSn2Nw518Mw%2F0uObII9G%2FnjiB1pqDA3qZ2IdfEQmwVaBBHLrgoIqKlGOd0KwgHrjWSRtbWgOmoBTTRuxoA2%2By%2F36CW24I4jdkYMg7%2FMVkEmVWPoVvt9dKZx%2Brh19AY4PJL4NASQIVYz0LgrJBw7GXgb8BIZ7Wt4D6UxrsBAGeJcNPZaTppnugZhk3snD0--gJzIBbU0A994kOY%2F--sSi5oX%2FqwrUqVOHrreQI8Q%3D%3D",
   "referer": "https://my.flexmls.com/JustinBui/search/contacts/20260904034505780984000000/newsfeeds/listings",
   "sec-ch-ua": '"Google Chrome";v="153", "Not_A Brand";v="8", "Chromium";v="153"',
   "sec-ch-ua-mobile": "?1",
   "sec-ch-ua-platform": '"Android"',
   "sec-fetch-dest": "empty",
   "sec-fetch-mode": "cors",
   "sec-fetch-site": "same-origin",
   "user-agent": "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Mobile Safari/537.36",
   "x-csrf-token": "VkePo8sdYOvK2eso2_TsiNkc5bD1VelRtlIiAxGvJr3neIm7deWnK1hrumBkgonQJ15q2IEHg6bZpDO-WrWR9A",
   "x-requested-with": "XMLHttpRequest",
};

export async function scrapeListingsAction(inputUrl: string): Promise<PropertyListing[]> {
   const allListings: PropertyListing[] = [];

   // Normalize base URL: strip existing query parameters to control pagination directly
   const cleanBaseUrl = inputUrl.split("?")[0].replace(/\/$/, "");

   let page = 1;
   const limit = 25; // Increase from 10 to fetch larger batches per round-trip
   let keepFetching = true;

   while (keepFetching) {
      const targetUrl = `${cleanBaseUrl}?list_view=table&page=${page}&_limit=${limit}`;

      const res = await fetch(targetUrl, {
         method: "GET",
         headers: {
            ...SCRAPE_HEADERS,
            "referer": cleanBaseUrl,
         },
         cache: "no-store",
      });

      if (!res.ok) {
         if (res.status === 404 || res.status === 400) break;
         throw new Error(`Flexmls returned status ${res.status}: ${res.statusText}`);
      }

      const htmlChunk = await res.text();

      // Catch if session expired or bot protection intercepted
      if (htmlChunk.includes("captchaContainer") || htmlChunk.includes("fastlyLogo")) {
         throw new Error("Fastly session expired or flagged. Update session cookies and CSRF token.");
      }

      const listingsBatch = parseListingsFromHtml(htmlChunk);

      if (listingsBatch.length === 0) {
         keepFetching = false;
      } else {
         allListings.push(...listingsBatch);
         page++;
      }
   }

   return allListings;
}