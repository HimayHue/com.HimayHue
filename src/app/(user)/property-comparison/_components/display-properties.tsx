"use client"

import { Property } from "@prisma/client"

/**
 * A component for displaying a list of properties.
 * @param properties - The list of properties to display.
 * @returns The rendered component.
 */
export function DisplayProperties({ properties }: { properties: Property[] }) {
   return (
      <div>
         <ul>
            {properties.map((property) => (
               <li key={property.id}>{property.name}</li>
            ))}
         </ul>
      </div>
   )
}