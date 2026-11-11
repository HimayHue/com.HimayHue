// src/lib/constants/property-icons.tsx
import { PropertyType } from "@prisma/client";
import {
   Home,
   Building2,
   Building,
   Warehouse,
   Trees,
   HelpCircle,
   type LucideIcon
} from "lucide-react";


/**
 * Mapping of property types to their corresponding Lucide icons.
 */
export const PROPERTY_TYPE_ICONS: Record<PropertyType, LucideIcon> = {
   HOUSE: Home,
   APARTMENT: Building2,
   CONDO: Building,
   TOWNHOUSE: Warehouse,
   LOT: Trees,
   OTHER: HelpCircle,
};