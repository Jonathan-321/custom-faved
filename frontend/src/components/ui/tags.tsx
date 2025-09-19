"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { observer } from "mobx-react-lite"
import {useContext, useEffect} from "react";
import { StoreContext } from "@/store/storeContext.ts";
import { toJS } from "mobx";
import { colorMap } from "@/lib/utils.ts";
import { TagsObjectType } from "@/types/types"


const TagEdit = observer(({ className, values, onChange }: { className?: string, values: Array<string> | undefined, onChange: (values: string[]) => void }) => {
  const store = useContext(StoreContext);
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(values.map(v => v.toString()))
  const [query, setQuery] = React.useState("")

  const getSortedTags = () => {
    const t = Object.values(toJS(store.tags as TagsObjectType[]))
    t.sort((a, b) => {
      return Number(selected.includes(b.id as unknown as string)) - Number(selected.includes(a.id as unknown as string))
    })
    return t
  }
  const [tags, setTags] = React.useState([]);

  React.useEffect(() => {
    setTags(
      getSortedTags()
    );

  }, [store.tags]);

  useEffect(() => {
    store.fetchTags()
  },[])

  React.useEffect(() => {
    onChange(selected)
  }, [selected])

  const sort = () => {
    setTags(getSortedTags());
  }

  return (
    <div className={[className, 'justify-between'].join(' ')}>

      <Popover open={open} onOpenChange={(v) => { setOpen(v); !v && setQuery(''); !v && sort() }}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={['text-left h-auto whitespace-normal'].join(' ')}
          >
            {selected.length > 0
              ? selected.map(v => tags.find(t => t.id === v)?.fullPath.replaceAll('\\/', '/')).join(', ')
              : "Select tags..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0 overflow-y-scroll" align="start" onWheel={(e) => e.stopPropagation()}>

          <Command shouldFilter={false} className={''} disablePointerSelection={false} loop={false} >
            <CommandInput value={query} onValueChange={setQuery} placeholder="Search tags..." className="h-9" />

            <CommandList>
              {/*<CommandEmpty>No tags found.</CommandEmpty>*/}
              <CommandGroup >
                {tags
                  .filter(tag => tag.fullPath.toLowerCase().includes(query.toLowerCase().trim())).map((tag) => (
                    <CommandItem
                      key={tag.id}
                      value={tag.id}
                      keywords={[tag.fullPath]}
                      onSelect={(currentValue) => {
                        setSelected(
                          selected.includes(currentValue)
                            ? selected.filter(val => val !== currentValue)
                            : [...selected, currentValue]
                        )
                      }}
                    >
                      <span className={`w-3 h-3 rounded-full inline-block mr-1 ${colorMap[tag.color]}`}></span>
                      {tag.fullPath}
                      <Check
                        className={cn(
                          "ml-auto",
                          selected.includes(tag.id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}

                {query.length > 1 && typeof tags.find(t => t.fullPath.toLowerCase() === query.trim().toLowerCase()) === 'undefined' && (<CommandItem
                  forceMount={true}
                  key="new_item"
                  value={query}
                  // keywords={[tag.fullPath]}
                  onSelect={async (currentValue) => {
                    const newTagID = await store.onCreateTag(query);
                    if (!newTagID) {
                      return;
                    }
                    setSelected(
                      [...selected, newTagID.toString()]
                    )
                    // sort();
                    // setQuery('');
                    // setOpen(false)
                  }}
                >
                  + Create new tag: "{query.trim()}"
                </CommandItem>)}
              </CommandGroup>
            </CommandList>
          </Command>

        </PopoverContent>
      </Popover>

    </div>
  )
})

export { TagEdit }