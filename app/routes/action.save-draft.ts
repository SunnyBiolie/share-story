import { ActionFunctionArgs, json } from "@remix-run/node";
import { cookieUserId } from "~/server/cookie.server";
import { db } from "~/lib/prisma";
import { checkCookie } from "~/lib/utils";
import { DataType } from "~/types/types";

// Call when close or refresh browser - save your draft
export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const data = formData.get("editingId") as string;

    if (!data) {
      throw new Error("No data found in formData");
    }

    const objData: DataType = JSON.parse(data);
    const { hasCookieInBrowser, cookie } = await checkCookie(request);

    if (!hasCookieInBrowser) {
      // Trường hợp trên trình duyệt không có thông tin cookie
      if (
        objData.blockContent.length === 1 &&
        objData.blockContent[0].type === "blank"
      ) {
        return null;
      }

      // Tạo một cookie user mới
      const insertCookieUser = await db.cookieUsers.create({
        data: { id: cookie.id },
      });
      // Tạo một bài viết mới
      const insertPost = await db.posts.create({
        data: {
          postData: data,
          cookieId: insertCookieUser.id,
        },
      });
      // Cập nhật cho user trên với trường bài viết đang edit chính là id bài viết vừa tạo
      await db.cookieUsers.update({
        where: {
          id: insertCookieUser.id,
        },
        data: {
          editingId: insertPost.id,
        },
      });
    } else {
      // Trường hợp đã có cookie trên trình duyệt

      // Lấy user với cookie có được
      const cookieUser = await db.cookieUsers.findUnique({
        where: {
          id: cookie.id,
        },
      });
      if (!cookieUser) {
        // Trường hợp không tồn tại cookieUser lấy từ cookie trình duyệt ở db
        if (
          objData.blockContent.length === 1 &&
          objData.blockContent[0].type === "blank"
        ) {
          return null;
        }

        // Tạo một cookie user mới
        const insertCookieUser = await db.cookieUsers.create({
          data: { id: cookie.id },
        });
        // Tạo một bài viết mới
        const insertPost = await db.posts.create({
          data: {
            postData: data,
            cookieId: insertCookieUser.id,
          },
        });
        // Cập nhật cho user trên với trường bài viết đang edit chính là id bài viết vừa tạo
        await db.cookieUsers.update({
          where: {
            id: insertCookieUser.id,
          },
          data: {
            editingId: insertPost.id,
          },
        });
      } else {
        // TH: dưới db tồn tại 1 cookieUser khớp với thông tin cookie trên trình duyệt
        if (cookieUser.editingId) {
          // Nếu user có bài viết chưa được publish

          // Cập nhật dữ liệu bài viết đó với dữ liệu hiện tại
          await db.posts.update({
            where: {
              id: cookieUser.editingId,
            },
            data: {
              postData: data,
            },
          });
        } else {
          // Nếu user không có bài viết nào đang được edit
          if (
            objData.blockContent.length === 1 &&
            objData.blockContent[0].type === "blank"
          ) {
            return null;
          }

          // Tạo một bài viết mới
          const insertEditingPost = await db.posts.create({
            data: {
              postData: data,
              cookieId: cookie.id,
            },
          });

          // Cập nhật trường bài viết đang edit cho cookieUser
          await db.cookieUsers.update({
            where: {
              id: cookie.id,
            },
            data: {
              editingId: insertEditingPost.id,
            },
          });
        }
      }
    }

    return new Response("", {
      headers: {
        "Set-Cookie": await cookieUserId.serialize(cookie),
      },
    });
  } catch (error) {
    console.error("Error in action: ", error);
    return json({ error: error || "Unknown error" }, { status: 500 });
  }
}
