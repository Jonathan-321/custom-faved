import { IconDotsVertical, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { observer } from "mobx-react-lite"
import { StoreContext } from "@/store/storeContext"
import React from "react"
import { colorMap } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { ActionType } from "./types"




export const SectionCards: React.FC<{ setIsShowEditModal: (val: boolean) => void }> = observer(({ setIsShowEditModal }) => {
  const store = React.useContext(StoreContext);
  const [isHovered, setIsHovered] = React.useState(false);
  const data = store.selectedTagId === '0' ? store.items : store.items.filter((item => {
    return (store.selectedTagId === null && item.tags.length === 0) || item.tags.includes(Number(store.selectedTagId));
  }))
  const getTagName = (fullPath) => fullPath?.substring(fullPath.lastIndexOf("/") + 1) || "";

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

      {data.map(el => (
        <Card className="@container/card relative">
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
                <DropdownMenuItem onClick={() => {
                  store.setType(ActionType.EDIT);
                  setIsShowEditModal(true);
                  store.setIdItem(el.id)
                }}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { store.onCreateItem(el, true) }}>Make a copy</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => store.onDeleteItem(el.id)}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
          <CardHeader>
            <div className="flex flex-column flex-wrap sm:flex-row md:flex-row kg:flex-row items-start w-full">
              {el.image &&
                <div className="flex w-[175px] pb-4 md:pr-4 lg:pr-4 ">
                  <img className="w-auto h-auto max-w-[200px] w-[200px] pr-4" src={el.image} />
                </div>
              }
              <div className="flex flex-col items-start flex-wrap  table-layout-fixed break-words">
                <CardTitle>
                  {el.title && <span className="flex items-start text-left w-full flex-wrap pb-2 break-words break-all">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight ">
                      {el.title}
                    </h4>
                  </span>
                  }</CardTitle>
                {el.url && (
                  <span className="flex items-start text-left w-full flex-wrap pb-2 break-all">
                    <a className="text-custom-blue underline" href={el.url} target="_blank" rel="noopener noreferrer">
                      {el.url.slice(0, 60) + (el.url.length > 60 ? "..." : "")}
                    </a>
                  </span>
                )}
                {el.tags && <div className="flex flex-start text-left w-full flex-wrap pb-2">
                  {el.tags.map((tagID, index) => {
                    const fullPath = store.tags?.[tagID]?.fullPath;
                    const tagName = getTagName(fullPath);

                    const setTag = () => {
                      store.setCurrentTagId(tagID);
                      store.setCurrentPage(1);
                    }

                    return (
                      <Badge
                        key={index}
                        variant={'secondary'}
                        className="mr-2 mb-2 cursor-pointer"
                        onClick={setTag}
                        // className="mr-2 mb-2 bg-white text-gray border border-gray relative" // Добавили relative для позиционирования tooltip
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <span
                          className={`w-3 h-3 rounded-full inline-block mr-1 ${colorMap[store.tags[tagID]?.color || 'gray']}`}
                        ></span>
                        <span>{isHovered ? fullPath : tagName}</span>
                        {isHovered && (
                          <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded z-10">
                            {fullPath}
                          </div>
                        )}
                      </Badge>
                    );
                  })}
                </div>}
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
                    </div >
                  </div >
                </CardDescription>
              </div >
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div>
              <p className="text-muted-foreground text-sm">{el.updated_at ?? el.created_at}</p>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div >
  )
})
