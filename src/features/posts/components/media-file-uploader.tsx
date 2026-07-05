"use client"

import * as React from "react"
import { Play, Pause, X, FileVideo, Plus, RefreshCw } from "lucide-react"

type MediaFileUploaderProps = {
  videoSrc: string
  videoFile: File | null
  videoDuration: string
  videoSize: string
  isPlaying: boolean
  videoRef: React.RefObject<HTMLVideoElement | null>
  onTogglePlay: () => void
  onRemoveVideo: () => void
  onTriggerFileSelect: () => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onVideoLoadedMetadata: (e: React.SyntheticEvent<HTMLVideoElement>) => void
}

export function MediaFileUploader({
  videoSrc,
  videoFile,
  videoDuration,
  videoSize,
  isPlaying,
  videoRef,
  onTogglePlay,
  onRemoveVideo,
  onTriggerFileSelect,
  onDragOver,
  onDrop,
  onFileChange,
  onVideoLoadedMetadata,
}: MediaFileUploaderProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 font-sans">
        Media File
      </h3>

      {!videoSrc ? (
        <div
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={onTriggerFileSelect}
          className="group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-accent-brand/50 dark:hover:border-accent-brand/40 bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl py-14 px-6 text-center cursor-pointer transition-all duration-300"
        >
          <input
            type="file"
            id="video-upload-input"
            accept="video/*"
            onChange={onFileChange}
            className="hidden"
          />

          <div className="size-14 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-accent-brand shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition duration-300">
            <FileVideo className="size-6" />
          </div>

          <h4 className="mt-4 text-base font-semibold text-slate-850 dark:text-slate-200">
            Click to upload or drag and drop
          </h4>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            MP4, WebM, or MOV formats. Vertically oriented videos (9:16) work best for Reels, TikTok, and Shorts.
          </p>
          <div className="mt-6 flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 shadow-2xs">
            <Plus className="size-3.5 text-slate-450 dark:text-slate-500" />
            <span>Import from device</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Media Playback Container */}
          <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden border border-slate-805 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-html-video-element */}
            <video
              ref={videoRef}
              src={videoSrc}
              onLoadedMetadata={onVideoLoadedMetadata}
              onClick={onTogglePlay}
              loop
              className="h-full w-full object-contain"
            />

            {!isPlaying && (
              <button
                onClick={onTogglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white hover:bg-black/50 transition cursor-pointer"
                aria-label="Play video"
              >
                <div className="size-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                  <Play className="size-8 fill-white stroke-none ml-1" />
                </div>
              </button>
            )}

            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                onClick={onRemoveVideo}
                className="size-8 rounded-full bg-black/60 hover:bg-red-600 backdrop-blur-sm text-white flex items-center justify-center transition cursor-pointer"
                title="Remove media"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 to-transparent p-4 text-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileVideo className="size-4 text-accent-brand" />
                <span className="font-medium truncate max-w-[200px]">
                  {videoFile?.name}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span>Duration: {videoDuration}</span>
                <span>Size: {videoSize}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <button
              onClick={onTriggerFileSelect}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              Replace Media
            </button>

            <button
              onClick={onTogglePlay}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-accent-brand/10 text-accent-dark hover:bg-accent-brand/20 flex items-center gap-1.5 cursor-pointer"
            >
              {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              <span>{isPlaying ? "Pause Preview" : "Play Preview"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
