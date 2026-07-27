"use client"

import * as React from "react"
import { ModalShell } from "@/components/ui/modal-shell"

type ThumbnailPickerModalProps = {
  videoSrc: string
  currentThumbnail: string
  initialTimestamp?: number
  onSelect: (dataUrl: string, timestamp: number) => void
  onClose: () => void
}

export function ThumbnailPickerModal({
  videoSrc,
  currentThumbnail,
  initialTimestamp = 0,
  onSelect,
  onClose,
}: ThumbnailPickerModalProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [sliderValue, setSliderValue] = React.useState(initialTimestamp)
  const [duration, setDuration] = React.useState(0)
  const [isReady, setIsReady] = React.useState(false)
  const [aspectRatio, setAspectRatio] = React.useState<number>(16 / 9) // Default fallback
  const isSeekingRef = React.useRef(false)
  const pendingTimeRef = React.useRef<number | null>(null)

  const handleLoadedData = () => {
    const video = videoRef.current
    if (!video) return
    setDuration(video.duration || 0)
    if (video.videoWidth && video.videoHeight) {
      setAspectRatio(video.videoWidth / video.videoHeight)
    }
    video.currentTime = initialTimestamp
    setIsReady(true)
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setSliderValue(val)
    if (videoRef.current) {
      if (!isSeekingRef.current) {
        isSeekingRef.current = true
        videoRef.current.currentTime = val
      } else {
        pendingTimeRef.current = val
      }
    }
  }

  const handleSeeked = () => {
    isSeekingRef.current = false
    if (pendingTimeRef.current !== null && videoRef.current) {
      const nextTime = pendingTimeRef.current
      pendingTimeRef.current = null
      isSeekingRef.current = true
      videoRef.current.currentTime = nextTime
    }
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  const maxModalWidth = aspectRatio < 1 ? "max-w-md" : "max-w-2xl"

  const handleSetCover = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (video && canvas) {
      // Capture at full resolution for the final selected cover
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const fullResDataUrl = canvas.toDataURL("image/jpeg", 0.9)
        const offsetInMs = Math.round(sliderValue * 1000)
        onSelect(fullResDataUrl, offsetInMs)
      }
    }
    onClose()
  }

  const footer = (
    <>
      <button
        onClick={onClose}
        className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
      >
        Cancel
      </button>
      <button
        onClick={handleSetCover}
        disabled={!isReady}
        className="px-4 py-2 text-xs font-semibold rounded-xl bg-accent-brand text-white hover:bg-accent-dark transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Set as Cover
      </button>
    </>
  )

  return (
    <ModalShell
      isOpen={true}
      onClose={onClose}
      title="Select Cover Frame"
      showPulseAccent={true}
      maxWidthClass={maxModalWidth}
      footerContent={footer}
    >
      <div className="space-y-5">
        {/* Dynamic layout depending on if a current thumbnail exists */}
        <div className={currentThumbnail ? "grid grid-cols-2 gap-6" : "flex justify-center w-full"}>
          {/* New frame preview */}
          <div className={`space-y-2 flex flex-col items-center ${currentThumbnail ? "" : "w-full"}`}>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide self-start">
              New cover image
            </p>
            {/* eslint-disable-next-line @next/next/no-html-video-element */}
            <video
              ref={videoRef}
              src={videoSrc}
              className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 w-auto h-auto max-h-[45vh] max-w-full"
              style={{ aspectRatio: `${aspectRatio}` }}
              preload="auto"
              muted
              playsInline
              onLoadedData={handleLoadedData}
              onSeeked={handleSeeked}
            />
          </div>

          {/* Current cover */}
          {currentThumbnail && (
            <div className="space-y-2 flex flex-col items-center">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide self-start">
                Current cover
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentThumbnail}
                alt="Current thumbnail"
                className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 w-auto h-auto max-h-[45vh] max-w-full"
                style={{ aspectRatio: `${aspectRatio}` }}
              />
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/* Scrub slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-accent-brand inline-block" />
              Use this bar to select your cover frame
            </span>
            <span className="font-mono tabular-nums">
              {formatTime(sliderValue)} / {formatTime(duration)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.01}
            value={sliderValue}
            onChange={handleSliderChange}
            disabled={!isReady}
            style={{ accentColor: "#fb923c" }}
            className="w-full cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </ModalShell>
  )
}
