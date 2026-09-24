import { getPropertiesByUserId } from '@/actions/properties'
import { Property } from '@prisma/client'
import { auth } from '@/auth'
import { DisplayProperties } from './_components/display-properties'

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

   return (
      <div>
         <p>Properties for {session.user.name}:</p>
         <DisplayProperties properties={properties} />
      </div>
   )
}