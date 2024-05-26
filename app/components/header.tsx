import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <div className="fixed top-4 right-6 flex items-center z-50">
      <Button size="sm" variant="link" asChild>
        <a href="/">Home</a>
      </Button>
      <ModeToggle />
    </div>
  );
};

export default Header;
