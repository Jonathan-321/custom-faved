"use client"

import * as React from "react"
import { SlidersHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { SettingsDialog } from "@/components/settings-dialog"



export function PresetActions() {
  const [open, setIsOpen] = React.useState(false)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon">
            <span className="sr-only">Actions</span>
            <div onClick={() => { setIsOpen(true) }}><SlidersHorizontal /></div>
          </Button>
        </DropdownMenuTrigger>
      </DropdownMenu>
      <div className="flex h-svh items-center justify-center">
        {open && <SettingsDialog open={open} setOpen={setIsOpen} />}
      </div>
    </>
  )
}
