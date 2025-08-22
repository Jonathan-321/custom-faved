"use client"

import { X } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import { observer } from "mobx-react-lite"
import React from "react"
import { StoreContext } from "@/store/storeContext"


export const DataSectionsToolbar: React.FC = observer(() => {
  const store = React.useContext(StoreContext);
  const [filter, setFilter] = useState('');
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (value === '') handleResetFilter()
    setFilter(value);

    const filteredItems = store.itemsOriginal.filter(item => {
      return (
        item.title.toLowerCase().includes(value) ||
        item.description.toLowerCase().includes(value) ||
        item.comments.toLowerCase().includes(value) ||
        item.url.toLowerCase().includes(value)
      );
    });
    store.setItems(filteredItems)
  };

  const handleResetFilter = () => {
    setFilter('');
    store.setItems(store.itemsOriginal)
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter..."
          value={filter}
          onChange={handleFilterChange}
          className="h-8 w-[150px] lg:w-[150px]"
        />
      </div>
    </div>
  )
})
