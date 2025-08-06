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
import {useContext} from "react";
import {StoreContext} from "@/store/storeContext.ts";
import {toJS} from "mobx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.tsx";



const TagEdit = observer(({className}: {className?: string}) => {
  const store = useContext(StoreContext);
  const [open, setOpen] = React.useState(false)
  const [values, setValues] = React.useState([])
  const tags = Object.values(toJS(store.tags));

  const [tagTitle, setTagTitle] = React.useState('')
  let tagObject = toJS(store.tags);
  console.log('Object.values(toJS(store.tags))',Object.values(toJS(store.tags)), values)

const [showTagCreate, setShowTagCreate] = React.useState(false)

  const [query, setQuery] = React.useState("")



  const [tagsList, setTagList] = React.useState(tags);

  const sort = () => {

    setTagList(tagsList.sort((a, b) => {
      return Number(values.includes(b.id)) - Number(values.includes(a.id))
    }));
  }

  const colorMap = {
    'gray':  'bg-gray-600',
    'green':  'bg-green-600',
    'red':  'bg-red-600',
    'yellow':  'bg-yellow-600',
    'aqua':  'bg-blue-600',
    'white ':  'bg-neutral-100',
    'black':  'bg-neutral-950',
  }

  return (
    <div className={ [className, 'justify-between'].join(' ') }>
      <Dialog open={showTagCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new tag</DialogTitle>
            <DialogDescription>

              <form>
                <div> <label> Title </label>
                  <input id="title" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter tag title" value={tagTitle} /> </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter tag description"
                  />
                </div>

                <div>
                  <label htmlFor="color" className="block text-sm font-medium mb-1">
                    Color
                  </label>
                  <input
                    id="color"
                    type="color"
                    className="w-16 h-10 border border-gray-300 rounded-md cursor-pointer"
                    defaultValue="#3b82f6"
                  />
                </div>

                <div>
                  <label htmlFor="parent" className="block text-sm font-medium mb-1">
                    Parent Tag
                  </label>
                  <select
                    id="parent"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="0">No parent</option>
                    {tagsList.map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.fullPath}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="pinned"
                    type="checkbox"
                    className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="pinned" className="text-sm font-medium">
                    Pinned
                  </label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTagCreate(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Tag
                  </Button>
                </div>
              </form>

            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    <Popover open={open} onOpenChange={(v) => { setOpen(v); !v && setQuery(''); !v && sort() }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={ ['text-left'].join(' ') }
        >
          { values.length > 0
            ? values.map(v => tagObject[v]?.title).join(', ')
            : "Select tags..."}

          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 overflow-y-scroll" align = "start" onWheel={(e) => e.stopPropagation()}>

        <Command shouldFilter={false} className={''} disablePointerSelection={false} loop={false} >
          <CommandInput onValueChange={setQuery} placeholder="Search tags..." className="h-9" />

          <CommandList>
            {/*<CommandEmpty>No tags found.</CommandEmpty>*/}
            <CommandGroup >
              {tagsList
                .filter(tag => tag.fullPath.toLowerCase().includes(query.toLowerCase())).map((tag) => (
                  <CommandItem
                    key={tag.id}
                    value={tag.id}
                    keywords={[tag.fullPath]}
                    onSelect={(currentValue)=> {
                      console.log(currentValue, tag)
                      // setOpen(false)

                      setValues(
                        values.includes(currentValue)
                          ? values.filter(val => val !== currentValue )
                          : [...values, currentValue]
                      )
                    }}
                  >
                    <span className={`w-3 h-3 rounded-full inline-block mr-1 ${colorMap[tag.color]}`}></span>
                    { tag.fullPath }
                    <Check
                      className={cn(
                        "ml-auto",
                        values.includes( tag.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}

              {query.length > 1 && typeof tagsList.find(t => t.fullPath.toLowerCase() === query.toLowerCase()) === 'undefined' && ( <CommandItem
                forceMount={true}
                key="new_item"
                value={query}
                // keywords={[tag.fullPath]}
                onSelect={(currentValue)=> {
                  setTagTitle(query)
                  setShowTagCreate(true)

                  // const newTagID = 222
                  // setValues(
                  //   [...values, newTagID]
                  // )
                  // setOpen(false)
                }}
              >
                + Create new tag: "{query}"
                {/*<Check*/}
                {/*  className={cn(*/}
                {/*    "ml-auto",*/}
                {/*    values.includes( tag.id) ? "opacity-100" : "opacity-0"*/}
                {/*  )}*/}
                {/*/>*/}
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