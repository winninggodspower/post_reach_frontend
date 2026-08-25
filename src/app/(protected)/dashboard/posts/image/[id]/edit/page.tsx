import { ImageComposer } from "@/features/posts/components/image/image-composer"

export const metadata = {
  title: "Edit Image Post | Post Reach",
  description: "Edit your scheduled social media image posts.",
}

export default async function EditImagePostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  
  return <ImageComposer postId={resolvedParams.id} />
}
