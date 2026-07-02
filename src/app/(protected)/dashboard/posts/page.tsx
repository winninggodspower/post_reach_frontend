import { CreatePost } from "@/features/posts/components/create-post"

export const metadata = {
  title: "Create Post | PostReach",
  description: "Compose and schedule posts across all your social channels.",
}

export default function PostsPage() {
  return <CreatePost />
}
