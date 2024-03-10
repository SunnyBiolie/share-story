import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { query } from "thin-backend";

import { BlankItemType, DataType } from "~/types/types";
import { checkCookie, guidGenerator } from "~/lib/utils";
import EditorBlock from "~/components/containers/editor-block";

export async function loader({ request }: LoaderFunctionArgs) {
  const { hasCookieInBrowser, cookie } = await checkCookie(request);

  if (!hasCookieInBrowser) {
    return json(null);
  }

  const cookieUser = await query("cookie_users")
    .where("id", cookie.id)
    .fetchOne();

  if (cookieUser && cookieUser?.editingId) {
    const draft = await query("posts")
      .where("id", cookieUser.editingId)
      .fetchOne();
    return json(draft.postData);
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
  if (json) draftData = JSON.parse(json);

  const data: DataType = draftData ? draftData : initialData;

  return (
    <>
      <EditorBlock inAction="write" initialData={data} />
    </>
  );
};

export default EditPage;
