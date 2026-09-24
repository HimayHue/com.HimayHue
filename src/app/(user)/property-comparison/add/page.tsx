import { createProperty } from '@/actions/properties'
import { AddPropertyForm } from '../_components/add-property-form'

export default async function PropertyComparisonPage() {
   return (
      <div>
         <AddPropertyForm onSubmitAction={createProperty} />
      </div>
   )
}
