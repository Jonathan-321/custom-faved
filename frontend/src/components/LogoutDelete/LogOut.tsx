import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { observer } from "mobx-react-lite"
import { useContext } from "react"
import { StoreContext } from "@/store/storeContext"

export const LogOutModal = observer(() => {
    const store = useContext(StoreContext);
    return (
        <PopoverContent className="w-50">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <h4 className="leading-none font-medium">{store.userName}</h4>
                </div>
                <div className="grid gap-2">
                    <div className="flex justify-end">
                        <Button onClick={store.logOut} variant={"destructive"}><LogOut /> Logout</Button>
                    </div>
                </div>
            </div>
        </PopoverContent>
    )
})
