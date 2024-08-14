export function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
}

export function splitBulletList(text: string) {
  return text.split("\u2022");
}

/**
 * Resize image to fit within 2000px on the longest side and 768px on the shortest side (OpenAI recommendation)
 * @param base64Image
 * @returns Promise<string>
 */
export function resizeImage(base64Image: string): Promise<string> {
  const mimeType = base64Image.split(",")[0].split(":")[1].split(";")[0];
  const img = new Image();
  img.src = base64Image;

  return new Promise((resolve) => {
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate the new dimensions
      if (width > height) {
        if (width > 2000) {
          height = (height * 2000) / width;
          width = 2000;
        }
      } else {
        if (height > 2000) {
          width = (width * 2000) / height;
          height = 2000;
        }
      }

      if (width < height) {
        if (width > 768) {
          height = (height * 768) / width;
          width = 768;
        }
      } else {
        if (height > 768) {
          width = (width * 768) / height;
          height = 768;
        }
      }

      // Create a canvas to draw the resized image
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }

      // Get the resized image as a base64 string
      const resizedBase64 = canvas.toDataURL(mimeType);
      resolve(resizedBase64);
    };
  });
}
