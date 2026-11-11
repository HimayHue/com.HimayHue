export type PropertyStatusVariant =
   | "active"
   | "pending"
   | "underContract"
   | "closed"
   | "cancelled"
   | "comingSoon"
   | "tempOffMarket"
   | "expired"
   | "statusUnknown";

export const PROPERTY_STATUS_VARIANTS: Record<string, PropertyStatusVariant> = {
   active: "active",
   pending: "pending",
   "ucb (under contract-backups)": "underContract",
   closed: "closed",
   cancelled: "cancelled",
   "coming soon": "comingSoon",
   "temp off market": "tempOffMarket",
   expired: "expired",
};

export function getPropertyStatusVariant(status: string): PropertyStatusVariant {
   return PROPERTY_STATUS_VARIANTS[status.trim().toLowerCase()] ?? "statusUnknown";
}
