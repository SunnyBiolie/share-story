import { cssBundleHref } from "@remix-run/css-bundle";
import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
  // useRouteError,
} from "@remix-run/react";
import clsx from "clsx";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes";

import { themeSessionResolver } from "~/server/sessions.server";
import { initThinBackend } from "thin-backend";

import styles from "./tailwind.css";
import { checkCookie } from "./lib/utils";
import { cookieUserId } from "./server/cookie.server";
import NotificationModal from "./components/containers/notification-modal";

export const meta: MetaFunction = () => {
  return [
    { title: "Share Story" },
    { name: "description", content: "Welcome to Share Story!" },
    { tagName: "link", type: "image/x-icon", rel: "icon", href: "/logo.png" },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export async function loader({ request }: LoaderFunctionArgs) {
  initThinBackend({
    host: `https://${process.env.BACKEND_URL!}`,
  });

  const { getTheme } = await themeSessionResolver(request);
  const { cookie } = await checkCookie(request);

  return json(
    {
      theme: getTheme(),
    },
    {
      headers: {
        "Set-Cookie": await cookieUserId.serialize(cookie),
      },
    }
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();

  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  );
}

export function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();

  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body>
        <Outlet />
        <NotificationModal />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html lang="en" className="dark">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="w-full h-full overflow-hidden flex flex-col items-center justify-center gap-6">
          <h1 className="text-3xl font-medium">
            {isRouteErrorResponse(error)
              ? `${error.status} - ${error.statusText}`
              : error instanceof Error
              ? error.message
              : "Unknown Error"}
          </h1>
          <Link
            to={"/"}
            prefetch="render"
            className="py-2 px-4 font-medium rounded-lg bg-white text-black"
          >
            Return home
          </Link>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
