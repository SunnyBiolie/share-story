import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { db } from "~/lib/prisma";
import { checkCookie } from "~/lib/utils";
import { cookieUserId } from "~/server/cookie.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = formData.get("json") as string;

  const { hasCookieInBrowser, cookie } = await checkCookie(request);

  if (!hasCookieInBrowser) {
    // Tạo người dùng mới nếu cookie không có thông tin
    const insertCookieUser = await db.cookieUsers.create({
      data: {
        id: cookie.id,
      },
    });

    // Tạo bài viết mới cho người dùng vừa tạo
    const insertPost = await db.posts.create({
      data: {
        postData: data,
        cookieId: insertCookieUser.id,
      },
    });

    return redirect(`/published/${insertPost.id}`);
  }

  // Tìm người dùng từ thông tin cookie
  const cookieUser = await db.cookieUsers.findUnique({
    where: { id: cookie.id },
  });

  if (!cookieUser) {
    // Tạo người dùng mới nếu CSDL không tồn tại khớp với cookie
    const insertCookieUser = await db.cookieUsers.create({
      data: {
        id: cookie.id,
      },
    });
    const insertPost = await db.posts.create({
      data: {
        postData: data,
        cookieId: insertCookieUser.id,
      },
    });

    return redirect(`/published/${insertPost.id}`);
  }

  if (cookieUser.editingId) {
    // Cập nhật nội dung bài viết chưa được publish của người dùng
    const publishPost = await db.posts.update({
      where: {
        id: cookieUser.editingId,
      },
      data: {
        postData: data,
      },
    });
    // Đánh dấu người dùng không còn bài viết nào chưa publish
    await db.cookieUsers.update({
      where: { id: cookie.id },
      data: { editingId: null },
    });

    return redirect(`/published/${publishPost.id}`);
  } else {
    // Nếu có người dùng và người dùng không có bài viết chưa publish
    const insertPost = await db.posts.create({
      data: {
        postData: data,
        cookieId: cookie.id,
      },
    });

    return redirect(`/published/${insertPost.id}`, {
      headers: {
        "Set-Cookie": await cookieUserId.serialize(cookie),
      },
    });
  }
}
