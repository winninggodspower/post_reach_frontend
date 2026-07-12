"use client"

import * as React from "react"
import Image from "next/image"
import { Play, Pause, X, FileVideo, Plus, RefreshCw, Image as LucideImage } from "lucide-react"

type MediaFileUploaderProps = {
  videoSrc: string
  videoFile: File | null
  isPlaying: boolean
  videoRef: React.RefObject<HTMLVideoElement | null>
  thumbnailDataUrl: string
  onTogglePlay: () => void
  onFileChange: (file: File | null) => void
  onOpenThumbnailPicker: () => void
}

export function MediaFileUploader({
  videoSrc,
  videoFile,
  isPlaying,
  videoRef,
  thumbnailDataUrl,
  onTogglePlay,
  onFileChange,
  onOpenThumbnailPicker,
}: MediaFileUploaderProps) {
  const [videoDuration, setVideoDuration] = React.useState("0:00")
  const [videoSize, setVideoSize] = React.useState("")

  React.useEffect(() => {
    if (videoFile) {
      const sizeInMB = (videoFile.size / (1024 * 1024)).toFixed(1)
      setVideoSize(`${sizeInMB} MB`)
    } else {
      setVideoSize("")
      setVideoDuration("0:00")
    }
  }, [videoFile])

  const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget
    const minutes = Math.floor(video.duration / 60)
    const seconds = Math.floor(video.duration % 60)
    setVideoDuration(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`)
  }

  const triggerFileSelect = () => {
    const input = document.getElementById("video-upload-input")
    input?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("video/")) {
        onFileChange(file)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type.startsWith("video/")) {
        onFileChange(file)
      }
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 font-sans">
        Media File
      </h3>

      <input
        type="file"
        id="video-upload-input"
        accept="video/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {!videoSrc ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
          className="group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-accent-brand/50 dark:hover:border-accent-brand/40 bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl py-14 px-6 text-center cursor-pointer transition-all duration-300"
        >
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
              onLoadedMetadata={handleVideoLoadedMetadata}
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
                onClick={() => onFileChange(null)}
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
            <div className="flex gap-4">
              <button
                onClick={triggerFileSelect}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="size-3.5" />
                Replace Media
              </button>

              <button
                onClick={onOpenThumbnailPicker}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80"
              >
                {thumbnailDataUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumbnailDataUrl} alt="Cover" className="size-5 rounded object-cover border border-slate-300 dark:border-slate-600" />
                    <span className="text-slate-700 dark:text-slate-300">Change Cover</span>
                  </>
                ) : (
                  <>
                    <LucideImage className="size-3.5 text-slate-500" />
                    <span className="text-slate-700 dark:text-slate-300">Set Cover</span>
                  </>
                )}
              </button>
            </div>

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
