import { useEffect, useState } from "react"
import { Clock, Film, Image as ImageIcon, FileText, Trash2, Edit2 } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { CalendarItem } from "@/features/posts/api/server"
import { getPlatformMeta } from "@/features/posts/components/upload-status/utils"

type CalendarPostDetailsProps = {
  post: CalendarItem | null
  onClose: () => void
}

export function CalendarPostDetails({ post, onClose }: CalendarPostDetailsProps) {
  const [mediaError, setMediaError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMediaError(false)
  }, [post])
  const getContentTypeIcon = (type: CalendarItem["content_type"]) => {
    switch (type) {
      case "video":
        return <Film className="size-3" />
      case "photo":
        return <ImageIcon className="size-3" />
      case "text":
      default:
        return <FileText className="size-3" />
    }
  }

  const isEditable = post?.platforms.some(p => p.status === 'scheduled' || p.status === 'pending')

  return (
    <Sheet open={!!post} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[400px] sm:max-w-md p-0 flex flex-col border-l border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {post && (
          <>
            {/* Visually hidden header for Radix accessibility */}
            <SheetHeader className="sr-only">
              <SheetTitle>Post Details</SheetTitle>
              <SheetDescription>Detailed view of the selected calendar post</SheetDescription>
            </SheetHeader>

            <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 overflow-y-auto">
            {/* Edge-to-Edge Media Header */}
            {(!mediaError && (post.thumbnail_url || (post.media_urls && post.media_urls.length > 0))) ? (
              <div className="relative w-full bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                {/* Gradient for close button visibility */}
                <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/50 to-transparent pointer-events-none z-10" />
                
                {post.content_type === "video" ? (
                  post.thumbnail_url ? (
                    <div className="relative aspect-video w-full">
                      <img src={post.thumbnail_url} alt="Video thumbnail" className="w-full h-full object-cover" onError={() => setMediaError(true)} />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl border border-white/20">
                          <Film className="size-5 text-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : post.media_urls && post.media_urls[0] ? (
                    <div className="relative">
                      <video 
                        src={post.media_urls[0]} 
                        className="w-full aspect-video object-cover"
                        controls
                        onError={() => setMediaError(true)}
                      />
                    </div>
                  ) : null
                ) : post.content_type === "photo" && post.media_urls ? (
                  <div className={`grid gap-0.5 w-full ${post.media_urls.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                    {post.media_urls.map((url, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={url} 
                          alt={`Post image ${idx + 1}`} 
                          className={`w-full object-cover ${post.media_urls!.length === 1 ? 'aspect-video' : 'aspect-square'}`}
                          onError={() => setMediaError(true)}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
               // Header if no media
               <SheetHeader className="pt-12 px-6 sm:px-8 pb-2">
                 <SheetTitle className="text-xl">Post Details</SheetTitle>
                 <SheetDescription className="sr-only">Detailed view of the selected calendar post</SheetDescription>
               </SheetHeader>
            )}

            <div className={`flex-1 flex flex-col p-6 sm:p-8 space-y-8 ${(!mediaError && (post.thumbnail_url || (post.media_urls && post.media_urls.length > 0))) ? 'pt-6' : 'pt-0'}`}>
              
              {/* Date & Time Header */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {new Date(post.scheduled_at || post.created_at).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </h2>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider shadow-sm ${
                    post.content_type === "video" ? "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400" :
                    post.content_type === "photo" ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400" :
                    "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400"
                  }`}>
                    {getContentTypeIcon(post.content_type)}
                    {post.content_type}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium text-sm">
                  <Clock className="size-4" />
                  {new Date(post.scheduled_at || post.created_at).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                </div>
              </div>

              {/* Caption (Glassmorphic) */}
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-slate-100 to-slate-50 dark:from-slate-900/80 dark:to-slate-950/80 rounded-2xl blur-sm -z-10" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 break-words leading-relaxed whitespace-pre-wrap bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                  {post.caption || <span className="text-slate-400 italic">No caption provided</span>}
                </p>
              </div>

              {/* Platforms Section */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 flex flex-col gap-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Destinations</h3>
                <div className="flex flex-col gap-3">
                  {post.platforms.map((plat) => {
                    const meta = getPlatformMeta(plat.platform)
                    const Wrapper = plat.post_url ? "a" : "div"
                    
                    return (
                      <Wrapper
                        key={plat.id}
                        href={plat.post_url || undefined}
                        target={plat.post_url ? "_blank" : undefined}
                        rel={plat.post_url ? "noreferrer" : undefined}
                        className={`group flex items-center justify-between bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm transition-all overflow-hidden ${
                          plat.post_url ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 hover:shadow-md hover:-translate-y-0.5" : ""
                        }`}
                        title={plat.post_url ? `View on ${meta.label}` : undefined}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-900 w-9 h-9 rounded-full border border-slate-100 dark:border-slate-800 group-hover:bg-white dark:group-hover:bg-slate-950 transition-colors shrink-0">
                            <img src={meta.icon} alt={meta.label} className="w-4 h-4 object-contain" />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1 pr-2">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                              {meta.label}
                            </span>
                            {plat.error_message && (
                              <span className="text-[11px] font-medium text-red-500 truncate mt-0.5 w-full block" title={plat.error_message}>
                                {plat.error_message}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 pl-3 border-l border-slate-100 dark:border-slate-800 shrink-0">
                          <span className={`text-xs font-bold capitalize ${
                            plat.status === 'posted' ? 'text-green-600 dark:text-green-500' :
                            plat.status === 'failed' ? 'text-red-600 dark:text-red-500' :
                            (plat.status === 'processing' || plat.status === 'uploading') ? 'text-amber-600 dark:text-amber-500' :
                            'text-blue-600 dark:text-blue-500'
                          }`}>
                            {plat.status}
                          </span>
                          <div className={`w-2 h-2 rounded-full shrink-0 ${
                            plat.status === 'posted' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                            plat.status === 'failed' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                            (plat.status === 'processing' || plat.status === 'uploading') ? 'bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                            'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                          }`} />
                        </div>
                      </Wrapper>
                    )
                  })}
                </div>
              </div>
            </div>
            
            </div>
            
            {isEditable && (
              <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0 flex items-center justify-between gap-4">
                <Button 
                  variant="outline" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:border-red-900/30 dark:hover:bg-red-950/30 shadow-sm"
                  onClick={() => {
                    alert(`Simulating deletion for post ${post.id}`)
                    onClose()
                  }}
                >
                  <Trash2 className="size-4 mr-2" />
                  Delete Post
                </Button>
                <Button 
                  className="flex-1 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 shadow-sm"
                  onClick={() => {
                    const routeType = post.content_type === "photo" ? "image" : post.content_type
                    router.push(`/dashboard/posts/${routeType}/${post.id}/edit`)
                    onClose()
                  }}
                >
                  <Edit2 className="size-4 mr-2" />
                  Edit Post
                </Button>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
