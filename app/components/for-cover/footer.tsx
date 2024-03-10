import { Link } from "@remix-run/react";
import { Copyright } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full px-8 py-4">
      <div className="flex items-center justify-center gap-2">
        <Copyright className="w-4 h-4" />{" "}
        <p className="text-sm">
          2024 -{" "}
          <Link
            to={"https://sunnybiolie.vercel.app/"}
            className="hover:underline"
          >
            Sunny Biolie
          </Link>
        </p>
      </div>
      <div></div>
    </footer>
  );
};

export default Footer;
