import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import { cookieUserId } from "~/server/cookie.server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function guidGenerator() {
  const S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

export const isValidUrl = (url: string) => {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
};

// Kiểm tra xem trên trình duyệt có cookie chưa, nếu có trả về true và cookie đó, nếu chưa có trả về false và tạo ra và trả về một dữ liệu cookie mới
export const checkCookie = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  let cookie = await cookieUserId.parse(cookieHeader);
  if (!cookie || !isUUID(cookie.id)) {
    cookie = {
      id: guidGenerator(),
    };
    return {
      hasCookieInBrowser: false,
      cookie,
    };
  }

  return {
    hasCookieInBrowser: true,
    cookie,
  };
};

export const isUUID = (s: string) => {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(s);
};
