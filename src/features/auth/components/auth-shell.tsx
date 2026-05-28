import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

import { GridPattern } from "@/components/ui/grid-pattern"

type AuthShellProps = {
  eyebrow: string
  title: string
  description?: string
  footer: ReactNode
  children: ReactNode
}

export function AuthShell({
  eyebrow,
  title,
  description,
  footer,
  children,
}: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fffaf5_0%,#fff3e8_42%,#ffffff_100%)]">
      <GridPattern
        className="stroke-black/5 mask-[linear-gradient(to_bottom,white,transparent_90%)]"
        squares={[
          [2, 3],
          [5, 8],
          [9, 4],
          [12, 7],
        ]}
      />

      <div className="relative mx-auto grid min-h-screen max-w-375 gap-10 px-6 py-8 lg:grid-cols-[minmax(0,45%)_minmax(0,55%)] lg:px-10 lg:py-10">
        <div className="flex min-h-full flex-col">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-r from-accent-dark to-accent-brand text-sm font-bold text-white shadow-lg shadow-orange-200/70">
                PR
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-black/70">
                PostReach
              </span>
            </Link>

            <Link
              href="/"
              className="text-sm font-medium text-black/60 transition hover:text-black"
            >
              Back home
            </Link>
          </div>

          <div className="flex flex-1 items-center py-8 lg:py-12">
            <div className="w-full max-w-md max-md:mx-auto">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent-dark">
                {eyebrow}
              </p>
              <h1 className="mt-4 text-4xl leading-tight text-black md:text-5xl">
                {title}
              </h1>
              {description ? (
                <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
                  {description}
                </p>
              ) : null}

              <div className={description ? "mt-8" : "mt-6"}>{children}</div>
              <div className="mt-6 text-sm text-slate-600">{footer}</div>
            </div>
          </div>

        </div>

        <aside className="relative hidden min-h-full self-stretch overflow-hidden rounded-[32px] border border-white/60 bg-[#10233f] p-4 text-white shadow-[0_40px_100px_-50px_rgba(15,23,42,0.7)] lg:flex lg:flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.35),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.28),transparent_36%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_28%,rgba(255,255,255,0.03))]" />

          <div className="relative z-10 flex h-full flex-1 rounded-[28px] border border-white/12 bg-white/8 p-3 backdrop-blur-sm">
            <div className="relative h-full min-h-full flex-1 overflow-hidden rounded-[22px] border border-white/10 bg-[#0b1b35]/80">
              <Image
                src="/auth-shell-visual.svg"
                alt="An abstract dashboard preview for the PostReach workspace"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 520px, 0px"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
