import React from 'react'
import {Loader2Icon} from 'lucide-react'

function Loading() {
  return (
    
    <div role ="status" aria-label="Loading" className="flex items-center justify-center h-screen bg-[#0f172a]">
           <Loader2Icon size={26} className="animate-spin text-indigo-400" />
    </div>
  )
}

export default Loading