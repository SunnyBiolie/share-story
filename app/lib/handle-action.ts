import { BlankItemType, DataType } from "~/types/types";
import { guidGenerator } from "./utils";

export const createBlankItem = (
  e: KeyboardEvent,
  index: number,
  data: DataType,
  setData: React.Dispatch<React.SetStateAction<DataType>>
) => {
  e.preventDefault();

  const newBlankItem: BlankItemType = {
    id: guidGenerator(),
    type: "blank",
  };

  if (e.shiftKey) {
    const newBlockContent = [
      ...data.blockContent.slice(0, index),
      newBlankItem,
      ...data.blockContent.slice(index),
    ];

    setData({ currentIndex: index, blockContent: newBlockContent });
  } else {
    const newBlockContent = [
      ...data.blockContent.slice(0, index + 1),
      newBlankItem,
      ...data.blockContent.slice(index + 1),
    ];

    setData({ currentIndex: ++index, blockContent: newBlockContent });
  }
};

export const removeThisItem = (
  e: KeyboardEvent,
  isInput: boolean,
  input: HTMLDivElement | HTMLInputElement,
  index: number,
  data: DataType,
  setData: React.Dispatch<React.SetStateAction<DataType>>,
  prevContainer: HTMLElement
) => {
  let content: string;
  if (isInput) {
    content = (input as HTMLInputElement).value;
  } else {
    content = (input as HTMLDivElement).innerText;
  }

  if (content === "") {
    e.preventDefault();
    if (data.blockContent.length === 1 && index === 0) {
      const newBlockContent = [...data.blockContent];
      newBlockContent[0] = {
        id: guidGenerator(),
        type: "blank",
      } as BlankItemType;
      setData({ currentIndex: 0, blockContent: newBlockContent });
    } else {
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
  }
};
