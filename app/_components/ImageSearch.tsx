"use client";
import React, { useState } from "react";
import ImageUpload from "./ImageUpload";
import ImageResponseAccordion from "./ImageResponseAccordion";
import { Progress } from "@nextui-org/progress";

export default function ImageSearch() {
  const [imageUploadImage, setImageUploadImage] = useState(""); // base64 representation of image
  const [isImageUploadDataFetching, setIsImageUploadDataFetching] =
    useState(false);
  const [imageSearchAccordionData, setImageSearchAccordionData] =
    useState<ImageSearchAccordionData>();

  const [imageUploadDataError, setImageUploadDataError] = useState("");

  const handleDataResponse = async (
    data: ApiVisionResponse,
    imageUrl: string
  ) => {
    // initialise feedback to 0 for these data items in db and et back the document id (feedbackId)
    const initFeedbackRes = await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl: imageUrl,
        items: data.data,
      }),
    });

    const { id: newFeedbackId }: { id: string } = await initFeedbackRes.json();
    const dataWithoutFeedback: ImageSearchAccordionDataItem[] = data.data.map(
      (item) => {
        return {
          ...item,
          feedback: 0,
        };
      }
    );

    const accordionData: ImageSearchAccordionData = {
      feedbackId: newFeedbackId,
      imageUrl: imageUrl,
      items: dataWithoutFeedback,
    };
    setImageSearchAccordionData(accordionData);
  };

  const handleFeedbackUpdate = async (
    itemIndex: number,
    feedback: 0 | 1 | 2
  ) => {
    const updatedImageSearchAccordionData = {
      ...imageSearchAccordionData,
    } as ImageSearchAccordionData;

    updatedImageSearchAccordionData.items[itemIndex].feedback = feedback;
    setImageSearchAccordionData(updatedImageSearchAccordionData);

    // send patch request to update the feedback for this item
    const feedbackItems: WasteTypeFeedbackItem[] =
      updatedImageSearchAccordionData.items.map((item) => {
        return {
          item: item.item,
          source: item.source,
          feedback: item.feedback,
        };
      });

    try {
      const res = await fetch("/api/feedback", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackId: updatedImageSearchAccordionData.feedbackId,
          items: feedbackItems,
        }),
      });
    } catch (error) {
      console.error("Error updating feedback", error);
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center mt-4 gap-4">
      <ImageUpload
        onImageChange={setImageUploadImage}
        onDataResponse={handleDataResponse}
        isDataFetching={setIsImageUploadDataFetching}
        onDataError={setImageUploadDataError}
      />

      {imageUploadImage && (
        <div className="flex flex-col items-center justify-center my-4 w-auto">
          <img
            src={imageUploadImage}
            alt="Uploaded image"
            className="w-5/6 h-5/6"
          />
        </div>
      )}

      {imageUploadDataError ? (
        <div className="flex flex-col items-center justify-center my-4 w-auto text-red-500">
          <p>{imageUploadDataError}</p>
        </div>
      ) : isImageUploadDataFetching ? (
        <Progress
          size="sm"
          isIndeterminate
          label="Loading..."
          aria-label="Loading uploaded image..."
          className="max-w-md my-4"
        />
      ) : (
        imageSearchAccordionData && (
          <div className="flex flex-col items-center justify-center my-4 w-full">
            <ImageResponseAccordion
              data={imageSearchAccordionData.items}
              onFeedbackUpdate={handleFeedbackUpdate}
            />
          </div>
        )
      )}
    </div>
  );
}
