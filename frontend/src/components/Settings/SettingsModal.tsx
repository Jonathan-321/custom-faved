import * as React from "react"
import {
  Bell,
  Check,
  Globe,
  Home,
  Keyboard,
  Link,
  Lock,
  Menu,
  MessageCircle,
  Paintbrush,
  Settings,
  Video,
} from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
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

const data = {
  nav: [
    { name: "Authentication settings", icon: Keyboard },
    { name: "Import", icon: Settings },
    // { name: "Home", icon: Home },
    // { name: "Appearance", icon: Paintbrush },
    // { name: "Messages & media", icon: MessageCircle },
    // { name: "Language & region", icon: Globe },
    // { name: "Accessibility", icon: Keyboard },
    // { name: "Mark as read", icon: Check },
    // { name: "Audio & video", icon: Video },
    // { name: "Connected accounts", icon: Link },
    // { name: "Privacy & visibility", icon: Lock },
    // { name: "Advanced", icon: Settings },
  ],
}
type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const components = [
  { name: "CardsEditAccount", component: <CardsEditAccountUserName /> },
  { name: "Component2", component: <CardsEditAccountPassword /> },
  { name: "Component3", component: <CardsEditAccountDisableAuth /> },
];
export const SettingsDialog = observer(({ open, setOpen }: Props) => {
  const store = React.useContext(StoreContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthSuccess, setIsAuthSuccess] = React.useState(false);
  React.useEffect(() => {
    store.getUser(setIsAuthSuccess)
  }, [])
  if (!open && isLoading) {
    return <div>{'Loading...'}</div>
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 sm:h-[100%] md:max-h-[800px] sm:max-w-[750px] md:max-w-[900px] lg:max-w-[900px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <SidebarProvider className="items-start">
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
          <main className="flex md:h-[800px] sm:h-[100%] lg:max-h-[800px] flex-1 flex-col overflow-hidden">
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
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {store.selectedItemSettingsModal === "Authentication settings" && !isAuthSuccess
                ?
                <CardsCreateAccount setIsAuthSuccess={setIsAuthSuccess} />
                :
                store.selectedItemSettingsModal === "Authentication settings"
                && components.map((component, i) => (
                  <div
                    key={i}
                  // className="bg-muted/50 aspect-video max-w-3xl rounded-xl"
                  >{component.component}</div>
                ))}
              {store.selectedItemSettingsModal === "Import" &&
                <ImportModal />
              }
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
)