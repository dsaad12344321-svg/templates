// Utility to produce a cropped image blob URL from a source + pixel crop area.
export type Area = { x: number; y: number; width: number; height: number };

export async function getCroppedImageUrl(
  imageSrc: string,
  crop: Area,
  outputWidth = 1080,
  outputHeight = 1920,
): Promise<string> {
  const img = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    img,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outputWidth,
    outputHeight,
  );
  return canvas.toDataURL("image/jpeg", 0.95);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
