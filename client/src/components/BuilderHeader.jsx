import React from "react";
import {
  ArrowLeftIcon,
  EyeIcon,
  Code2Icon,
  ExternalLinkIcon,
  Loader2Icon,
  GlobeIcon,
  DownloadIcon,
} from "lucide-react";

const BuilderHeader = ({
  projectName,
  version,
  showCode,
  publishing,
  onToggleShowCode,
  onOpenPreview,
  onPublish,
  onDownload,
  onBack,
  onLogout,
}) => {
  return (
    <header className="h-12 shrink-0 flex items-center justify-between px-3 border-b border-white/10 bg-[#0f172a]">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
        >
          <ArrowLeftIcon size={16} />
        </button>

        <img src="/logo.svg" alt="" className="size-5" />

        <span className="text-sm font-semibold truncate max-w-38 md:max-w-50 text-white">
          {projectName}
        </span>

        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-indigo-300 font-medium">
          v{version}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={onToggleShowCode}
          className={`inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border border-white/15 text-zinc-300 hover:bg-white/10 hover:text-white text-xs font-medium rounded-lg cursor-pointer bg-transparent ${
            showCode ? "bg-white/10 text-white" : ""
          }`}
        >
          {showCode ? (
            <>
              <EyeIcon size={13} />
              Preview
            </>
          ) : (
            <>
              <Code2Icon size={13} />
              Code
            </>
          )}
        </button>

        <button
          onClick={onOpenPreview}
          className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border border-white/15 text-zinc-300 hover:bg-white/10 hover:text-white text-xs font-medium rounded-lg cursor-pointer bg-transparent"
        >
          <ExternalLinkIcon size={13} />
          Open Preview
        </button>

        <button
          onClick={onPublish}
          disabled={publishing}
          className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border border-white/15 text-zinc-300 hover:bg-white/10 hover:text-white text-xs font-medium rounded-lg cursor-pointer bg-transparent"
        >
          {publishing ? (
            <Loader2Icon size={13} className="animate-spin" />
          ) : (
            <GlobeIcon size={13} />
          )}
          Publish
        </button>

        <button
          onClick={onDownload}
          className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border border-white/15 text-zinc-300 hover:bg-white/10 hover:text-white text-xs font-medium rounded-lg cursor-pointer bg-transparent"
        >
          <DownloadIcon size={13} />
          Export
        </button>

        <button
          onClick={onLogout}
          className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border border-white/15 text-zinc-300 hover:bg-white/10 hover:text-white text-xs font-medium rounded-lg cursor-pointer bg-transparent"
        >
        SignOut
        </button>
      </div>
    </header>
  );
};

export default BuilderHeader;