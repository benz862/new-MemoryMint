import { NextResponse } from "next/server";

/** Short URL / bookmarks: same behavior as /api/checkout */
export function GET(request: Request) {
  const url = new URL(request.url);
  const qs = url.searchParams.toString();
  const target = new URL(
    `/api/checkout${qs ? `?${qs}` : ""}`,
    url.origin
  );
  return NextResponse.redirect(target);
}
