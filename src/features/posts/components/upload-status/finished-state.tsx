import * as React from "react"
import { Check, ExternalLink } from "lucide-react"
import { getPlatformMeta, getPostUrl } from "./utils"
import { PreviewData } from "./types"
import { PlatformPostStatus } from "../../api/server"

type FinishedStateProps = {
  isScheduled?: boolean
  finalStatuses: PlatformPostStatus[] | null
  selectedPlatforms: string[]
  contentType: string | null
  previewData?: PreviewData
  onClose: () => void
  onViewPost: () => void
}

export function FinishedState({
  isScheduled,
  finalStatuses,
  selectedPlatforms,
  contentType,
  previewData,
  onClose,
  onViewPost,
}: FinishedStateProps) {
  const displayPlatforms = (finalStatuses && finalStatuses.length > 0)
    ? finalStatuses.map(p => ({
      id: p.id,
      platform: p.platform,
      status: p.status,
      url: getPostUrl(p.platform, p.platform_post_id, contentType),
      meta: getPlatformMeta(p.platform)
    }))
    : selectedPlatforms.map((p, idx) => ({
      id: `scheduled-${idx}`,
      platform: p,
      status: (isScheduled ? "scheduled" : "pending"),
      url: null,
      meta: getPlatformMeta(p)
    }));
  return (
    <div className="flex flex-col p-8 pt-10">
      {/* Header Icon */}
      <div className="mx-auto mb-5 w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border-4 border-emerald-500/10">
        <Check className="w-8 h-8 stroke-[3]" />
      </div>

      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {isScheduled ? "Post Scheduled Successfully!" : "Post Published Successfully!"}
        </h2>
        <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-emerald-600">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          <span>All platforms synced successfully</span>
        </div>
      </div>

      {/* Post Preview (mockup) */}
      {previewData && (previewData.title || previewData.caption || previewData.imageSrc) && (
        <div className="flex gap-4 p-4 bg-slate-50 rounded-xl mb-6 border border-slate-100/60 items-center">
          {previewData.imageSrc && (
            <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-200 relative border border-slate-200">
              <img src={previewData.imageSrc} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-[10px] font-bold text-orange-600 tracking-wider uppercase mb-1">Post Preview</span>
            {previewData.title && (
              <h4 className="text-sm font-bold text-slate-900 truncate">{previewData.title}</h4>
            )}
            {previewData.caption && (
              <p className={`text-sm text-slate-600 line-clamp-2 ${!previewData.title ? 'font-medium text-slate-800' : ''}`}>
                {previewData.caption}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Overall Progress */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-end">
          <span className="text-sm font-medium text-slate-700">Overall Progress</span>
          <span className="text-sm font-medium text-emerald-600">100%</span>
        </div>
        <div className="h-2.5 w-full bg-emerald-50 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 w-full rounded-full" />
        </div>
      </div>

      {/* Platforms Status list */}
      {displayPlatforms.length > 0 && (
        <div className="space-y-3 mb-8">
          {displayPlatforms.map((p) => {
            const isRealSuccess = p.status === "posted" || p.status === "scheduled" || isScheduled
            return (
              <div key={p.id} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center overflow-hidden border border-slate-100">
                    <img src={p.meta.icon} alt={p.meta.label} className="w-5 h-5 object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">{p.meta.label}</span>
                    <span className={`text-[10px] font-semibold ${isRealSuccess ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {isRealSuccess ? (p.status === "scheduled" || isScheduled ? 'Scheduled' : 'Success') : 'Failed'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View
                    </a>
                  )}
                  {isRealSuccess && (
                    <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                      <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
        <button
          onClick={onClose}
          className="px-5 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Close
        </button>
        <button
          onClick={onViewPost}
          className="px-5 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
        >
          View Post
        </button>
      </div>
    </div>
  )
}
