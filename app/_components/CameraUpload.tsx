"use client";

import { Button } from "@nextui-org/button";
import { useEffect, useRef, useState } from "react";
import { CameraIcon } from "../_icons/CameraIcon";
type CameraUploadProps = {
  onImageChange: (base64Image: string) => void;
  cameraOpened: (opened: boolean) => void;
  onDataResponse: (data: ApiVisionResponse) => void;
  isDataFetching: (isFetching: boolean) => void;
  onDataError: (error: string) => void;
};

export default function CameraUpload({
  onImageChange,
  cameraOpened,
  onDataResponse,
  isDataFetching,
  onDataError,
}: CameraUploadProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleOpenCamera = async () => {
    setIsCameraOpen(true);
    cameraOpened(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    }
  };

  const handleCaptureImage = async () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL("image/jpeg");
        onImageChange(imageDataUrl);
        setIsCameraOpen(false);
        cameraOpened(false);
        // send post request
        onDataError("");
        isDataFetching(true);
        try {
          const res = await fetch("/api/vision", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ base64_image: imageDataUrl.split(",")[1] }),
          });
          const data = (await res.json()) as ApiVisionResponse;
          isDataFetching(false);
          onDataResponse(data);
        } catch (error) {
          onDataError(
            "We are experiencing an error processing your request. Please try again later."
          );
          isDataFetching(false);
        }
      }
    }
  };

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {!isCameraOpen && (
        <Button
          startContent={<CameraIcon />}
          className="w-auto bg-gray-100 mt-4"
          type="button"
          onPress={handleOpenCamera}
        >
          <span className="text-sm">Open Camera</span>
        </Button>
      )}
      {isCameraOpen && (
        <div className="mt-4">
          <video ref={videoRef} style={{ width: "100%" }} />
          <Button
            className="w-auto bg-gray-100 mt-4"
            type="button"
            onPress={handleCaptureImage}
          >
            <span className="text-sm">Capture Image</span>
          </Button>
        </div>
      )}
    </div>
  );
}
