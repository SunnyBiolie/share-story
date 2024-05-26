import { Link } from "@remix-run/react";
import Header from "../../components/for-cover/header";
import Footer from "../../components/for-cover/footer";
import { Button } from "~/components/ui/button";
import { NotebookText, PencilLine } from "lucide-react";

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
    </div>
  );
};

export default IndexPage;
