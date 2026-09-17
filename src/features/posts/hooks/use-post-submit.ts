import { useState } from "react"
import { toast } from "sonner"
import { extractErrorMessage } from "@/shared/lib/extract-error-message"

type UsePostSubmitProps = {
  submitFn: (scheduledAt: string | undefined) => Promise<{
    success: boolean
    data?: { id?: string }
    message?: string
    error?: string
    errors?: unknown
  }>
}

export function usePostSubmit({ submitFn }: UsePostSubmitProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [createdPostId, setCreatedPostId] = useState<string | null>(null)

  const handlePublish = async (action: "schedule" | "now", scheduleDate?: string, scheduleTime?: string) => {
    if (isPublishing) return

    let scheduledAt: string | undefined = undefined
    if (action === "schedule" && scheduleDate && scheduleTime) {
      const dt = new Date(`${scheduleDate}T${scheduleTime}:00`)
      scheduledAt = dt.toISOString()
    }

    setUploadProgress(0)
    setCreatedPostId(null)
    setIsStatusModalOpen(true)
    setIsPublishing(true)

    try {
      const response = await submitFn(scheduledAt)
      if (response.success && response.data?.id) {
        setCreatedPostId(response.data.id)
        setUploadProgress(100)
      } else {
        const errorDesc =
          response.message ||
          response.error ||
          (typeof response.errors === "string" ? response.errors : undefined) ||
          "An unknown error occurred"

        toast.error("Failed to create post", {
          description: errorDesc,
        })
        setIsStatusModalOpen(false)
        setIsPublishing(false)
      }
    } catch (err: unknown) {
      const errorDesc = extractErrorMessage(err, "Failed to publish post.")
      console.error("Post submission error:", errorDesc, err)
      toast.error("Failed to create post", {
        description: errorDesc,
      })
      setIsStatusModalOpen(false)
      setIsPublishing(false)
    }
  }

  return {
    isPublishing,
    setIsPublishing,
    isStatusModalOpen,
    setIsStatusModalOpen,
    uploadProgress,
    setUploadProgress,
    createdPostId,
    setCreatedPostId,
    handlePublish,
  }
}
