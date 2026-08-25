"use client"

import { useParams, useRouter } from "next/navigation"
import { TextComposer } from "@/features/posts/components/text/text-composer"

export default function EditTextPostPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  return <TextComposer postId={id} onBack={() => router.push("/dashboard/calendar")} />
}
