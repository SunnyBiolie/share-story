import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { db } from "~/lib/prisma";
import { checkCookie, isUUID } from "~/lib/utils";
import { cookieUserId } from "~/server/cookie.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const postId = formData.get("postId") as string;

  if (!isUUID(postId)) {
    throw new Error(`Invalid post id: ${postId}.`);
  }

  const { hasCookieInBrowser, cookie } = await checkCookie(request);

  if (!hasCookieInBrowser) {
    throw new Error(
      "You can't delete this post, be careful when clear your cookies!"
    );
  }

  const post = await db.posts.findUnique({ where: { id: postId } });

  if (post?.cookieId !== cookie.id) {
    throw new Error("You can't delete this post, you aren't the author!");
  }

  // When no error is returned
  await db.posts.delete({ where: { id: postId } });

  return redirect(`/`, {
    headers: {
      "Set-Cookie": await cookieUserId.serialize(cookie),
    },
  });
}
