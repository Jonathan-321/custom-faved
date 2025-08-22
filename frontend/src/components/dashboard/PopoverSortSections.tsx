import { Button } from "@/components/ui/button"
import {
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { observer } from "mobx-react-lite"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { ArrowDownUp, X } from "lucide-react"
import React, { useState } from "react"
import { StoreContext } from "@/store/storeContext"
import type { ItemType } from "@/types/types"


const capitalizeFirstLetter = ([first, ...rest]) => {
    if (!first) { return ""; }
    return first.toUpperCase() + rest.join('').toLowerCase();
}


export const PopoverSortSections: React.FC = observer(() => {
    const store = React.useContext(StoreContext);
    const [sortBy, setSortBy] = useState<keyof ItemType>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e as unknown as keyof ItemType);
    };

    const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(e as unknown as 'asc' | 'desc');
    };

    React.useEffect(() => {
        const sortedItems = [...store.items].sort((a, b) => {
            const valueA = a[sortBy];
            const valueB = b[sortBy];

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                const comparison = valueA.localeCompare(valueB);
                return sortOrder === 'asc' ? comparison : -comparison;
            } else if (typeof valueA === 'number' && typeof valueB === 'number') {
                return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
            } else {
                return 0
            }

        });
        store.setItems(sortedItems);
    }, [sortBy, sortOrder]);

    const sortableFields: (keyof ItemType)[] = ['url', 'description', 'title', 'created_at', 'updated_at', 'comments'];
    return (
        <div>
            <PopoverTrigger asChild>
                <Button className="ml-[10px]" variant="outline"><ArrowDownUp /></Button>
            </PopoverTrigger>
            <PopoverContent className=" flex flex-row flex-nowrap w-[320px] justify-between items-center" >
                <Select
                    value={sortBy}
                    onValueChange={handleSortByChange}
                >
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {sortableFields.map((field) => (
                                <SelectItem key={field} value={field}>
                                    {capitalizeFirstLetter(field)}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>

                </Select>
                <div >
                    {!!sortBy
                        &&
                        <Select
                            value={sortOrder}
                            onValueChange={handleSortOrderChange}
                        >
                            <SelectTrigger className="w-[90px]">
                                <SelectValue placeholder="ASC" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="asc">ASC</SelectItem>
                                    <SelectItem value="desc">DESC</SelectItem>
                                </SelectGroup>
                            </SelectContent>

                        </Select>
                    }
                </div>
                {!!sortBy && <Button variant={"ghost"} onClick={() => { setSortBy(""); store.setItems(store.itemsOriginal) }} className="flex "> <X color="#7b7474" strokeWidth={1} /></Button>}
            </PopoverContent>
        </div >
    )
})
