"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuthStatus } from "@/features/auth/hooks/use-auth-status";

interface NavLinkProps {
  href: string;
  onClick?: () => void;
  isMobile: boolean;
  type: "link" | "button-primary" | "button-secondary";
  children: React.ReactNode;
}

function NavLink({ href, onClick, isMobile, type, children }: NavLinkProps) {
  let className = "";

  if (type === "link") {
    className = isMobile
      ? "text-base font-medium text-black/70 hover:text-black px-3 py-2 rounded-lg hover:bg-black/5 transition"
      : "text-sm font-medium text-black/70 transition hover:text-black mr-4";
  } else if (type === "button-primary") {
    className = isMobile
      ? "w-full text-center rounded-full bg-linear-to-r from-accent-dark to-accent-brand px-5 py-2.5 text-base font-semibold text-white shadow-sm transition hover:opacity-95 block"
      : "rounded-full bg-linear-to-r from-accent-dark to-accent-brand px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95";
  } else if (type === "button-secondary") {
    className = isMobile
      ? "w-full text-center rounded-full px-4 py-2.5 text-base font-medium text-black/75 hover:bg-black/5 hover:text-black transition block"
      : "rounded-full px-4 py-2 text-sm font-medium text-black/75 transition hover:text-black";
  }

  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}

interface NavItemsProps {
  showDashboard: boolean;
  onItemClick?: () => void;
  isMobile?: boolean;
}

function NavItems({ showDashboard, onItemClick, isMobile = false }: NavItemsProps) {
  return (
    <div className={isMobile ? "flex flex-col gap-4" : "flex items-center"}>
      <NavLink href="/tools" onClick={onItemClick} isMobile={isMobile} type="link">
        Tools
      </NavLink>

      {showDashboard ? (
        <NavLink href="/dashboard" onClick={onItemClick} isMobile={isMobile} type="button-primary">
          Dashboard
        </NavLink>
      ) : (
        <div className={isMobile ? "flex flex-col gap-2 pt-2 border-t border-black/5" : "flex items-center gap-3"}>
          <NavLink href="/signin" onClick={onItemClick} isMobile={isMobile} type="button-secondary">
            Sign in
          </NavLink>
          <NavLink href="/signup" onClick={onItemClick} isMobile={isMobile} type="button-primary">
            Create account
          </NavLink>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { isAuthenticated, isHydrated, isLoadingUser } = useAuthStatus();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const showDashboard = mounted && isHydrated && !isLoadingUser && isAuthenticated;

  return (
    <header className="sticky top-0 z-30 mx-auto w-full border-b border-black/10 bg-white/30 px-6 py-4 backdrop-blur-xl sm:px-10">
      <nav className="mx-auto flex w-full max-w-7xl flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-r from-accent-dark to-accent-brand font-bold text-white shadow-sm">
              PR
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold uppercase tracking-widest text-black">PostReach</span>
            </div>
          </div>

          {/* Mobile hamburger menu toggle button */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-black/75 hover:bg-black/5 hover:text-black focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Desktop Buttons & Links */}
        <div className="hidden sm:flex items-center">
          <NavItems showDashboard={showDashboard} />
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {isMenuOpen && (
          <div className="sm:hidden mt-4 border-t border-black/5 pt-4 pb-2" id="mobile-menu">
            <NavItems showDashboard={showDashboard} onItemClick={() => setIsMenuOpen(false)} isMobile />
          </div>
        )}
      </nav>
    </header>
  );
}
