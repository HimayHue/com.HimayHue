import { Building, HomeIcon, LayoutDashboard } from "lucide-react"
import { MainNavItem, SubNavItem, SecondaryNavItem } from "../types/navigation"


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


export const ADMIN_NAVIGATION: MainNavItem[] = [
]