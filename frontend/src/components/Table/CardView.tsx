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
                        <DropdownMenuItem onClick={() => { store.onCreateItem(el, true); }}>Make a copy</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => store.onDeleteItem(el.id)}
                        >
                            Delete
                        </DropdownMenuItem>
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