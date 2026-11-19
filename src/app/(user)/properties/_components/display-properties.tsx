"use client"

import { PropertyListing } from "@prisma/client"
import { PropertyCard } from "./property-card"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { sortingOptions } from "@/lib/constants/property-filters"
import { calculatePropertiesOverview } from "@/lib/utils/properties"
import { getAllPropertiesByUserId } from "@/actions/properties"
import { useState, useTransition } from "react"

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


export function SortPropertiesButton({
   sortingOptions,
   value,
   onValueChange,
   disabled,
}: {
   sortingOptions: readonly { label: string; value: "asc" | "desc" }[]
   value: "asc" | "desc"
   onValueChange: (value: "asc" | "desc") => void
   disabled?: boolean
}) {
   return (
      <Select value={value} onValueChange={(nextValue) => {
         if (nextValue === "asc" || nextValue === "desc") {
            onValueChange(nextValue)
         }
      }} disabled={disabled}>
         <SelectTrigger className="w-full max-w-48">
            <SelectValue>
               {sortingOptions.find((item) => item.value === value)?.label}
            </SelectValue>
         </SelectTrigger>

         <SelectContent>
            <SelectGroup>
               <SelectLabel>Sorting Options</SelectLabel>
               {sortingOptions.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                     {item.label}
                  </SelectItem>
               ))}
            </SelectGroup>
         </SelectContent>
      </Select>
   )
}


/**
 * Displays an overview of the properties, including total properties, average home value, and average year built. 
 * Also includes a sorting button to sort the properties.
 */
export function PropertiesOverview({
   propertiesData,
   sort,
   onSortChange,
   isSorting,
}: {
   propertiesData: ReturnType<typeof calculatePropertiesOverview>
   sort: "asc" | "desc"
   onSortChange: (sort: "asc" | "desc") => void
   isSorting: boolean
}) {
   return (
      <Card className='grid grid-cols-4 gap-4 p-4 mb-4'>
         <p className='border rounded-2xl background-muted'>Total Properties: {propertiesData.totalProperties}</p>
         <p>Average Home Value: {propertiesData.averageHomeValue}</p>
         {/* <p>Average Price Per Square Foot: {propertiesData.averagePricePerSquareFoot}</p> */}
         <p>Average Year Built: {propertiesData.averageYearBuilt}</p>

         <SortPropertiesButton
            sortingOptions={sortingOptions}
            value={sort}
            onValueChange={onSortChange}
            disabled={isSorting}
         />
      </Card>
   )
}

/**
 * Displays a list of properties with an overview and sorting functionality.
 */
export function PropertiesBrowser({
   initialProperties,
   userId,
}: {
   initialProperties: PropertyListing[]
   userId: string
}) {
   const [properties, setProperties] = useState(initialProperties)
   const [sort, setSort] = useState<"asc" | "desc">("asc")
   const [errorMessage, setErrorMessage] = useState<string | null>(null)
   const [isSorting, startSorting] = useTransition()

   function handleSortChange(nextSort: "asc" | "desc") {
      setSort(nextSort)

      startSorting(async () => {
         const result = await getAllPropertiesByUserId(userId, nextSort)

         if (!result.success) {
            setErrorMessage(result.message)
            return
         }

         setErrorMessage(null)
         setProperties(result.data)
      })
   }

   const propertiesData = calculatePropertiesOverview(properties)

   return (
      <>
         <PropertiesOverview
            propertiesData={propertiesData}
            sort={sort}
            onSortChange={handleSortChange}
            isSorting={isSorting}
         />

         {errorMessage && <p role="alert">Error fetching properties: {errorMessage}</p>}
         <h1>{properties.length} Properties</h1>
         <DisplayProperties properties={properties} />
      </>
   )
}