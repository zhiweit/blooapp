"use client";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { toTitleCase, splitBulletList } from "../_lib/utils";
import InfoTooltip from "./InfoTooltip";

interface Props {
  data: ApiVisionResponse;
}

export default function ImageResponseAccordion({ data }: Props) {
  const accordionItems = [
    ...data.from_database.map((item, index) => (
      <AccordionItem
        key={`${item.item}-${index}`}
        aria-label={item.item}
        title={
          <span
            className={`text-medium ${
              item.recyclable ? "text-green-700" : "text-red-700"
            }`}
          >
            {item.recyclable
              ? `✅ ${toTitleCase(item.item)}`
              : `❌ ${toTitleCase(item.item)}`}
          </span>
        }
      >
        <div className="flex flex-col gap-1">
          <p className="text-sm">
            <span className="font-bold">Material</span>: {item.material}
          </p>
          <p className="text-sm font-bold">Instructions</p>
          <ul className="list-disc list-inside text-sm text-justify">
            {splitBulletList(item.instructions).map((instruction, index) => {
              return index == 0 ? (
                <p>{instruction}</p>
              ) : (
                <li className="pl-4" key={`${item.item}-${index}`}>
                  {instruction}
                </li>
              );
            })}
          </ul>

          {item.links && item.links.length > 0 && (
            <>
              <p className="text-sm font-bold">Links</p>
              <ul className="list-disc list-inside text-sm text-justify">
                {item.links.map((link, index) => (
                  <li key={`${item.item}-${index}`}>
                    <a className="text-blue-500" href={link} target="_blank">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </AccordionItem>
    )),
    ...data.from_llm.map((item, index) => (
      <AccordionItem
        key={`${item.item}-${index}`}
        aria-label={item.item}
        title={
          <span
            className={`text-medium ${
              item.recyclable ? "text-green-700" : "text-red-700"
            }`}
          >
            {item.recyclable
              ? `✅ ${toTitleCase(item.item)}`
              : `❌ ${toTitleCase(item.item)}`}
          </span>
        }
      >
        <div className="flex flex-col gap-1">
          <p className="text-sm">
            <span className="font-bold">Material</span>: {item.material}
          </p>
          <p className="text-sm font-bold">
            Instructions{" "}
            <InfoTooltip
              content={
                "These instructions are obtained from other sources which may not be accurate."
              }
            />
          </p>
          <p className="text-sm text-justify">{item.instructions}</p>
        </div>
      </AccordionItem>
    )),
  ];

  return (
    <Accordion
      variant="splitted"
      selectionMode="multiple"
      className="p-2 flex flex-col gap-4 w-5/6"
    >
      {accordionItems}
    </Accordion>
  );
}
