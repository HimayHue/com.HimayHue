import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { PropertyListing, PropertyType } from "@prisma/client";
import { Bath, Bed, Calendar, CalendarDays, ChevronDown, ChevronUp, DollarSign, Ruler } from "lucide-react";
import { PROPERTY_TYPE_ICONS } from "@/lib/constants/property-icons";
import { getPropertyStatusVariant } from "@/lib/constants/property-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PropertyTypeBadgeProps {
   type: PropertyListing["propertyType"];
   className?: string;
}

function normalizePropertyType(type: PropertyListing["propertyType"]): PropertyType {
   if (type && Object.values(PropertyType).includes(type as PropertyType)) {
      return type as PropertyType;
   }

   return PropertyType.OTHER;
}


function PropertyTypeBadge({ type, className }: PropertyTypeBadgeProps) {
   const Icon = PROPERTY_TYPE_ICONS[normalizePropertyType(type)];


   return (
      <Icon className={`items-center gap-1.5 text-xs font-medium text-primary ${className ?? ""}`} />
   );
}


function PropertyCardHeader({
   address,
   propertyType,
   listingId,
   status,
}: {
   address: PropertyListing["address"];
   propertyType: PropertyListing["propertyType"];
   listingId: string;
   status: string;
}) {
   const isUcbStatus = status.trim().toLowerCase() === "ucb (under contract-backups)";

   return (
      <CardHeader className="flex flex-row items-center gap-x-3">
         <PropertyTypeBadge className="h-10 w-10" type={propertyType} />
         <div >
            <h2 className="text-lg sm:text-xl text-white font-medium tracking-tight">{address.street}</h2>
            <h3 className="text-muted-foreground">{address.city}, {address.state} {address.postalCode} #{listingId}</h3>
         </div>
         <TooltipProvider >
            <Tooltip>
               <TooltipTrigger asChild>
                  <Badge
                     variant={getPropertyStatusVariant(status)}
                     className="ml-auto text-xs sm:text-sm"
                  >
                     {isUcbStatus ? "UCB" : status}
                  </Badge>
               </TooltipTrigger>
               {isUcbStatus && (
                  <TooltipContent>Under Contract Backups</TooltipContent>
               )}
            </Tooltip>
         </TooltipProvider>
      </CardHeader>
   );
}

/**
 * Displays the price information for a property.
 * Including price change indicators and percentage change if applicable.
 */
function PropertyCardPrice({
   currentPrice,
   previousPrice,
}: {
   currentPrice: number;
   previousPrice: number | null;
}) {
   const priceDelta = previousPrice === null ? null : currentPrice - previousPrice;
   const priceChangePercent = previousPrice !== null && previousPrice !== 0 && priceDelta !== null
      ? Math.abs((priceDelta / previousPrice) * 100)
      : null;
   const isPriceDrop = priceDelta !== null && priceDelta < 0;
   const PriceChangeIcon = isPriceDrop ? ChevronDown : ChevronUp;
   const priceChangeColor = isPriceDrop ? "text-emerald-500" : "text-red-500";
   const formattedCurrentPrice = currentPrice.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
   });
   const formattedPriceChange = priceDelta === null
      ? null
      : Math.abs(priceDelta).toLocaleString("en-US", {
         style: "currency",
         currency: "USD",
         notation: "compact",
         compactDisplay: "short",
         maximumFractionDigits: 1,
      }).replace("K", "k");
   const formattedPriceChangePercent = priceChangePercent === null
      ? null
      : `${priceChangePercent.toLocaleString("en-US", {
         maximumFractionDigits: 1,
      })}%`;

   return (
      <div className="flex flex-col gap-1">
         <div className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {formattedCurrentPrice}
         </div>
         {priceDelta !== null && priceDelta !== 0 && (
            <div
               className="flex items-center gap-2 text-xl font-semibold"
               aria-label={`Price ${isPriceDrop ? "decreased" : "increased"} by ${formattedPriceChange}${formattedPriceChangePercent ? `, ${formattedPriceChangePercent}` : ""}`}
            >
               <PriceChangeIcon aria-hidden="true" className={`size-6 fill-current ${priceChangeColor}`} />
               <span className={priceChangeColor}>{formattedPriceChange}</span>
               {formattedPriceChangePercent && (
                  <span className="font-normal text-muted-foreground">({formattedPriceChangePercent})</span>
               )}
            </div>
         )}
      </div>
   );
}


