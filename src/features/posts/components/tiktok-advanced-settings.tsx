import * as React from "react"
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { useIsMounted } from "@/shared/hooks/use-is-mounted"
import { fetchTikTokCreatorInfo, type TikTokCreatorInfo } from "../api/tiktok"

interface TiktokAdvancedSettingsProps {
  register: UseFormRegister<any>
  watch: UseFormWatch<any>
  setValue?: UseFormSetValue<any>
  postType?: "video" | "photo" | "text"
}

const DEFAULT_PRIVACY_OPTIONS = [
  { value: "PUBLIC_TO_EVERYONE", label: "Public" },
  { value: "MUTUAL_FRIENDS", label: "Mutual Friends" },
  { value: "SELF_ONLY", label: "Private" },
]

const formatPrivacyLabel = (val: string) => {
  switch (val) {
    case "PUBLIC_TO_EVERYONE":
      return "Public"
    case "MUTUAL_FOLLOW_FRIENDS":
    case "MUTUAL_FRIENDS":
      return "Mutual Friends"
    case "FOLLOWER_OF_CREATOR":
      return "Followers"
    case "SELF_ONLY":
      return "Private"
    default:
      return val
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
  }
}

export function TiktokAdvancedSettings({
  register,
  watch,
  setValue,
  postType = "video",
}: TiktokAdvancedSettingsProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [creatorInfo, setCreatorInfo] = React.useState<TikTokCreatorInfo | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const isMounted = useIsMounted()
  const hasInitializedRef = React.useRef(false)
  const setValueRef = React.useRef(setValue)
  setValueRef.current = setValue
  const watchRef = React.useRef(watch)
  watchRef.current = watch

  React.useEffect(() => {
    setIsLoading(true)

    fetchTikTokCreatorInfo()
      .then((info) => {
        if (!isMounted()) return
        if (info) {
          setCreatorInfo(info)

          if (!hasInitializedRef.current) {
            hasInitializedRef.current = true

            // If TikTok account disabled comments, duet, or stitch:
            if (info.comment_disabled && setValueRef.current) {
              setValueRef.current("tiktokAllowComments", false)
            }
            if (info.duet_disabled && setValueRef.current) {
              setValueRef.current("tiktokAllowDuet", false)
            }
            if (info.stitch_disabled && setValueRef.current) {
              setValueRef.current("tiktokAllowStitch", false)
            }

            // If current privacy level is not in returned options, update it
            if (info.privacy_level_options && info.privacy_level_options.length > 0) {
              const currentLevel = watchRef.current?.("tiktokPrivacyLevel")
              if (currentLevel && !info.privacy_level_options.includes(currentLevel)) {
                setValueRef.current?.("tiktokPrivacyLevel", info.privacy_level_options[0])
              }
            }
          }
        }
      })
      .finally(() => {
        if (isMounted()) setIsLoading(false)
      })
  }, [isMounted])

  const brandContent = watch("tiktokBrandContentToggle")
  const brandOrganic = watch("tiktokBrandOrganicToggle")

  let disclosureMessage = ""
  if (brandContent) {
    disclosureMessage = "Your photo/video will be labeled as 'Paid partnership'"
  } else if (brandOrganic) {
    disclosureMessage = "Your photo/video will be labeled as 'Promotional content'"
  }

  const isCommentDisabled = creatorInfo?.comment_disabled ?? false
  const isDuetDisabled = creatorInfo?.duet_disabled ?? false
  const isStitchDisabled = creatorInfo?.stitch_disabled ?? false

  const privacyOptions =
    creatorInfo?.privacy_level_options && creatorInfo.privacy_level_options.length > 0
      ? creatorInfo.privacy_level_options.map((opt) => ({
          value: opt,
          label: formatPrivacyLabel(opt),
        }))
      : DEFAULT_PRIVACY_OPTIONS

  return (
    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full hover:opacity-80 transition-opacity cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <h5 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
            TikTok Advanced Settings
          </h5>
          {isLoading && <Loader2 className="size-3 animate-spin text-slate-400" />}
        </div>
        <span className="text-slate-400">
          {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </span>
      </button>

      {isExpanded && (
        <div className="space-y-4 animate-in slide-in-from-top-1 fade-in duration-200">
          {/* Privacy Level Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Privacy Level
            </label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-sm focus:outline-hidden focus:ring-1 focus:ring-accent-brand focus:border-accent-brand text-slate-800 dark:text-slate-100"
              {...register("tiktokPrivacyLevel")}
            >
              {privacyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Permissions Checkboxes */}
          <div className="space-y-2.5 pt-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Permissions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-2 ${
                  isCommentDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  disabled={isCommentDisabled}
                  className="rounded-sm border-slate-300 text-accent-brand focus:ring-accent-brand size-3.5 disabled:opacity-50"
                  {...register("tiktokAllowComments")}
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  Allow Comments
                  {isCommentDisabled && (
                    <span className="text-[10px] text-slate-400 block font-normal">
                      (Disabled on TikTok)
                    </span>
                  )}
                </span>
              </label>

              {postType !== "photo" && (
                <>
                  <label
                    className={`flex items-center gap-2 ${
                      isDuetDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={isDuetDisabled}
                      className="rounded-sm border-slate-300 text-accent-brand focus:ring-accent-brand size-3.5 disabled:opacity-50"
                      {...register("tiktokAllowDuet")}
                    />
                    <span className="text-xs text-slate-700 dark:text-slate-300">
                      Allow Duet
                      {isDuetDisabled && (
                        <span className="text-[10px] text-slate-400 block font-normal">
                          (Disabled on TikTok)
                        </span>
                      )}
                    </span>
                  </label>

                  <label
                    className={`flex items-center gap-2 ${
                      isStitchDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={isStitchDisabled}
                      className="rounded-sm border-slate-300 text-accent-brand focus:ring-accent-brand size-3.5 disabled:opacity-50"
                      {...register("tiktokAllowStitch")}
                    />
                    <span className="text-xs text-slate-700 dark:text-slate-300">
                      Allow Stitch
                      {isStitchDisabled && (
                        <span className="text-[10px] text-slate-400 block font-normal">
                          (Disabled on TikTok)
                        </span>
                      )}
                    </span>
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Brand Content Toggles */}
          <div className="space-y-2.5 pt-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Content Disclosure
            </label>
            <div className="grid grid-cols-1 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded-sm border-slate-300 text-accent-brand focus:ring-accent-brand size-3.5"
                  {...register("tiktokBrandContentToggle")}
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  Branded Content (Promoting another brand)
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded-sm border-slate-300 text-accent-brand focus:ring-accent-brand size-3.5"
                  {...register("tiktokBrandOrganicToggle")}
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  Brand Organic (Promoting your own brand)
                </span>
              </label>
            </div>
            {disclosureMessage && (
              <div className="mt-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                <p className="text-[11px] font-medium text-amber-800 dark:text-amber-500">
                  {disclosureMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
