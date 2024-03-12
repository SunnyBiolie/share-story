import { ActionFunctionArgs } from "@remix-run/node";
import { createRecord, query, updateRecord } from "thin-backend";
import { checkCookie } from "~/lib/utils";
import { cookieUserId } from "~/server/cookie.server";
import { DataType } from "~/types/types";

// Call when close or refresh browser
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = formData.get("editingId") as string;

  const objData: DataType = JSON.parse(data);
  const { hasCookieInBrowser, cookie } = await checkCookie(request);

  if (!hasCookieInBrowser) {
    if (
      objData.blockContent.length === 1 &&
      objData.blockContent[0].type === "blank"
    ) {
      return null;
    }
    const insertCookieUser = await createRecord("cookie_users", {
      id: cookie.id,
    });
    const insertPost = await createRecord("posts", {
      postData: data,
      cookieId: insertCookieUser.id,
    });
    await updateRecord("cookie_users", insertCookieUser.id, {
      editingId: insertPost.id,
    });
  } else {
    const cookieUser = await query("cookie_users")
      .where("id", cookie.id)
      .fetchOne();
    if (!cookieUser) {
      if (
        objData.blockContent.length === 1 &&
        objData.blockContent[0].type === "blank"
      ) {
        return null;
      }
      const insertCookieUser = await createRecord("cookie_users", {
        id: cookie.id,
      });
      const insertPost = await createRecord("posts", {
        postData: data,
        cookieId: insertCookieUser.id,
      });
      await updateRecord("cookie_users", insertCookieUser.id, {
        editingId: insertPost.id,
      });
    } else {
      if (cookieUser.editingId) {
        await updateRecord("posts", cookieUser.editingId, {
          postData: data,
        });
      } else {
        if (
          objData.blockContent.length === 1 &&
          objData.blockContent[0].type === "blank"
        ) {
          return null;
        }
        const insertEditingPost = await createRecord("posts", {
          postData: data,
          cookieId: cookie.id,
        });
        await updateRecord("cookie_users", cookie.id, {
          editingId: insertEditingPost.id,
        });
      }
    }
  }

  return new Response("", {
    headers: {
      "Set-Cookie": await cookieUserId.serialize(cookie),
    },
  });
}
