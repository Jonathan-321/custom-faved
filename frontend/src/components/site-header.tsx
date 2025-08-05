import { ActionType } from "@/components/dashboard/page"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Import, LogOut } from "lucide-react"
import { useState } from "react"
import { ImportModal } from "./Import/ImportModal"
import { LogOutModal } from "./Logout/LogOut"
import { Popover, PopoverTrigger } from "./ui/popover"

export const SiteHeader: React.FC<{ setType: (val: ActionType) => void; setIsShowEditModal: (val: boolean) => void }> = ({ setType, setIsShowEditModal }) => {
  const [isOpenImport, setIsOpenImport] = useState(false)

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Button variant="default" size="sm" className="hidden sm:flex" onClick={() => { setIsShowEditModal(true); setType(ActionType.CREATE) }}>

          Nev item
        </Button>
        <Button onClick={() => { setIsOpenImport(true) }} variant="outline" size="sm" className="hidden sm:flex">
          <Import />
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <Popover >
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <LogOut />
              </Button>
            </PopoverTrigger>
            <LogOutModal />
          </Popover>

        </div>
        {isOpenImport && <ImportModal isOpen={isOpenImport} setIsOpen={setIsOpenImport} />}


      </div>
    </header>
  )
}
