import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { db } from "~/lib/prisma";

import { BlankItemType, DataType } from "~/types/types";
import { checkCookie, guidGenerator } from "~/lib/utils";
import EditorBlock from "~/components/containers/editor-block";

// Kiểm tra và trả về cho user dữ liệu bài viết trước đó còn dang dở
export async function loader({ request }: LoaderFunctionArgs) {
  const { hasCookieInBrowser, cookie } = await checkCookie(request);

  // Nếu trình duyệt không lưu cookie
  if (!hasCookieInBrowser) {
    return json(null);
  }

  // Tìm user vs cookie có được trên trình duyệt
  const cookieUser = await db.cookieUsers.findUnique({
    where: {
      id: cookie.id,
    },
  });

  // Kiểm tra xem user đó có tồn tại hoặc đang có bài viết nào chưa publish
  if (cookieUser && cookieUser?.editingId) {
    const draft = await db.posts.findUnique({
      where: {
        id: cookieUser.editingId,
      },
    });
    return json(draft!.postData);
  } else {
    return json(null);
  }
}

const initialData: DataType = {
  currentIndex: 0,
  blockContent: [{ id: guidGenerator(), type: "blank" } as BlankItemType],
};

const EditPage = () => {
  const json = useLoaderData<typeof loader>();
  let draftData = null;
  if (json) draftData = JSON.parse(json as string);

  const data: DataType = draftData ? draftData : initialData;

  return (
    <>
      <EditorBlock inAction="write" initialData={data} />
    </>
  );
};

export default EditPage;
