"use client"

import { PropertyListing } from "@prisma/client"
import { PropertyCard } from "./property-card"

/**
 * A component for displaying a list of properties.
 * @param properties - The list of properties to display.
 * @returns The rendered component.
 */
export function DisplayProperties({ properties }: { properties: PropertyListing[] }) {
   return (
      <div className="mx-auto w-full">
         <ul className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-5">
            {properties.map((property) => (
               <li key={property.id} className="flex min-w-0">
                  <PropertyCard property={property} />
               </li>
            ))}
         </ul>
      </div>
   )
}