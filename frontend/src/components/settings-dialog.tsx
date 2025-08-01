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
} from "@/components/ui/sidebar"

import { CardsEditAccountUserName } from "@/app/dashboard/CardsEditAccountUserName"
import { CardsEditAccountPassword } from "@/app/dashboard/CardsEditAccountPassword"
import { CardsEditAccountDisableAuth } from "@/app/dashboard/CardsEditAccountDisableAuth"
import { CardsCreateAccount } from "@/app/dashboard/CreateAccount"
import { StoreContext } from "@/store/storeContext"

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
export function SettingsDialog({ open, setOpen }: Props) {
  const store = React.useContext(StoreContext);
  const [isAuthSuccess, setIsAuthSuccess] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState("Authentication settings")
  const [isUserWasCreated, setIsUserWasCreated] = React.useState(false)
  React.useEffect(() => {
    store.auth(setIsAuthSuccess)
  }, [])
  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogContent className="overflow-hidden p-0 md:max-h-[600px] md:max-w-[900px] lg:max-w-[900px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        {/* <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription> */}
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name} onClick={() => { setSelectedItem(item.name) }}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.name === selectedItem}
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
          <main className="flex h-[600px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{selectedItem}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {isAuthSuccess ? selectedItem === "Authentication settings" && !isUserWasCreated && <CardsCreateAccount setIsUserWasCreate={setIsUserWasCreated} /> : selectedItem === "Authentication settings" && isUserWasCreated && components.map((component, i) => (
                <div
                  key={i}
                // className="bg-muted/50 aspect-video max-w-3xl rounded-xl"
                >{component.component}</div>
              ))}

              {selectedItem === "User edit" &&
                <div>Import</div>
              }

            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
