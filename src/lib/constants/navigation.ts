import { Building, HomeIcon, LayoutDashboard } from "lucide-react"
import { MainNavItem, SubNavItem, SecondaryNavItem } from "../types/navigation"
import { ROUTES } from "./routes"

/**
 * Navigation menu items for the public-facing part of the application
 */
export const PUBLIC_NAVIGATION: MainNavItem[] = [
   {
      title: "Home",
      url: ROUTES.HOME,
      icon: HomeIcon
   },
   {
      title: "Dashboard",
      url: ROUTES.DASHBOARD,
      icon: LayoutDashboard,

   },
   {
      title: "Property Comparison",
      url: ROUTES.PROPERTY_COMPARISON.ROOT,
      icon: Building,
      items: [
         {
            title: "View Property",
            url: ROUTES.PROPERTY_COMPARISON.VIEW
         },
         {
            title: "Add Property",
            url: ROUTES.PROPERTY_COMPARISON.ADD
         }
      ]
   }
]


/**
 * Navigation menu items for the admin section of the application
 */
export const ADMIN_NAVIGATION: MainNavItem[] = [
]