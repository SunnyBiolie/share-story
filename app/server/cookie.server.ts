import { createCookie } from "@remix-run/node";

export const cookieUserId = createCookie("share-story-cookie-id", {
  maxAge: 31_536_000,
});
