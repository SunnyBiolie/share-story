import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import { query } from "thin-backend";
import { DataType } from "~/types/types";
import TextItem from "../../components/static-items/text-item";
import CheckboxItem from "../../components/static-items/checkbox-item";
import ImageItem from "../../components/static-items/image-item";
import { checkCookie, isUUID } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import PageLoading from "~/components/page-loading";

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (!isUUID(params.id!)) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }
  const post = await query("posts").where("id", params.id!).fetchOne();
  const { cookie } = await checkCookie(request);

  if (!post) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const isOwner: boolean = post.cookieId === cookie.id ? true : false;

  const belongToDraft = await query("cookie_users")
    .where("editingId", post.id)
    .fetchOne();

  if (belongToDraft) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return json({ isOwner, postId: post.id, postData: post.postData });
}

const PublishedPage = () => {
  const { isOwner, postId, postData } = useLoaderData<typeof loader>();
  const data: DataType = JSON.parse(postData);

  const submit = useSubmit();

  const openEdit = () => {
    submit(
      { postId },
      { action: `/edit/${postId}`, method: "POST", navigate: true }
    );
  };

  const navigation = useNavigation();

  return (
    <>
      <div className="flex flex-col items-center justify-center py-4 lg:py-8">
        {data.blockContent.map((item, index) => {
          if (item.type === "blank") {
            return;
          } else if (item.type === "text") {
            return <TextItem key={index} item={item} />;
          } else if (item.type === "checkbox") {
            return <CheckboxItem key={index} item={item} />;
          } else if (item.type === "image") {
            return <ImageItem key={index} item={item} />;
          }
        })}
      </div>
      {isOwner && (
        <div className="fixed top-4 left-4">
          <Button
            variant="outline"
            size="sm"
            className="w-[72px]"
            onClick={openEdit}
          >
            Edit
          </Button>
        </div>
      )}
      {navigation.state === "submitting" ||
        (navigation.state === "loading" && <PageLoading />)}
    </>
  );
};

export default PublishedPage;
