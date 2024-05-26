import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  defer,
  json,
} from "@remix-run/node";
import {
  Await,
  Link,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { Suspense, useEffect } from "react";
import EditorBlock from "~/components/containers/editor-block";
import PageLoading from "~/components/page-loading";
import { db } from "~/lib/prisma";
import { isUUID } from "~/lib/utils";

export async function action({ request }: ActionFunctionArgs) {
  // Đảm bảo rằng chỉ hiển thị nội dung khi người dùng truy cập từ trang published
  const formData = await request.formData();
  if (formData.get("postId")) {
    const data = formData.get("postId") as string;
    return json(data);
  }
  throw new Response(null, {
    status: 404,
    statusText: "Not Found",
  });
}

export async function loader({ params }: LoaderFunctionArgs) {
  if (!isUUID(params.id!)) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }
  const post = await db.posts.findUnique({ where: { id: params.id! } });

  if (!post) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return defer({ postPromise: post });
}

export default function EditPage() {
  useEffect(() => {
    if (!actionData) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  });

  const actionData = useActionData<typeof action>();
  const { postPromise } = useLoaderData<typeof loader>();
  //  !actionData
  if (!actionData) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-8 lg:pb-0 pb-10">
        <p className="text-xl">Nothing here.</p>
        <Link
          to={"/"}
          prefetch="render"
          className="py-2 px-4 font-medium rounded-lg bg-white text-black"
        >
          Return home
        </Link>
      </div>
    );
  }

  return (
    <Suspense fallback={<EditPage.Skeleton />}>
      <Await resolve={postPromise}>
        {(post) => (
          <EditorBlock
            inAction="edit"
            initialData={JSON.parse(post.postData as string)}
            postId={post.id}
          />
        )}
      </Await>
    </Suspense>
  );
}

EditPage.Skeleton = function SkeletonEditPage() {
  return (
    <div>
      <PageLoading />
    </div>
  );
};

export function ErrorBoundary() {
  const error = useRouteError() as Error;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="text-2xl font-semibold">Something went wrong!</div>
      <div>
        {isRouteErrorResponse(error)
          ? `${error.status} - ${error.statusText}`
          : error instanceof Error
          ? error.message
          : "Unknown Error"}
      </div>
    </div>
  );
}
