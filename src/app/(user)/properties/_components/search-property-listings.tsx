"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { createManyPropertyListings } from "@/actions/properties"
import { Search } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import type { ScrapedPropertyListing } from "@/types/property-listing"


/**
 * A component that fetches and displays properties listings associated with the users assigned URL. 
 * It fetches the listings by scraping and parsing them from the provided URL, and then saves them to the database if they do not already exist.
 * If the properly listings already exist in the database, it will update the latest price.
 */
export function ScrapedPropertyListings({
   onSearchClickAction,
}: {
   onSearchClickAction: (url: string) => Promise<ScrapedPropertyListing[]>
}) {
   const [propertyListings, setPropertyListings] = useState<ScrapedPropertyListing[]>([])

   return (
      <div>
         <form
            onSubmit={async (event) => {
               event.preventDefault()
               const value = new FormData(event.currentTarget).get('url')
               const url = typeof value === 'string' ? value.trim() : ''

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
               let parsedPropertyListings: ScrapedPropertyListing[]
               try {
                  toast("Fetching property listings...")
                  parsedPropertyListings = await onSearchClickAction(url)
                  setPropertyListings(parsedPropertyListings)
                  toast.success(`${parsedPropertyListings.length} property listings fetched`)
               }
               catch {
                  toast.error('Unable to fetch property listings.')
                  return
               }

               // 3. Update the property listings in the database
               try {
                  toast("Saving property listings...")
                  const saveResult = await createManyPropertyListings(parsedPropertyListings)
                  if (!saveResult.success) {
                     toast.error(saveResult.message)
                     return
                  }
                  toast.success("Property listings saved.")
               }
               catch {
                  toast.error('Unable to save property listings.')
               }

            }}
            className="flex gap-2"
         >
            <Input name="url" type="url" placeholder="Enter URL" required defaultValue={"https://my.flexmls.com/JustinBui/search/contacts/20260904034505780984000000/newsfeeds/listings"} />
            <Button type="submit" size="icon" aria-label="Search">
               <Search />
            </Button>
         </form>

         <div className="mt-4 space-y-4">
            {propertyListings.map((listing) => (
               <div key={listing.listingKey} className="rounded-md border p-4">
                  <h3 className="font-semibold">${listing.price.toLocaleString()}</h3>
                  <pre className="text-sm text-muted-foreground">{JSON.stringify(listing, null, 2)}</pre>
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