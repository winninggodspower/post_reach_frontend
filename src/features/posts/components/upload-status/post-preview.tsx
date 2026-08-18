import * as React from "react"
import { PreviewData } from "./types"

interface PostPreviewProps {
  previewData?: PreviewData
}

export function PostPreview({ previewData }: PostPreviewProps) {
  if (!previewData || (!previewData.title && !previewData.caption && !previewData.imageSrc && !previewData.videoSrc)) {
    return null
  }

  return (
    <div className="flex gap-4 p-4 bg-slate-50 rounded-xl mb-6 border border-slate-100/60 items-center">
      {(previewData.imageSrc || previewData.videoSrc) && (
        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-200 relative border border-slate-200">
          {previewData.imageSrc ? (
            <img src={previewData.imageSrc} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <video src={`${previewData.videoSrc}#t=0.1`} className="w-full h-full object-cover" muted playsInline />
          )}
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
  )
}
