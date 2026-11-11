"use server";

import { parseListingsFromHtml } from "@/lib/utils/web-scraping/parse-property-listings";
import type { ScrapedPropertyListing } from "@/types/property-listing";

const FLEXMLS_HEADERS: HeadersInit = {
   "accept": "text/html, */*; q=0.01",
   "accept-language": "en-US,en;q=0.9",
   "cookie": "cid=6a9789ce44d0f2.90055957; selectedCartCount_public_20241126235524617956000000=0; mapState={}; _my_flexmls_session=blEK4wQYlbXEtX4pTVzFoKqgfaDvVX4yV%2FDJYiS4yGHGJhwTHLiA%2BnwFl6wfUiba4JJ9RZECoPh1BYYC4nLGaFSuyKYpAz0QGqcgK%2FIwq5TNDFeSF3APw7cqOX%2FHvutgWgHgpBJP7Zn29c5zq2Rv%2FhF3GQoCbvvV9zHAIm6G7l%2FKSQQRGzmnHM8nGIarK9EeBctD%2FZhMagTHNuUcCmsDyFpXZKoT5EF9ds4E76qFjMhnbpvETMLoKMmUJZUjOIYRozgye0aV21qqoWktfU8lP9IwVfZLfAuTRX3PDRg0aAnoyh%2FSWLZgx38lv%2Bau9tDVx3sb3mv9lR8bvTc08kyOt9KEKkaHIwHRVsiTtxQsbxwHxawZrTfF7pqC4xuC%2BwnhA4xWazpdRRVAXgnq%2F8%2F5QlC0BrmdE%2BDsd32YqEHupezAqnNbyKTmK7JF%2B3pes2tGxT%2BdXPVw7jagdu%2F%2BytsW5vSRN9EM%2B96XI%2B1dqOafVd81EIqpO7K0VgUa8yDashOBAv2DPX8tjg%3D%3D--bkILR7T1wckxRVCP--JaQYvVo9CHdQ69g%2FKFiB8g%3D%3D; _mls_search_session=FsASiEoGHDySgXvqPTKM3Fe%2FuvbGATIYNaS0mo5Wo8ql0uNWOAKOO09k5fSYw1bmQY3CHQLgrQ4DlDQqb7fXuNfyyIddaIulTA1hjI35RWJyi%2BCI%2F83dnamX4OZ701j5Yb7bOoYKUxl2Mwov9d5Xk4v9vTQrppDcoeNWW1eBo1d0LQhuw%2BlyA%2B7YDcz%2BJYVFFvYQZ%2BaABimeuoczpkU%2BlIim5kLxfpoSxQTQPM%2FrlZ3wRLyg3XGqbeJZIQA4AxmsmOZkLjgEmhRVrqEX2GE2Fd3yk9j8WtwRMcG9pwMIQ4Dy6xe6OdhqpWx659kiRU080kcy--NhwVwrXLAYl%2FhYOd--MiIMnZmu9VHISwtv7teOfA%3D%3D; listingEvent={%22searchContext%22:null%2C%22viewedListings%22:[%2220260924005624182348000000%22]}; SearchResultsLastViewMode=summary",
   "referer": "https://my.flexmls.com/JustinBui/search/contacts/20260904034505780984000000/newsfeeds/listings",
   "sec-ch-ua": '"Google Chrome";v="153", "Not_A Brand";v="8", "Chromium";v="153"',
   "sec-ch-ua-mobile": "?1",
   "sec-ch-ua-platform": '"Android"',
   "sec-fetch-dest": "empty",
   "sec-fetch-mode": "cors",
   "sec-fetch-site": "same-origin",
   "user-agent": "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Mobile Safari/537.36",
   "x-requested-with": "XMLHttpRequest",
};

export async function scrapeListingsAction(
   inputUrl: string,
): Promise<ScrapedPropertyListing[]> {
   const allListings: ScrapedPropertyListing[] = [];
   const cleanBaseUrl = inputUrl.split("?")[0].replace(/\/$/, "");

   let page = 1;
   const limit = 25;
   let keepFetching = true;

   while (keepFetching) {
      const targetUrl = `${cleanBaseUrl}?list_view=summary&page=${page}&_limit=${limit}`;

      // 1. Fetch the HTML content of the listings page
      const res = await fetch(targetUrl, {
         method: "GET",
         headers: {
            ...FLEXMLS_HEADERS,
            "referer": cleanBaseUrl,
         },
         cache: "no-store",
      });

      if (!res.ok) {
         if (res.status === 404 || res.status === 400) break;
         throw new Error(`Flexmls returned status ${res.status}: ${res.statusText}`);
      }

      const htmlChunk = await res.text();

      if (htmlChunk.includes("captchaContainer") || htmlChunk.includes("fastlyLogo")) {
         throw new Error("Fastly session expired or blocked. Refresh Flexmls and update cookies.");
      }

      // 2. Parse the HTML to extract property listings
      const batch = parseListingsFromHtml(htmlChunk);

      // 3. If no listings are found, stop fetching; otherwise, add to the results and continue
      if (batch.length === 0) {
         keepFetching = false;
      } else {
         allListings.push(...batch);
         page++;
      }
   }


   // 4. Return the aggregated listings
   return allListings;
}