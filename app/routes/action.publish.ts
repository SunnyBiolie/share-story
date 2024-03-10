import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createRecord, query, updateRecord } from "thin-backend";
import { checkCookie } from "~/lib/utils";
import { cookieUserId } from "~/server/cookie.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = formData.get("json") as string;

  const { hasCookieInBrowser, cookie } = await checkCookie(request);

  if (!hasCookieInBrowser) {
    const insertCookieUser = await createRecord("cookie_users", {
      id: cookie.id,
    });
    const insertPost = await createRecord("posts", {
      postData: data,
      cookieId: insertCookieUser.id,
    });

    return redirect(`/published/${insertPost.id}`);
  }

  const cookieUser = await query("cookie_users")
    .where("id", cookie.id)
    .fetchOne();

  if (!cookieUser) {
    const insertCookieUser = await createRecord("cookie_users", {
      id: cookie.id,
    });
    const insertPost = await createRecord("posts", {
      postData: data,
      cookieId: insertCookieUser.id,
    });

    return redirect(`/published/${insertPost.id}`);
  }

  if (cookieUser.editingId) {
    const publishPost = await updateRecord("posts", cookieUser.editingId, {
      postData: data,
    });
    await updateRecord("cookie_users", cookie.id, { editingId: null });

    return redirect(`/published/${publishPost.id}`);
  } else {
    const insertPost = await createRecord("posts", {
      postData: data,
      cookieId: cookie.id,
    });

    return redirect(`/published/${insertPost.id}`, {
      headers: {
        "Set-Cookie": await cookieUserId.serialize(cookie),
      },
    });
  }
}
