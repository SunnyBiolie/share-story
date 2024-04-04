import { Link } from "@remix-run/react";
import Header from "../../components/for-cover/header";
import Footer from "../../components/for-cover/footer";
import { Button } from "~/components/ui/button";
import { NotebookText, PencilLine, XIcon } from "lucide-react";

const IndexPage = () => {
  return (
    <div className="w-full h-full flex flex-col ">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center gap-20">
        <div className="w-full flex flex-col items-center justify-center gap-6">
          <div className="w-5/6 sm:w-3/4 text-3xl font-bold text-center leading-10">
            <p>Write a blog, share your story, no need an account.</p>
            <p>
              Welcome to <u>Share Story</u>.
            </p>
          </div>
          <Button
            asChild
            className="flex items-center justify-center gap-2 py-3 "
          >
            <Link to={"/write"} /* prefetch="render" */>
              <PencilLine className="w-4 h-4" /> Start write
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="text-lg font-medium text-center leading-10">
            Nead a guide?
          </div>
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="flex items-center justify-center gap-2"
          >
            <Link to={"/read-me"} prefetch="intent">
              <NotebookText className="w-4 h-4" /> Read this
            </Link>
          </Button>
        </div>
      </div>
      <Footer />
      <div
        id="temp-notice"
        className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-950/50 flex items-center justify-center shadow-md"
      >
        <div className="relative bg-neutral-900 p-6 rounded-md w-5/6 md:w-4/5 lg:w-3/4 xl:w-1/2">
          <button
            className="absolute top-4 right-4 rounded-full hover:bg-neutral-500/50 p-1.5 transition cursor-pointer flex items-center justify-center"
            onClick={() => {
              document.getElementById("temp-notice")?.classList.add("hidden");
            }}
          >
            <XIcon width={20} height={20} />
          </button>
          <h1 className="text-lg font-semibold pb-2">
            Notice from @sunnybiolie
          </h1>
          <h3 className="font-medium text-rose-500 pb-3">
            Something went wrong!
          </h3>
          <div className="space-y-2">
            <p className="indent-3">
              There is currently an error occurring with Thin Backend that
              causes pages working with data with Thin Backend to experience
              irreparable errors. Pages with errors include write, published,
              and edit pages.
            </p>
            <p className="indent-3">
              {`In the near future, I will wait for the error to be fixed from the
              Thin Backend side. Since I'm aiming to start another project, if
              Thin doesn't fix the bug in a short time, I won't be able to
              switch to another party like Supabase or Neon.`}
            </p>
            <p className="indent-3">Sorry for the inconvenience.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
