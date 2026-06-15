import * as ImageManipulator from "expo-image-manipulator";

export type CompressedImage = {
  base64: string;
  mimeType: string;
  width: number;
  height: number;
};

function guessMimeType(filename?: string) {
  const f = (filename ?? "").toLowerCase();
  if (f.endsWith(".png")) return "image/png";
  if (f.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

export async function compressImageToJpegBase64(params: {
  uri: string;
  fileName?: string;
  maxDimension?: number; // default 1024
  quality?: number; // default 0.7
}): Promise<CompressedImage> {
  const { uri, fileName, maxDimension = 1024, quality = 0.7 } = params;

  const manipResult = await ImageManipulator.manipulateAsync(
    uri,
    [
      {
        resize: {
          width: maxDimension,
          height: maxDimension,
        },
      },
    ],
    {
      compress: quality,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    },
  );

  if (!manipResult.base64) {
    throw new Error("Image compression failed: missing base64");
  }

  const mimeType = guessMimeType(fileName);

  return {
    base64: manipResult.base64,
    mimeType,
    width: manipResult.width ?? maxDimension,
    height: manipResult.height ?? maxDimension,
  };
}
