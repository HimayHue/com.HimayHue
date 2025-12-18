export function getUsersLocation(options?: PositionOptions) {
   return new Promise<GeolocationPosition>((resolve, reject) => {
      if (!("geolocation" in navigator)) {
         reject(new Error("Geolocation not supported"));
         return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
         enableHighAccuracy: true,
         timeout: 10_000,
         maximumAge: 60_000,
         ...options,
      });
   });
}
