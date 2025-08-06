import * as React from "react"
import { useEffect, useState } from "react"
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
  IconSettings, IconTrash,
  IconChevronRight,
  IconPaletteOff,
  type Icon, IconDotsVertical, IconEdit,
} from "@tabler/icons-react"
import styles from "./appSidebar.module.scss"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu, SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import { PresetActions } from "@/components/dashboard/presetActions"
import { StoreContext } from "@/store/storeContext.ts";

const data = {
  user: {
    name: "m@example.comm@example.comm@example.comm@example.comm@example.comm@example.comm@example.com",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Untagged",
      url: "#",
      icon: IconDashboard,
    },
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

const colorMap = {
  'gray': 'bg-gray-600',
  'green': 'bg-green-600',
  'red': 'bg-red-600',
  'yellow': 'bg-yellow-600',
  'aqua': 'bg-blue-600',
  'white ': 'bg-neutral-100',
  'black': 'bg-neutral-950',
}

export function AppSidebar({ allTags, ...props }: React.ComponentProps<typeof Sidebar>) {

  const store = React.useContext(StoreContext);
  const userName = store.userName;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isMobile } = useSidebar()


  console.log('all_Tags_2', allTags, userName)



  function renderTag(parentID: integer, level = 0): JSX.Element[] {
    let output = []
    const tags = Object.values(allTags).filter((tag: any) => tag.parent === parentID);
    console.log('tagList', Object.values(allTags), allTags, parentID, tags);

    level++
    for (const tag of tags) {
      console.log('tag', tag.color)
      const deleteTag = () => {
        store.onDeleteTag(tag.id)
      }

      console.log(tag)
      const innerItems = renderTag(tag.id, level)
      const actionButtons = (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction
              className="data-[state=open]:bg-accent rounded-sm sidebar-menu-action"
            >
              <IconDotsVertical />
              <span className="sr-only">More</span>
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-24 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align={isMobile ? "end" : "start"}
          >
            <DropdownMenuItem>
              <IconEdit />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger> Color</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {Object.keys(colorMap).map((color) => (
                    <DropdownMenuItem
                      key={color}
                      className={`text-${colorMap[color]}-foreground hover:bg-${colorMap[color]}-foreground/10`}
                      onClick={() => store.onChangeTagColor(tag.id, color)}
                    >
                      <span className={`w-3 h-3 rounded-full inline-block mr-1 ${colorMap[color]}`}></span> {color.charAt(0).toUpperCase() + color.slice(1)}
                      <span className="ml-auto">{tag.color === color ? "✓" : ""}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={deleteTag}>
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const code = innerItems.length > 0 ? (<Collapsible className='group/collapsible'>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <CollapsibleTrigger asChild>
              <IconChevronRight className={`transition-transform hover:cursor-pointer`} />
            </CollapsibleTrigger>
            <a href='#'>
              <span className={`w-3 h-3 rounded-full inline-block mr-2 ${colorMap[tag.color]}`}></span>
              <span>{tag.title}</span>
            </a>
            {actionButtons}
          </SidebarMenuButton>

          <CollapsibleContent>
            <SidebarMenuSub>
              {innerItems}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>)
        :
        (<SidebarMenuItem>
          <SidebarMenuButton>
            <a href='#' className='ml-6'>
              <span className={`w-3 h-3 rounded-full inline-block mr-2 ${colorMap[tag.color]}`}></span>
              <span>{tag.title}</span>
            </a>
            {actionButtons}
          </SidebarMenuButton>
        </SidebarMenuItem>)

      output.push(code)
    }

    return output
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className={styles.headeBtnWrapper}>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <img src="/public/logo.png" alt="Faved logo" className="img-fluid " width="48"></img>
                <span className="text-base font-semibold">Faved.</span>
              </a>
            </SidebarMenuButton>
            <PresetActions />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className={'no-scrollbar'}>
        <NavMain items={data.navMain} />
        <SidebarMenu>
          {renderTag(0)}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>{store.userName && <NavUser />}

      </SidebarFooter>
    </Sidebar>
  )
}
