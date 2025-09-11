import React from "react";
import { Badge } from "../ui/badge";
import { observer } from "mobx-react-lite";
import { StoreContext } from "@/store/storeContext";
import { colorMap } from "@/lib/utils";

type TagType = {
    fullPath: string;
    color: string;
};
interface MainStore {
    tags: Record<number, TagType>;
    setCurrentTagId: (id: number) => void;
    setCurrentPage: (page: number) => void;
}

const getTagName = (fullPath: string) => fullPath?.substring(fullPath.lastIndexOf("/") + 1) || "";

export const TagBadge: React.FC<{ tagID: number }> = observer(({ tagID }) => {
    const store = React.useContext(StoreContext) as unknown as MainStore;
    const [isHovered, setIsHovered] = React.useState(false);
    const fullPath = store.tags?.[tagID]?.fullPath || "";
    const tagName = getTagName(fullPath);

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
            className="mr-2 mb-2 cursor-pointer relative"
            onClick={setTag}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span
                className={`w-3 h-3 rounded-full inline-block mr-1 ${colorClass}`}
            ></span>
            <span>{isHovered ? fullPath : tagName}</span>
            {isHovered && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded z-10">
                    {fullPath}
                </div>
            )}
        </Badge>
    );
});