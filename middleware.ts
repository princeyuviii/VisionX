import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/try-on",
    "/recommend", 
    "/community",
  ],
});

export const config = {
  matcher: ["/((?!_next|.*\\..*|favicon.ico).*)"],
};