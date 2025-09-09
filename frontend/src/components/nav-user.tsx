import {
  IconDotsVertical,
  IconLogout,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { User } from "lucide-react"
import { observer } from "mobx-react-lite"
import { StoreContext } from "@/store/storeContext"
import { useContext } from "react"
import { API_ENDPOINTS } from "@/store/api"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { stylesTost } from "@/store/mainStore"

export const NavUser = observer(() => {
  const store = useContext(StoreContext);
  const { isMobile } = useSidebar()
  const navigate = useNavigate();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={'/avatars/shadcn.jpg'} alt={store.userName} />
                <AvatarFallback className="rounded-lg"><User /></AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{store.userName}</span>

              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    <User />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{store.userName}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              const options = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              };

              fetch(API_ENDPOINTS.auth.logout, options)
                .then(response => {
                  if (!response.ok) {
                    if (response.status === 401) {
                      store.setShowLoginPage(true)
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  return response.json();
                })
                .then((response) => {
                  toast(response.message, { position: 'top-center', style: stylesTost });
                  store.setShowLoginPage(true)
                  navigate('/login', { replace: true })
                })
                .catch((err) => {
                  toast(err.message, { position: 'top-center', style: stylesTost });
                })

            }}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
)