import { ElementRef, useEffect, useRef } from "react";
import { Hash } from "lucide-react";
import { cn } from "~/lib/utils";
import { useEditorStyle } from "~/hooks/use-editor-style";
import { DataType, TextItemType } from "~/types/types";
import { createBlankItem, removeThisItem } from "~/lib/handle-action";

interface TextElementProps {
  index: number;
  data: DataType;
  setData: React.Dispatch<React.SetStateAction<DataType>>;
  item: TextItemType;
}

const TextItem = ({ index, data, setData, item }: TextElementProps) => {
  const ref = useRef<ElementRef<"div">>(null);
  const inputRef = useRef<ElementRef<"div">>(null);
  const placeholderRef = useRef<ElementRef<"div">>(null);

  const editorStyleState = useEditorStyle();

  useEffect(() => {
    const input = inputRef.current!;
    const placeholder = placeholderRef.current!;

    input.contentEditable = "true";

    if (input.textContent === "") {
      placeholder.style.display = "flex";
    } else placeholder.style.display = "none";
  });

  useEffect(() => {
    const container = ref.current!;
    const input = inputRef.current!;
    const placeholder = placeholderRef.current!;

    container.onclick = () => {
      input.focus();
      data.currentIndex = index;
    };

    input.oninput = () => {
      (data.blockContent as TextItemType[])[index].content = input.innerText;

      if (input.innerText === "") {
        placeholder.style.display = "flex";
      } else placeholder.style.display = "none";
    };

    input.onkeydown = (e: KeyboardEvent) => {
      const prevContainer = container.previousElementSibling as HTMLElement;
      const nextContainer = container.nextElementSibling as HTMLElement;

      if (e.code === "Enter") {
        createBlankItem(e, index, data, setData);
      }
      if (e.code === "Backspace") {
        removeThisItem(e, false, input, index, data, setData, prevContainer);
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

    input.onpaste = (e: ClipboardEvent) => {
      e.preventDefault();
      // return;
      const clipdata = e.clipboardData;
      input.innerText = clipdata!.getData("text/plain");

      const newBlockContent = data.blockContent as TextItemType[];
      newBlockContent[index].content = input.innerText;

      if (input.innerText === "") {
        placeholder.style.display = "flex";
      } else placeholder.style.display = "none";
    };
  }, [index, data, setData, editorStyleState]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    editorStyleState.setIsShow(true);
    editorStyleState.setIndex(index);

    const toLeft = ref.current!.getBoundingClientRect().left;

    const left = toLeft + "px";
    const right = "none";

    let top, bottom;

    const toTop = ref.current!.getBoundingClientRect().top;
    const toBottom = ref.current!.getBoundingClientRect().bottom;

    if (window.innerHeight - toBottom > 200) {
      top = toBottom + "px";
      bottom = "none";
    } else if (toTop > 200) {
      top = "none";
      bottom = window.innerHeight - toTop + "px";
    } else {
      top = "0px";
      bottom = "none";
    }

    editorStyleState.setPosition([top, right, bottom, left]);
    e.stopPropagation();
  };

  return (
    <div ref={ref} className="group relative w-full mb-2">
      <div
        className={cn(
          "transition-all",
          item.fontStyle === "p" && "text-base font-medium",
          item.fontStyle === "h1" && "text-4xl font-bold",
          item.fontStyle === "h2" && "text-3xl font-bold",
          item.fontStyle === "h3" && "text-2xl font-bold"
        )}
      >
        <p
          ref={inputRef}
          className={cn(
            "border-none outline-none",
            item.format.bold && "font-bold",
            item.format.underline && "underline",
            item.format.italic && "italic",
            item.format.strikeThrough && "line-through"
          )}
        >
          {item.content}
        </p>
      </div>
      <p
        ref={placeholderRef}
        className={cn(
          "absolute top-0 left-0 bottom-0 text-sm font-medium text-neutral-400 hidden items-center transition-all select-none cursor-text italic",
          item.fontStyle === "p" && "text-base font-medium",
          item.fontStyle === "h1" && "text-4xl font-bold",
          item.fontStyle === "h2" && "text-3xl font-bold",
          item.fontStyle === "h3" && "text-2xl font-bold"
        )}
      >
        Type something...
      </p>
      <button
        className="hidden absolute top-0 bottom-0 right-full group-hover:flex items-center justify-center p-1 px-4 cursor-pointer text-neutral-400"
        onClick={(e) => handleClick(e)}
      >
        <Hash className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TextItem;
