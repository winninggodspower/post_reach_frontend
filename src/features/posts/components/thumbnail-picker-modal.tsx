"use client"

import * as React from "react"
import { ModalShell } from "@/components/ui/modal-shell"

type ThumbnailPickerModalProps = {
  videoSrc: string
  currentThumbnail: string
  onSelect: (dataUrl: string, timestamp: number) => void
  onClose: () => void
}

export function ThumbnailPickerModal({
  videoSrc,
  currentThumbnail,
  onSelect,
  onClose,
}: ThumbnailPickerModalProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [sliderValue, setSliderValue] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [previewDataUrl, setPreviewDataUrl] = React.useState("")
  const [isReady, setIsReady] = React.useState(false)
  const [aspectRatio, setAspectRatio] = React.useState<number>(16 / 9) // Default fallback

  const captureFrame = React.useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.videoWidth === 0) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    setPreviewDataUrl(canvas.toDataURL("image/jpeg", 0.9))
  }, [])

  const handleLoadedData = () => {
    const video = videoRef.current
    if (!video) return
    setDuration(video.duration || 0)
    if (video.videoWidth && video.videoHeight) {
      setAspectRatio(video.videoWidth / video.videoHeight)
    }
    setIsReady(true)
    captureFrame()
  }

  const handleSeeked = () => {
    captureFrame()
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setSliderValue(val)
    if (videoRef.current) {
      videoRef.current.currentTime = val
    }
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  const maxModalWidth = aspectRatio < 1 ? "max-w-md" : "max-w-2xl"

  const footer = (
    <>
      <button
        onClick={onClose}
        className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
      >
        Cancel
      </button>
      <button
        onClick={() => {
          if (previewDataUrl) onSelect(previewDataUrl, sliderValue)
          onClose()
        }}
        disabled={!previewDataUrl}
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
        <div className={currentThumbnail ? "grid grid-cols-2 gap-6" : "flex justify-center"}>
          {/* New frame preview */}
          <div className={`space-y-2 ${currentThumbnail ? "" : "w-full max-w-xs"}`}>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              New cover image
            </p>
            <div 
              className="rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-slate-800 relative w-full max-h-[45vh]"
              style={{ aspectRatio: `${aspectRatio}` }}
            >
              {previewDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewDataUrl} alt="Selected frame" className="w-full h-full max-h-[45vh] object-contain" />
              ) : (
                <div className="text-slate-600 text-xs animate-pulse">Loading...</div>
              )}
            </div>
          </div>

          {/* Current cover */}
          {currentThumbnail && (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Current cover
              </p>
              <div 
                className="rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-slate-800 w-full max-h-[45vh]"
                style={{ aspectRatio: `${aspectRatio}` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentThumbnail} alt="Current thumbnail" className="w-full h-full max-h-[45vh] object-contain" />
              </div>
            </div>
          )}
        </div>

        {/* Hidden video + canvas for frame capture */}
        {/* eslint-disable-next-line @next/next/no-html-video-element */}
        <video
          ref={videoRef}
          src={videoSrc}
          className="hidden"
          preload="auto"
          muted
          playsInline
          onLoadedData={handleLoadedData}
          onSeeked={handleSeeked}
        />
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
