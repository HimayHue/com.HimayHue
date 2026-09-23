import { createProperty } from '@/actions/properties'
import { AddPropertyForm } from './_components/forms'

export default function PropertyComparisonPage() {
   return (
      <div>
         <h1>Property Comparison Page</h1>
         <AddPropertyForm onSubmitAction={createProperty} />
      </div>
   )
}
