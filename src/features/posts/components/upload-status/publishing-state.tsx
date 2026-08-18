import * as React from "react"
import { Check, X as XIcon, RefreshCw, MoreHorizontal } from "lucide-react"
import { getPlatformMeta } from "./utils"
import { PreviewData } from "./types"
import { usePostStatus } from "../../hooks/use-post-status"
import { PlatformPostStatus } from "../../api/server"
import { PostPreview } from "./post-preview"

type PublishingStateProps = {
  postId: string | null
  selectedPlatforms: string[]
  previewData?: PreviewData
  isScheduled?: boolean
  onClose: () => void
  onFinished: (statuses: PlatformPostStatus[]) => void
}

export function PublishingState({
  postId,
  selectedPlatforms,
  previewData,
  isScheduled,
  onClose,
  onFinished,
}: PublishingStateProps) {
  const { platformStatuses, contentType, isFinished } = usePostStatus({
    postId,
    enabled: true,
  })

  React.useEffect(() => {
    if (isFinished) {
      onFinished(platformStatuses)
    }
  }, [isFinished, platformStatuses, onFinished])

  const displayPlatforms = platformStatuses.length > 0
    ? platformStatuses.map(p => ({
      id: p.id,
      platform: p.platform,
      status: p.status,
      url: p.post_url,
      meta: getPlatformMeta(p.platform)
    }))
    : selectedPlatforms.map((p, idx) => ({
      id: `pending-${idx}`,
      platform: p,
      status: "pending" as const,
      url: null,
      meta: getPlatformMeta(p)
    }));

  return (
    <div className="flex flex-col p-8 pt-10 relative">
      <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
        <XIcon className="w-5 h-5" />
      </button>

      <div className="space-y-2 mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Publishing Your Post</h2>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
          <span>Multi-platform sync in progress...</span>
        </div>
      </div>

      {/* Post Preview */}
      <PostPreview previewData={previewData} />

      {/* Overall Status Indicator */}
      <div className="flex items-center gap-3 mb-6 bg-indigo-50/50 border border-indigo-100/50 p-3.5 rounded-xl shadow-sm">
        <div className="relative flex h-3 w-3 flex-shrink-0 mt-0.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-indigo-900">
            Publishing to {displayPlatforms.length} {displayPlatforms.length === 1 ? 'platform' : 'platforms'}...
          </span>
          <span className="text-xs font-medium text-indigo-700/80">
            Please wait while we distribute your content.
          </span>
        </div>
      </div>

      {/* Platforms Status list */}
      {displayPlatforms.length > 0 && (
        <div className="space-y-1 mb-8">
          {displayPlatforms.map((p) => {
            const isRealSuccess = p.status === "posted" || p.status === "scheduled" || isScheduled
            const isFailed = p.status === "failed"
            const isUploadingPlatform = p.status === "uploading"
            const isProcessingPlatform = p.status === "processing"

            return (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden">
                    <img src={p.meta.icon} alt={p.meta.label} className="w-4 h-4 object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">{p.meta.label}</span>
                    <span className={`text-[11px] font-medium ${isRealSuccess ? 'text-emerald-600' :
                        isFailed ? 'text-rose-500' :
                          isUploadingPlatform ? 'text-slate-500 italic' :
                            isProcessingPlatform ? 'text-slate-500 italic' : 'text-slate-400'
                      }`}>
                      {isRealSuccess ? 'Success' :
                        isFailed ? 'Failed' :
                          isUploadingPlatform ? 'Uploading media...' :
                            isProcessingPlatform ? 'Processing on platform...' : 'Processing...'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center w-6 h-6">
                  {isRealSuccess && <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />}
                  {isFailed && <XIcon className="w-4 h-4 text-rose-500" />}
                  {isUploadingPlatform && <RefreshCw className="w-4 h-4 text-orange-400 animate-spin" />}
                  {isProcessingPlatform && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />}
                  {(!isRealSuccess && !isFailed && !isUploadingPlatform && !isProcessingPlatform) && <MoreHorizontal className="w-5 h-5 text-slate-300" />}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors shadow-sm">
          Minimize
        </button>
      </div>
    </div>
  )
}
