import { PostAnalyticsView } from "@/features/analytics"

export const metadata = {
  title: "Post Analytics | Post Reach",
  description: "View detailed engagement metrics and platform-by-platform analytics for your post.",
}

export default async function PostAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params

  return <PostAnalyticsView postId={resolvedParams.id} />
}
