import { getPropertiesByUserId } from '@/actions/properties'
import { auth } from '@/auth'
import { DisplayProperties } from './_components/display-properties'
import { Suspense } from 'react'
import { PropertyListing } from '@prisma/client'
import { Card } from '@/components/ui/card'

export default async function PropertyComparisonPage() {
   const session = await auth()

   if (!session) {
      return (
         <div>
            <p>You must be logged in to view this page.</p>
         </div>
      )
   }

   const fetchPropertiesResult = await getPropertiesByUserId(session.user.id)
   const properties = fetchPropertiesResult.success ? fetchPropertiesResult.data : []



   let propertyData = calculatePropertiesOverview(properties);

   return (
      <div>
         <Suspense fallback={<p>Loading properties...</p>}>
            <PropertiesOverview propertiesData={propertyData} />
         </Suspense>

         <Suspense fallback={<p>Loading properties...</p>}>
            <h1>{properties.length} Properties</h1>
            <DisplayProperties properties={properties} />
         </Suspense>
      </div>
   )
}

function calculatePropertiesOverview(properties: PropertyListing[]) {
   return {
      totalProperties: properties.length,
      averageHomeValue: properties.reduce((acc, property) => acc + (property.priceHistory[property.priceHistory.length - 1].price ?? 0), 0) / properties.length || 0,
      averageYearBuilt: properties.reduce((acc, property) => acc + (property.specs.yearBuilt ?? 0), 0) / properties.length || 0,
   }
}

function PropertiesOverview({ propertiesData }: { propertiesData: ReturnType<typeof calculatePropertiesOverview> }) {
   return (
      <Card className='grid grid-cols-4 gap-4 p-4 mb-4'>
         <p className='border rounded-2xl background-muted'>Total Properties: {propertiesData.totalProperties}</p>
         <p>Average Home Value: {propertiesData.averageHomeValue}</p>
         {/* <p>Average Price Per Square Foot: {propertiesData.averagePricePerSquareFoot}</p> */}
         <p>Average Year Built: {propertiesData.averageYearBuilt}</p>
      </Card>
   )
}