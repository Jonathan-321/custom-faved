import { Button } from "@/components/ui/button"
import {
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { observer } from "mobx-react-lite"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { ArrowDownUp, X } from "lucide-react"


const capitalizeFirstLetter = ([first, ...rest]) => {
    if (!first) { return ""; }
    return first.toUpperCase() + rest.join('').toLowerCase();
}

export const PopoverSort: React.FC<{
    selectedSortColumn: any;
    handleSortChange: any;
    sortableColumns: any;
    setSortDesc: any;
}> = observer(({ selectedSortColumn, handleSortChange, sortableColumns, setSortDesc }) => {
    return (
        <div>
            <PopoverTrigger asChild>
                <Button className="ml-[10px]" variant="outline"><ArrowDownUp /></Button>
            </PopoverTrigger>
            <PopoverContent className=" flex flex-row flex-nowrap w-[320px] justify-between items-center" >
                <Select
                    value={selectedSortColumn || ""}
                    onValueChange={(e) => { handleSortChange(e) }}
                >
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {sortableColumns.map((column) => (
                                <SelectItem key={column.accessorKey} value={column.accessorKey}>
                                    {capitalizeFirstLetter(column.accessorKey)}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>

                </Select>
                <div >
                    {selectedSortColumn && <Select
                        defaultValue="ASC"
                        onValueChange={(e) => {
                            if (e === 'ASC') {
                                setSortDesc(false); handleSortChange(selectedSortColumn);
                            } else {
                                setSortDesc(true); handleSortChange(selectedSortColumn);
                            }
                        }}
                    >
                        <SelectTrigger className="w-[90px]">
                            <SelectValue placeholder="ASC" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="ASC">ASC</SelectItem>
                                <SelectItem value="DESC">DESC</SelectItem>
                            </SelectGroup>
                        </SelectContent>

                    </Select>
                    }
                </div>
                {selectedSortColumn && <Button variant={"ghost"} onClick={() => { handleSortChange("") }} className="flex "> <X color="#7b7474" strokeWidth={1} /></Button>}
            </PopoverContent>
        </div >
    )
})
