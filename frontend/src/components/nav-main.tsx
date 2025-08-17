import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {StoreContext} from "@/store/storeContext.ts";
import * as React from "react";
import {observer} from "mobx-react-lite";

export const NavMain = observer(({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) => {
  const store = React.useContext(StoreContext)

  const setAllTags = () => {
    store.setCurrentTagId(0);
    store.setCurrentPage(1);
  }

  const setNoTags = () => {
    store.setCurrentTagId(null);
    store.setCurrentPage(1);
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              onClick={setAllTags}
              tooltip="All items"
              className={"active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear" + (store.selectedTagId === '0' ? " !bg-primary !text-primary-foreground" : "")}
            >
              <span>All items</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              onClick={setNoTags}
              tooltip="Untagged items"
              className={"active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear" + (store.selectedTagId === null ? " !bg-primary !text-primary-foreground" : "")}
            >
              <span>Untagged</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
})