/**
 * Displays a single statistic for the property card.
 * @param icon The icon to display for the statistic.
 * @param label The label for the statistic.
 * @param value The value for the statistic.
 * @returns A React component displaying the statistic.
 */
function PropertyCardStatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
   return (
      <div className="flex items-center gap-4 border rounded-2xl border-border p-2">
         {icon}
         <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <span className="text-lg font-semibold text-white">{value}</span>
         </div>
      </div>
   );
}


/**
 * The grid layout for displaying property statistics such as year built, price per square foot, square footage, bedrooms, and bathrooms.
 * @param property The property listing object containing the statistics to display.
 * @returns A React component displaying the property statistics in a grid layout.
 */
function PropertyCardStats({
   property,
}: {
   property: PropertyListing;
}) {
   return (
      <div className="grid grid-cols-2 gap-4 ">
         <PropertyCardStatItem icon={<CalendarDays className="h-8 w-8" />} label="Year Built" value={property.specs.yearBuilt} />
         <PropertyCardStatItem icon={<DollarSign className="h-8 w-8" />} label="Price Per Sq Ft" value={`$${(property.price / property.specs.approxSqFt).toFixed(2)}`} />
         <PropertyCardStatItem icon={<Ruler className="h-8 w-8" />} label="Square Feet" value={property.specs.approxSqFt} />
         <PropertyCardStatItem icon={<Bed className="h-8 w-8" />} label="Bedrooms" value={property.specs.bedrooms} />
         <PropertyCardStatItem icon={<Bath className="h-8 w-8" />} label="Bathrooms" value={property.specs.bathrooms} />
      </div>
   );
}


/**
 * Displays the minimum and maximum prices for a property based on its price history.
 * @param priceHistory The price history of the property.
 * @returns A React component displaying the min and max prices.
 */
function PropertyCardPriceMinMax({ priceHistory }: { priceHistory: PropertyListing["priceHistory"] }) {
   if (priceHistory.length === 0) return null;
   const minPrice = Math.min(...priceHistory.map((item) => item.price));
   const maxPrice = Math.max(...priceHistory.map((item) => item.price));

   return (
      <div className="grid grid-cols-2 gap-4">
         <PropertyCardStatItem icon={<ChevronDown className="h-8 w-8" />} label="Min Price" value={`$${minPrice.toLocaleString()}`} />
         <PropertyCardStatItem icon={<ChevronUp className="h-8 w-8" />} label="Max Price" value={`$${maxPrice.toLocaleString()}`} />
      </div>
   );
}

/**
 * The footer for the property card, which contains a link to view more details about the property directly on the listing page.
 * @param detailsUrl The URL to the property details page.
 * @param className The class name for the footer.
 * @returns A React component displaying the property card footer.
 */
function PropertyCardFooter({ detailsUrl, className }: { detailsUrl?: string | null; className?: string }) {
   if (!detailsUrl) return null;

   return (
      <CardFooter className={`${className ?? ""}`}>
         <Button asChild className="w-full justify-center">
            <a href={detailsUrl} target="_blank" rel="noopener noreferrer">
               View Details
            </a>
         </Button>
      </CardFooter>
   );
}


/**
 * This component renders a card displaying property information, including address, listing ID, status, price history, and specifications.
 * It also provides visual indicators for price changes and a link to view more details about the property.
 */
export function PropertyCard({ property }: { property: PropertyListing }) {
   const currentPrice = property.priceHistory[property.priceHistory.length - 1].price;
   const previousPrice = property.priceHistory.length > 1 ? property.priceHistory[property.priceHistory.length - 2].price : null;

   return (
      <Card className="h-full w-full">

         <PropertyCardHeader
            address={property.address}
            propertyType={property.propertyType}
            listingId={property.listingId}
            status={property.status}
         />

         <CardContent className="flex flex-col gap-y-4 border-t border-muted mx-4 pt-4">
            <PropertyCardPrice
               currentPrice={currentPrice}
               previousPrice={previousPrice}
            />
            <PropertyCardStats property={property} />
            <PropertyCardPriceMinMax priceHistory={property.priceHistory} />
         </CardContent>

         <PropertyCardFooter
            detailsUrl={property.detailsUrl}
            className="mt-auto"
         />

      </Card>
   );
}
