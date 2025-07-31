"use client"

import * as React from "react"
import { Dialog } from "@radix-ui/react-dialog"
import { MoreHorizontal, SlidersHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { CardsCreateAccount } from "./CreateAccount"
import { SettingsDialog } from "@/components/settings-dialog"



export function PresetActions() {
  const [open, setIsOpen] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)

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
        <SettingsDialog open={open} setOpen={setIsOpen} />
      </div>
    </>
  )
}
