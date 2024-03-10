import { Bold, Italic, Strikethrough, Underline } from "lucide-react";
import { cn } from "~/lib/utils";
import { useEditorStyle } from "~/hooks/use-editor-style";
import { DataType, TextItemType } from "~/types/types";

interface EditorStyleProps {
  data: DataType;
  setData: React.Dispatch<React.SetStateAction<DataType>>;
}

const EditorStyle = ({ data, setData }: EditorStyleProps) => {
  const editorStyleState = useEditorStyle();

  const newBlockContent = [...data.blockContent] as TextItemType[];

  const format =
    editorStyleState.index !== null
      ? newBlockContent[editorStyleState.index].format
      : null;

  const setFontStyle = (style: string) => {
    switch (style) {
      case "h1":
        newBlockContent[editorStyleState.index!].fontStyle = "h1";
        break;
      case "h2":
        newBlockContent[editorStyleState.index!].fontStyle = "h2";
        break;
      case "h3":
        newBlockContent[editorStyleState.index!].fontStyle = "h3";
        break;
      case "p":
        newBlockContent[editorStyleState.index!].fontStyle = "p";
        break;
    }

    setData({
      currentIndex: editorStyleState.index!,
      blockContent: newBlockContent,
    });
    editorStyleState.setIsShow(false);
  };

  const setFormat = (newF: string) => {
    if (!format) return;

    switch (newF) {
      case "b":
        format.bold = !format.bold;
        newBlockContent[editorStyleState.index!].format = format;
        break;
      case "u":
        format.underline = !format.underline;
        newBlockContent[editorStyleState.index!].format = format;
        break;
      case "i":
        format.italic = !format.italic;
        newBlockContent[editorStyleState.index!].format = format;
        break;
      case "s":
        format.strikeThrough = !format.strikeThrough;
        newBlockContent[editorStyleState.index!].format = format;
        break;
    }

    setData({
      currentIndex: editorStyleState.index!,
      blockContent: newBlockContent,
    });
  };

  return (
    <>
      <div
        style={{
          top: editorStyleState.position[0],
          right: editorStyleState.position[1],
          bottom: editorStyleState.position[2],
          left: editorStyleState.position[3],
        }}
        className="fixed w-fix flex flex-col gap-2 my-2 p-4 rounded-md text-sm font-medium text-neutral-400 bg-neutral-900 shadow-lg z-50"
      >
        <div className="w-full flex items-center gap-x-2 pb-2 border-b">
          <button
            className={cn(
              "w-7 aspect-square rounded-sm flex items-center justify-center bg-neutral-900",
              format?.bold && "bg-neutral-700 text-neutral-100"
            )}
            onClick={() => setFormat("b")}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            className={cn(
              "w-7 aspect-square rounded-sm flex items-center justify-center bg-neutral-900",
              format?.underline && "bg-neutral-700 text-neutral-100"
            )}
            onClick={() => setFormat("u")}
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            className={cn(
              "w-7 aspect-square rounded-sm flex items-center justify-center bg-neutral-900",
              format?.italic && "bg-neutral-700 text-neutral-100"
            )}
            onClick={() => setFormat("i")}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            className={cn(
              "w-7 aspect-square rounded-sm flex items-center justify-center bg-neutral-900",
              format?.strikeThrough && "bg-neutral-700 text-neutral-100"
            )}
            onClick={() => setFormat("s")}
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col">
          <button
            className="p-1 rounded-sm hover:text-neutral-100  bg-neutral-900 hover:bg-neutral-700"
            onClick={() => setFontStyle("h1")}
          >
            Heading 1
          </button>
          <button
            className="p-1 rounded-sm hover:text-neutral-100  bg-neutral-900 hover:bg-neutral-700"
            onClick={() => setFontStyle("h2")}
          >
            Heading 2
          </button>
          <button
            className="p-1 rounded-sm hover:text-neutral-100  bg-neutral-900 hover:bg-neutral-700"
            onClick={() => setFontStyle("h3")}
          >
            Heading 3
          </button>
        </div>
        <button
          className="p-1 rounded-sm hover:text-neutral-100  bg-neutral-900 hover:bg-neutral-700"
          onClick={() => setFontStyle("p")}
        >
          Paragraph
        </button>
      </div>
      <button
        className="fixed top-0 bottom-0 left-0 right-0 cursor-default z-40"
        onClick={() => editorStyleState.setIsShow(false)}
      ></button>
    </>
  );
};

export default EditorStyle;
