import React from "react";
import { Badge } from "../ui/badge";
import { observer } from "mobx-react-lite";
import { StoreContext } from "@/store/storeContext";
import { colorMap } from "@/lib/utils";

type TagType = {
    fullPath: string;
    title: string;
    color: string;
};
interface MainStore {
    tags: Record<number, TagType>;
    setCurrentTagId: (id: number) => void;
    setCurrentPage: (page: number) => void;
}


export const TagBadge: React.FC<{ tagID: number }> = observer(({ tagID }) => {
    const store = React.useContext(StoreContext) as unknown as MainStore;
    const [isHovered, setIsHovered] = React.useState(false);
    const fullPath = store.tags?.[tagID]?.fullPath.replaceAll('\\/', '/') || "";
    const tagName = store.tags?.[tagID]?.title;

    const setTag = () => {
        store.setCurrentTagId(tagID);
        store.setCurrentPage(1);
    };

    const colorClass = store.tags[tagID]?.color && colorMap[store.tags[tagID].color as keyof typeof colorMap]
        ? colorMap[store.tags[tagID].color as keyof typeof colorMap]
        : colorMap.gray;

    return (
        <Badge
            variant={'secondary'}
            className="mr-2 cursor-pointer"
            onClick={setTag}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span
                className={`w-3 h-3 rounded-full inline-block align-[-2px] mr-2 ${colorClass}`}
            ></span>
            <span>{isHovered ? fullPath : tagName}</span>
        </Badge>
    );
});