import { type LucideIcon } from "lucide-react"

export type MainNavItem = {
   title: string
   url: string
   icon: LucideIcon
   isActive?: boolean
   items?: SubNavItem[]
}

export type SubNavItem = {
   title: string
   url: string
}

export type SecondaryNavItem = {
   title: string
   url: string
   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}