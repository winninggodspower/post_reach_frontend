"use client"

import { useParams, useRouter } from "next/navigation"
import { VideoComposer } from "@/features/posts/components/video/video-composer"

export default function EditVideoPostPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  return <VideoComposer postId={id} onBack={() => router.push("/dashboard/calendar")} />
}
