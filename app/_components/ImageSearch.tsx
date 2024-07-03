"use client";
import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import { ImageIcon } from "@/app/_icons/ImageIcon";
import { CameraIcon } from "@/app/_icons/CameraIcon";
import ImageUpload from "./ImageUpload";
import CameraUpload from "./CameraUpload";
import ImageResponseAccordion from "./ImageResponseAccordion";
import { Progress } from "@nextui-org/progress";
import { isMobileDevice } from "../_lib/utils";

export default function ImageSearch() {
  const [imageUploadImage, setImageUploadImage] = useState(""); // base64 representation of image
  const [cameraUploadImage, setCameraUploadImage] = useState(""); // base64 representation of image
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isImageUploadDataFetching, setIsImageUploadDataFetching] =
    useState(false);
  const [isCameraUploadDataFetching, setIsCameraUploadDataFetching] =
    useState(false);
  const [imageUploadDataResponse, setImageUploadDataResponse] =
    useState<ApiVisionResponse>();
  const [cameraUploadDataResponse, setCameraUploadDataResponse] =
    useState<ApiVisionResponse>();

  const [imageUploadDataError, setImageUploadDataError] = useState("");
  const [cameraUploadDataError, setCameraUploadDataError] = useState("");

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  return (
    <div className="flex flex-col w-full items-center justify-center mt-4 gap-4">
      <Tabs key="bordered" variant="bordered" aria-label="Image search tabs">
        <Tab
          key="image-upload"
          title={
            <div className="flex items-center space-x-2">
              <ImageIcon />
              <span>Image Upload</span>
            </div>
          }
        >
          <ImageUpload
            onImageChange={setImageUploadImage}
            onDataResponse={setImageUploadDataResponse}
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
              className="max-w-md mt-4"
            />
          ) : (
            imageUploadDataResponse && (
              <div className="flex flex-col items-center justify-center my-4 w-auto">
                <ImageResponseAccordion data={imageUploadDataResponse} />
              </div>
            )
          )}
        </Tab>

        {!isMobile && (
          <Tab
            key="camera-upload"
            title={
              <div className="flex items-center space-x-2">
                <CameraIcon />
                <span>Camera Upload</span>
              </div>
            }
          >
            <CameraUpload
              onImageChange={setCameraUploadImage}
              cameraOpened={setIsCameraOpen}
              onDataResponse={setCameraUploadDataResponse}
              isDataFetching={setIsCameraUploadDataFetching}
              onDataError={setCameraUploadDataError}
            />
            {!isCameraOpen && cameraUploadImage && (
              <div className="flex flex-col items-center justify-center my-4 w-auto">
                <img
                  src={cameraUploadImage}
                  alt="Camera Uploaded Image"
                  className="w-5/6 h-5/6"
                />
              </div>
            )}
            {cameraUploadDataError ? (
              <div className="flex flex-col items-center justify-center my-4 w-auto text-red-500">
                <p>{cameraUploadDataError}</p>
              </div>
            ) : isCameraUploadDataFetching ? (
              <Progress
                size="sm"
                isIndeterminate
                label="Loading..."
                aria-label="Loading camera uploaded image..."
                className="max-w-md mt-4"
              />
            ) : (
              cameraUploadDataResponse && (
                <div className="flex flex-col items-center justify-center my-4 w-auto">
                  <ImageResponseAccordion data={cameraUploadDataResponse} />
                </div>
              )
            )}
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
