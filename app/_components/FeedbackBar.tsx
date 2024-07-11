"use client";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { useState } from "react";
import {
  PiThumbsUpFill,
  PiThumbsUp,
  PiThumbsDownFill,
  PiThumbsDown,
} from "react-icons/pi";

interface Props {
  index: number;
  feedback: 0 | 1 | 2;
  onFeedbackUpdate: (itemIndex: number, feedback: 0 | 1 | 2) => void;
}

export default function FeedbackBar({
  index,
  feedback,
  onFeedbackUpdate,
}: Props) {
  const [isHelpfulResponse, setIsHelpfulResponse] = useState(feedback == 1);
  const [isNotHelpfulResponse, setIsNotHelpfulResponse] = useState(
    feedback == 2
  );

  const handleHelpfulResponse = () => {
    setIsNotHelpfulResponse(false);
    const updatedIsHelpful = !isHelpfulResponse;
    setIsHelpfulResponse(updatedIsHelpful);
    onFeedbackUpdate(index, updatedIsHelpful ? 1 : 0);
  };

  const handleNotHelpfulResponse = () => {
    setIsHelpfulResponse(false);
    const updatedIsNotHelpful = !isNotHelpfulResponse;
    setIsNotHelpfulResponse(updatedIsNotHelpful);
    onFeedbackUpdate(index, updatedIsNotHelpful ? 2 : 0);
  };

  return (
    <div className="flex flex-row gap-2 items-center">
      <span className="text-xs font-normal">Was this helpful?</span>
      <Tooltip
        key={`${index}-thumbs-up`}
        content="Helpful response"
        placement="bottom"
      >
        <Button
          variant="light"
          color="default"
          isIconOnly
          onPress={handleHelpfulResponse}
        >
          {isHelpfulResponse ? (
            <PiThumbsUpFill className="w-4 h-4" fill="#44825C" />
          ) : (
            <PiThumbsUp className="w-4 h-4" fill="#44825C" />
          )}
        </Button>
      </Tooltip>
      <Tooltip
        key={`${index}-thumbs-down`}
        content="Not helpful response"
        placement="bottom"
      >
        <Button
          variant="light"
          color="default"
          isIconOnly
          onPress={handleNotHelpfulResponse}
        >
          {isNotHelpfulResponse ? (
            <PiThumbsDownFill className="w-4 h-4" fill="#9F2828" />
          ) : (
            <PiThumbsDown className="w-4 h-4" fill="#9F2828" />
          )}
        </Button>
      </Tooltip>
    </div>
  );
}
