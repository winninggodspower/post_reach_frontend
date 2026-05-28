import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-dark">
        Dashboard
      </p>
      <h1 className="mt-3 text-4xl font-semibold text-slate-950">Welcome back</h1>
      <p className="mt-3 text-slate-600">
        Signed in as {session?.user?.email}
      </p>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Scheduled Posts</h2>
          <p className="mt-2 text-3xl font-bold text-slate-950">0</p>
        </article>
        <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Connected Accounts</h2>
          <p className="mt-2 text-3xl font-bold text-slate-950">0</p>
        </article>
        <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Workspaces</h2>
          <p className="mt-2 text-3xl font-bold text-slate-950">1</p>
        </article>
      </section>
    </main>
  )
}
