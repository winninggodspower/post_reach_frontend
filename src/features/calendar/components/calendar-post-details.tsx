import { Clock, Film, Image as ImageIcon, FileText } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { CalendarItem } from "@/features/posts/api/server"
import { getPlatformMeta } from "@/features/posts/components/upload-status/utils"

type CalendarPostDetailsProps = {
  post: CalendarItem | null
  onClose: () => void
}

export function CalendarPostDetails({ post, onClose }: CalendarPostDetailsProps) {
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

  return (
    <Sheet open={!!post} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[400px] sm:max-w-md overflow-y-auto p-6 sm:p-8 flex flex-col">
        <SheetHeader>
          <SheetTitle>Post Details</SheetTitle>
        </SheetHeader>
        {post && (
          <div className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                  post.content_type === "video" ? "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400" :
                  post.content_type === "photo" ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400" :
                  "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
                }`}>
                {getContentTypeIcon(post.content_type)}
                {post.content_type}
              </span>
              <span className="text-xs font-bold text-slate-400">
                {new Date(post.scheduled_at || post.created_at).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 break-words leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              {post.caption || <span className="text-slate-400 italic">No caption provided</span>}
            </p>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full text-xs font-bold shadow-xs border border-slate-200/50 dark:border-slate-700/50">
                <Clock className="size-3.5" />
                {new Date(post.scheduled_at || post.created_at).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>

              <div className="flex flex-wrap gap-2">
                {post.platforms.map((plat) => {
                  const meta = getPlatformMeta(plat.platform)
                  const Wrapper = plat.post_url ? "a" : "div"
                  return (
                    <Wrapper
                      key={plat.id}
                      href={plat.post_url || undefined}
                      target={plat.post_url ? "_blank" : undefined}
                      rel={plat.post_url ? "noreferrer" : undefined}
                      className={`flex items-center gap-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full px-2.5 py-1.5 shadow-xs ${
                        plat.post_url ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors" : ""
                      }`}
                      title={plat.post_url ? `View on ${meta.label}` : meta.label}
                    >
                      <img src={meta.icon} alt={meta.label} className="w-4 h-4 object-contain" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {meta.label}
                      </span>
                    </Wrapper>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
