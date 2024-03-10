import { cn } from "~/lib/utils";
import { TextItemType } from "~/types/types";

const TextItem = ({ item }: { item: TextItemType }) => {
  if (item.content === "") return <></>;

  return (
    <div
      className={cn(
        "w-full transition-all mb-2",
        item.fontStyle === "p" && "text-base font-medium",
        item.fontStyle === "h1" && "text-4xl font-bold mb-3",
        item.fontStyle === "h2" && "text-3xl font-bold",
        item.fontStyle === "h3" && "text-2xl font-bold"
      )}
    >
      <p
        className={cn(
          "text-wrap break-words border-none outline-none",
          item.format.bold && "font-bold",
          item.format.underline && "underline",
          item.format.italic && "italic",
          item.format.strikeThrough && "line-through"
        )}
      >
        {item.content}
      </p>
    </div>
  );
};

export default TextItem;
