"use client"

import { useState } from "react"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { deleteScheduledPost } from "@/features/posts/api/server"
import { toast } from "sonner"

type DeletePostDialogProps = {
  postId: string
  onClose?: () => void
  onDelete?: (id: string) => void
  children: React.ReactNode
}

export function DeletePostDialog({ postId, onClose, onDelete, children }: DeletePostDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDeleting(true)
    try {
      await deleteScheduledPost(postId)
      toast.success("Post deleted successfully")
      if (onClose) onClose()
      if (onDelete) onDelete(postId)
      router.refresh()
    } catch (error) {
      toast.error("Failed to delete post")
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your scheduled post and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button 
            variant="destructive" 
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? (
              <div className="size-4 mr-2 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : null}
            {isDeleting ? "Deleting..." : "Delete Post"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
