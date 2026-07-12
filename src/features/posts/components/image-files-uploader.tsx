"use client"

import * as React from "react"
import { Image as LucideImage, Plus, X, FileImage, ChevronLeft, ChevronRight } from "lucide-react"

type ImageFilesUploaderProps = {
  imageFiles: File[]
  imageSrcs: string[]
  onFileChange: (files: File[]) => void
  onRemoveImage: (index: number) => void
}

export function ImageFilesUploader({
  imageFiles,
  imageSrcs,
  onFileChange,
  onRemoveImage,
}: ImageFilesUploaderProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [showScrollLeft, setShowScrollLeft] = React.useState(false)
  const [showScrollRight, setShowScrollRight] = React.useState(false)

  const triggerFileSelect = () => {
    const input = document.getElementById("image-upload-input")
    input?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const processFiles = (fileList: FileList) => {
    const validFiles: File[] = []
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      if (file.type.startsWith("image/")) {
        validFiles.push(file)
      }
    }
    
    if (validFiles.length > 0) {
      onFileChange([...imageFiles, ...validFiles])
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files)
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const totalSize = React.useMemo(() => {
    const total = imageFiles.reduce((acc, file) => acc + file.size, 0)
    return formatBytes(total)
  }, [imageFiles])

  const updateScrollButtons = React.useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowScrollLeft(scrollLeft > 5)
      setShowScrollRight(scrollLeft + clientWidth < scrollWidth - 5)
    }
  }, [])

  React.useEffect(() => {
    const timer = setTimeout(updateScrollButtons, 150)
    return () => clearTimeout(timer)
  }, [imageSrcs, updateScrollButtons])

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -220 : 220
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 font-sans">
          Media Files ({imageFiles.length})
        </h3>
        {imageFiles.length > 0 && (
          <span className="text-xs text-slate-500 font-medium">
            Total Size: {totalSize}
          </span>
        )}
      </div>

      <input
        type="file"
        id="image-upload-input"
        accept="image/*"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={imageFiles.length === 0 ? triggerFileSelect : undefined}
        className={`group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl py-8 px-6 text-center transition-all duration-300 ${
          imageFiles.length === 0 
            ? "hover:border-accent-brand/50 dark:hover:border-accent-brand/40 cursor-pointer py-14" 
            : ""
        }`}
      >
        {imageFiles.length === 0 ? (
          <>
            <div className="size-14 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-accent-brand shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition duration-300">
              <FileImage className="size-6" />
            </div>

            <h4 className="mt-4 text-base font-semibold text-slate-855 dark:text-slate-200">
              Click to upload or drag and drop images
            </h4>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              PNG, JPG, JPEG, or WebP formats. You can select multiple images to publish as a carousel.
            </p>
            <div className="mt-6 flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 shadow-2xs">
              <Plus className="size-3.5 text-slate-450 dark:text-slate-500" />
              <span>Import images</span>
            </div>
          </>
        ) : (
          <div className="w-full space-y-4">
            {/* Scroll Container wrapper */}
            <div className="relative w-full group/scroll-wrap">
              {/* Left Arrow Button */}
              {showScrollLeft && (
                <button
                  type="button"
                  onClick={() => handleScroll("left")}
                  className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 size-8 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-full flex items-center justify-center shadow-md border border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-850 transition duration-200 cursor-pointer"
                  title="Scroll Left"
                >
                  <ChevronLeft className="size-4" />
                </button>
              )}

              {/* Right Arrow Button */}
              {showScrollRight && (
                <button
                  type="button"
                  onClick={() => handleScroll("right")}
                  className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 size-8 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-full flex items-center justify-center shadow-md border border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-850 transition duration-200 cursor-pointer"
                  title="Scroll Right"
                >
                  <ChevronRight className="size-4" />
                </button>
              )}

              {/* Horizontal Scroll list of uploaded images */}
              <div 
                ref={scrollContainerRef}
                onScroll={updateScrollButtons}
                className="flex gap-3 overflow-x-auto pb-3 snap-x scrollbar-none scroll-smooth"
              >
                {imageSrcs.map((src, index) => (
                  <div 
                    key={index}
                    className="relative shrink-0 w-32 aspect-square rounded-xl overflow-hidden border border-slate-200/60 dark:border-slate-800 snap-start group/thumb shadow-xs"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="size-full object-cover"
                    />
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center gap-2 transition duration-200">
                      <button
                        type="button"
                        onClick={() => onRemoveImage(index)}
                        className="size-7 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 transition cursor-pointer"
                        title="Remove image"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>

                    {/* Badge position indicator */}
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                      {index + 1}
                    </div>
                  </div>
                ))}

                {/* Add more images box */}
                <button
                  type="button"
                  onClick={triggerFileSelect}
                  className="shrink-0 w-32 aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-accent-brand/50 hover:bg-white dark:hover:bg-slate-900/40 flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-slate-650 transition cursor-pointer"
                >
                  <Plus className="size-5" />
                  <span className="text-[9px] font-bold">Add Images</span>
                </button>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={triggerFileSelect}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  Add More
                </button>
                <button
                  type="button"
                  onClick={() => onFileChange([])}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 dark:border-rose-900/35 dark:hover:bg-rose-950/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="size-3.5" />
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
