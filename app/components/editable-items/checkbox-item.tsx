import { Check } from "lucide-react";
import { ElementRef, useEffect, useRef, useState } from "react";
import { createBlankItem, removeThisItem } from "~/lib/handle-action";
import { cn } from "~/lib/utils";
import { CheckboxItemType, DataType } from "~/types/types";

interface CheckboxElementProps {
  index: number;
  data: DataType;
  setData: React.Dispatch<React.SetStateAction<DataType>>;
  item: CheckboxItemType;
}

const CheckboxItem = ({ index, data, setData, item }: CheckboxElementProps) => {
  const [checked, setChecked] = useState<boolean>(item.checked);

  const ref = useRef<ElementRef<"div">>(null);
  const inputRef = useRef<ElementRef<"div">>(null);
  const placeholderRef = useRef<ElementRef<"div">>(null);

  const onCheck = () => {
    (data.blockContent as CheckboxItemType[])[index].checked = !checked;
    setChecked((prev) => !prev);
  };

  useEffect(() => {
    const input = inputRef.current!;
    const placeholder = placeholderRef.current!;

    input.contentEditable = "plaintext-only";

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
      (data.blockContent as CheckboxItemType[])[index].content =
        input.innerText;

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

      const newBlockContent = data.blockContent as CheckboxItemType[];
      newBlockContent[index].content = input.innerText;

      if (input.innerText === "") {
        placeholder.style.display = "flex";
      } else placeholder.style.display = "none";
    };
  }, [index, data, setData]);

  return (
    <div ref={ref} className="w-full flex items-center gap-x-2 mb-2">
      <button
        className={cn(
          "w-4 h-4 border-2 border-neutral-600 rounded-sm flex items-center justify-center dark:border-neutral-400",
          checked && "dark:bg-neutral-400"
        )}
        onClick={onCheck}
      >
        {checked && (
          <Check
            className="w-full h-full text-neutral-600 dark:text-neutral-900"
            strokeWidth={2}
          />
        )}
      </button>
      <div className="relative w-full font-medium">
        <p
          ref={inputRef}
          className={cn("border-none outline-none", checked && "line-through")}
        >
          {item.content}
        </p>
        <p
          ref={placeholderRef}
          className={cn(
            "absolute top-0 left-0 bottom-0 text-sm text-neutral-400 hidden items-center transition-all select-none cursor-text italic",
            checked && "line-through"
          )}
        >
          Your checkbox content...
        </p>
      </div>
    </div>
  );
};

export default CheckboxItem;
