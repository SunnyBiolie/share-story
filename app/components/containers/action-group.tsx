import { useSubmit } from "@remix-run/react";
import { Button } from "../ui/button";
import { DataType } from "~/types/types";
import { useNotification } from "~/hooks/use-notification";
import { useState } from "react";

interface ActionGroupProps {
  data: DataType;
  isPreivew: boolean;
  setIsPreivew: React.Dispatch<React.SetStateAction<boolean>>;
  inAction: "write" | "edit";
  postId?: string | undefined;
  previewSectionRef: React.RefObject<HTMLDivElement>;
}

const ActionGroup = ({
  data,
  isPreivew,
  setIsPreivew,
  inAction,
  postId,
  previewSectionRef,
}: ActionGroupProps) => {
  const [isOpenDeleteForm, setIsOpenDeleteForm] = useState<boolean>(false);

  const notificationModalState = useNotification();

  const onPreview = () => {
    setIsPreivew((prev) => !prev);
  };

  const submit = useSubmit();

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.currentTarget.disabled = true;

    switch (inAction) {
      case "write":
        if (previewSectionRef.current) {
          if (previewSectionRef.current.childElementCount === 0) {
            notificationModalState.setContent(
              "You can't publish an empty post."
            );
            notificationModalState.setIsShown(true);
            return;
          }
        } else {
          notificationModalState.setContent(
            "Unable to get preview section. Reload needed."
          );
          notificationModalState.setIsShown(true);
          return;
        }
        submit(
          { json: JSON.stringify(data) },
          { action: "/action/publish", method: "post", navigate: false }
        );
        break;
      case "edit":
        submit(
          {
            json: JSON.stringify({
              data: JSON.stringify(data),
              postId: postId!,
            }),
          },
          { action: "/action/edit", method: "post", navigate: false }
        );
        break;
    }
  };

  const onCancel = () => {
    window.location.replace(`/published/${postId}`);
  };

  const onDelete = () => {
    submit(
      {
        postId: postId!,
      },
      { action: "/action/delete", method: "post", navigate: false }
    );
  };

  return (
    <div className="fixed top-4 left-4">
      <div className="flex lg:flex-col gap-1">
        {isPreivew ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="w-[72px]"
              onClick={onPreview}
            >
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-[72px]"
              // style={{color: "#111"}}
              onClick={(e) => onSubmit(e)}
            >
              Publish
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              className="w-[72px]"
              onClick={onPreview}
            >
              Preview
            </Button>
            {inAction === "edit" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-[72px]"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-[72px]"
                  onClick={() => setIsOpenDeleteForm(true)}
                >
                  Delete
                </Button>
                {isOpenDeleteForm && (
                  <>
                    <div className="fixed top-20 left-1/2 -translate-x-1/2 rounded-md p-6 bg-neutral-200 dark:bg-neutral-900 z-50">
                      <div className="mb-4">
                        This action cannot be undone, please make sure you want
                        to delete this post.
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-[72px]"
                          onClick={onDelete}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-[72px]"
                          onClick={() => setIsOpenDeleteForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                    <div className="fixed top-0 left-0 bottom-0 right-0 bg-stone-950/60 z-[49]"></div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActionGroup;
