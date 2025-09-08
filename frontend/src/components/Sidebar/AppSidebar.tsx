import * as React from "react"
import { useState } from "react"
import {
  IconCamera,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconReport,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { StoreContext } from "@/store/storeContext.ts";
import { observer } from "mobx-react-lite"
import { SidebarTag } from "@/components/Sidebar/SidebarTag.tsx";
import { PresetActions } from "../dashboard/PresetActions"

const data = {
  navMain: [
    // {
    //   title: "Untagged",
    //   url: "#",
    //   icon: IconDashboard,
    // },
    // {
    //   title: "Lifecycle",
    //   url: "#",
    //   icon: IconListDetails,
    // },
    // {
    //   title: "Analytics",
    //   url: "#",
    //   icon: IconChartBar,
    // },
    // {
    //   title: "Projects",
    //   url: "#",
    //   icon: IconFolder,
    // },
    // {
    //   title: "Team",
    //   url: "#",
    //   icon: IconUsers,
    // },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}



export const AppSidebar = observer(({ allTags, ...props }: React.ComponentProps<typeof Sidebar>) => {

  const store = React.useContext(StoreContext);
  const selectedTag = allTags[store.selectedTagId] || null;

  function renderTag(parentID: string, level = 0): JSX.Element[] {
    let output = []
    const tags = Object.values(allTags).filter((tag: any) => tag.parent === parentID);
    tags.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return a.title.localeCompare(b.title);
    })
    level++
    for (const tag of tags) {
      const innerItems = renderTag(tag.id, level)
      const isTagSelected = store.selectedTagId === tag.id;
      const isChildTagSelected = !isTagSelected && selectedTag && selectedTag.fullPath.indexOf(tag.fullPath) === 0
      const code = (<SidebarTag key={tag.id} tag={tag} innerItems={innerItems} level={level} isTagSelected={isTagSelected} isChildTagSelected={isChildTagSelected} />)
      output.push(code)
    }

    return output
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex w-full justify-between">
            <div className="flex flex-row items-start justify-center text-center">
              <img src="/public/logo.png" alt="Faved logo" className="img-fluid pr-2 w-[36px] h-auto"></img>
              <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">Faved.</h2>
            </div>
            <PresetActions />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className={'no-scrollbar'}>
        <NavMain items={data.navMain} />
        <SidebarMenu>
          {renderTag('0')}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>{store.userName && <NavUser />}

      </SidebarFooter>
    </Sidebar>
  )
})
