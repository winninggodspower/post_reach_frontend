import * as React from "react"
import { UseFormRegister, UseFormWatch } from "react-hook-form"
import { ChevronDown, ChevronUp } from "lucide-react"

interface TiktokAdvancedSettingsProps {
  register: UseFormRegister<any>
  watch: UseFormWatch<any>
}

export function TiktokAdvancedSettings({ register, watch }: TiktokAdvancedSettingsProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const brandContent = watch("tiktokBrandContentToggle")
  const brandOrganic = watch("tiktokBrandOrganicToggle")

  let disclosureMessage = ""
  if (brandContent) {
    disclosureMessage = "Your photo/video will be labeled as 'Paid partnership'"
  } else if (brandOrganic) {
    disclosureMessage = "Your photo/video will be labeled as 'Promotional content'"
  }

  return (
    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full hover:opacity-80 transition-opacity cursor-pointer"
      >
        <h5 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
          TikTok Advanced Settings
        </h5>
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
              <option value="PUBLIC_TO_EVERYONE">Public</option>
              <option value="MUTUAL_FRIENDS">Mutual Friends</option>
              <option value="SELF_ONLY">Private</option>
            </select>
          </div>

          {/* Permissions Checkboxes */}
          <div className="space-y-2.5 pt-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Permissions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded-sm border-slate-300 text-accent-brand focus:ring-accent-brand size-3.5"
                  {...register("tiktokAllowComments")}
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">Allow Comments</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded-sm border-slate-300 text-accent-brand focus:ring-accent-brand size-3.5"
                  {...register("tiktokAllowDuet")}
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">Allow Duet</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded-sm border-slate-300 text-accent-brand focus:ring-accent-brand size-3.5"
                  {...register("tiktokAllowStitch")}
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">Allow Stitch</span>
              </label>
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
                <span className="text-xs text-slate-700 dark:text-slate-300">Branded Content (Promoting another brand)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded-sm border-slate-300 text-accent-brand focus:ring-accent-brand size-3.5"
                  {...register("tiktokBrandOrganicToggle")}
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">Brand Organic (Promoting your own brand)</span>
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
