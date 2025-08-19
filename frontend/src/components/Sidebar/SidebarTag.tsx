import * as React from "react";
import {
  Sidebar,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub, useSidebar
} from "@/components/ui/sidebar.tsx";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {IconChevronRight, IconDotsVertical, IconPinned} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {StoreContext} from "@/store/storeContext.ts";
import { colorMap} from "@/lib/utils.ts";


export function SidebarTag({tag, innerItems = [], level, isTagSelected, isChildTagSelected}) {
  const [isRenaming, setIsRenaming] = React.useState(false);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = React.useState(false);

  const [newTagTitle, setNewTagTitle] = React.useState(tag.fullPath);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    setNewTagTitle(tag.fullPath);
  }, [tag.fullPath]);


  const store = React.useContext(StoreContext);
  const { isMobile } = useSidebar()

  const deleteTag = () => {
    store.onDeleteTag(tag.id)
  }
  const enableRenaming = () => {
    setIsRenaming(true);
    setTimeout(() => {
      inputRef.current.focus();
    }, 50)
  }

  const submit = () => {
    store.onChangeTagTitle(tag.id, newTagTitle as string);
    // Add your submit logic here, e.g., store.onUpdateTagTitle(tag.id, newTagTitle)
    setIsRenaming(false);
  }

  const revert = () => {
    setNewTagTitle(tag.fullPath);
    setIsRenaming(false);
  }

  const setTag = () => {
    if (isRenaming) {
      return;
    }

    store.setCurrentTagId(tag.id);
    store.setCurrentPage(1);
  }


  const tagContent = (className = '') => {
    return (<>
      <button onClick={setTag} className={`${className} flex items-center gap-2 flex-grow-1 py-2`}>
        <span className={`w-2.5 h-2.5 rounded-full ${colorMap[tag.color]}`}></span>
        <input
          ref={inputRef}
          className={ ['border-none rounded-sm w-[85%]', (isRenaming ? '' : 'hidden')].join(' ')}
          value={newTagTitle as string}
          onChange={(e) => setNewTagTitle(e.target.value)}
          onKeyDown={(e) => {
              if (e.key === 'Escape') {
                revert();
              } else if (e.key === 'Enter') {
                submit();
              }
            }
          }
          onBlur={revert}
        />
        {!isRenaming && <span>{tag.title}</span>}
      </button>
      {!!tag.pinned && (<IconPinned className={'ms-auto'}/>)}
      {actionButtons}
    </>)
  }

  const actionButtons = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction
          className="data-[state=open]:bg-accent rounded-sm sidebar-menu-action"
        >
          <IconDotsVertical />
          <span className="sr-only">More</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-24 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align={isMobile ? "end" : "start"}
      >
        {level === 1 && (<DropdownMenuItem onClick={() => store.onChangeTagPinned(tag.id, !tag.pinned)}>
            <span>{tag.pinned ? 'Unpin' : 'Pin' } tag</span>
          </DropdownMenuItem>)}
        <DropdownMenuItem onClick={enableRenaming}>
          <span>Rename</span>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger> Color</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {Object.keys(colorMap).map((color) => (
                <DropdownMenuItem
                  key={color}
                  className={`text-${colorMap[color]}-foreground hover:bg-${colorMap[color]}-foreground/10`}
                  onClick={() => store.onChangeTagColor(tag.id, color)}
                >
                  <span className={`w-3 h-3 rounded-full inline-block mr-1 ${colorMap[color]}`}></span> {color.charAt(0).toUpperCase() + color.slice(1)}
                  <span className="ml-auto">{tag.color === color ? "✓" : ""}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={deleteTag}>
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const code = innerItems.length > 0 ? (<Collapsible className='group/collapsible'  open={isCollapsibleOpen || isChildTagSelected}
    onOpenChange={(open: boolean)=> setIsCollapsibleOpen(open) }

>
      <SidebarMenuItem>
        <SidebarMenuButton className={'py-0 active:bg-primary/90 active:text-primary-foreground' + (isTagSelected ? ' !bg-primary !text-primary-foreground' : '') }>
          <CollapsibleTrigger asChild>
            <IconChevronRight className={`transition-transform hover:cursor-pointer`} />
          </CollapsibleTrigger>
          {tagContent()}
        </SidebarMenuButton>

        <CollapsibleContent>
          <SidebarMenuSub>
            {innerItems}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>)
    :
    (<SidebarMenuItem >
      <SidebarMenuButton className={'py-0 active:bg-primary/90 active:text-primary-foreground' + (isTagSelected ? ' !bg-primary !text-primary-foreground' : '') }>
        {tagContent('pl-6')}
      </SidebarMenuButton>
    </SidebarMenuItem>)

  return (code)
}
