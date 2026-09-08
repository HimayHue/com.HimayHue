import { Building, HomeIcon, LayoutDashboard } from "lucide-react"
import { MainNavItem, SubNavItem, SecondaryNavItem } from "../types/navigation"

/**
 * Navigation menu items for the public-facing part of the application
 */
export const PUBLIC_NAVIGATION: MainNavItem[] = [
   {
      title: "Home",
      url: "/",
      icon: HomeIcon
   },
   {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,

   },
   {
      title: "Property Comparison",
      url: "/property-comparison",
      icon: Building,
   }
]


/**
 * Navigation menu items for the admin section of the application
 */
export const ADMIN_NAVIGATION: MainNavItem[] = [
]