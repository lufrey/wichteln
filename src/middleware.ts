import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/", "/((?!api|_next/static|favicon.svg).*)"],
};

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1] ?? ":";

    if (authValue === process.env.BASIC_AUTH) {
      return NextResponse.next();
    }
  }
  url.pathname = "/api/basicauth";

  return NextResponse.rewrite(url);
}
