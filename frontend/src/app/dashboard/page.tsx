
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

// import data from "./data.json"
import { useContext, useEffect, useState } from "react"
// import { mockDefaultValues } from "@/components/utils/utils"
import EditItemForm from "@/components/EditForm/EditItemForm"
import { Dialog } from "@/components/ui/dialog"
import { DataTable } from "@/components/Table/data-table"
import { observer } from "mobx-react-lite"
import { StoreContext } from "@/store/storeContext"
import { AppSidebar } from "@/components/Sidebar/AppSidebar"

export enum ActionType {
  CREATE = "CREATE",
  EDIT = "EDIT",
}
export const mockDefaultValues = {
  title: 'How to Migrate Your Data from Pocket to Faved | Faved - Organize Your Bookmarks',
  url: 'https://faved.dev/blog/migrate-pocket-to-faved',
  description: 'Pocket is shutting down on July 8, 2025. As a privacy-first alternative, Faved lets you organize and manage your bookmarks while keeping full ownership of your data. Learn how to migrate your data from Pocket to Faved in a few simple steps.',
  comments: 'blalbaple steps.',
  imageUrl: 'https://example.com/image.jpg', // Added a placeholder image URL
  tags: 'Faved / Welcome',
  createdAt: '222',
  updatedAt: '222',
};

export const Page = observer(() => {
  const store = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  console.log('items', store.items)
  useEffect(() => {
    store.fetchItems().finally(() => { setIsLoading(false) })
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader setType={store.setType} setIsShowEditModal={setIsShowEditModal} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* <SectionCards /> */}
              {/* <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div> */}
              {/* <DataTable setIsShowEditModal={setIsShowEditModal} setType={setType} /> */}
              <DataTable setIsShowEditModal={setIsShowEditModal} />
            </div >
          </div >
        </div >
      </SidebarInset >
      <Dialog onOpenChange={(val) => {
        setIsShowEditModal(val)
        if (!val) {
          store.fetchItems()
        }
      }} open={isShowEditModal} >
        {isShowEditModal && <EditItemForm setIsShowEditModal={setIsShowEditModal} />}
      </Dialog>
    </SidebarProvider >
  )
})
