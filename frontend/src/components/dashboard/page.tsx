

import { SiteHeader } from "@/components/Header/SiteHeader"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useContext, useEffect, useState } from "react"
import EditItemForm from "@/components/EditForm/EditItemForm"
import { Dialog } from "@/components/ui/dialog"
import { observer } from "mobx-react-lite"
import { StoreContext } from "@/store/storeContext"
import { AppSidebar } from "@/components/Sidebar/AppSidebar"
import { useNavigate } from "react-router-dom"
import { DataTable } from "../Table/DataTable"
import { SettingsDialog } from "../Settings/SettingsModal"
import { TagType } from "@/types/types"
import Loading from "@/components/Loading"


export const Page = observer(() => {
  const navigate = useNavigate();
  const store = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isShowEditModal, setIsShowEditModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([store.fetchItems(), store.fetchTags()])
      setIsLoading(false)
    };

    loadData();
  }, []);

  useEffect(() => {
    if (store.showLoginPage) {
      navigate('/login', { replace: true });
    }

  }, [store.showLoginPage, store.showInitializeDatabasePage, navigate]);

  if (isLoading) {
    return <Loading />;
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
      <AppSidebar variant="inset" allTags={store.tags as unknown as Record<string, TagType>} />
      <SidebarInset>
        <SiteHeader setType={store.setType} setIsShowEditModal={setIsShowEditModal} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6">
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
        {isShowEditModal && <EditItemForm setIsShowEditModal={setIsShowEditModal} isFullScreen={false} />}
        {store.isOpenSettingsModal && <SettingsDialog />}
      </Dialog>
    </SidebarProvider >
  )
})
