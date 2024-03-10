import { ElementRef, useEffect, useRef, useState } from "react";
import EditorStyle from "~/components/editor-style";
import BlankItem from "../editable-items/blank-item";
import TextItem from "../editable-items/text-item";
import { useEditorStyle } from "~/hooks/use-editor-style";
import CheckboxItem from "../editable-items/checkbox-item";
import { DataType } from "~/types/types";
import ImageItem from "../editable-items/image-item";
import PreviewBlock from "./preview-section";
import ActionGroup from "./action-group";
import { useNavigation, useSubmit } from "@remix-run/react";
import PageLoading from "../page-loading";

interface EditorBlockProps {
  inAction: "write" | "edit";
  initialData: DataType;
  postId?: string;
}

const EditorBlock = ({ inAction, initialData, postId }: EditorBlockProps) => {
  const [data, setData] = useState<DataType>(initialData);
  const [isPreivew, setIsPreivew] = useState<boolean>(false);

  const ref = useRef<ElementRef<"div">>(null);
  const previewSectionRef = useRef<ElementRef<"div">>(null);

  const editorStyleState = useEditorStyle();

  useEffect(() => {
    const childen = ref.current!.children;

    for (let i = 0; i < childen.length; i++) {
      if (i === data.currentIndex) {
        const item = childen[i] as HTMLElement;
        setTimeout(() => {
          item.click();
        });
      }
    }
  });

  const submit = useSubmit();

  useEffect(() => {
    window.onkeydown = (e) => {
      if (e.code === "KeyZ") {
        e.preventDefault();
        console.log(data);
      }
    };
    if (inAction === "write") {
      window.onbeforeunload = () => {
        submit(
          { editingId: JSON.stringify(data) },
          { action: "/action/save-draft", method: "POST", navigate: false }
        );
      };
    }
  });

  const navigation = useNavigation();

  return (
    <>
      <div className="flex flex-col w-full">
        <div ref={ref} className="flex flex-col items-center my-6">
          {data.blockContent.map((item, index) => {
            if (item.type === "blank") {
              return (
                <BlankItem
                  key={item.id}
                  index={index}
                  data={data}
                  setData={setData}
                />
              );
            } else if (item.type === "text") {
              return (
                <TextItem
                  key={item.id}
                  index={index}
                  data={data}
                  setData={setData}
                  item={item}
                />
              );
            } else if (item.type === "checkbox") {
              return (
                <CheckboxItem
                  key={item.id}
                  index={index}
                  data={data}
                  setData={setData}
                  item={item}
                />
              );
            } else if (item.type === "image") {
              return (
                <ImageItem
                  key={item.id}
                  index={index}
                  data={data}
                  setData={setData}
                  item={item}
                />
              );
            }
          })}
        </div>
        {editorStyleState.isShown && (
          <EditorStyle data={data} setData={setData} />
        )}
      </div>
      {isPreivew && (
        <div className="fixed top-0 left-0 right-0 bottom-0 overflow-auto bg-[#fff] dark:bg-[#111]">
          <PreviewBlock ref={previewSectionRef} data={data} />
        </div>
      )}
      <ActionGroup
        data={data}
        isPreivew={isPreivew}
        setIsPreivew={setIsPreivew}
        inAction={inAction}
        postId={inAction === "edit" ? postId : undefined}
        previewSectionRef={previewSectionRef}
      />
      {(navigation.state === "submitting" ||
        navigation.state === "loading") && <PageLoading />}
    </>
  );
};

export default EditorBlock;
