import { Link } from "@remix-run/react";
import { AlertTriangle, MoveLeft, MoveRight } from "lucide-react";
import { useState } from "react";
import Footer from "~/components/for-cover/footer";
import Header from "~/components/for-cover/header";
import { ScrollArea } from "~/components/ui/scroll-area";

const ReadMe = () => {
  const [isShowMore, setIsShowMore] = useState<boolean>();
  const [contentMore, setContentMore] = useState<string>();

  return (
    <div className="w-full h-full flex flex-col">
      <Header />
      <ScrollArea className="flex-1 overflow-auto w-full px-2 md:px-4 max-w-[768px] m-auto dark:text-neutral-300">
        <h1 className="text-4xl font-bold text-neutral-700 dark:text-neutral-300 mb-6">
          #Readme
        </h1>
        <div className="flex flex-col gap-y-1 text-justify font-medium mb-4">
          <p className="indent-4">
            {
              "I'm aiming for user convenience in using the web, one of which is using the keyboard instead of the mouse."
            }
          </p>
          <p className="indent-4">
            So, feel free using{" "}
            <code>
              <b>up</b>
            </code>{" "}
            and{" "}
            <code>
              <b>down</b>
            </code>{" "}
            keys to move between elements (currently I have, as I call it,{" "}
            <button
              className="underline font-semibold"
              onClick={() => {
                setContentMore("/blank-item.png");
                setIsShowMore(true);
              }}
            >
              blank
            </button>{" "}
            ,{" "}
            <button
              className="underline font-semibold"
              onClick={() => {
                setContentMore("/text-item.png");
                setIsShowMore(true);
              }}
            >
              text
            </button>
            ,{" "}
            <button
              className="underline font-semibold"
              onClick={() => {
                setContentMore("/checkbox-item.png");
                setIsShowMore(true);
              }}
            >
              checkbox
            </button>{" "}
            and{" "}
            <button
              className="underline font-semibold"
              onClick={() => {
                setContentMore("/image-item.png");
                setIsShowMore(true);
              }}
            >
              image
            </button>{" "}
            items). In blank item, you can use{" "}
            <code>
              <b>left</b>
            </code>{" "}
            and{" "}
            <code>
              <b>right</b>
            </code>{" "}
            keys to select between the others elements.
          </p>
          <p className="indent-4">
            Use{" "}
            <code>
              <b>Enter</b>
            </code>{" "}
            to create a new blank element below the current element, or{" "}
            <code>
              <b>Shift</b>
            </code>
            {" + "}
            <code>
              <b>Enter</b>
            </code>{" "}
            to create a new one above it.{" "}
          </p>
          <p className="indent-4">
            To delete an element, simply delete all the content in the element
            and then press the{" "}
            <code>
              <b>Backspace</b>
            </code>{" "}
            key.
          </p>
        </div>
        <h2 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-x-2">
          <AlertTriangle />
          Attention
        </h2>
        <div className="flex flex-col gap-y-2 text-justify font-medium mb-10">
          <p className="indent-4">
            {
              "Not needing an account means I used another way to determine who is the author of a particular post. In this case, it's a cookie, so if you don't want to lose access to the previous post or the current post's draft data when you leave the page but don't publish it. Be careful when deleting your cookie data."
            }
          </p>
          <p className="indent-4">
            {
              "Another thing to note is that remember to save your published link wherever you want, then you can share it with the world. In the next version maybe I will save it to your local storage or try to coding something like that."
            }
          </p>
        </div>
        <div className="flex items-center justify-between font-medium mb-4">
          <Link
            to={"/"}
            className="flex items-center gap-x-2 opacity-75 hover:opacity-100 transition-all"
            prefetch="intent"
          >
            <MoveLeft />
            <span>Return Home</span>
          </Link>
          <Link
            to={"/write"}
            className="flex items-center gap-x-2 opacity-75 hover:opacity-100 transition-all"
            prefetch="viewport"
          >
            <span>Start Write</span>
            <MoveRight />
          </Link>
        </div>
      </ScrollArea>
      {isShowMore && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg p-4 rounded-sm">
          <button
            className="float-right text-red-600 font-medium mb-2 underline"
            onClick={() => {
              setIsShowMore(false);
            }}
          >
            Close
          </button>
          <img src={contentMore} alt="" />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ReadMe;
