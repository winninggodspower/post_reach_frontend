import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 mx-auto w-full border-b border-black/10 bg-white/30 px-6 py-4 backdrop-blur-xl sm:px-10">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-r from-accent-dark to-accent-brand font-bold text-white shadow-sm">
            PR
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold uppercase tracking-widest text-black">PostReach</span>
            <Link href="/tools" className="text-sm font-medium text-black/70 transition hover:text-black">Tools</Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/signin" className="rounded-full px-4 py-2 text-sm font-medium text-black/75 transition hover:text-black">
            Sign in
          </Link>
        </div>
      </nav>
    </header>
  );
}
