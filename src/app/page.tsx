import Link from "next/link";

import Navbar from "@/components/navbar";
import { GridPattern } from "@/components/ui/grid-pattern";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col text-foreground">
      <Navbar />

      <section className="overflow-hidden px-6 py-24 text-center">
        <GridPattern className="stroke-black/10 mask-[linear-gradient(to_bottom,white,transparent_85%)]" />
        <div className=" bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.75),transparent_55%)]" />

        <div className="relative z-10 mx-auto max-w-4xl">
            <h1 className="text-5xl leading-tight md:text-[5rem] text-black">
              Publish with <span className="text-accent-brand">clarity</span>
            </h1>

            <p className="mx-auto mt-2 max-w-3xl text-xl text-[#374151]">
              Plan, compose, and publish across all your social channels from one unified workspace — maintain consistent campaigns, and amplify your reach.
            </p>

            <div className="mt-10">
              <Link
                href="/signup"
                className="btn-primary hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-orange-300"
              >
                Start Scheduling 
              </Link>
            </div>
          </div>
      </section>
    </main>
  );
}
