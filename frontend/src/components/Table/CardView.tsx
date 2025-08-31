import * as React from "react"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    IconDotsVertical,
} from "@tabler/icons-react"
import { observer } from "mobx-react-lite"
import { Button } from "../ui/button";
import { ActionType } from "../dashboard/types"
import { StoreContext } from "@/store/storeContext"
import { TagBadge } from "./TagBadge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"

export const CardView: React.FC<{ setIsShowEditModal: (val: boolean) => void; el: any }> = observer(({ setIsShowEditModal, el }) => {
    const store = React.useContext(StoreContext);
    return (

        <Card key={el.id} className="@container/card relative">
            <CardAction>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="link"
                            className="data-[state=open]:bg-muted text-muted-foreground flex size-8 absolute top-2 right-2"
                            size="icon"
                        >
                            <IconDotsVertical />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                            onClick={() => {
                                store.setType(ActionType.EDIT);
                                setIsShowEditModal(true);
                                store.setIdItem(el.id);
                            }}
                        >
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { store.onCreateItem(el, true, false, null); }}>Make a copy</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <div
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-destructive/90 hover:text-white"
                                >
                                    Delete
                                </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your item
                                        and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => store.onDeleteItem(el.id)}
                                        className="w-full sm:w-auto order-first sm:order-last mt-2 sm:mt-0 bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardAction>
            <CardHeader>
                <div className="flex flex-column flex-wrap sm:flex-row md:flex-row kg:flex-row items-start w-full">
                    {el.image && (
                        <div className="flex w-[175px] pb-4 md:pr-4 lg:pr-4">
                            <img className="w-auto h-auto max-w-[200px] w-[200px] pr-4" src={el.image} />
                        </div>
                    )}
                    <div className="flex flex-col items-start flex-wrap table-layout-fixed break-words">
                        <CardTitle>
                            {el.title && (
                                <span className="flex items-start text-left w-full flex-wrap pb-2 break-words break-all">
                                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                                        {el.title}
                                    </h4>
                                </span>
                            )}
                        </CardTitle>
                        {el.url && (
                            <span className="flex items-start text-left w-full flex-wrap pb-2 break-all">
                                <a
                                    className="text-custom-blue underline"
                                    href={el.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {el.url.slice(0, 60) + (el.url.length > 60 ? "..." : "")}
                                </a>
                            </span>
                        )}
                        {el.tags && (
                            <div className="flex flex-start text-left w-full flex-wrap pb-2">
                                {el.tags.map((tagID, index) => (
                                    <TagBadge key={index} tagID={tagID} />
                                ))}
                            </div>
                        )}
                        <CardDescription>
                            <div className="flex flex-col items-start w-full flex-wrap break-words break-all">
                                <div className="flex flex-col items-start text-start">
                                    <div>
                                        <p className="leading-7 [&:not(:first-child)]:mt-6">
                                            {el.description}
                                        </p>
                                    </div>
                                    <div>
                                        <blockquote className="mt-6 border-l-2 pl-6 italic">{el.comments}</blockquote>
                                    </div>
                                </div>
                            </div>
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div>
                    <p className="text-muted-foreground text-sm">{el.updated_at ?? el.created_at}</p>
                </div>
            </CardFooter>
        </Card>
    );

});