import { Outlet } from "@remix-run/react";
import Header from "~/components/header";

export default function Layout() {
  return (
    <div className="w-[768px] max-w-full h-full min-h-full px-12 md:px-2 pt-10 lg:pt-0 m-auto">
      <Header />
      <Outlet />
    </div>
  );
}
