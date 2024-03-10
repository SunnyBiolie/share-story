import { ModeToggle } from "~/components/mode-toggle";

const Header = () => {
  return (
    <header className="w-full px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="text-xl font-semibold">Share Story</div>
        <div className="text-xs font-medium rounded-full bg-neutral-200 px-1 text-neutral-700">
          Beta
        </div>
      </div>
      <ModeToggle />
    </header>
  );
};

export default Header;
