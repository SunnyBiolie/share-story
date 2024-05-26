// import { useSubmit } from "@remix-run/react";
import { DataType } from "~/types/types";
import TextItem from "../static-items/text-item";
import CheckboxItem from "../static-items/checkbox-item";
import ImageItem from "../static-items/image-item";
import { forwardRef } from "react";

interface PreviewSectionProps {
  data: DataType;
}

const PreviewSection = forwardRef(function PreviewSection(
  { data }: PreviewSectionProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <>
      <div
        ref={ref}
        className="w-[768px] max-w-full px-12 md:px-2 pt-10 lg:pt-0 m-auto flex flex-col items-center my-6"
      >
        {data.blockContent.map((item, index) => {
          if (item.type === "blank") {
            return;
          } else if (item.type === "text") {
            return <TextItem key={index} item={item} />;
          } else if (item.type === "checkbox") {
            return <CheckboxItem key={index} item={item} />;
          } else if (item.type === "image") {
            return <ImageItem key={index} item={item} />;
          }
        })}
      </div>
      <div className="fixed top-0 left-0 size-full bg-red-400 z-[60]"></div>
    </>
  );
});

export default PreviewSection;
