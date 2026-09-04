import { auth } from '@/auth'

export default async function Dashboard() {
   const user = await auth()

   return (
      <div className='flex flex-col items-center justify-center h-full'>
         <h1 className='text-2xl font-bold'>User Information</h1>
         <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
   )
}
