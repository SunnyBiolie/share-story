import { ElementRef, useEffect, useRef, useState } from "react";
import { cn, isValidUrl } from "~/lib/utils";
import { ImageItemType } from "~/types/types";

const ImageItem = ({ item }: { item: ImageItemType }) => {
  const [error, setError] = useState<boolean>(false);
  const [intrinsicAspectRatio, setIntrinsicAspectRatio] = useState<
    number | null
  >(null);
  const [isVerticalImage, setIsVerticalImage] = useState<boolean | null>(null);
  const [overflowWidth, setOverflowWidth] = useState<number | null>(null);
  const [overflowHeight, setOverflowHeight] = useState<number | null>(null);

  const imageContainerRef = useRef<ElementRef<"div">>(null);
  const imageRef = useRef<ElementRef<"img">>(null);

  useEffect(() => {
    if (isValidUrl(item.content)) {
      const imageContainer = imageContainerRef.current!;
      const image = imageRef.current!;

      image.onerror = () => {
        setError(true);
      };
      image.onload = () => {
        const intrinsicAspectRatio = image.naturalWidth / image.naturalHeight;
        const isVertical = image.naturalWidth / image.naturalHeight <= 1;

        setIntrinsicAspectRatio(intrinsicAspectRatio);
        setIsVerticalImage(isVertical);

        if (isVertical)
          setOverflowHeight(imageContainer.offsetWidth / intrinsicAspectRatio);
        else
          setOverflowWidth(imageContainer.offsetHeight * intrinsicAspectRatio);
      };
      image.src = item.content;
    }
  }, [item]);

  if (!isValidUrl(item.content)) {
    item.content = "";
  }

  if (item.content === "") {
    return;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center gap-2 mt-2 mb-3">
      <div
        ref={imageContainerRef}
        className={cn(
          "relative overflow-hidden",
          error ? "w-[175px] aspect-square" : "max-w-[80%] min-w-[200px]"
        )}
        style={
          intrinsicAspectRatio
            ? {
                width: item.percentageWidth || "50%",
                aspectRatio:
                  item.aspectRatio === "auto"
                    ? intrinsicAspectRatio
                    : item.aspectRatio,
              }
            : { width: item.percentageWidth || "50%" }
        }
      >
        <div
          className={cn("relative", isVerticalImage ? "w-full" : "h-full")}
          style={
            isVerticalImage
              ? { height: overflowHeight ? overflowHeight : "100%" }
              : {
                  width: overflowWidth ? overflowWidth : "100%",
                }
          }
        >
          <img
            ref={imageRef}
            src={error ? "/no-image.png" : item.content}
            alt={`${item.content} is not available`}
            className={cn(
              "absolute",
              error
                ? "h-full"
                : "object-cover bg-neutral-800/20 dark:bg-neutral-800/60",
              isVerticalImage ? "h-full" : "w-full"
            )}
            style={{
              top: item.cropPos[0] + "px",
              left: item.cropPos[1] + "px",
            }}
          />
        </div>
      </div>
      <div
        className={cn(
          "text-sm text-center font-medium",
          error && "text-neutral-500 italic"
        )}
      >
        {error ? `Image is not available` : item.caption}
      </div>
    </div>
  );
};

export default ImageItem;
