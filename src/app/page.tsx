import Link from "next/link"

import Navbar from "@/components/navbar"
import { GridPattern } from "@/components/ui/grid-pattern"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col text-foreground">
      <Navbar />

      <section className="overflow-hidden px-6 py-24 text-center">
        <GridPattern className="stroke-black/10 mask-[linear-gradient(to_bottom,white,transparent_85%)]" />
        <div className="bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.75),transparent_55%)]" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <h1 className="text-5xl leading-tight text-black md:text-[5rem]">
            One dashboard for every{" "}
            <span className="text-accent-brand">social</span> channel
          </h1>

          <p className="mx-auto mt-2 max-w-3xl text-xl text-[#374151]">
            Connect Instagram, Facebook, X, TikTok, and YouTube. Create,
            schedule, rewrite, organize, and publish content across brands and
            workspaces from one place.
          </p>

          <div className="mt-10">
            <Link
              href="/signup"
              className="btn-primary hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-orange-300"
            >
              Create your workspace
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
