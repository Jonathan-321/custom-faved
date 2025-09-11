"use client"

import * as React from "react"
import { SlidersHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { SettingsDialog } from "@/components/Settings/SettingsModal"
import { StoreContext } from "@/store/storeContext"
import { observer } from "mobx-react-lite"



export const PresetActions = observer(() => {
  const store = React.useContext(StoreContext);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon">
            <span className="sr-only">Actions</span>
            <div onClick={() => { store.setIsOpenSettingsModal(true) }}><SlidersHorizontal /></div>
          </Button>
        </DropdownMenuTrigger>
      </DropdownMenu>
      <div>

      </div>
    </div>
  )
})
