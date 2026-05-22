/**
 * Compresses an image file on the client side using the Canvas API.
 * Resizes the image to fit within maximum dimensions while maintaining aspect ratio,
 * and outputs an optimized JPEG file at the specified quality level.
 * 
 * @param file The original image File object
 * @param maxWidth The maximum width for the output image
 * @param maxHeight The maximum height for the output image
 * @param quality The compression quality (0.0 to 1.0)
 * @returns A promise that resolves to a new compressed File object, or the original file if compression fails
 */
export function compressImage(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7
): Promise<File> {
  return new Promise((resolve) => {
    // If we're not running in a browser environment, return the original file
    if (typeof window === "undefined" || !window.FileReader) {
      resolve(file);
      return;
    }

    // Only compress image files
    if (!file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio and new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file); // Fallback to original
          return;
        }

        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to compressed JPEG blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file); // Fallback to original
              return;
            }
            
            // Create a new File from the Blob
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };
      
      img.onerror = () => {
        resolve(file); // Fallback to original
      };
    };
    
    reader.onerror = () => {
      resolve(file); // Fallback to original
    };
  });
}
