import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      {/* ── Background decorative elements ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Gradient glow top-right */}
        <div className="absolute -top-40 right-0 size-96 rounded-full bg-gradient-to-br from-accent-brand/15 to-accent-dark/10 blur-3xl" />
        {/* Gradient glow bottom-left */}
        <div className="absolute -bottom-40 left-0 size-80 rounded-full bg-gradient-to-tr from-accent-brand/10 to-transparent blur-3xl" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--accent-brand) 1px, transparent 1px), linear-gradient(to bottom, var(--accent-brand) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        {/* 404 visual — broken connection / lost signal icon */}
        <div className="relative mb-10">
          {/* Outer ring */}
          <div className="flex size-40 items-center justify-center rounded-full border-2 border-accent-brand/20 bg-accent-brand/5 sm:size-48">
            {/* Inner ring */}
            <div className="flex size-28 items-center justify-center rounded-full border-2 border-accent-brand/30 bg-accent-brand/10 sm:size-36">
              {/* Lost signal icon */}
              <svg
                viewBox="0 0 64 64"
                className="size-16 text-accent-brand sm:size-20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Post card */}
                <rect x="10" y="12" width="44" height="36" rx="6" />

                {/* Broken image inside post */}
                <path d="M16 40 L28 28 L36 36 L44 28" opacity="0.8" />

                {/* Broken link / chain */}
                <path d="M22 20h6" />
                <path d="M36 20h6" />
                <path d="M28 20c0-3 2-5 5-5h1" opacity="0.5" />
                <path d="M36 25c0 3-2 5-5 5h-1" opacity="0.5" />

                {/* Small "x" badge */}
                <circle cx="48" cy="18" r="5" opacity="0.9" />
                <line x1="46" y1="16" x2="50" y2="20" />
                <line x1="50" y1="16" x2="46" y2="20" />
              </svg>
            </div>
          </div>

          {/* Floating 404 text */}
          <span className="absolute -right-4 -top-2 font-heading text-5xl font-bold text-accent-brand/20 sm:text-6xl">
            404
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Nothing scheduled here
        </h1>

        {/* Description */}
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
          This page seems to have been removed, renamed, or never scheduled in the first place.
          Even the best content calendars have missing posts.
        </p>

        {/* Divider */}
        <div className="my-8 h-px w-16 bg-gradient-to-r from-transparent via-accent-brand/40 to-transparent" />

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            className="bg-gradient-to-r from-accent-dark to-accent-brand text-white shadow-lg shadow-accent-brand/25 hover:shadow-accent-brand/40"
          >
            <Link href="/">Go to home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
