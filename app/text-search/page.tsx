"use client";

import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Key, useEffect, useState } from "react";
import { splitBulletList, toTitleCase } from "@/_lib/utils";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import InfoTooltip from "@/_components/InfoTooltip";

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

      <Accordion
        variant="splitted"
        selectionMode="multiple"
        className="p-2 flex flex-col gap-4 w-5/6"
      >
        {filteredItems.map((item, index) => {
          return (
            <AccordionItem
              key={`${item.item}-${index}`}
              aria-label={item.item}
              title={
                <span
                  className={`text-medium font-semibold ${
                    item.recyclable ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {item.recyclable ? "✅" : "❌"} {toTitleCase(item.item)}
                </span>
              }
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm">
                  <span className="font-bold">Material</span>: {item.material}
                </p>
                <p className="text-sm font-bold">Instructions</p>
                <ul className="list-disc list-inside text-sm text-justify">
                  {splitBulletList(item.instructions).map(
                    (instruction, index) => {
                      return (
                        <li key={`${item.item}-instructions-${index}`}>
                          {instruction}
                        </li>
                      );
                    }
                  )}
                </ul>

                {item.links && item.links.length > 0 && (
                  <>
                    <p className="text-sm font-bold">Links</p>
                    <ul className="list-disc list-inside text-sm ">
                      {item.links.map((link, index) => (
                        <li key={`${item.item}-links-${index}`}>
                          <a
                            className="text-blue-500"
                            href={link}
                            target="_blank"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
