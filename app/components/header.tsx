import { ModeToggle } from "./mode-toggle";

const Header = () => {
  return (
    <div className="fixed top-4 right-6 z-50">
      <ModeToggle />
    </div>
  );
};

export default Header;
