import { Image, ListTodo, Type } from "lucide-react";
import { Button } from "../ui/button";
import {
  CheckboxItemType,
  DataType,
  ImageItemType,
  TextItemType,
} from "~/types/types";
import { ElementRef, useEffect, useRef } from "react";
import { guidGenerator } from "~/lib/utils";

interface BlankElementProps {
  index: number;
  data: DataType;
  setData: React.Dispatch<React.SetStateAction<DataType>>;
}

const buttons = [
  {
    type: "text",
    icon: Type,
  },
  {
    type: "checkbox",
    icon: ListTodo,
  },
  {
    type: "image",
    icon: Image,
  },
];

const BlankItem = ({ index, data, setData }: BlankElementProps) => {
  const ref = useRef<ElementRef<"div">>(null);
  const selectRef = useRef<ElementRef<"div">>(null);

  let canDelete = true;
  if (data.blockContent.length === 1 && index === 0) {
    canDelete = false;
  }

  useEffect(() => {
    const container = ref.current!;
    const select = selectRef.current!;
    const childs = select.querySelectorAll("button");

    container.onclick = () => {
      childs[0].focus();
      data.currentIndex = index;
    };

    childs.forEach((child) => {
      child.onkeydown = (e: KeyboardEvent) => {
        const nextItem = child.nextElementSibling as HTMLElement;
        const prevItem = child.previousElementSibling as HTMLElement;

        const nextContainer = container.nextElementSibling as HTMLElement;
        const prevContainer = container.previousElementSibling as HTMLElement;

        switch (e.code) {
          case "ArrowRight":
            if (nextItem) nextItem.focus();
            else childs[0].focus();
            break;
          case "ArrowLeft":
            if (prevItem) prevItem.focus();
            else childs[childs.length - 1].focus();
            break;
          case "ArrowUp":
            if (prevContainer) prevContainer.click();
            break;
          case "ArrowDown":
            if (nextContainer) nextContainer.click();
            break;
          case "Enter":
            break;
          case "Backspace":
            e.preventDefault();
            if (canDelete) {
              const newBlockContent = [...data.blockContent];
              newBlockContent.splice(index, 1);

              let newCurrentIndex: number = 0;
              if (prevContainer) {
                newCurrentIndex = index - 1;
              }

              setData({
                currentIndex: newCurrentIndex,
                blockContent: newBlockContent,
              });
            }
            break;

          default:
            e.preventDefault();
            break;
        }
      };
    });
  }, [canDelete, index, data, setData]);

  const createText = () => {
    const newTextItem: TextItemType = {
      id: guidGenerator(),
      type: "text",
      content: "",
      format: {
        bold: false,
        underline: false,
        italic: false,
        strikeThrough: false,
      },
      fontStyle: "p",
    };

    const newBlockContent = [...data.blockContent];
    newBlockContent[index] = newTextItem;

    setData({ currentIndex: index, blockContent: newBlockContent });
  };
  const createCheckbox = () => {
    const newChecknoxItem: CheckboxItemType = {
      id: guidGenerator(),
      type: "checkbox",
      content: "",
      checked: false,
    };

    const newBlockContent = [...data.blockContent];
    newBlockContent[index] = newChecknoxItem;

    setData({ currentIndex: index, blockContent: newBlockContent });
  };
  const createImage = () => {
    const newImageItem: ImageItemType = {
      id: guidGenerator(),
      type: "image",
      content: "",
      aspectRatio: "auto",
      percentageWidth: "50%",
      cropPos: [0, 0],
    };

    const newBlockContent = [...data.blockContent];
    newBlockContent[index] = newImageItem;

    setData({ currentIndex: index, blockContent: newBlockContent });
  };

  const createAction = (type: string) => {
    if (type === "text") return createText();
    if (type === "checkbox") return createCheckbox();
    if (type === "image") return createImage();
  };

  const cancelCreate = () => {
    const newBlockContent = [...data.blockContent];
    newBlockContent.splice(index, 1);

    setData({ currentIndex: --index, blockContent: newBlockContent });
  };

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className="w-full flex items-center justify-between p-1 mt-1 mb-2 border border-neutral-500 rounded-md focus-within:border-neutral-600 dark:focus-within:border-neutral-400 focus-within:ring-1 focus-within:ring-neutral-600 dark:focus-within:ring-neutral-400"
    >
      <div ref={selectRef} className="flex items-center">
        {buttons.map((button) => {
          const Icon = button.icon;
          return (
            <Button
              key={button.type}
              tabIndex={-1}
              variant="focus"
              size="sm"
              onClick={() => createAction(button.type)}
            >
              <Icon className="w-4 h-4" />
            </Button>
          );
        })}
      </div>
      <div className="font-medium">
        {canDelete ? (
          <Button variant="destructive" size="sm" onClick={cancelCreate}>
            Cancel
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="bg-neutral-600 hover:bg-neutral-600 cursor-not-allowed"
            tabIndex={-1}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default BlankItem;
