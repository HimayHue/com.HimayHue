import { GooglePlace } from "@/types/google-places";

const apikey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;



/**
 * fetches a list of places matching the search text within a specified radius of a location.
 * @see {@link https://developers.google.com/maps/documentation/places/web-service/text-search}
 * @param searchText - The text query to search for (e.g., "pizza near me").
 * @param lat - The latitude of the location to search around.
 * @param lng - The longitude of the location to search around.
 * @param radius - The radius (in meters) to search within (default is 5000m).
 * @returns A promise resolving to an array of {@link GooglePlace} objects matching the search criteria.
 * @throws {Error} If the API key is missing or the request fails.
*/
export async function searchPlacesByText(searchText: string, lat: number, lng: number, radius: number = 5000.0): Promise<GooglePlace[]> {
   if (!apikey) throw new Error("Google API key is required to fetch place details.");

   const basicFields = [
      "places.id",
      "places.name",
      "places.attributions",
      "nextPageToken",
      "places.movedPlace",
      "places.movedPlaceId",
   ];

   const proFields = [
      "places.displayName",
      "places.formattedAddress",
      "places.location",
      "places.primaryTypeDisplayName",
      "places.websiteUri",
   ];

   const enterpriseFields = [
      "places.rating",
      "places.userRatingCount",
      "places.currentOpeningHours",
   ];

   const fieldMask = [...basicFields, ...proFields, ...enterpriseFields].join(',');

   const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'X-Goog-Api-Key': apikey,
         'X-Goog-FieldMask': basicFields.join(','),
      },
      body: JSON.stringify({
         textQuery: searchText,
         locationBias: {
            circle: {
               center: {
                  latitude: lat,
                  longitude: lng
               },
               radius: radius
            }
         },
      })
   });

   if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Places API Error:', errorData);
      throw new Error(`Failed to fetch place details: ${response.statusText}`);
   }

   const data = await response.json();
   console.log("Raw API response:", data);

   // The API returns { places: [...] }. We return just the array to match the Promise type.
   return data.places || [];
}

/**
 * Fetches comprehensive details for a single place by its unique ID.
 * @see {@link https://developers.google.com/maps/documentation/places/web-service/place-details}
 * @param placeId - The unique identifier for a place (e.g., "ChIJP3Sa8ziURiyIWZscBHTSbaQ").
 * @returns A promise resolving to a {@link GooglePlace} object.
 * @throws {Error} If the API key is missing or the request fails.
 */
export async function fetchPlaceById(placeId: string): Promise<GooglePlace> {
   if (!apikey) throw new Error("Google API key is required to fetch place details.");

   const basicFields = [
      "places.attributions",
      "places.id",
      "places.movedPlace",
      "places.movedPlaceId",
      "places.name",
      "places.photos",
   ];

   const proFields: string[] = [
   ];

   const enterpriseFields: string[] = [
   ];

   const fieldMask = [...basicFields, ...proFields, ...enterpriseFields].join(',');
   const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      method: 'GET',
      headers: {
         'X-Goog-Api-Key': apikey,
         'X-Goog-FieldMask': fieldMask,
      },
   });

   if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Places API Error:', errorData);
      throw new Error(`Failed to fetch place details: ${response.statusText}`);
   }

   // Unlike Search, Details returns the Place object directly as the root JSON.
   return await response.json();
}