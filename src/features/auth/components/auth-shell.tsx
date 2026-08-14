import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

import { GridPattern } from "@/components/ui/grid-pattern"
import { AuthCarousel } from "./auth-carousel"

type AuthShellProps = {
  title: string
  description?: string
  footer: ReactNode
  children: ReactNode
}

export function AuthShell({
  title,
  description,
  footer,
  children,
}: AuthShellProps) {
  return (
    <div className="relative flex h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#fff3e8_42%,#ffffff_100%)]">
      <GridPattern
        className="stroke-black/5 mask-[linear-gradient(to_bottom,white,transparent_90%)]"
        squares={[
          [2, 3],
          [5, 8],
          [9, 4],
          [12, 7],
        ]}
      />

      <div className="scrollbar-thin relative flex w-full flex-col overflow-y-auto px-6 py-8 lg:w-[45%] lg:px-10 lg:py-10">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/postglee-logo.png"
              alt="PostGlee logo"
              width={112}
              height={112}
              className="rounded-lg w-28 h-auto object-contain"
            />
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-black/60 transition hover:text-black"
          >
            Back home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-8 lg:py-12">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-6 px-2">
              <h1 className="text-3xl font-medium leading-tight text-black">
                {title}
              </h1>
              {description ? (
                <p className="mt-1.5 max-w-md text-sm leading-6 text-slate-600">
                  {description}
                </p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-black/8 bg-white/90 p-8 shadow-lg shadow-black/5 backdrop-blur">
              <div>{children}</div>
              <div className="mt-6 text-sm text-slate-600">{footer}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - full viewport height animated visual, no padding */}
      <aside className="relative hidden h-screen w-[55%] shrink-0 overflow-hidden lg:block">
        <AuthCarousel />
      </aside>
    </div>
  )
}
