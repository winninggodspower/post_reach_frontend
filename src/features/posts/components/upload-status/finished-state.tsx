import * as React from "react"
import { Check, ExternalLink, X, AlertTriangle } from "lucide-react"
import { getPlatformMeta, getPostUrl } from "./utils"
import { PreviewData } from "./types"
import { PlatformPostStatus } from "../../api/server"
import { PostPreview } from "./post-preview"

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
  const failedCount = finalStatuses ? finalStatuses.filter(s => s.status === "failed").length : 0;
  const totalCount = finalStatuses ? finalStatuses.length : selectedPlatforms.length;
  const isAllFailed = totalCount > 0 && failedCount === totalCount;
  const isPartialSuccess = failedCount > 0 && failedCount < totalCount;
  const isAllSuccess = failedCount === 0;
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
      {isAllSuccess && (
        <div className="mx-auto mb-5 w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border-4 border-emerald-500/10">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>
      )}
      {isAllFailed && (
        <div className="mx-auto mb-5 w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center border-4 border-rose-500/10">
          <X className="w-8 h-8 stroke-[3]" />
        </div>
      )}
      {isPartialSuccess && (
        <div className="mx-auto mb-5 w-14 h-14 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center border-4 border-orange-500/10">
          <AlertTriangle className="w-8 h-8 stroke-[3]" />
        </div>
      )}

      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {isAllSuccess
            ? (isScheduled ? "Post Scheduled Successfully!" : "Post Published Successfully!")
            : isAllFailed
            ? "Failed to Publish Post"
            : "Partially Published Post"}
        </h2>
        <div className={`flex items-center justify-center gap-1.5 text-sm font-medium ${isAllSuccess ? 'text-emerald-600' : isAllFailed ? 'text-rose-600' : 'text-orange-600'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isAllSuccess ? 'bg-emerald-500' : isAllFailed ? 'bg-rose-500' : 'bg-orange-500'}`}></span>
          <span>
            {isAllSuccess
              ? "All platforms synced successfully"
              : isAllFailed
              ? "Failed on all selected platforms"
              : `${totalCount - failedCount} of ${totalCount} platforms successful`}
          </span>
        </div>
      </div>

      {/* Post Preview (mockup) */}
      <PostPreview previewData={previewData} />

      {/* Overall Progress */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-end">
          <span className="text-sm font-medium text-slate-700">Overall Progress</span>
          <span className={`text-sm font-medium ${isAllFailed ? 'text-rose-600' : isPartialSuccess ? 'text-orange-600' : 'text-emerald-600'}`}>100%</span>
        </div>
        <div className={`h-2.5 w-full rounded-full overflow-hidden ${isAllFailed ? 'bg-rose-50' : isPartialSuccess ? 'bg-orange-50' : 'bg-emerald-50'}`}>
          <div className={`h-full w-full rounded-full ${isAllFailed ? 'bg-rose-500' : isPartialSuccess ? 'bg-orange-500' : 'bg-emerald-500'}`} />
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
