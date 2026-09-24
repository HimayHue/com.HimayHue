"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { PropertyListing } from "@/lib/zod/properties"
import { Search } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function SearchPropertyListings({
   onSearchClick,
}: {
   onSearchClick: (url: string) => Promise<PropertyListing[]>
}) {
   const [propertyListings, setPropertyListings] = useState<PropertyListing[]>([])

   return (
      <div>
         <form
            onSubmit={async (event) => {
               event.preventDefault()
               const value = new FormData(event.currentTarget).get('url')
               const url = typeof value === 'string' ? value.trim() : ''
               toast("Fetching property listings...")

               // 1. Validate the URL format
               try {
                  const parsedUrl = new URL(url)
                  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
                     throw new Error('Invalid URL protocol')
                  }
               } catch {
                  toast.error('Please enter a valid URL.')
                  return
               }

               // 2. Fetch property listings using the provided onSearchClick function
               try {
                  const results = await onSearchClick(url)
                  setPropertyListings(results)
               } catch {
                  toast.error('Unable to fetch property listings.')
               }
            }}
            className="flex gap-2"
         >
            <Input name="url" type="url" placeholder="Enter URL" required />
            <Button type="submit" size="icon" aria-label="Search">
               <Search />
            </Button>
         </form>

         <div className="mt-4 space-y-4">
            {propertyListings.map((listing) => (
               <div key={listing.listingKey} className="rounded-md border p-4">
                  <h3 className="font-semibold">${listing.price.toLocaleString()}</h3>
                  <p>{listing.address.full}</p>
                  <p>
                     {listing.specs.bedrooms} bd · {listing.specs.bathrooms} ba
                     {listing.specs.approxSqFt === null ? "" : ` · ${listing.specs.approxSqFt.toLocaleString()} sqft`}
                  </p>
                  <p className="text-sm text-muted-foreground">MLS #{listing.listingId}</p>
               </div>
            ))}
         </div>

         <Pagination className="mt-5">
            <PaginationContent>
               <PaginationItem>
                  <PaginationPrevious href="#" />
               </PaginationItem>
               <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
               </PaginationItem>
               <PaginationItem>
                  <PaginationLink href="#" isActive>
                     2
                  </PaginationLink>
               </PaginationItem>
               <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
               </PaginationItem>
               <PaginationItem>
                  <PaginationEllipsis />
               </PaginationItem>
               <PaginationItem>
                  <PaginationNext href="#" />
               </PaginationItem>
            </PaginationContent>
         </Pagination>
      </div>
   )
}