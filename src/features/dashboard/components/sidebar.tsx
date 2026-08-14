"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  Clock,
  GalleryVerticalEnd,
  Link2,
  LogOut,
  PenSquare,
  PlusCircle,
  Settings,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/features/auth/store/auth-store"

const mainNavItems = [
  {
    title: "New Post",
    url: "/dashboard/posts",
    icon: PlusCircle,
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Scheduled",
    url: "/dashboard/scheduled",
    icon: Clock,
  },
]

const configNavItems = [
  {
    title: "Connections",
    url: "/dashboard/connections",
    icon: Link2,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const logout = useAuth((state) => state.logout)
  const user = useAuth((state) => state.user)

  const brandName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "PostReach"
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-slate-100 overflow-hidden border border-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icon.png" alt="Logo" className="size-full object-cover" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{brandName}</span>
                  <span className="text-xs text-muted-foreground">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Prominent CTA button */}
        <div className="px-3 pt-4 pb-2 flex justify-center">
          {isCollapsed ? (
            <Link href="/dashboard/posts">
              <Button size="icon" className="size-8 bg-linear-to-r from-accent-dark to-accent-brand text-white shadow-xs hover:brightness-95 transition-all duration-300 font-semibold cursor-pointer rounded-lg">
                <PenSquare className="size-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard/posts" className="w-full">
              <Button className="w-full h-9 bg-linear-to-r from-accent-dark to-accent-brand text-white shadow-xs hover:brightness-95 transition-all duration-300 font-semibold cursor-pointer rounded-lg text-xs gap-1.5 px-3">
                <PenSquare className="size-3.5" />
                <span>Create post</span>
              </Button>
            </Link>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-4 pt-2 px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Main</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  tooltip={item.title}
                  className="font-medium text-slate-600 hover:text-slate-900"
                >
                  <Link href={item.url}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Configuration</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {configNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  tooltip={item.title}
                  className="font-medium text-slate-600 hover:text-slate-900"
                >
                  <Link href={item.url}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-2">
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              onClick={() => {
                logout()
                window.location.href = "/signin"
              }}
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}