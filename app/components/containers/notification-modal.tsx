import { X, XCircle } from "lucide-react";
import { useNotification } from "~/hooks/use-notification";

const NotificationModal = () => {
  const notificationModalState = useNotification();

  return (
    <>
      {notificationModalState.isShown && (
        <>
          <div className="fixed top-0 right-0 bottom-0 left-0 z-50 bg-neutral-950/10 dark:bg-neutral-950/50" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-80 sm:max-w-96 max-w-[80%] z-50">
            <div className="p-4 rounded-md shadow-md bg-white dark:bg-neutral-800">
              <div className="flex flex-col items-center justify-center gap-y-3">
                <h6 className="flex items-center gap-2 text-lg font-semibold text-red-500">
                  <XCircle className="w-5 h-5" /> Error
                </h6>
                <div>{notificationModalState.content}</div>
              </div>
            </div>
            <button onClick={() => notificationModalState.setIsShown(false)}>
              <X className="absolute top-4 right-4 w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default NotificationModal;
