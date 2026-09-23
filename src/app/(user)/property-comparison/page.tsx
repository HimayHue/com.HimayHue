import { createProperty } from '@/actions/properties'
import { AddPropertyForm } from './_components/forms'

export default function PropertyComparisonPage() {
   return (
      <div>
         <AddPropertyForm onSubmitAction={createProperty} />
      </div>
   )
}
