import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { query, updateRecord } from "thin-backend";
import { checkCookie } from "~/lib/utils";
import { cookieUserId } from "~/server/cookie.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const json = formData.get("json") as string;
  const { data, postId } = JSON.parse(json);

  const { hasCookieInBrowser, cookie } = await checkCookie(request);

  if (!hasCookieInBrowser) {
    throw new Error(
      "You can't edit this post, be careful when clear your cookies!"
    );
  }

  const post = await query("posts").where("id", postId).fetchOne();

  if (post.cookieId !== cookie.id) {
    throw new Error("You can't edit this post, you aren't the author!");
  }

  // When no error is returned
  const updatedPost = await updateRecord("posts", postId, { postData: data });

  return redirect(`/published/${updatedPost.id}`, {
    headers: {
      "Set-Cookie": await cookieUserId.serialize(cookie),
    },
  });
}
