import users from "@/models/users";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;

  let page = parseInt(params.get("page") || "1");
  page = Math.max(page, 1);
  let pageSize = parseInt(params.get("pageSize") || "5");
  pageSize = Math.min(Math.max(pageSize, 2), 50);

  const usersFound = await users.getAllUsers({
    page,
    pageSize,
  });

  return NextResponse.json({
    data: usersFound.data,
    count: usersFound.count,
    next:
      page < usersFound.totalPages
        ? makeUrl(url.toString(), page + 1, pageSize)
        : null,
    previous: page > 1 ? makeUrl(url.toString(), page - 1, pageSize) : null,
  });
}

function makeUrl(url: string, page: number, pageSize: number) {
  const newUrl = new URL(url);
  newUrl.searchParams.set("page", page.toString());
  newUrl.searchParams.set("pageSize", pageSize.toString());

  return newUrl.toString();
}
