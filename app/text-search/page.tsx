"use client";

import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Key, useEffect, useState } from "react";
import { toTitleCase } from "../_lib/utils";
import ImageResponseAccordion from "../_components/ImageResponseAccordion";

export default function Page() {
  const [filteredItems, setFilteredItems] = useState<WasteType[]>([]);
  const [defaultItems, setDefaultItems] = useState<WasteType[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch(`/api/items`);
      const { items } = (await res.json()) as { items: WasteType[] };
      setDefaultItems(items);
    };
    fetchItems();
  }, []);

  const handleSearch = async (key: Key | null) => {
    if (!key) return;
    const searchTerm = key.toString();
    const result = defaultItems.filter((item) => item.item === searchTerm);
    setFilteredItems(result);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8">
      <Autocomplete
        defaultItems={defaultItems}
        startContent="🔍"
        label="Search for item name"
        placeholder="E.g. wet wipes, plastic bottle, etc."
        className="max-w-xs"
        onSelectionChange={handleSearch}
      >
        {(item) => (
          <AutocompleteItem key={item.item}>
            {toTitleCase(item.item)}
          </AutocompleteItem>
        )}
      </Autocomplete>

      <ImageResponseAccordion
        data={{ from_database: filteredItems, from_llm: [] }}
      />
    </div>
  );
}
