/**
 * This file contains the route constants used throughout the application. These constants help maintain consistency and avoid hardcoding route paths in multiple places.
 * 
 * Each route is defined as a string constant, representing the path to a specific page or feature within the application. This approach simplifies route management and makes it easier to update paths if needed.
 */

//TODO: Make routes have a current route and an array of previous routes for redirection purposes.

/**
 * ROUTES is an object that holds the route paths for the application. 
 * ROUTES ending in ROOT represent the base path.
 * EXAMPLE: ROUTES.PROPERTY_COMPARISON.ROOT = "/property-comparison" while ROUTES.PROPERTY_COMPARISON.HOMES = "/property-comparison/homes"
 */
export const ROUTES = {
   HOME: "/",
   AUTH: {
      SIGN_IN: "/auth/signin",
      SIGN_UP: "/auth/signup",
      FORGOT_PASSWORD: "/auth/forgot-password"
   },
   DASHBOARD: "/dashboard",
   PROPERTY_COMPARISON: {
      ROOT: "/property-comparison",
      HOMES: "/property-comparison/homes",
      APARTMENTS: "/property-comparison/apartments",
   }
} as const;