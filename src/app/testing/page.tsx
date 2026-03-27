import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

function Page() {
   return (
      <div>
         <h1 className="text-2xl font-bold">Testing Page</h1>
         <Input placeholder="This is a test input" className="mt-4" />
         <Button className="mt-4">Test Button</Button>
      </div>
   )
}

export default Page