import { ElementRef, useEffect, useRef, useState } from "react";
import {
  AspectRatio,
  AspectRatioValue,
  DataType,
  ImageItemType,
} from "~/types/types";
import useDebounce from "~/hooks/use-debounce";
import { createBlankItem, removeThisItem } from "~/lib/handle-action";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Link, Loader2 } from "lucide-react";
import { isValidUrl } from "~/lib/utils";
import CustomImage, { ImageState } from "../custom-image";

interface ImageItemProps {
  index: number;
  data: DataType;
  setData: React.Dispatch<React.SetStateAction<DataType>>;
  item: ImageItemType;
}

const ImageItem = ({ index, data, setData, item }: ImageItemProps) => {
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  const [url, setUrl] = useState<string>(item.content);
  const [imageState, setImageState] = useState<ImageState>("empty");

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(
    item.aspectRatio || "auto"
  );
  const [defaultAspectRatio, setDefaultAspectRatio] = useState<number | null>(
    null
  );
  const [isVerticalImage, setIsVerticalImage] = useState<boolean | null>(null);

  const debounced = useDebounce(url, 500);

  const ref = useRef<ElementRef<"div">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  const captionRef = useRef<ElementRef<"input">>(null);

  const imageContainerRef = useRef<ElementRef<"div">>(null);
  const imageWrapperRef = useRef<ElementRef<"div">>(null);
  const imageRef = useRef<ElementRef<"img">>(null);

  useEffect(() => {
    const container = ref.current!;
    const input = inputRef.current!;

    container.onclick = () => {
      input.focus();
      data.currentIndex = index;
    };

    input.oninput = () => {
      (data.blockContent as ImageItemType[])[index].content = input.value;
      setUrl(input.value);
    };

    input.onkeydown = (e: KeyboardEvent) => {
      const prevContainer = container.previousElementSibling as HTMLElement;
      const nextContainer = container.nextElementSibling as HTMLElement;

      if (e.code === "Enter") {
        createBlankItem(e, index, data, setData);
      }
      if (e.code === "Backspace") {
        removeThisItem(e, true, input, index, data, setData, prevContainer);
      }
      switch (e.code) {
        case "ArrowUp":
          if (prevContainer) prevContainer.click();
          break;
        case "ArrowDown":
          if (nextContainer) nextContainer.click();
          break;
      }
    };
  }, [index, data, setData, item.content]);

  useEffect(() => {
    const caption = captionRef.current;
    if (caption) {
      caption.onclick = (e) => {
        e.stopPropagation();
      };

      caption.oninput = () => {
        (data.blockContent as ImageItemType[])[index].caption = caption.value;
      };
    }
  }, [data.blockContent, index, imageState]); // if not have imageState in deps, e.stopPropagation will not work

  useEffect(() => {
    let ignore = false;

    setImageState("loading");

    if (debounced === "") {
      setImageState("empty");
    } else {
      if (isValidUrl(debounced)) {
        const image = new Image();

        // naturalWidth && naturalHeight if outside onload will return 0
        image.onload = () => {
          setImageState("success");

          const defaultAR = image.naturalWidth / image.naturalHeight; // AR === Aspect Ratio
          const isVertical = defaultAR <= 1;

          setDefaultAspectRatio(defaultAR);
          setIsVerticalImage(isVertical);
        };
        image.onerror = () => {
          if (!ignore) setImageState("error");
        };
        image.src = debounced;

        if (!isFirstRender) onSelectAspectRatio("auto");
      } else {
        setImageState("invalid");
      }
    }

    return () => {
      ignore = true;
    };
  }, [debounced]);

  const onSelectAspectRatio = (value: AspectRatio) => {
    (data.blockContent[index] as ImageItemType).aspectRatio = value;
    setAspectRatio(value);
  };

  return (
    <div ref={ref} className="w-full mt-1 mb-2">
      <div className="flex items-center gap-x-2 mb-2">
        <div className="flex font-semibold">
          <Link className="w-5 h-5" />
        </div>
        <Input
          ref={inputRef}
          placeholder="Image's Url..."
          className="text-sm font-medium px-2 placeholder:italic placeholder:text-neutral-400 border-none shadow-none focus-visible:ring-0 !outline-neutral-500 dark:outline-neutral-600"
          defaultValue={url}
        />
        {imageState === "success" && (
          <Select
            onValueChange={(value: string) =>
              onSelectAspectRatio(value as AspectRatio)
            }
            defaultValue={item.aspectRatio}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem
                value="1/1"
                disabled={
                  !isVerticalImage &&
                  defaultAspectRatio! < AspectRatioValue["1/1"]
                }
              >
                1:1
              </SelectItem>
              <SelectItem
                value="4/3"
                disabled={
                  !isVerticalImage &&
                  defaultAspectRatio! < AspectRatioValue["4/3"]
                }
              >
                4:3
              </SelectItem>
              <SelectItem
                value="3/2"
                disabled={
                  !isVerticalImage &&
                  defaultAspectRatio! < AspectRatioValue["3/2"]
                }
              >
                3:2
              </SelectItem>
              <SelectItem
                value="16/9"
                disabled={
                  !isVerticalImage &&
                  defaultAspectRatio! < AspectRatioValue["16/9"]
                }
              >
                16:9
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      {imageState !== "empty" &&
        (imageState === "invalid" ? (
          <div className=" text-red-500 font-medium pb-1">Invalid URL.</div>
        ) : imageState === "loading" ? (
          <div className="w-full flex flex-col items-center justify-center">
            <div className="w-2/5 aspect-square bg-neutral-950/10 dark:bg-neutral-800/75 flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          </div>
        ) : (
          <div>
            <div className="w-full flex flex-col items-center justify-center">
              <CustomImage
                item={item}
                imageContainerRef={imageContainerRef}
                imageWrapperRef={imageWrapperRef}
                imageRef={imageRef}
                validUrl={debounced}
                aspectRatio={aspectRatio}
                intrinsicAspectRatio={defaultAspectRatio}
                isVerticalImage={isVerticalImage}
                error={imageState === "error"}
              />
              {imageState === "success" && (
                <Input
                  ref={captionRef}
                  type="text"
                  className="text-center border-none focus-visible:ring-0 shadow-none font-medium placeholder:font-normal"
                  placeholder="Caption (optional)"
                  defaultValue={item.caption}
                />
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ImageItem;
