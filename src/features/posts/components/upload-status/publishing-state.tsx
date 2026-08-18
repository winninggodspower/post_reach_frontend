import * as React from "react"
import { Check, X as XIcon, RefreshCw, MoreHorizontal } from "lucide-react"
import { getPlatformMeta, getPostUrl } from "./utils"
import { PreviewData } from "./types"
import { usePostStatus } from "../../hooks/use-post-status"
import { PlatformPostStatus } from "../../api/server"

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
      url: getPostUrl(p.platform, p.platform_post_id, contentType),
      meta: getPlatformMeta(p.platform)
    }))
    : selectedPlatforms.map((p, idx) => ({
      id: `pending-${idx}`,
      platform: p,
      status: "pending" as const,
      url: null,
      meta: getPlatformMeta(p)
    }));

  const syncProgress = React.useMemo(() => {
    if (displayPlatforms.length === 0) return 0
    let total = 0
    displayPlatforms.forEach(p => {
      if (p.status === "posted" || p.status === "scheduled" || p.status === "failed") total += 100
      else if (p.status === "uploading") total += 50
      else total += 10 // pending
    })
    return Math.round(total / displayPlatforms.length)
  }, [displayPlatforms])

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
          <span className="text-sm font-medium text-orange-500">{syncProgress}%</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${syncProgress}%` }}
          />
        </div>
      </div>

      {/* Platforms Status list */}
      {displayPlatforms.length > 0 && (
        <div className="space-y-1 mb-8">
          {displayPlatforms.map((p) => {
            const isRealSuccess = p.status === "posted" || p.status === "scheduled" || isScheduled
            const isFailed = p.status === "failed"
            const isUploadingPlatform = p.status === "uploading"
            
            return (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden">
                    <img src={p.meta.icon} alt={p.meta.label} className="w-4 h-4 object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">{p.meta.label}</span>
                    <span className={`text-[11px] font-medium ${
                      isRealSuccess ? 'text-emerald-600' : 
                      isFailed ? 'text-rose-500' : 
                      isUploadingPlatform ? 'text-slate-500 italic' : 'text-slate-400'
                    }`}>
                      {isRealSuccess ? 'Success' : 
                       isFailed ? 'Failed' : 
                       isUploadingPlatform ? 'Uploading media...' : 'Processing...'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center w-6 h-6">
                  {isRealSuccess && <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />}
                  {isFailed && <XIcon className="w-4 h-4 text-rose-500" />}
                  {isUploadingPlatform && <RefreshCw className="w-4 h-4 text-orange-400 animate-spin" />}
                  {(!isRealSuccess && !isFailed && !isUploadingPlatform) && <MoreHorizontal className="w-5 h-5 text-slate-300" />}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          Cancel
        </button>
        <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
          Minimize
        </button>
      </div>
    </div>
  )
}
