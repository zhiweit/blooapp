"use client";

import { useState } from "react";
import { Tooltip } from "@nextui-org/tooltip";
import { InfoIcon } from "../_icons/InfoIcon";

type InfoTooltipProps = {
  children?: React.ReactNode;
  content: string;
};

export default function InfoTooltip({ children, content }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Tooltip
        content={content}
        showArrow={true}
        placement="right-end"
        isOpen={isOpen}
      >
        <span className="inline">
          {children}
          <InfoIcon
            onClick={(e) => {
              setIsOpen((prev) => !prev);
            }}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          />
        </span>
      </Tooltip>
    </>
  );
}
