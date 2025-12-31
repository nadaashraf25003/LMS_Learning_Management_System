"use client"

import * as React from "react"
import { sidebarData as data } from "@/components/AppSidebar/UserData/UserData"

import { NavMain } from "@/components/AppSidebar/nav-main"
import { NavSetting } from "@/components/AppSidebar/nav-setting"
import { NavUser } from "@/components/AppSidebar/nav-user"
import { TeamSwitcher } from "@/components/AppSidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/Sidebar/sidebar"
export function AppSidebar({ role = "student", ...props }: React.ComponentProps<typeof Sidebar> & { role?: "student" | "instructor" | "admin" }) {
  const currentData = data[role];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="mt-16 max-md:mt-2">
        <TeamSwitcher teams={currentData.teams || []} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={currentData.navMain} />
        <NavSetting Setting={currentData.Setting} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

