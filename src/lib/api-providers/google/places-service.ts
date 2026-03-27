
const apikey = process.env.GOOGLE_API_KEY;

//TODO: This is a very basic implementation. We should consider caching results and handling rate limits for production use. Also, we should define which fields we want to fetch to optimize performance and costs.
export async function getPlaceDetails(searchText: string) {
   if (!apikey) {
      throw new Error("Google API key is required to fetch place details.");
   }

   // The endpoint for Place Details (New)

   const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'X-Goog-Api-Key': apikey,
         'X-Goog-FieldMask': 'places.displayName,places.formattedAddress',
      },
      body: JSON.stringify({
         textQuery: `${searchText}`,
      })
   });

   if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Places API Error:', errorData);
      throw new Error(`Failed to fetch place details: ${response.statusText}`);
   }

   return await response.json();
}