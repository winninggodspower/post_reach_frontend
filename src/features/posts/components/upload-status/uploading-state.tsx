import * as React from "react"
import { Clock } from "lucide-react"
import { DisplayPlatform } from "./types"

import { getPlatformMeta } from "./utils"

type UploadingStateProps = {
  postType?: "video" | "photo" | "text"
  uploadProgress: number
  totalMB: string | null
  currentMB: string | null
  selectedPlatforms: string[]
  onCancel: () => void
}

export function UploadingState({
  postType,
  uploadProgress,
  totalMB,
  currentMB,
  selectedPlatforms,
  onCancel,
}: UploadingStateProps) {
  return (
    <div className="flex flex-col p-8 pt-10">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          {postType === "video" ? "Uploading your video..." : postType === "photo" ? "Uploading your photos..." : "Creating your post..."}
        </h2>
        <p className="text-sm text-slate-500">
          We're preparing your {postType === "video" ? "video" : "photos"} for distribution. Hang tight!
        </p>
      </div>

      <div className="space-y-3 mb-8">
        <div className="flex justify-between items-end">
          <span className="text-sm font-semibold text-slate-700">Server Upload</span>
          <span className="text-xl font-bold text-orange-500">{uploadProgress}%</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] font-medium text-slate-500">
          <span>Uploading...</span>
          {totalMB && (
            <span>{currentMB} MB / {totalMB} MB</span>
          )}
        </div>
      </div>

      {/* Pending Distribution */}
      {selectedPlatforms.length > 0 && (
        <div className="space-y-3 bg-white border border-slate-100 rounded-xl p-4 shadow-sm mb-6">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pending Distribution</h3>
          <div className="space-y-3.5">
            {selectedPlatforms.map((platform, idx) => {
              const meta = getPlatformMeta(platform)
              return (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={meta.icon} alt={meta.label} className="w-4 h-4 object-contain opacity-50 grayscale" />
                    <span className="text-sm font-medium text-slate-700">{meta.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Waiting</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Footer button */}
      <div className="border-t border-slate-100 pt-6 flex justify-center">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel Upload
        </button>
      </div>
    </div>
  )
}
