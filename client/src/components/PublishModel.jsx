import React from 'react'

import { XIcon } from "lucide-react";
import { toast } from "react-hot-toast";

const PublishModel = ({publishUrl, onClose}) => {
    const handleCopyLink=()=>{
        if(!publishUrl)return;
        navigator.clipboard.writeText(publishUrl);
        toast.success("Public link copied to clipboard!")
    }
 return (
  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-[#131b2e] border border-white/10 shadow-lg rounded-xl max-w-md w-full p-6 mx-4 relative">

      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-zinc-500 hover:text-white cursor-pointer"
      >
        <XIcon size={16} />
      </button>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-1">
          Your website is live!
        </h3>

        <p className="text-sm text-zinc-400">
          Anyone with the link below can view your published site.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
            Published Link
          </label>

          <input
            type="text"
            readOnly
            value={publishUrl}
            className="w-full px-0 py-2 border-b border-white/15 text-sm text-white bg-transparent outline-none"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 py-2 bg-indigo-500 text-white text-xs font-medium hover:bg-indigo-600 cursor-pointer rounded-lg text-center"
          >
            Copy Link
          </button>

          <button
            onClick={() => window.open(publishUrl, "_blank")}
            className="flex-1 py-2 border border-white/15 text-zinc-300 text-xs font-medium hover:bg-white/5 cursor-pointer rounded-lg text-center"
          >
            Open Site
          </button>
        </div>
      </div>

    </div>
  </div>
)
}

export default PublishModel