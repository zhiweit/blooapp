"use client";

import { Button, ButtonProps } from "@nextui-org/button";
import { useRef } from "react";

interface ImageUploadProps extends ButtonProps {
  onImageChange: (base64Image: string) => void;
}

export default function ImageUploadButton({
  onImageChange,
  ...props
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp"
    ) {
      return;
    }
    // convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      onImageChange(base64Image);
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleImageChange}
      />
      <Button onPress={handleButtonClick} {...props}>
        {props.children}
      </Button>
    </div>
  );
}
