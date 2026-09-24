import { SearchPropertyListings } from '../_components/search-property-listings'
import { scrapeListingsAction } from '@/actions/scrape-properties-listings'

export default function Page() {
   return (
      <SearchPropertyListings onSearchClick={scrapeListingsAction} />
   )
}

