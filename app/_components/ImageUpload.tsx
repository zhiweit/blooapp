"use client";

import { Button } from "@nextui-org/button";
import { useRef, useState } from "react";
import { ImageIcon } from "../_icons/ImageIcon";

type ImageUploadProps = {
  onImageChange: (base64Image: string) => void;
  onDataResponse: (data: ApiVisionResponse) => void;
  isDataFetching: (isFetching: boolean) => void;
  onDataError: (error: string) => void;
};

export default function ImageUpload({
  onImageChange,
  onDataResponse,
  isDataFetching,
  onDataError,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp"
    ) {
      setErrorMsg(
        "Invalid image file upload type. Please upload only image files (jpeg, png, webp)"
      );
      return;
    }
    // convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      onImageChange(base64Image);
      // send post request
      onDataError("");
      isDataFetching(true);
      try {
        const res = await fetch("/api/vision", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ base64_image: base64Image.split(",")[1] }),
        });
        const data = (await res.json()) as ApiVisionResponse;
        isDataFetching(false);
        onDataResponse(data);
      } catch (error) {
        console.error(error);
        onDataError(
          "We are experiencing an error processing your request. Please try again later."
        );
        isDataFetching(false);
      }
    };
    reader.readAsDataURL(file);
    setErrorMsg("");
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-4">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleImageChange}
      />
      <Button
        startContent={<ImageIcon />}
        className="w-auto bg-gray-100"
        type="button"
        onPress={handleButtonClick}
      >
        <span className="text-sm">Upload image</span>
      </Button>
      {errorMsg && <span className="text-red-500">{errorMsg}</span>}
    </div>
  );
}
