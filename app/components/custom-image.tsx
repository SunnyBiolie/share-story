import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { AspectRatio, ImageItemType } from "~/types/types";

export type ImageState = "empty" | "invalid" | "loading" | "error" | "success";

interface CustomImageProps {
  item: ImageItemType;
  imageContainerRef: React.RefObject<HTMLDivElement>;
  imageWrapperRef: React.RefObject<HTMLDivElement>;
  imageRef: React.RefObject<HTMLImageElement>;
  validUrl: string;
  aspectRatio: AspectRatio;
  intrinsicAspectRatio: number | null;
  isVerticalImage: boolean | null;
  error: boolean;
}

const CustomImage = ({
  item,
  imageContainerRef,
  imageWrapperRef,
  imageRef,
  validUrl,
  aspectRatio,
  intrinsicAspectRatio,
  isVerticalImage,
  error,
}: CustomImageProps) => {
  const [width, setWidth] = useState<string>(item.percentageWidth || "50%");
  const [overflowWidth, setOverflowWidth] = useState<number | null>(null);
  const [overflowHeight, setOverflowHeight] = useState<number | null>(null);
  const [cropPos, setCropPos] = useState<[number, number]>(
    item.cropPos || [0, 0]
  );

  useEffect(() => {
    if (intrinsicAspectRatio === null || isVerticalImage === null) return;

    window.onresize = () => {
      setOverflow();
      if (isVerticalImage) setCropPosition(cropPos[0]);
      else setCropPosition(cropPos[1]);
    };
  });

  const setOverflow = () => {
    if (intrinsicAspectRatio === null || isVerticalImage === null) return;

    const imageContainer = imageContainerRef.current!;

    if (isVerticalImage) {
      setOverflowHeight(imageContainer.offsetWidth / intrinsicAspectRatio);
    } else {
      setOverflowWidth(imageContainer.offsetHeight * intrinsicAspectRatio);
    }
  };

  const setCropPosition = (newValue: number) => {
    if (intrinsicAspectRatio === null || isVerticalImage === null) return;

    const imageContainer = imageContainerRef.current!;

    const fullHeight = imageContainer.offsetWidth / intrinsicAspectRatio;
    const fullWidth = imageContainer.offsetHeight * intrinsicAspectRatio;

    let cropPosition: [number, number];

    if (isVerticalImage) {
      if (newValue >= 0) cropPosition = [0, 0];
      else if (newValue <= imageContainer.offsetHeight - fullHeight)
        cropPosition = [imageContainer.offsetHeight - fullHeight, 0];
      else cropPosition = [newValue, 0];
    } else {
      if (newValue >= 0) {
        cropPosition = [0, 0];
      } else if (newValue <= imageContainer.offsetWidth - fullWidth) {
        cropPosition = [0, imageContainer.offsetWidth - fullWidth];
      } else {
        cropPosition = [0, newValue];
      }
    }

    item.cropPos = cropPosition;
    setCropPos(cropPosition);
  };

  useEffect(() => {
    if (intrinsicAspectRatio === null || isVerticalImage === null) return;
    if (error) return;

    setOverflow();
    if (isVerticalImage) {
      setCropPosition(cropPos[0])!;
    } else {
      setCropPosition(cropPos[1])!;
    }
  }, [validUrl, error]);

  useEffect(() => {
    if (intrinsicAspectRatio === null || isVerticalImage === null) return;
    if (error) return;

    setOverflow();
    if (isVerticalImage) {
      setCropPosition(cropPos[0])!;
    } else {
      setCropPosition(cropPos[1])!;
    }
  }, [aspectRatio, error]);

  const onDragImage = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (intrinsicAspectRatio === null || isVerticalImage === null) return;

    const image = imageRef.current!;

    if (isVerticalImage) {
      const startPos = e.clientY - image.offsetTop;

      const onMove = (event: MouseEvent) => {
        const newTop = event.clientY - startPos;
        setCropPosition(newTop)!;
      };

      const stopMove = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", stopMove);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", stopMove);
    } else {
      const startPos = e.clientX - image.offsetLeft;

      const onMove = (event: MouseEvent) => {
        const newLeft = event.clientX - startPos;
        setCropPosition(newLeft)!;
      };

      const stopMove = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", stopMove);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", stopMove);
    }
  };

  const onResizeImageX = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (intrinsicAspectRatio === null || isVerticalImage === null) return;

    const imageContainer = imageContainerRef.current!;

    const startWidth = imageContainer.clientWidth;
    const startPos = e.screenX;

    const onResize = (event: MouseEvent) => {
      setWidth((event.screenX - startPos) * 2 + startWidth + "px");

      const image = imageRef.current!;

      if (isVerticalImage) {
        const newTop = image.offsetTop;
        setCropPosition(newTop)!;
      } else {
        const newLeft = image.offsetLeft;
        setCropPosition(newLeft)!;
      }

      setOverflow();
    };

    const stopResize = () => {
      window.removeEventListener("mousemove", onResize);
      window.removeEventListener("mouseup", stopResize);

      item.percentageWidth =
        (imageContainer.clientWidth /
          imageContainer.parentElement!.clientWidth) *
          100 +
        "%";
    };

    window.addEventListener("mousemove", onResize);
    window.addEventListener("mouseup", stopResize);
  };

  if (intrinsicAspectRatio === null || isVerticalImage === null) return <></>;

  return (
    <>
      {!error ? (
        <div
          ref={imageContainerRef}
          className="group relative max-w-[80%] min-w-[25%]"
          style={{ width: width }}
        >
          <div
            ref={imageWrapperRef}
            className="w-full overflow-hidden" // transition-all
            style={{
              aspectRatio:
                aspectRatio === "auto" ? intrinsicAspectRatio : aspectRatio,
            }}
          >
            <div
              className={cn("relative", isVerticalImage ? "w-full" : "h-full")}
              style={
                isVerticalImage
                  ? { height: overflowHeight ? overflowHeight : "100%" }
                  : { width: overflowWidth ? overflowWidth : "100%" }
              }
            >
              {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
              <img
                ref={imageRef}
                src={validUrl}
                alt="This url not available"
                className={cn(
                  "absolute h-full object-cover hover:cursor-move bg-neutral-950/10 dark:bg-neutral-800/75",
                  intrinsicAspectRatio! ? "h-full" : "w-full"
                )}
                style={{
                  top: cropPos[0] + "px",
                  left: cropPos[1] + "px",
                }}
                draggable={"false"}
                onMouseDown={onDragImage}
              />
            </div>
          </div>
          <div className="hidden group-hover:flex items-center absolute left-full top-1/2 -translate-y-1/2 px-2 h-full">
            <button
              className="w-2 max-h-full h-1/2 min-h-10 rounded-full bg-neutral-200/50 hover:bg-neutral-200 dark:bg-neutral-700/50 hover:dark:bg-neutral-700 hover:cursor-ew-resize"
              onMouseDown={onResizeImageX}
            ></button>
          </div>
        </div>
      ) : (
        <div className="w-2/5 aspect-square bg-neutral-950/10 dark:bg-neutral-800/75 flex items-center justify-center">
          This url not available.
        </div>
      )}
    </>
  );
};

export default CustomImage;
