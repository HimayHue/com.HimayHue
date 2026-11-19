import { getAllPropertiesByUserId } from '@/actions/properties'
import { auth } from '@/auth'
import { PropertiesBrowser } from './_components/display-properties'
import { Suspense } from 'react'


export default async function PropertyComparisonPage() {
   const session = await auth()

   if (!session) {
      return (
         <div>
            <p>You must be logged in to view this page.</p>
         </div>
      )
   }

   const fetchedProperties = await getAllPropertiesByUserId(session.user.id)

   if (!fetchedProperties.success) {
      return (
         <div>
            <p>Error fetching properties: {fetchedProperties.message}</p>
         </div>
      )
   }

   return (
      <Suspense fallback={<p>Loading properties...</p>}>
         <PropertiesBrowser
            initialProperties={fetchedProperties.data}
            userId={session.user.id}
         />
      </Suspense>
   )
}








