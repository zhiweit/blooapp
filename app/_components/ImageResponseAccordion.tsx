"use client";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { toTitleCase, splitBulletList } from "@/_lib/utils";
import InfoTooltip from "./InfoTooltip";
import FeedbackBar from "./FeedbackBar";

interface Props {
  data: ImageSearchAccordionDataItem[];
  onFeedbackUpdate: (itemIndex: number, feedback: 0 | 1 | 2) => void;
}

export default function ImageResponseAccordion({
  data,
  onFeedbackUpdate,
}: Props) {
  return (
    <Accordion
      variant="splitted"
      selectionMode="multiple"
      className="p-2 flex flex-col gap-4 w-5/6"
    >
      {data.map((item, index) => {
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
              <p className="text-sm font-bold">
                Instructions{" "}
                {item.source === "llm" ? (
                  <InfoTooltip content="These instructions are obtained from other sources which may not be accurate." />
                ) : null}
              </p>
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

              <FeedbackBar
                index={index}
                feedback={item.feedback}
                onFeedbackUpdate={onFeedbackUpdate}
              />
            </div>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
