import * as React from "react"
import {
  Keyboard,
  Import,
  Bookmark,
} from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { CardsEditAccountUserName } from "@/components/dashboard/CardsEditAccountUserName"
import { CardsEditAccountPassword } from "@/components/dashboard/CardsEditAccountPassword"
import { CardsEditAccountDisableAuth } from "@/components/dashboard/CardsEditAccountDisableAuth"
import { CardsCreateAccount } from "@/components/dashboard/CreateAccount"
import { StoreContext } from "@/store/storeContext"
import { ImportModal } from "../Import/ImportModal"
import { observer } from "mobx-react-lite"
import BookmarkletPage from "./BookMarklet"

const data = {
  nav: [
    { name: "Authentication settings", icon: Keyboard },
    { name: "Import", icon: Import },
    { name: "Bookmarklet", icon: Bookmark },
  ],
}

const components = [
  { name: "CardsEditAccount", component: <CardsEditAccountUserName /> },
  { name: "Component2", component: <CardsEditAccountPassword /> },
  { name: "Component3", component: <CardsEditAccountDisableAuth /> },
];
export const SettingsDialog = observer(() => {
  const store = React.useContext(StoreContext);
  React.useEffect(() => {
    store.getUser()
  }, [store.isAuthSuccess])
  if (!store.isOpenSettingsModal) {
    return <div>{'Loading...'}</div>
  }
  return (
    <Dialog open={store.isOpenSettingsModal} onOpenChange={store.setIsOpenSettingsModal}>
      <DialogContent className="overflow-hidden p-0 h-full sm:max-h-[90vh] md:max-h-[800px] sm:max-w-[750px] md:max-w-[900px] lg:max-w-[900px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <SidebarProvider className="items-start h-full">
          <Sidebar collapsible="icon" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name} onClick={() => {
                        store.setSelectedItemSettingsModal(item.name as string)
                      }}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.name === store.selectedItemSettingsModal}
                        >
                          <a href="#">
                            <item.icon />
                            <span>{item.name}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-full flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{store.selectedItemSettingsModal}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0 h-full">
              {store.selectedItemSettingsModal === "Authentication settings" && !store.isAuthSuccess
                ?
                <CardsCreateAccount />
                :
                store.selectedItemSettingsModal === "Authentication settings"
                && components.map((component, i) => (
                  <div
                    key={i}
                  >{component.component}</div>
                ))}
              {store.selectedItemSettingsModal === "Import" &&
                <ImportModal />
              }   {store.selectedItemSettingsModal === "Bookmarklet" &&
                <BookmarkletPage />
              }
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
)