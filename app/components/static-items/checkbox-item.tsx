import { Check } from "lucide-react";
import { cn } from "~/lib/utils";
import { CheckboxItemType } from "~/types/types";

const CheckboxItem = ({ item }: { item: CheckboxItemType }) => {
  if (item.content === "") return <></>;

  return (
    <div className="w-full flex items-center gap-x-2 mb-2">
      <div
        className={cn(
          "w-4 h-4 border-2 border-neutral-600 rounded-sm flex items-center justify-center dark:border-neutral-400",
          item.checked && "dark:bg-neutral-400"
        )}
      >
        {item.checked && (
          <Check
            className="w-full h-full text-neutral-600 dark:text-neutral-900"
            strokeWidth={2}
          />
        )}
      </div>
      <div className="relative w-full font-medium">
        <p
          className={cn(
            "border-none outline-none",
            item.checked && "line-through"
          )}
        >
          {item.content}
        </p>
      </div>
    </div>
  );
};

export default CheckboxItem;
