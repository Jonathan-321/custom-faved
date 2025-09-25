import { Button } from "@/components/ui/button"
import {
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { observer } from "mobx-react-lite"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { ArrowDownUp, X } from "lucide-react"
import { useState } from "react"


const formatDateFieldName = (fieldName) => {
    if (fieldName === 'created_at' || fieldName === 'updated_at') {
        return fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace('_', ' ').toLowerCase();
    }
    if (!fieldName) {
        return "";
    }
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase();
}

export const PopoverSort: React.FC<{
    selectedSortColumn: any;
    handleSortChange: any;
    sortableColumns: any;
}> = observer(({ selectedSortColumn, handleSortChange, sortableColumns }) => {
    const [sortDirection, setSortDirection] = useState<string>("asc"); // Устанавливаем начальное значение

    const handleDirectionChange = (e) => {
        const newDirection = e === "ASC" ? "asc" : "desc";
        setSortDirection(newDirection); // Сначала обновляем состояние
        handleSortChange(selectedSortColumn, newDirection); // Затем вызываем handleSortChange
    };

    return (
        <div>
            <PopoverTrigger asChild>
                <Button className="" variant="outline"><ArrowDownUp /></Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-row flex-nowrap w-[320px] justify-between items-center" >
                <Select
                    value={selectedSortColumn || ""}
                    onValueChange={(e) => { handleSortChange(e, sortDirection) }}
                >
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {sortableColumns.map((column) => (
                                <SelectItem key={column.accessorKey} value={column.accessorKey}>
                                    {formatDateFieldName(column.accessorKey)}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>

                </Select>
                <div >
                    {selectedSortColumn && (
                        <Select
                            value={sortDirection === "asc" ? "ASC" : "DESC"} // Отображаем текущее направление
                            onValueChange={handleDirectionChange}
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
                    )}
                </div>
                {selectedSortColumn && <Button variant={"ghost"} onClick={() => { handleSortChange("") }} className="flex "> <X color="#7b7474" strokeWidth={1} /></Button>}
            </PopoverContent>
        </div >
    )
})
