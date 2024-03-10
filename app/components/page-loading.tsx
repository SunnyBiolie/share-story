import { Loader } from "lucide-react";

const PageLoading = () => {
  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 bg-neutral-950/50 flex items-center justify-center z-[100]">
      <Loader className="animate-spin" />
    </div>
  );
};

export default PageLoading;
