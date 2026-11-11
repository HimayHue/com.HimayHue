import { ScrapedPropertyListings } from '../_components/search-property-listings'
import { scrapeListingsAction } from '@/actions/scrape-properties-listings'

export default function Page() {
   return (
      <ScrapedPropertyListings onSearchClickAction={scrapeListingsAction} />
   )
}

