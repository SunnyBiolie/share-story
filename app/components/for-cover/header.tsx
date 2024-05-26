import { ModeToggle } from "~/components/mode-toggle";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <header className="w-full px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="text-xl font-semibold">Share Story</div>
        <div className="text-xs font-medium rounded-full bg-neutral-200 px-1 text-neutral-700">
          Beta
        </div>
      </div>
      <div className="flex items-center">
        <Button size="sm" variant="link" asChild>
          <a
            href="/published/55797c24-5ca1-4a41-9781-d658403a05a3"
            className="text-red-400"
          >
            Announcement
          </a>
        </Button>
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
