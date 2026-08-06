"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStatus } from "@/features/auth/hooks/use-auth-status";

interface NavLinkProps {
  href: string;
  onClick?: () => void;
  isMobile: boolean;
  type: "button-primary" | "button-secondary";
  children: React.ReactNode;
}

function NavLink({ href, onClick, isMobile, type, children }: NavLinkProps) {
  const className =
    type === "button-primary"
      ? isMobile
        ? "w-full text-center rounded-full bg-linear-to-r from-accent-dark to-accent-brand px-5 py-2.5 text-base font-semibold text-white shadow-sm transition hover:opacity-95 block"
        : "rounded-full bg-linear-to-r from-accent-dark to-accent-brand px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
      : isMobile
        ? "w-full text-center rounded-full px-4 py-2.5 text-base font-medium text-black/75 hover:bg-black/5 hover:text-black transition block"
        : "rounded-full px-4 py-2 text-sm font-medium text-black/75 transition hover:text-black";

  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}

interface NavDropdownProps {
  isMobile: boolean;
  onNavigate?: () => void;
  align?: "start" | "center" | "end";
}

function NavDropdown({ isMobile, onNavigate, align = "center" }: NavDropdownProps) {
  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex w-full items-center justify-between rounded-full px-4 py-2.5 text-base font-medium text-black/75 transition hover:bg-black/5 hover:text-black"
          >
            More
            <ChevronDown className="size-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-[calc(100vw-3rem)] max-w-72">
          <DropdownMenuItem asChild>
            <Link href="/privacy-policy" onClick={onNavigate}>
              Privacy policy
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/terms-of-service" onClick={onNavigate}>
              Terms of service
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-black/75 transition hover:bg-black/5 hover:text-black"
        >
          More
          <ChevronDown className="size-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align}>
        <DropdownMenuItem asChild>
          <Link href="/privacy-policy" onClick={onNavigate}>
            Privacy policy
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/terms-of-service" onClick={onNavigate}>
            Terms of service
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
          <Link href={'/'} className="flex items-center gap-3">
            <Image
              src="/postglee-logo.png"
              alt="PostGlee logo"
              width={112}
              height={112}
              className="rounded-lg w-28"
            />
          </Link>

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

        <div className="hidden sm:grid flex-1 grid-cols-[1fr_auto_1fr] items-center">
          <div />

          {!showDashboard ? (
            <div className="justify-self-center">
              <NavDropdown isMobile={false} align="center" />
            </div>
          ) : (
            <div />
          )}

          <div className="justify-self-end">
            {showDashboard ? (
              <NavLink href="/dashboard" isMobile={false} type="button-primary">
                Dashboard
              </NavLink>
            ) : (
              <NavLink href="/signin" isMobile={false} type="button-primary">
                Sign in
              </NavLink>
            )}
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {isMenuOpen && (
          <div className="sm:hidden mt-4 border-t border-black/5 pt-4 pb-2" id="mobile-menu">
            <div className="flex flex-col gap-2 pt-2 border-black/5">
              {!showDashboard ? (
                <NavDropdown isMobile onNavigate={() => setIsMenuOpen(false)} />
              ) : null}
              {showDashboard ? (
                <NavLink href="/dashboard" onClick={() => setIsMenuOpen(false)} isMobile type="button-primary">
                  Dashboard
                </NavLink>
              ) : (
                <NavLink href="/signin" onClick={() => setIsMenuOpen(false)} isMobile type="button-primary">
                  Sign in
                </NavLink>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
