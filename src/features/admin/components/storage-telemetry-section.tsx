"use client"

import React from "react"
import {
  HardDrive,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Trash2,
  Info,
} from "lucide-react"
import { AdminStorageMetrics } from "../types"

interface StorageTelemetrySectionProps {
  storage: AdminStorageMetrics
}

export const StorageTelemetrySection: React.FC<
  StorageTelemetrySectionProps
> = ({ storage }) => {
  const pending = storage.pending_uploads || {
    total: 0,
    claimed: 0,
    unclaimed: 0,
  }

  const totalPending = Math.max(pending.total || 0, 1)
  const claimRate = Math.min(
    100,
    Math.round(((pending.claimed || 0) / totalPending) * 100)
  )

  const hasUnclaimed = (pending.unclaimed || 0) > 0

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Media Assets
            </span>
            <div className="size-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <HardDrive className="size-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
            {storage.total_media_items.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-2">Active cloud storage assets</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Claimed Uploads
            </span>
            <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
              {pending.claimed.toLocaleString()}
            </p>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
              ({claimRate}%)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Linked to active posts or drafts</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Unclaimed Uploads
            </span>
            <div
              className={`size-8 rounded-xl flex items-center justify-center border ${
                hasUnclaimed
                  ? "bg-amber-50 text-amber-600 border-amber-200"
                  : "bg-slate-50 text-slate-400 border-slate-200"
              }`}
            >
              <AlertTriangle className="size-4" />
            </div>
          </div>
          <p
            className={`mt-2 text-2xl sm:text-3xl font-extrabold leading-none ${
              hasUnclaimed ? "text-amber-600" : "text-slate-900"
            }`}
          >
            {pending.unclaimed.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {hasUnclaimed ? "Orphaned files awaiting GC" : "Zero orphaned uploads"}
          </p>
        </div>
      </div>

      {/* Unclaimed Uploads Alert Banner */}
      {hasUnclaimed && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900">
          <Info className="size-5 shrink-0 text-amber-600 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold">Storage Garbage Collection Opportunity:</span>{" "}
            There {pending.unclaimed === 1 ? "is" : "are"}{" "}
            <span className="font-bold">{pending.unclaimed}</span> unattached media upload
            {pending.unclaimed === 1 ? "" : "s"} uploaded via presigned URL but never bound to a post.
            These can safely be pruned by background retention jobs.
          </div>
        </div>
      )}

      {/* Detailed Telemetry Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Pending Uploads Pipeline</h3>
            <p className="text-xs text-slate-500">
              Direct-to-cloud upload lifecycle and reconciliation status
            </p>
          </div>
          <div className="text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5">
            <UploadCloud className="size-3.5 text-accent-brand" />
            <span>{pending.total} sessions</span>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-slate-700">Upload Claim Ratio</span>
              <span className="font-bold text-slate-900">{claimRate}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden flex">
              <div
                style={{ width: `${claimRate}%` }}
                className="h-full bg-emerald-500 transition-all duration-700"
                title={`Claimed: ${pending.claimed}`}
              />
              <div
                style={{ width: `${100 - claimRate}%` }}
                className="h-full bg-amber-500 transition-all duration-700"
                title={`Unclaimed: ${pending.unclaimed}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-start gap-3 rounded-xl bg-slate-50/70 p-4 border border-slate-100">
              <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                <FileCheck className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Claimed Uploads</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">{pending.claimed}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Successfully linked to published posts or schedule drafts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-slate-50/70 p-4 border border-slate-100">
              <div className="size-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
                <Trash2 className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unclaimed Uploads</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">{pending.unclaimed}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Uploaded directly but post creation aborted or discarded by user.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
