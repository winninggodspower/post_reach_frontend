"use client"

import * as React from "react"
import confetti from "canvas-confetti"
import { useRouter } from "next/navigation"
import { PlatformPostStatus } from "../api/server"

import { UploadingState } from "./upload-status/uploading-state"
import { PublishingState } from "./upload-status/publishing-state"
import { FinishedState } from "./upload-status/finished-state"

type UploadStatusModalProps = {
  isOpen: boolean
  onClose: () => void
  postId: string | null
  uploadProgress: number
  postType?: "video" | "photo" | "text"
  isScheduled?: boolean
  selectedPlatforms?: string[]
  previewData?: {
    title: string
    caption: string
    imageSrc?: string
  }
  fileSizeBytes?: number
}

export function UploadStatusModal({
  isOpen,
  onClose,
  postId,
  uploadProgress,
  postType,
  isScheduled = false,
  selectedPlatforms = [],
  previewData,
  fileSizeBytes
}: UploadStatusModalProps) {
  const router = useRouter()
  
  const [finalStatuses, setFinalStatuses] = React.useState<PlatformPostStatus[] | null>(null)

  const isUploading = uploadProgress < 100 && postType !== "text"
  
  const isFinished = React.useMemo(() => {
    if (isScheduled) return postType === "text" ? !!postId : uploadProgress === 100
    return finalStatuses !== null
  }, [isScheduled, uploadProgress, postType, postId, finalStatuses])

  const isPublishing = !isUploading && !isFinished

  const confettiFiredRef = React.useRef(false)

  // Reset confetti and statuses when modal is opened for a new post
  React.useEffect(() => {
    if (isOpen) {
      confettiFiredRef.current = false
      setFinalStatuses(null)
    }
  }, [isOpen, postId])

  // Trigger confetti when at least one platform successfully publishes or when post is successfully scheduled
  React.useEffect(() => {
    const isScheduledSuccess = isScheduled && (postType === "text" ? !!postId : uploadProgress === 100)
    const isNormalSuccess = !isScheduled && isFinished && finalStatuses !== null && finalStatuses.some((p) => p.status === "posted")

    if ((isScheduledSuccess || isNormalSuccess) && !confettiFiredRef.current) {
      confettiFiredRef.current = true
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [isFinished, finalStatuses, isScheduled, uploadProgress, postType, postId])

  if (!isOpen) return null;

  const totalMB = fileSizeBytes ? (fileSizeBytes / (1024 * 1024)).toFixed(1) : null;
  const currentMB = fileSizeBytes ? ((fileSizeBytes * (uploadProgress / 100)) / (1024 * 1024)).toFixed(1) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-[440px] shadow-2xl overflow-hidden flex flex-col">
        {isUploading && (
          <UploadingState
            postType={postType}
            uploadProgress={uploadProgress}
            totalMB={totalMB}
            currentMB={currentMB}
            selectedPlatforms={selectedPlatforms}
            onCancel={onClose}
          />
        )}

        {isPublishing && (
          <PublishingState
            postId={postId}
            selectedPlatforms={selectedPlatforms}
            previewData={previewData}
            isScheduled={isScheduled}
            onClose={onClose}
            onFinished={setFinalStatuses}
          />
        )}

        {isFinished && (
          <FinishedState
            isScheduled={isScheduled}
            finalStatuses={finalStatuses}
            selectedPlatforms={selectedPlatforms}
            contentType={postType || null}
            previewData={previewData}
            onClose={onClose}
            onViewPost={() => router.push("/dashboard/calendar")}
          />
        )}
      </div>
    </div>
  )
}
