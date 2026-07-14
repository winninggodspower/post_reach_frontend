import { useState } from "react"
import { toast } from "sonner"

type UsePostSubmitProps = {
  submitFn: (scheduledAt: string | undefined) => Promise<{ success: boolean; data?: { id: string }; error?: string }>
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
        toast.error("Failed to create post", {
          description: response.error || "An unknown error occurred",
        })
        setIsStatusModalOpen(false)
        setIsPublishing(false)
      }
    } catch (err: any) {
      console.error(err)
      toast.error("An error occurred", {
        description: err.message || "Failed to publish post.",
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
